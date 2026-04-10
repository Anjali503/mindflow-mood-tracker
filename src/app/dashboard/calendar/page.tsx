import { dataService } from '@/lib/data-service';
import CalendarClient from '@/components/dashboard/CalendarClient';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const user = await dataService.getOrCreateUser();
  const moods = await dataService.getMoodEntries(user.id);

  return <CalendarClient initialMoods={moods} user={user} />;
}


