// Shared constants safe to import in both server and client components

export const HABIT_NAMES = ['Meditation', 'Exercise', 'Reading', 'Sleep Early'] as const;
export type HabitName = typeof HABIT_NAMES[number];

export const MILESTONES = [
  { id: 'first_entry',      label: 'First Entry',       emoji: '🌱', desc: 'Log your very first mood.' },
  { id: 'seven_day_streak', label: '7 Day Streak',       emoji: '🔥', desc: 'Log mood 7 days in a row.' },
  { id: 'journal_keeper',   label: 'Journal Keeper',     emoji: '📓', desc: 'Write 10 journal entries.' },
  { id: 'data_pioneer',     label: 'Data Pioneer',       emoji: '📊', desc: 'Log 20 mood entries.' },
  { id: 'monthly_master',   label: 'Monthly Master',     emoji: '🏆', desc: 'Maintain a 30-day streak.' },
  { id: 'habit_hero',       label: 'Habit Hero',         emoji: '💪', desc: 'Complete all habits in a day.' },
] as const;
