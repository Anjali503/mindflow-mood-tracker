"use client";

import { useEffect, useState, useMemo } from 'react';
import { subDays, format } from 'date-fns';
import { supabase } from '../../../lib/supabase';
import { type MoodEntry } from '@/lib/db';

const moodStyles: Record<string, { label: string; bg: string; emoji: string }> = {
  very_happy: { label: 'Very Happy', bg: 'bg-violet-500/25 border-violet-400/30', emoji: '🤩' },
  happy: { label: 'Happy', bg: 'bg-indigo-500/20 border-indigo-400/30', emoji: '😊' },
  neutral: { label: 'Neutral', bg: 'bg-slate-500/15 border-white/10', emoji: '😐' },
  sad: { label: 'Sad', bg: 'bg-orange-500/15 border-orange-400/30', emoji: '😔' },
  very_sad: { label: 'Very Sad', bg: 'bg-rose-500/20 border-rose-400/30', emoji: '😞' },
  none: { label: 'No Entry', bg: 'bg-white/5 border-white/10', emoji: '—' },
};

export default function CalendarClient({
  initialMoods,
  user,
}: {
  initialMoods: MoodEntry[];
  user: { id: string };
}) {
  const [moods, setMoods] = useState<MoodEntry[]>(initialMoods);

  useEffect(() => {
    setMoods(initialMoods);
  }, [initialMoods]);

  useEffect(() => {
    const channel = supabase
      .channel("mood_entries_changes_calendar")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mood_entries",
        },
        (payload: any) => {
          if (payload.new.userId === user.id) {
            console.log("Realtime mood entry received (Calendar):", payload.new);
            
            const row = payload.new;
            const mood = (row.mood ?? 'neutral') as MoodEntry['mood'];
            const createdAt = Array.isArray(row.createdAt)
              ? String(row.createdAt[0] ?? new Date().toISOString())
              : String(row.createdAt ?? new Date().toISOString());

            const moodScore =
              mood === 'very_happy' ? 5 : mood === 'happy' ? 4 : mood === 'neutral' ? 3 : mood === 'sad' ? 2 : 1;

            const moodEmoji =
              mood === 'very_happy' ? '🤩' : mood === 'happy' ? '😊' : mood === 'neutral' ? '😐' : mood === 'sad' ? '😔' : '😞';

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

  const since = format(subDays(new Date(), 29), 'yyyy-MM-dd');

  const moodsByDate = useMemo(() => {
    return moods.reduce((acc, entry) => {
      if (entry.date >= since) acc[entry.date] = entry;
      return acc;
    }, {} as Record<string, MoodEntry>);
  }, [moods, since]);

  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(new Date(), 29 - i);
    const key = format(d, 'yyyy-MM-dd');
    return { key, d, entry: moodsByDate[key] };
  });

  return (
    <div className="max-w-6xl mx-auto w-full space-y-10 pb-20 pt-4">
      <header>
        <h1 className="text-4xl font-extrabold text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-violet-300 to-indigo-300">
            Mood Calendar
          </span>
        </h1>
        <p className="text-white/50 text-lg mt-2">Last 30 days at a glance.</p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-6 shadow-glass">
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
          {days.map(({ key, entry }) => {
            const moodKey = entry?.mood ?? 'none';
            const s = moodStyles[moodKey] ?? moodStyles.none;
            return (
              <div
                key={key}
                title={`${key} • ${s.label}`}
                className={[
                  'aspect-square rounded-2xl border flex items-center justify-center',
                  'text-xl shadow-sm transition-transform hover:scale-110',
                  s.bg,
                ].join(' ')}
              >
                <span className="opacity-90">{entry ? s.emoji : '·'}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        {Object.entries(moodStyles).map(([k, v]) => (
          <div
            key={k}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-white/70 ${v.bg}`}
          >
            <span className="text-sm">{v.emoji}</span>
            {v.label}
          </div>
        ))}
      </section>
    </div>
  );
}
