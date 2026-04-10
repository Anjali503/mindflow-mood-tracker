import Database from "better-sqlite3";
import path from "path";
export { HABIT_NAMES, MILESTONES } from "./constants";
export type { HabitName } from "./constants";

// Define the path to the database file in the root
const dbPath = path.join(process.cwd(), "mindflow.db");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export type Mood = "very_happy" | "happy" | "neutral" | "sad" | "very_sad";

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: Mood;
  moodScore: number; // 1..5
  moodEmoji: string;
  tagsJson: string | null; // JSON array of strings
  journalNote: string | null; // optional note attached to mood log
  date: string; // YYYY-MM-DD (local)
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  moodEntryId: string | null;
  body: string;
  date: string; // YYYY-MM-DD (local)
  createdAt: string;
  updatedAt: string;
}

// Back-compat (old table)
export interface Entry {
  id: string;
  moodScore: number;
  moodEmoji: string;
  journalBody: string | null;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  date: string; // YYYY-MM-DD
  completed: number; // 0 or 1 (SQLite boolean)
  createdAt: string;
}

export interface Achievement {
  id: string;
  userId: string;
  milestoneId: string; // e.g. 'first_entry', '7_day_streak', ...
  unlockedAt: string;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mood_entries (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mood TEXT NOT NULL,
      moodScore INTEGER NOT NULL,
      moodEmoji TEXT NOT NULL,
      tagsJson TEXT,
      journalNote TEXT,
      date TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      moodEntryId TEXT REFERENCES mood_entries(id) ON DELETE SET NULL,
      body TEXT NOT NULL,
      date TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, name, date)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      milestoneId TEXT NOT NULL,
      unlockedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, milestoneId)
    );

    -- Legacy support
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      moodScore INTEGER NOT NULL,
      moodEmoji TEXT NOT NULL,
      journalBody TEXT,
      tags TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_mood_entries_date ON mood_entries(date);
    CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(date);
    CREATE INDEX IF NOT EXISTS idx_habits_lookup ON habits(userId, date);
  `);
}

initSchema();

export function getOrCreateDefaultUser() {
  const email = "local@mindflow.app";
  const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
  if (existing) return existing;

  const id = crypto.randomUUID();
  db.prepare("INSERT INTO users (id, email) VALUES (?, ?)").run(id, email);
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User;
}

export default db;
