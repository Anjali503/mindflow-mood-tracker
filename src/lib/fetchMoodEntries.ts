import { supabase } from "../../lib/supabase";
import type { MoodEntry } from "./db";

export async function fetchMoodEntries(userId: string): Promise<MoodEntry[]> {
  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Failed to fetch mood entries:", error);
    throw error;
  }

  console.log("Fetched mood entries:", data);

  return (data ?? []) as MoodEntry[];
}

