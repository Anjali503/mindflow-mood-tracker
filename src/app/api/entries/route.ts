import { NextResponse } from "next/server";
import { dataService } from "@/lib/data-service";
import { type Mood } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const user = await dataService.getOrCreateUser();
    const moodEntries = await dataService.getMoodEntries(user.id);
    return NextResponse.json(moodEntries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { moodScore, moodEmoji, journalBody, tags, date } = body;

    if (typeof moodScore !== "number" || !moodEmoji) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = await dataService.getOrCreateUser();

    const toMood = (score: number): Mood => {
      if (score <= 1) return "very_sad";
      if (score === 2) return "sad";
      if (score === 3) return "neutral";
      if (score === 4) return "happy";
      return "very_happy";
    };

    const dateKey =
      typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? date
        : (() => {
            const d = new Date();
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
          })();

    const tagsJson =
      Array.isArray(tags) && tags.length
        ? JSON.stringify(tags)
        : tags
          ? JSON.stringify(tags)
          : null;

    const createdMood = await dataService.createMoodEntry({
      userId: user.id,
      mood: toMood(moodScore),
      moodScore,
      moodEmoji,
      tagsJson,
      date: dateKey,
    });

    if (typeof journalBody === "string" && journalBody.trim().length > 0) {
      await dataService.createJournalEntry({
        userId: user.id,
        moodEntryId: createdMood.id,
        body: journalBody,
        date: dateKey,
      });
    }

    // Revalidate paths so Next.js fetches fresh data from DB on next load
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/calendar");

    return NextResponse.json(createdMood, { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
  }
}
