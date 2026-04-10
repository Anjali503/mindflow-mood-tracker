import { dataService } from '@/lib/data-service';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const dynamic = 'force-dynamic';

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default async function DashboardPage() {
  const user = await dataService.getOrCreateUser();
  const todayKey = getTodayKey();

  const moods = await dataService.getMoodEntries(user.id);

  const journals = await dataService.getJournalEntries(user.id);
  const todayHabits = await dataService.getTodayHabits(user.id, todayKey);

  return (
    <DashboardClient
      initialMoods={moods}
      journals={journals}
      todayHabits={todayHabits}
      user={user}
      todayKey={todayKey}
    />
  );
}
