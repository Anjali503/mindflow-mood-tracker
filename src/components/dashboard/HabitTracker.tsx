'use client';

import { useState } from 'react';
import { CheckCircle2, Dumbbell, BookOpen, Moon, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HABIT_NAMES } from '@/lib/constants';
import type { HabitName } from '@/lib/constants';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Meditation: Brain,
  Exercise: Dumbbell,
  Reading: BookOpen,
  'Sleep Early': Moon,
};

const COLORS: Record<string, string> = {
  Meditation: 'from-violet-500/20 to-purple-500/10 border-violet-500/20 text-violet-300',
  Exercise: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-300',
  Reading: 'from-amber-500/20 to-yellow-500/10 border-amber-500/20 text-amber-300',
  'Sleep Early': 'from-cyan-500/20 to-blue-500/10 border-cyan-500/20 text-cyan-300',
};

interface Props {
  initialHabits: { name: string; completed: boolean }[];
  todayKey: string;
}

export default function HabitTracker({ initialHabits, todayKey }: Props) {
  const initMap: Record<string, boolean> = {};
  for (const h of initialHabits) initMap[h.name] = h.completed;

  const [completed, setCompleted] = useState<Record<string, boolean>>(initMap);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function toggle(name: HabitName) {
    const next = !completed[name];
    setLoading((l) => ({ ...l, [name]: true }));
    try {
      await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, completed: next, date: todayKey }),
      });
      setCompleted((c) => ({ ...c, [name]: next }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((l) => ({ ...l, [name]: false }));
    }
  }

  const doneCount = Object.values(completed).filter(Boolean).length;
  const total = HABIT_NAMES.length;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-white/90">Daily Habits</div>
          <div className="text-sm text-white/35">Today&apos;s progress</div>
        </div>
        <div className="text-sm font-bold text-white/70">
          <span className="text-white">{doneCount}</span>/{total}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(doneCount / total) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(HABIT_NAMES as unknown as HabitName[]).map((name) => {
          const Icon = ICONS[name];
          const done = completed[name] ?? false;
          const busy = loading[name] ?? false;
          const colorBase = COLORS[name];

          return (
            <motion.button
              key={name}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggle(name)}
              disabled={busy}
              className={[
                'relative flex items-center gap-3 p-3.5 rounded-2xl border bg-gradient-to-br transition-all duration-300',
                done
                  ? colorBase + ' opacity-100'
                  : 'from-white/5 to-white/2 border-white/10 text-white/40',
                busy ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:border-white/20',
              ].join(' ')}
            >
              <Icon className={`w-5 h-5 shrink-0 ${done ? '' : 'text-white/30'}`} />
              <span className={`text-sm font-medium leading-tight text-left ${done ? '' : 'text-white/50'}`}>
                {name}
              </span>
              <AnimatePresence>
                {done && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="ml-auto shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-current" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {doneCount === total && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm font-semibold text-emerald-400"
        >
          🎉 All habits done today!
        </motion.div>
      )}
    </div>
  );
}
