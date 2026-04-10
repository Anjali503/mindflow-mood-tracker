import { NextResponse } from "next/server";
import { dataService } from "@/lib/data-service";

export async function GET() {
  try {
    const user = await dataService.getOrCreateUser();
    const entries = await dataService.getMoodEntries(user.id);
    
    const insights = {
      streak: 0,
      moodDrop: false,
      frequentTags: [] as { tag: string; count: number }[],
      summary: "Start logging your mood to see insights!"
    };

    if (entries.length === 0) {
      return NextResponse.json(insights);
    }

    // Calculate generic streak (positive moodScore >= 4)
    let currentStreak = 0;
    for (const entry of entries) {
      if (entry.moodScore >= 4) {
        currentStreak++;
      } else {
        break;
      }
    }
    insights.streak = currentStreak;

    // Detect mood drops (last 3 entries avg < previous 3 entries avg)
    if (entries.length >= 6) {
      const last3 = entries.slice(0, 3).reduce((acc, e) => acc + e.moodScore, 0) / 3;
      const prev3 = entries.slice(3, 6).reduce((acc, e) => acc + e.moodScore, 0) / 3;
      if (last3 <= prev3 - 1) {
        insights.moodDrop = true;
      }
    }

    // Frequent negative tags (moodScore <= 2)
    const tagCounts: Record<string, number> = {};
    entries.filter((e) => e.moodScore <= 2 && e.tagsJson).forEach((e) => {
      try {
        const parsedTags = JSON.parse(e.tagsJson!);
        if (Array.isArray(parsedTags)) {
          parsedTags.forEach((tag) => {
            const t = String(tag).trim().toLowerCase();
            if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
          });
        }
      } catch {}
    });

    insights.frequentTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // top 3

    // Generate summary string based on logic
    if (insights.streak > 2) {
      insights.summary = `You're on a ${insights.streak}-day positive streak! Keep it up.`;
    } else if (insights.moodDrop) {
      insights.summary = "Your mood has been slightly lower recently. It's okay to take a break.";
    } else {
      insights.summary = "You've been tracking pretty consistently. Check your weekly trends below.";
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error calculating insights:", error);
    return NextResponse.json(
      { error: "Failed to calculate insights" },
      { status: 500 }
    );
  }
}
