import { NextResponse } from "next/server";
import { dataService } from "@/lib/data-service";
import { HABIT_NAMES } from "@/lib/db";

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function GET(request: Request) {
  try {
    const user = await dataService.getOrCreateUser();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || getTodayKey();
    const habits = await dataService.getTodayHabits(user.id, date);
    return NextResponse.json(habits);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, completed, date } = body;
    if (!HABIT_NAMES.includes(name)) {
      return NextResponse.json({ error: "Invalid habit name" }, { status: 400 });
    }
    const user = await dataService.getOrCreateUser();
    const dateKey = date || getTodayKey();
    
    await dataService.toggleHabit(user.id, name, dateKey, !!completed);

    const { revalidatePath } = require("next/cache");
    revalidatePath("/dashboard");

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
