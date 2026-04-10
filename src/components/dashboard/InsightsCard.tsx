'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingDown, Tag as TagIcon, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InsightsCard({ insights }: { insights: any }) {
  if (!insights) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Streak Insight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group p-6 rounded-3xl bg-black/40 border border-white/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-green-500/20 rounded-2xl">
            <Activity className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{insights.streak} Days</h3>
        <p className="text-white/50 text-sm font-medium">Current Positive Streak</p>
      </motion.div>

      {/* Mood Warning Insight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group p-6 rounded-3xl bg-black/40 border border-white/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-orange-500/20 rounded-2xl">
            <TrendingDown className="w-6 h-6 text-orange-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 leading-tight">
          {insights.moodDrop ? "Mood Drop Detected" : "Stable Trajectory"}
        </h3>
        <p className="text-white/50 text-sm font-medium">
          {insights.moodDrop ? "Your mood scores are slightly lower than earlier this week." : "Your recent mood has been stable without sharp drops."}
        </p>
      </motion.div>

      {/* Frequent Tags Insight */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn("relative group p-6 rounded-3xl bg-black/40 border border-white/10 overflow-hidden md:col-span-2 lg:col-span-1")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl">
            <TagIcon className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-white mb-3">Top Triggers</h3>
        <div className="flex flex-wrap gap-2">
          {insights.frequentTags?.length > 0 ? insights.frequentTags.map((t: any) => (
            <span key={t.tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/80">
              #{t.tag} <span className="text-white/40 ml-1">{t.count}</span>
            </span>
          )) : <p className="text-white/40 text-sm">Not enough data to find triggers yet.</p>}
        </div>
      </motion.div>
    </div>
  );
}
