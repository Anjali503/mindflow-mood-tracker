'use client';
export const dynamic = "force-dynamic";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import MoodSelector from '@/components/dashboard/MoodSelector';
import { Sparkles, Save, Tag as TagIcon, Loader2, NotebookPen } from 'lucide-react';
import { motion } from 'framer-motion';

const TAGS = [
  'Stress',
  'Study',
  'Health',
  'Social',
  'Sleep',
  'Work',
  'Exercise',
  'Creative',
  'Family',
  'Food',
];

export default function LogMoodPage() {
  const router = useRouter();

  const [score, setScore] = useState<number | null>(null);
  const [emoji, setEmoji] = useState<string>('');
  const [journal, setJournal] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(() => !!score && !!emoji && !isLoading && !success, [emoji, isLoading, score, success]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit() {
    if (!score || !emoji) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodScore: score,
          moodEmoji: emoji,
          journalBody: journal,
          tags: selectedTags.map((t) => t.toLowerCase()),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        router.push('/dashboard');
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-12 pb-20">
      <header className="pt-4">
        <h1 className="text-4xl font-extrabold flex items-center gap-3 text-white">
          <Sparkles className="w-8 h-8 text-violet-300" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300">
            Log Mood
          </span>
        </h1>
        <p className="text-white/50 mt-2 text-lg">
          Choose your mood, add tags, and optionally write a short note.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white/90">How are you feeling?</h2>
        <MoodSelector
          selectedScore={score}
          onSelect={(s, e) => {
            setScore(s);
            setEmoji(e);
          }}
        />
      </section>

      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: score ? 1 : 0.55, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <NotebookPen className="w-6 h-6 text-fuchsia-300" />
          <h2 className="text-2xl font-semibold text-white/90">Journal note (optional)</h2>
        </div>
        <textarea
          disabled={!score || isLoading}
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder="What influenced your mood today?"
          className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-base text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all resize-none shadow-inner"
        />
      </motion.section>

      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: score ? 1 : 0.55, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <TagIcon className="w-6 h-6 text-cyan-300" />
          <h2 className="text-2xl font-semibold text-white/90">Tags</h2>
        </div>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          {TAGS.map((t) => {
            const active = selectedTags.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                disabled={!score || isLoading}
                className={[
                  'px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition',
                  'border',
                  active
                    ? 'bg-gradient-to-r from-violet-500/25 to-cyan-500/15 border-white/20 text-white'
                    : 'bg-black/30 border-white/10 text-white/55 hover:text-white hover:border-white/20',
                  (!score || isLoading) ? 'opacity-60 cursor-not-allowed' : '',
                ].join(' ')}
              >
                {t}
              </button>
            );
          })}
        </div>
      </motion.section>

      <div className="pt-8 border-t border-white/10 flex justify-end">
        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl font-bold text-base text-white shadow-xl shadow-violet-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : success ? (
            'Saved!'
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Mood
            </>
          )}
        </button>
      </div>
    </div>
  );
}

