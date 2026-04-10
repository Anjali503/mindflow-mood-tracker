import { NextResponse } from "next/server";
import { dataService } from "@/lib/data-service";
import { type MoodEntry, MILESTONES } from "@/lib/db";
import { format, subDays } from "date-fns";

function computeStreak(moods: MoodEntry[]): number {
  const days = new Set(moods.map((m) => m.date));
  const now = new Date();
  let s = 0;
  for (let i = 0; i < 365; i++) {
    const key = format(subDays(now, i), 'yyyy-MM-dd');
    if (!days.has(key)) break;
    s++;
  }
  return s;
}

export async function GET() {
  try {
    const user = await dataService.getOrCreateUser();

    const moods = await dataService.getMoodEntries(user.id);
    const journals = await dataService.getJournalEntries(user.id);
    const existing = await dataService.getAchievements(user.id);
    const unlockedIds = new Set(existing.map((e) => e.milestoneId));

    const streak = computeStreak(moods);

    // Auto-unlock new achievements
    const toUnlock: string[] = [];
    if (!unlockedIds.has('first_entry') && moods.length >= 1) toUnlock.push('first_entry');
    if (!unlockedIds.has('seven_day_streak') && streak >= 7) toUnlock.push('seven_day_streak');
    if (!unlockedIds.has('journal_keeper') && journals.length >= 10) toUnlock.push('journal_keeper');
    if (!unlockedIds.has('data_pioneer') && moods.length >= 20) toUnlock.push('data_pioneer');
    if (!unlockedIds.has('monthly_master') && streak >= 30) toUnlock.push('monthly_master');

    if (toUnlock.length > 0) {
      for (const mid of toUnlock) {
        await dataService.unlockAchievement(user.id, mid);
        unlockedIds.add(mid);
      }
    }

    const allAchievements = MILESTONES.map((m) => {
      const found = existing.find((e) => e.milestoneId === m.id);
      return {
        ...m,
        unlocked: unlockedIds.has(m.id),
        unlockedAt: found?.unlockedAt ?? (toUnlock.includes(m.id) ? new Date().toISOString() : null),
      };
    });

    return NextResponse.json(allAchievements);
  } catch (e) {
    console.error('[Achievements API] Error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
