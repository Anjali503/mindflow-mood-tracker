"use client";

import { useEffect, useState } from 'react';
import { HABIT_NAMES } from '@/lib/constants';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { supabase } from '../../../lib/supabase';
import { StatsCard } from '@/components/dashboard/StatsCard';
import {
  MoodMixCard,
  MoodTrendCard,
  TagFrequencyCard,
} from '@/components/dashboard/DashboardCharts';
import HabitTracker from '@/components/dashboard/HabitTracker';
import { type MoodEntry, type JournalEntry, type Habit } from '@/lib/db';

// ─── helpers ──────────────────────────────────────────────────────────────────

function safeTagsPreview(tagsJson: string | null) {
  if (!tagsJson) return '';
  try {
    const tags = JSON.parse(tagsJson) as string[];
    if (!Array.isArray(tags)) return '';
    return tags
      .slice(0, 3)
      .map((t) => `#${t}`)
      .join(' ');
  } catch {
    return '';
  }
}

function toDisplayDate(input: unknown) {
  if (Array.isArray(input)) return new Date(String(input[0]));
  return new Date(String(input));
}

/** Simple linear regression on mood scores */
function predictNextMood(moods: MoodEntry[]): { score: number; confidence: number } | null {
  const last7 = moods.slice(0, 7);
  if (last7.length < 3) return null;
  const n = last7.length;
  const scores = last7.map((m) => m.moodScore).reverse(); // chronological order
  // least-squares trend
  const xMean = (n - 1) / 2;
  const yMean = scores.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  scores.forEach((y, x) => {
    num += (x - xMean) * (y - yMean);
    den += (x - xMean) ** 2;
  });
  const slope = den !== 0 ? num / den : 0;
  const intercept = yMean - slope * xMean;
  const predicted = Math.max(1, Math.min(5, intercept + slope * n));
  // confidence: higher when variance is low and trend is clear
  const variance = scores.reduce((a, y) => a + (y - yMean) ** 2, 0) / n;
  const confidence = Math.round(Math.max(30, Math.min(95, 90 - variance * 15)));
  return { score: Math.round(predicted * 10) / 10, confidence };
}

function moodLabel(score: number): { label: string; emoji: string } {
  if (score >= 4.6) return { label: 'Very Happy', emoji: '😁' };
  if (score >= 3.6) return { label: 'Happy', emoji: '😊' };
  if (score >= 2.6) return { label: 'Neutral', emoji: '😐' };
  if (score >= 1.6) return { label: 'Sad', emoji: '😢' };
  return { label: 'Very Sad', emoji: '😞' };
}

/** Emotional balance score based on positive moods minus stress penalty */
function computeBalanceScore(moods: MoodEntry[]): number {
  if (moods.length === 0) return 0;
  let positiveCount = 0;
  let stressPenalty = 0;
  for (const m of moods) {
    if (m.mood === 'happy' || m.mood === 'very_happy') positiveCount++;
    // Stress tag penalty
    if (m.tagsJson) {
      try {
        const tags: string[] = JSON.parse(m.tagsJson);
        if (tags.map((t) => t.toLowerCase()).includes('stress')) stressPenalty += 0.5;
      } catch {}
    }
    if (m.mood === 'very_sad') stressPenalty += 1;
  }
  const raw = (positiveCount / moods.length) * 100 - stressPenalty;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

/** Weekly report: last 7 calendar days */
function buildWeeklyReport(moods: MoodEntry[]) {
  const now = new Date();
  const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekMoods = moods.filter((m) => m.date >= weekStart && m.date <= weekEnd);

  if (weekMoods.length === 0) return null;

  const avg = weekMoods.reduce((a, m) => a + m.moodScore, 0) / weekMoods.length;

  const moodCounts = new Map<string, number>();
  weekMoods.forEach((m) => moodCounts.set(m.mood, (moodCounts.get(m.mood) ?? 0) + 1));
  const topMoodEntry = [...moodCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  const tagCounts = new Map<string, number>();
  weekMoods.forEach((m) => {
    if (!m.tagsJson) return;
    try {
      const tags: string[] = JSON.parse(m.tagsJson);
      tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1));
    } catch {}
  });
  const topTagEntry = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  // Happiest day
  const dayScores = new Map<string, { sum: number; count: number }>();
  weekMoods.forEach((m) => {
    const v = dayScores.get(m.date) ?? { sum: 0, count: 0 };
    v.sum += m.moodScore; v.count++;
    dayScores.set(m.date, v);
  });
  const bestDayEntry = [...dayScores.entries()].sort(
    (a, b) => b[1].sum / b[1].count - a[1].sum / a[1].count
  )[0];

  // Spike/drop detection
  const dailyAvgs = [...dayScores.entries()].map(([d, v]) => ({ date: d, avg: v.sum / v.count }));
  let spike = false, drop = false;
  for (let i = 1; i < dailyAvgs.length; i++) {
    const diff = dailyAvgs[i].avg - dailyAvgs[i - 1].avg;
    if (diff >= 2) spike = true;
    if (diff <= -2) drop = true;
  }

  return {
    entries: weekMoods.length,
    avg: Math.round(avg * 10) / 10,
    topMood: topMoodEntry?.[0]?.replace('_', ' ') ?? '—',
    topTag: topTagEntry?.[0] ?? '—',
    happiest: bestDayEntry ? format(new Date(bestDayEntry[0] + 'T12:00:00'), 'EEE') : '—',
    spike,
    drop,
  };
}

