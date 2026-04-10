import { dataService } from '@/lib/data-service';
import { format, subDays } from 'date-fns';
import { ActivityImpactChart } from '@/components/dashboard/DashboardCharts';
import MoodHeatmap from '@/components/dashboard/MoodHeatmap';
import ExportButton from '@/components/dashboard/ExportButton';
import { type MoodEntry } from '@/lib/db';

export const dynamic = 'force-dynamic';

function avg(nums: number[]) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default async function InsightsPage() {
  const user = await dataService.getOrCreateUser();
  const moods = await dataService.getMoodEntries(user.id);

  const scores = moods.map((m) => m.moodScore);
  const averageMood = avg(scores);

  const topMood = (() => {
    const counts = new Map<string, number>();
    for (const m of moods) counts.set(m.mood, (counts.get(m.mood) ?? 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? '—';
  })();

  const stability = (() => {
    const mu = averageMood;
    const variance = scores.length
      ? scores.reduce((a, x) => a + (x - mu) * (x - mu), 0) / scores.length
      : 0;
    const normalized = Math.max(0, 1 - variance / 2);
    return Math.round(normalized * 100);
  })();

  const streak = (() => {
    const days = new Set(moods.map((m) => m.date));
    const now = new Date();
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const key = format(subDays(now, i), 'yyyy-MM-dd');
      if (!days.has(key)) break;
      s++;
    }
    return s;
  })();

  // ── F4: Activity impact (tag → avg mood) ──
  const activityImpact = (() => {
    const tagData = new Map<string, { sum: number; count: number }>();
    for (const m of moods) {
      if (!m.tagsJson) continue;
      try {
        const tags: string[] = JSON.parse(m.tagsJson);
        for (const t of tags) {
          const key = t.toLowerCase().trim();
          if (!key) continue;
          const v = tagData.get(key) ?? { sum: 0, count: 0 };
          v.sum += m.moodScore;
          v.count++;
          tagData.set(key, v);
        }
      } catch {}
    }
    return [...tagData.entries()]
      .filter(([, v]) => v.count >= 2)
      .map(([tag, v]) => ({
        tag: tag.charAt(0).toUpperCase() + tag.slice(1),
        avgMood: Math.round((v.sum / v.count) * 10) / 10,
        count: v.count,
      }))
      .sort((a, b) => b.avgMood - a.avgMood)
      .slice(0, 10);
  })();

  // ── F5: Smart recommendations ──
  const recommendations = (() => {
    const recs: { emoji: string; title: string; detail: string }[] = [];
    const tagCounts = new Map<string, number>();
    const tagMood = new Map<string, { sum: number; count: number }>();

    for (const m of moods) {
      if (!m.tagsJson) continue;
      try {
        const tags: string[] = JSON.parse(m.tagsJson);
        for (const t of tags) {
          const key = t.toLowerCase().trim();
          tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
          const v = tagMood.get(key) ?? { sum: 0, count: 0 };
          v.sum += m.moodScore; v.count++;
          tagMood.set(key, v);
        }
      } catch {}
    }

    const total = moods.length || 1;
    const stressCount = tagCounts.get('stress') ?? 0;
    const exerciseVal = tagMood.get('exercise');
    const sleepVal = tagMood.get('sleep');

    if (stressCount / total >= 0.25) {
      recs.push({
        emoji: '🧘',
        title: 'Try Relaxation Techniques',
        detail: `Stress appears in ${Math.round((stressCount / total) * 100)}% of your entries. Consider meditation or breathing exercises.`,
      });
    }
    if (exerciseVal && exerciseVal.count >= 3 && exerciseVal.sum / exerciseVal.count >= 3.5) {
      recs.push({
        emoji: '🏃',
        title: 'Keep Up Your Exercise Habit',
        detail: `Days with exercise have an avg mood of ${(exerciseVal.sum / exerciseVal.count).toFixed(1)}/5. Maintaining this routine is helping you.`,
      });
    }
    if (sleepVal && sleepVal.count >= 3 && sleepVal.sum / sleepVal.count >= 3.5) {
      recs.push({
        emoji: '😴',
        title: 'Prioritize Sleep',
        detail: `Good sleep correlates with higher mood scores. Keep maintaining your sleep schedule.`,
      });
    }
    if (averageMood < 2.5 && moods.length >= 5) {
      recs.push({
        emoji: '🤝',
        title: 'Connect with Others',
        detail: 'Your recent mood has been low. Reaching out to friends or family can help boost wellbeing.',
      });
    }
    if (streak >= 7) {
      recs.push({
        emoji: '🔥',
        title: 'Great Consistency!',
        detail: `You've maintained a ${streak}-day streak. Regular tracking gives you better self-awareness.`,
      });
    }
    if (recs.length === 0) {
      recs.push({
        emoji: '✨',
        title: 'Keep Logging!',
        detail: 'Log more moods with tags to receive personalized recommendations based on your patterns.',
      });
    }
    return recs;
  })();

  // ── F9: Trigger detection ──
  const triggers = (() => {
    const lowMoods = moods.filter((m) => m.moodScore <= 2);
    const total = lowMoods.length;
    if (total === 0) return [];

    const tagCounts = new Map<string, number>();
    for (const m of lowMoods) {
      if (!m.tagsJson) continue;
      try {
        const tags: string[] = JSON.parse(m.tagsJson);
        for (const t of tags) {
          const key = t.toLowerCase().trim();
          tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
        }
      } catch {}
    }
    return [...tagCounts.entries()]
      .filter(([, c]) => c >= 2)
      .map(([tag, count]) => ({
        tag: tag.charAt(0).toUpperCase() + tag.slice(1),
        percent: Math.round((count / total) * 100),
        count,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);
  })();

  // ── F7: Heatmap data ──
  const heatmapData = (() => {
    const now = new Date();
    const byDay = new Map<string, { sum: number; count: number; mood: string }>();
    for (const m of moods) {
      const v = byDay.get(m.date) ?? { sum: 0, count: 0, mood: m.mood };
      v.sum += m.moodScore; v.count++;
      byDay.set(m.date, v);
    }
    return Array.from({ length: 90 }).map((_, i) => {
      const d = subDays(now, 89 - i);
      const key = format(d, 'yyyy-MM-dd');
      const v = byDay.get(key);
      return {
        date: key,
        score: v ? Math.round((v.sum / v.count) * 10) / 10 : null,
        mood: v?.mood ?? null,
      };
    });
  })();

  return (
    <div id="pdf-export-target" className="max-w-6xl mx-auto w-full space-y-10 pb-20 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300">
              Insights
            </span>
          </h1>
          <p className="text-white/50 text-lg mt-2">Patterns and signals from your recent tracking.</p>
        </div>
        {/* F8: Export Button */}
        <ExportButton />
      </header>

      {/* ── Top Stats ── */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Average Mood" value={averageMood ? averageMood.toFixed(1) : '—'} hint="Last 30 entries" />
        <Card title="Stability Score" value={`${stability}%`} hint="Consistency index" />
        <Card title="Top Mood" value={topMood.replace('_', ' ')} hint="Most frequent" />
        <Card title="Day Streak" value={`${streak}`} hint="Days logged in a row" />
      </section>

      {/* ── F7: Mood Heatmap ── */}
      <section>
        <MoodHeatmap data={heatmapData} />
      </section>

      {/* ── F4: Activity Impact ── */}
      <section>
        <ActivityImpactChart data={activityImpact} />
      </section>

      {/* ── F9: Trigger Detection ── */}
      <section className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <h2 className="text-xl font-bold text-white mb-1">Emotional Triggers</h2>
        <p className="text-white/40 text-sm mb-5">Tags most commonly associated with low mood entries.</p>
        {triggers.length === 0 ? (
          <p className="text-white/35 text-sm">Log more entries with tags to identify your emotional triggers.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {triggers.map((t) => (
              <div
                key={t.tag}
                className="rounded-2xl border border-red-500/15 bg-red-500/8 p-5"
              >
                <div className="text-xl font-bold text-white">{t.percent}%</div>
                <div className="text-sm font-semibold text-red-300 mt-1">#{t.tag}</div>
                <div className="text-xs text-white/40 mt-1">
                  &quot;{t.tag}&quot; appears in {t.percent}% of low mood entries ({t.count} times)
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── F5: Smart Recommendations ── */}
      <section className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <h2 className="text-xl font-bold text-white mb-1">Smart Recommendations</h2>
        <p className="text-white/40 text-sm mb-5">Personalized suggestions based on your emotional patterns.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((r, i) => (
            <div
              key={i}
              className="rounded-2xl border border-violet-500/15 bg-violet-500/8 p-5"
            >
              <div className="text-2xl mb-2">{r.emoji}</div>
              <div className="text-sm font-bold text-white">{r.title}</div>
              <div className="text-xs text-white/50 mt-2 leading-relaxed">{r.detail}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="text-xs text-white/45 font-semibold uppercase tracking-wider">{title}</div>
      <div className="mt-3 text-3xl font-extrabold text-white capitalize">{value}</div>
      <div className="mt-2 text-xs text-white/35">{hint}</div>
    </div>
  );
}
