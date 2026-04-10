'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Trash2, Edit3, Loader2 } from 'lucide-react';
import { dataService } from '@/lib/data-service';
import { type JournalEntry } from '@/lib/db';
import { useRouter } from 'next/navigation';

interface JournalListProps {
  initialEntries: JournalEntry[];
}

export default function JournalList({ initialEntries }: JournalListProps) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    setIsDeleting(id);
    try {
      await dataService.deleteJournalEntry(id);
      setEntries(entries.filter((e) => e.id !== id));
      router.refresh();
    } catch (e) {
      alert('Failed to delete entry');
      console.error(e);
    } finally {
      setIsDeleting(null);
    }
  }

  if (entries.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-white/40 border border-white/5 bg-black/20 rounded-3xl">
        No journal entries yet. Start logging your mood to add context!
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {entries.map((j) => (
        <article
          key={j.id}
          className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-glass hover:bg-white/8 transition-colors"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="text-xs text-white/45 font-medium">
              {format(parseISO(j.createdAt), 'MMM d, yyyy • h:mm a')}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => alert('Editing coming soon!')}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(j.id)}
                disabled={isDeleting === j.id}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400"
              >
                {isDeleting === j.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{j.body}</p>
        </article>
      ))}
    </div>
  );
}
