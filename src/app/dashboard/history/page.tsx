import { dataService } from '@/lib/data-service';
import { type MoodEntry } from '@/lib/db';
import { History as HistoryIcon, Clock, CalendarDays, RefreshCw } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  let entries: MoodEntry[] = [];
  try {
    const user = await dataService.getOrCreateUser();
    entries = await dataService.getMoodEntries(user.id);
  } catch (e) {
    console.error('[HistoryPage] Error:', e);
  }

  function getScoreColor(score: number) {
    if (score === 1) return 'from-red-500/20 to-red-600/20 text-red-100';
    if (score === 2) return 'from-orange-500/20 to-orange-600/20 text-orange-100';
    if (score === 3) return 'from-yellow-500/20 to-yellow-600/20 text-yellow-100';
    if (score === 4) return 'from-green-500/20 to-green-600/20 text-green-100';
    return 'from-indigo-500/20 to-purple-500/20 text-purple-100';
  }

  function parseTags(tagsJson: string | null) {
    if (!tagsJson) return [];
    try {
      const p = JSON.parse(tagsJson);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-12 pb-20 pt-4">
      <header className="mb-10 flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold flex items-center gap-3 text-white">
          <HistoryIcon className="w-8 h-8 text-blue-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Timeline
          </span>
        </h1>
        <p className="text-white/50 text-lg">Your entire history of mood and thoughts.</p>
      </header>

      {entries.length === 0 ? (
        <div className="w-full h-40 flex items-center gap-3 justify-center text-white/40 border border-white/5 bg-black/20 rounded-3xl">
          No logs found. Create your first entry!
        </div>
      ) : (
        <div className="space-y-6 relative before:content-[''] before:absolute before:inset-y-0 before:left-[2.25rem] before:w-px before:bg-white/10 before:-z-10 pl-2">
          {entries.map((entry) => (
            <div key={entry.id} className="relative pl-14 group">
              {/* Timeline marker */}
              <div className="absolute left-[-0.25rem] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] flex items-center justify-center text-sm z-10 transition-transform group-hover:scale-110">
                <span className="drop-shadow-lg">{entry.moodEmoji}</span>
              </div>

              <div className={"bg-gradient-to-b " + getScoreColor(entry.moodScore) + " bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl transition-all hover:-translate-y-1 hover:border-white/20"}>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-white/50 text-sm font-medium bg-black/20 px-3 py-1.5 rounded-full">
                    <CalendarDays className="w-4 h-4" />
                    {format(parseISO(entry.createdAt), "MMM d, yyyy")}
                    <span className="mx-1">•</span>
                    <Clock className="w-4 h-4 ml-1" />
                    {format(parseISO(entry.createdAt), "h:mm a")}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">Mood:</span>
                  <span className="text-sm font-semibold text-white/80 capitalize">{entry.mood.replace('_', ' ')}</span>
                </div>

                {entry.journalNote && (
                  <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap font-serif mb-4">
                     &quot;{entry.journalNote}&quot;
                  </p>
                )}

                {entry.tagsJson && parseTags(entry.tagsJson).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                    {parseTags(entry.tagsJson).map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 font-semibold tracking-wide uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
