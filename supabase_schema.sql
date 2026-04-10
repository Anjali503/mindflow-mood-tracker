-- MindFlow Final Supabase Schema (camelCase matching existing users table)

-- Users table (already exists, but here for reference)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mood Entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  "moodScore" INTEGER NOT NULL,
  "moodEmoji" TEXT NOT NULL,
  "tagsJson" TEXT,
  "journalNote" TEXT,
  date DATE NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries("userId", date);

-- Journal Entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "moodEntryId" UUID REFERENCES mood_entries(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  date DATE NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries("userId", date);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE("userId", name, date)
);

CREATE INDEX IF NOT EXISTS idx_habits_user_date ON habits("userId", date);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "milestoneId" TEXT NOT NULL,
  "unlockedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "milestoneId")
);
