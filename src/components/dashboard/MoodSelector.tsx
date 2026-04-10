'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  onSelect: (score: number, emoji: string) => void;
  selectedScore: number | null;
}

const moods = [
  { score: 5, emoji: '🤩', label: 'Very Happy', color: 'from-violet-500/20 to-cyan-500/10', shadow: 'shadow-violet-500/50' },
  { score: 4, emoji: '😊', label: 'Happy', color: 'from-indigo-500/20 to-purple-500/10', shadow: 'shadow-indigo-500/50' },
  { score: 3, emoji: '😐', label: 'Neutral', color: 'from-slate-500/15 to-slate-500/5', shadow: 'shadow-slate-500/40' },
  { score: 2, emoji: '😔', label: 'Sad', color: 'from-orange-500/15 to-rose-500/10', shadow: 'shadow-orange-500/50' },
  { score: 1, emoji: '😞', label: 'Very Sad', color: 'from-rose-500/20 to-red-600/15', shadow: 'shadow-rose-500/50' },
];

export default function MoodSelector({ onSelect, selectedScore }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
      {moods.map((mood) => {
        const isSelected = selectedScore === mood.score;
        return (
          <motion.button
            key={mood.score}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mood.score, mood.emoji)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 h-28 sm:h-32 rounded-2xl transition-all duration-300 group",
              isSelected 
                ? "bg-gradient-to-b " + mood.color + " border border-white/20 " + mood.shadow + " shadow-lg"
                : "bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="active-mood"
                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="text-4xl sm:text-5xl drop-shadow-lg z-10 filter group-hover:brightness-110">
              {mood.emoji}
            </span>
            <span className={cn(
              "text-xs sm:text-sm font-medium transition-colors z-10",
              isSelected ? "text-white" : "text-white/40 group-hover:text-white/80"
            )}>
              {mood.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
