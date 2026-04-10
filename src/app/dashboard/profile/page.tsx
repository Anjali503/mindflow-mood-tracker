import { dataService } from '@/lib/data-service';
import { MILESTONES } from '@/lib/constants';
import { format, subDays } from 'date-fns';
import { type MoodEntry, type JournalEntry } from '@/lib/db';

export const dynamic = 'force-dynamic';

function mode<T extends string>(arr: T[]) {
  const m = new Map<T, number>();
  for (const x of arr) m.set(x, (m.get(x) ?? 0) + 1);
  const sorted = [...m.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? null;
}

function computeStreak(moods: MoodEntry[]): number {
  const days = new Set(moods.map((m) => m.date));
  const now = new Date();
  let s = 0;
  for (let i = 0; i < 365; i++) {
    const key = format(subDays(now, i), 'yyyy-MM-dd');
    if (!days.has(key)) break;
    s++;
  }
  return s;
}

function computeBalanceScore(moods: MoodEntry[]): number {
  if (moods.length === 0) return 0;
  let positiveCount = 0;
  let stressPenalty = 0;
  for (const m of moods) {
    if (m.mood === 'happy' || m.mood === 'very_happy') positiveCount++;
    if (m.tagsJson) {
      try {
        const tags: string[] = JSON.parse(m.tagsJson);
        if (tags.map((t) => t.toLowerCase()).includes('stress')) stressPenalty += 0.5;
      } catch {}
    }
    if (m.mood === 'very_sad') stressPenalty += 1;
  }
  return Math.round(Math.max(0, Math.min(100, (positiveCount / moods.length) * 100 - stressPenalty)));
}

export default async function ProfilePage() {
  const user = await dataService.getOrCreateUser();
  const moods = await dataService.getMoodEntries(user.id);
  const journals = await dataService.getJournalEntries(user.id);

  const topMood = mode(moods.map((m) => m.mood));
  const streak = computeStreak(moods);
  const avgMood = moods.length
    ? Math.round((moods.reduce((a, m) => a + m.moodScore, 0) / moods.length) * 10) / 10
    : 0;
  const balance = computeBalanceScore(moods);

  // ── F6: Auto-unlock achievements ──
  const existingRows = await dataService.getAchievements(user.id);
  const unlockedIds = new Set(existingRows.map((r) => r.milestoneId));

  const toUnlock: string[] = [];
  if (!unlockedIds.has('first_entry') && moods.length >= 1) toUnlock.push('first_entry');
  if (!unlockedIds.has('seven_day_streak') && streak >= 7) toUnlock.push('seven_day_streak');
  if (!unlockedIds.has('journal_keeper') && journals.length >= 10) toUnlock.push('journal_keeper');
  if (!unlockedIds.has('data_pioneer') && moods.length >= 20) toUnlock.push('data_pioneer');
  if (!unlockedIds.has('monthly_master') && streak >= 30) toUnlock.push('monthly_master');

  if (toUnlock.length > 0) {
    for (const mid of toUnlock) {
      await dataService.unlockAchievement(user.id, mid);
      unlockedIds.add(mid);
    }
  }

  const achievementRows = await dataService.getAchievements(user.id);
  const achievementMap = new Map(achievementRows.map((r) => [r.milestoneId, r.unlockedAt]));

  const allMilestones = MILESTONES.map((m) => ({
    ...m,
    unlocked: unlockedIds.has(m.id),
    unlockedAt: achievementMap.get(m.id) ?? null,
  }));

  const unlockedCount = allMilestones.filter((m) => m.unlocked).length;
  const progressPct = Math.round((unlockedCount / allMilestones.length) * 100);

  return (
    <div className="max-w-6xl mx-auto w-full space-y-10 pb-20 pt-4">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-violet-500/30 to-cyan-500/10 border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.2)] flex items-center justify-center text-2xl">
            🧠
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Profile</h1>
            <p className="text-white/50">{user.email}</p>
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
          {unlockedCount}/{allMilestones.length} Achievements
        </span>
      </header>

      {/* ── Stats Row ── */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Stat title="Mood Entries" value={`${moods.length}`} />
        <Stat title="Journal Entries" value={`${journals.length}`} />
        <Stat title="Day Streak" value={`${streak}d`} />
        <Stat title="Average Mood" value={avgMood ? `${avgMood}/5` : '—'} />
        <Stat title="Balance Score" value={`${balance}%`} />
      </section>

      {/* ── F6: Achievements ── */}
      <section className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">Achievements</h2>
          <span className="text-sm text-white/40">{unlockedCount} / {allMilestones.length} unlocked</span>
        </div>
        {/* Progress bar */}
        <div className="mb-6 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allMilestones.map((m) => (
            <div
              key={m.id}
              className={[
                'rounded-2xl border p-5 transition-all duration-300',
                m.unlocked
                  ? 'border-violet-500/30 bg-gradient-to-br from-violet-500/15 to-cyan-500/8 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                  : 'border-white/8 bg-white/3 opacity-50',
              ].join(' ')}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={[
                    'text-3xl w-12 h-12 flex items-center justify-center rounded-2xl',
                    m.unlocked ? 'bg-violet-500/20' : 'bg-white/5 grayscale',
                  ].join(' ')}
                >
                  {m.emoji}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-bold ${m.unlocked ? 'text-white' : 'text-white/40'}`}>
                    {m.label}
                  </div>
                  {m.unlocked && m.unlockedAt && (
                    <div className="text-xs text-white/35 mt-0.5">
                      Unlocked {format(new Date(m.unlockedAt), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
                {m.unlocked && (
                  <div className="ml-auto shrink-0 text-emerald-400 text-lg">✓</div>
                )}
              </div>
              <div className={`text-xs leading-relaxed ${m.unlocked ? 'text-white/50' : 'text-white/30'}`}>
                {m.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Mood */}
      {topMood && (
        <section className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-bold text-white mb-3">Mood Profile</h2>
          <div className="flex gap-6 flex-wrap">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-white/40 mb-1">Most Common Mood</div>
              <div className="text-2xl font-bold text-white capitalize">{topMood.replace('_', ' ')}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-white/40 mb-1">Account since</div>
              <div className="text-2xl font-bold text-white">
                {format(new Date(user.createdAt), 'MMM yyyy')}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="text-xs text-white/45 font-semibold uppercase tracking-wider">{title}</div>
      <div className="mt-3 text-3xl font-extrabold text-white">{value}</div>
    </div>
  );
}