export default function DashboardClient({
  initialMoods,
  journals,
  todayHabits,
  user,
  todayKey,
}: {
  initialMoods: MoodEntry[];
  journals: JournalEntry[];
  todayHabits: Habit[];
  user: { id: string };
  todayKey: string;
}) {
  const [moods, setMoods] = useState<MoodEntry[]>(initialMoods);

  useEffect(() => {
    setMoods(initialMoods);
  }, [initialMoods]);

  useEffect(() => {
    const channel = supabase
      .channel("mood_entries_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mood_entries",
        },
        (payload: any) => {
          if (payload.new.userId === user.id) {
            console.log("Realtime mood entry received:", payload.new);
            
            const row = payload.new;
            const mood = (row.mood ?? 'neutral') as MoodEntry['mood'];
            const createdAt = Array.isArray(row.createdAt)
              ? String(row.createdAt[0] ?? new Date().toISOString())
              : String(row.createdAt ?? new Date().toISOString());

            const moodScore =
              mood === 'very_happy'
                ? 5
                : mood === 'happy'
                  ? 4
                  : mood === 'neutral'
                    ? 3
                    : mood === 'sad'
                      ? 2
                      : 1;

            const moodEmoji =
              mood === 'very_happy'
                ? '🤩'
                : mood === 'happy'
                  ? '😊'
                  : mood === 'neutral'
                    ? '😐'
                    : mood === 'sad'
                      ? '😔'
                      : '😞';

            const newEntry: MoodEntry = {
              id: row.id,
              userId: row.userId,
              mood,
              moodScore,
              moodEmoji,
              tagsJson: Array.isArray(row.tags) ? JSON.stringify(row.tags) : row.tags ?? null,
              journalNote: row.journal ?? null,
              date: row.date ?? createdAt.slice(0, 10),
              createdAt,
            };

            setMoods((prev) => [newEntry, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  const now = new Date();
  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const streak = (() => {
    const days = new Set(moods.map((m) => m.date));
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const key = format(subDays(now, i), 'yyyy-MM-dd');
      if (!days.has(key)) break;
      s++;
    }
    return s;
  })();

  const avgMood = (() => {
    if (moods.length === 0) return 0;
    const last = moods.slice(0, Math.min(30, moods.length));
    const v = last.reduce((a, m) => a + m.moodScore, 0) / last.length;
    return Math.round(v * 10) / 10;
  })();

  const avgMoodLabel = (() => {
    if (!avgMood) return '—';
    return moodLabel(avgMood).label;
  })();

  const balanceScore = computeBalanceScore(moods);
  const prediction = predictNextMood(moods);
  const weeklyReport = buildWeeklyReport(moods);

  const trendData = (() => {
    const byDay = new Map<string, { sum: number; count: number }>();
    for (const m of moods) {
      if (!byDay.has(m.date)) byDay.set(m.date, { sum: 0, count: 0 });
      const v = byDay.get(m.date)!;
      v.sum += m.moodScore;
      v.count += 1;
    }
    return Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(now, 6 - i);
      const key = format(d, 'yyyy-MM-dd');
      const label = format(d, 'EEE');
      const v = byDay.get(key);
      return { day: label, score: v ? Math.round((v.sum / v.count) * 10) / 10 : null };
    });
  })();

  const mixData = (() => {
    const counts = { 'Very Happy': 0, Happy: 0, Neutral: 0, Sad: 0 };
    for (const m of moods) {
      if (m.mood === 'very_happy') counts['Very Happy']++;
      else if (m.mood === 'happy') counts.Happy++;
      else if (m.mood === 'neutral') counts.Neutral++;
      else counts.Sad++;
    }
    return [
      { name: 'Very Happy', value: counts['Very Happy'], color: '#34d399' },
      { name: 'Happy', value: counts.Happy, color: '#22d3ee' },
      { name: 'Neutral', value: counts.Neutral, color: '#fbbf24' },
      { name: 'Sad', value: counts.Sad, color: '#fb7185' },
    ];
  })();

  const tagFrequency = (() => {
    const sinceKey = format(subDays(now, 29), 'yyyy-MM-dd');
    const tagCounts = new Map<string, number>();
    for (const m of moods) {
      if (m.date < sinceKey) continue;
      if (!m.tagsJson) continue;
      try {
        const tags = JSON.parse(m.tagsJson) as string[];
        if (Array.isArray(tags)) {
          for (const t of tags) {
            const key = String(t).trim().toLowerCase();
            if (!key) continue;
            tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
          }
        }
      } catch {}
    }
    return [...tagCounts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  })();

  const recentMoods = moods.slice(0, 4);
  const recentJournals = journals.slice(0, 3);
  const totalLogs = moods.length;

  // Habit initial state for client component
  const habitInitialState = HABIT_NAMES.map((name) => ({
    name,
    completed: !!(todayHabits.find((h) => h.name === name)?.completed),
  }));

  return (
    <div className="w-full space-y-10 pb-20">
      <header className="pt-4">
        <h1 className="font-display text-5xl md:text-6xl font-semibold text-white/90">
          {greeting} <span className="text-white/80">✨</span>
        </h1>
        <p className="mt-3 text-white/40 text-lg">{format(now, 'EEEE, MMMM d, yyyy')}</p>
      </header>

      {/* ── Stats Row ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          iconName="flame"
          iconBgClassName="bg-orange-500/15"
          value={`${streak}`}
          label="Day Streak"
          sublabel={streak >= 3 ? 'Keep it up!' : ''}
          accent="warm"
        />
        <StatsCard
          iconName="smile"
          iconBgClassName="bg-indigo-500/15"
          value={avgMood ? `${avgMood}` : '—'}
          label="Avg Mood"
          sublabel={avgMood ? avgMoodLabel : ''}
          accent="cool"
        />
        <StatsCard
          iconName="clipboard"
          iconBgClassName="bg-cyan-500/10"
          value={`${totalLogs}`}
          label="Total Logs"
          sublabel="mood entries"
          accent="neutral"
        />
        {/* F2: Emotional Balance Score */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-xl">⚖️</div>
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-white/40">Emotional Balance</div>
              <div className="text-3xl font-extrabold text-white">{balanceScore}%</div>
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
              style={{ width: `${balanceScore}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-white/35">Wellness stability score</div>
        </div>
      </section>

      {/* ── F1 Prediction + F3 Weekly Report ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* F1: Tomorrow's Mood Prediction */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="text-xs uppercase tracking-wider font-semibold text-white/40 mb-4">Tomorrow&apos;s Mood Prediction</div>
          {prediction ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl mb-2">{moodLabel(prediction.score).emoji}</div>
                <div className="text-2xl font-bold text-white">{moodLabel(prediction.score).label}</div>
                <div className="text-sm text-white/40 mt-1">Predicted score: {prediction.score}/5</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-extrabold text-white">{prediction.confidence}%</div>
                <div className="text-xs text-white/35 mt-1">Confidence</div>
                <div className="mt-3 h-2 w-24 ml-auto rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-white/35 text-sm">Log at least 3 moods to unlock predictions.</div>
          )}
        </div>

        {/* F3: Weekly Report */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="text-xs uppercase tracking-wider font-semibold text-white/40 mb-4">Weekly Emotional Report</div>
          {weeklyReport ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-black/20 border border-white/8 p-3">
                <div className="text-white/40 text-xs">Avg Mood</div>
                <div className="text-white font-bold text-lg">{weeklyReport.avg}/5</div>
              </div>
              <div className="rounded-xl bg-black/20 border border-white/8 p-3">
                <div className="text-white/40 text-xs">Most Frequent</div>
                <div className="text-white font-bold capitalize">{weeklyReport.topMood}</div>
              </div>
              <div className="rounded-xl bg-black/20 border border-white/8 p-3">
                <div className="text-white/40 text-xs">Top Tag</div>
                <div className="text-white font-bold">#{weeklyReport.topTag}</div>
              </div>
              <div className="rounded-xl bg-black/20 border border-white/8 p-3">
                <div className="text-white/40 text-xs">Happiest Day</div>
                <div className="text-white font-bold">{weeklyReport.happiest}</div>
              </div>
              {(weeklyReport.spike || weeklyReport.drop) && (
                <div className="col-span-2 rounded-xl bg-black/20 border border-orange-500/20 p-3">
                  <div className="text-orange-400 text-xs font-semibold">
                    {weeklyReport.spike && '⚡ Mood spike detected  '}
                    {weeklyReport.drop && '📉 Mood drop detected'}
                  </div>
                </div>
              )}
              <div className="col-span-2 text-white/30 text-xs">{weeklyReport.entries} entries this week</div>
            </div>
          ) : (
            <div className="text-white/35 text-sm">No entries logged this week yet.</div>
          )}
        </div>
      </section>

      {/* ── Charts Row ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MoodTrendCard data={trendData} />
        </div>
        <div className="lg:col-span-1">
          <MoodMixCard data={mixData} />
        </div>
      </section>

      {/* ── Tag Frequency + Recent entries ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TagFrequencyCard data={tagFrequency} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="text-lg font-semibold text-white/90">Recent Journal Entries</div>
            <div className="mt-4 space-y-3">
              {recentJournals.length === 0 ? (
                <div className="text-sm text-white/35">No journal entries yet.</div>
              ) : (
                recentJournals.map((j) => (
                  <div key={j.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs text-white/40">{format(toDisplayDate(j.createdAt), 'MMM d')}</div>
                    <div className="mt-2 text-sm text-white/80 line-clamp-3">{j.body}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="text-lg font-semibold text-white/90">Recent Mood Entries</div>
            <div className="mt-4 space-y-3">
              {recentMoods.length === 0 ? (
                <div className="text-sm text-white/35">No mood entries yet.</div>
              ) : (
                recentMoods.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                        {m.moodEmoji}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-white/80 truncate">{format(toDisplayDate(m.createdAt), 'MMM d • h:mm a')}</div>
                        <div className="text-xs text-white/35 truncate">
                          {m.tagsJson ? safeTagsPreview(m.tagsJson) : 'No tags'}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-white/40">{m.moodScore}/5</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── F10: Habit Tracker ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HabitTracker initialHabits={habitInitialState} todayKey={todayKey} />
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col justify-center">
          <div className="text-xs uppercase tracking-wider font-semibold text-white/40 mb-3">Quick Stats</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-black/20 border border-white/8 p-3">
              <div className="text-white/40 text-xs">Journal Entries</div>
              <div className="text-white font-bold text-2xl">{journals.length}</div>
            </div>
            <div className="rounded-xl bg-black/20 border border-white/8 p-3">
              <div className="text-white/40 text-xs">Current Streak</div>
              <div className="text-white font-bold text-2xl">{streak}d</div>
            </div>
            <div className="rounded-xl bg-black/20 border border-white/8 p-3">
              <div className="text-white/40 text-xs">This Week</div>
              <div className="text-white font-bold text-2xl">{weeklyReport?.entries ?? 0}</div>
            </div>
            <div className="rounded-xl bg-black/20 border border-white/8 p-3">
              <div className="text-white/40 text-xs">Balance Score</div>
              <div className="text-white font-bold text-2xl">{balanceScore}%</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
