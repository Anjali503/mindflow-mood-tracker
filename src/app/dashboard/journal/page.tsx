import { dataService } from '@/lib/data-service';
import JournalList from '@/components/dashboard/JournalList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function JournalPage() {
  const user = await dataService.getOrCreateUser();
  const rows = await dataService.getJournalEntries(user.id);

  return (
    <div className="max-w-5xl mx-auto w-full space-y-10 pb-20 pt-4">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
              Journal
            </span>
          </h1>
          <p className="text-white/50 text-lg mt-2">Your reflections, connected to your moods.</p>
        </div>
        <Link
          href="/dashboard/log"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-xl shadow-violet-900/40 hover:brightness-110 transition"
        >
          New Entry
        </Link>
      </header>

      <JournalList initialEntries={rows} />
    </div>
  );
}

