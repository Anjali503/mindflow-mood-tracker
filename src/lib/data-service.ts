import { supabase } from '../../lib/supabase';
import { type MoodEntry, type JournalEntry, type Habit, type User, type Achievement } from './db';
import { fetchMoodEntries } from './fetchMoodEntries';

const DEBUG = true;

function log(msg: string, data?: any) {
  if (DEBUG) {
    console.log(`[DataService] ${msg}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

function moodToScore(mood: string): number {
  if (mood === 'very_happy') return 5;
  if (mood === 'happy') return 4;
  if (mood === 'neutral') return 3;
  if (mood === 'sad') return 2;
  return 1;
}

function moodToEmoji(mood: string): string {
  if (mood === 'very_happy') return '🤩';
  if (mood === 'happy') return '😊';
  if (mood === 'neutral') return '😐';
  if (mood === 'sad') return '😔';
  return '😞';
}

function normalizeMoodEntry(row: any): MoodEntry {
  const mood = (row.mood ?? 'neutral') as MoodEntry['mood'];
  const createdAt =
    Array.isArray(row.createdAt) ? String(row.createdAt[0] ?? '') :
    row.createdAt ?? new Date().toISOString();
  const date =
    typeof row.date === 'string' && row.date
      ? row.date
      : String(createdAt).slice(0, 10);

  return {
    id: row.id,
    userId: row.userId,
    mood,
    moodScore: typeof row.moodScore === 'number' ? row.moodScore : moodToScore(mood),
    moodEmoji: row.moodEmoji ?? moodToEmoji(mood),
    tagsJson:
      row.tagsJson ??
      (Array.isArray(row.tags) ? JSON.stringify(row.tags) : row.tags ?? null),
    journalNote: row.journalNote ?? row.journal ?? null,
    date,
    createdAt,
  };
}

function normalizeJournalEntry(row: any): JournalEntry {
  const createdAt = row.createdAt ?? new Date().toISOString();
  return {
    id: row.id,
    userId: row.userId,
    moodEntryId: row.moodEntryId ?? row.moodId ?? null,
    body: row.body ?? row.content ?? '',
    date: row.date ?? String(createdAt).slice(0, 10),
    createdAt,
    updatedAt: row.updatedAt ?? createdAt,
  };
}

export const dataService = {
  async getOrCreateUser() {
    log('getOrCreateUser called');
    const email = 'local@mindflow.app';
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('[DataService] Error fetching user:', error);
      throw error;
    }

    if (user) {
      log('User found', user);
      return user as User;
    }

    log('User not found, creating new user');
    const newUser = {
      id: crypto.randomUUID(),
      email: email,
      createdAt: new Date().toISOString(),
    };

    const { data, error: insertError } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (insertError) {
      console.error('[DataService] Error creating user:', insertError);
      throw insertError;
    }
    
    log('User created', data);
    return data as User;
  },

  async getMoodEntries(userId: string) {
    log('getMoodEntries', { userId });
    const data = await fetchMoodEntries(userId);
    return (data ?? []).map((r: any) => normalizeMoodEntry(r));
  },

  async getJournalEntries(userId: string) {
    log('getJournalEntries', { userId });
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('[DataService] Error fetching journal entries:', error);
      throw error;
    }
    return (data ?? []).map((r: any) => normalizeJournalEntry(r));
  },

  async deleteJournalEntry(id: string) {
    log('deleteJournalEntry', { id });
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[DataService] Error deleting journal entry:', error);
      throw error;
    }
    log('deleteJournalEntry success');
  },

  async getTodayHabits(userId: string, todayKey: string) {
    log('getTodayHabits', { userId, todayKey });
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('userId', userId)
      .eq('date', todayKey);

    if (error) {
      console.error('[DataService] Error fetching habits:', error);
      throw error;
    }
    return data as Habit[];
  },

  async createMoodEntry(entry: Partial<MoodEntry>) {
    log('createMoodEntry start', entry);
    
    // IMPORTANT: align to current Supabase mood_entries schema.
    // This table currently stores: id, userId, mood, tags, journal, date, createdAt.
    const payload = {
      id: crypto.randomUUID(),
      userId: entry.userId,
      mood: entry.mood,
      tags: (() => {
        if (!entry.tagsJson) return [];
        try {
          const parsed = JSON.parse(entry.tagsJson);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })(),
      journal: entry.journalNote ?? null,
      date: entry.date,
      // In the current Supabase schema this column is text[]
      createdAt: [new Date().toISOString()],
    };
    
    log('createMoodEntry inserting payload', payload);

    const { data, error } = await supabase
      .from('mood_entries')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[DataService] CRITICAL: Error creating mood entry in Supabase:', error);
      console.error('[DataService] Payload was:', payload);
      console.error('[DataService] Hint:', error.hint);
      throw error;
    }

    log('createMoodEntry success', data);
    return normalizeMoodEntry(data);
  },

  async createJournalEntry(entry: Partial<JournalEntry>) {
    log('createJournalEntry', entry);
    
    const payload = {
      id: crypto.randomUUID(),
      userId: entry.userId,
      moodId: entry.moodEntryId ?? null,
      content: entry.body ?? '',
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('journal_entries')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[DataService] Error creating journal entry:', error);
      throw error;
    }
    
    log('createJournalEntry success', data);
    return normalizeJournalEntry(data);
  },

  async toggleHabit(userId: string, name: string, date: string, completed: boolean) {
    log('toggleHabit', { userId, name, date, completed });
    
    const { error } = await supabase
      .from('habits')
      .upsert({ 
        userId, 
        name, 
        date, 
        completed: completed ? 1 : 0 
      }, { onConflict: 'userId,name,date' });

    if (error) {
      console.error('[DataService] Error toggling habit:', error);
      throw error;
    }
    log('toggleHabit success');
  },

  async getAchievements(userId: string) {
    log('getAchievements', { userId });
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('userId', userId);

    if (error) {
      console.error('[DataService] Error fetching achievements:', error);
      throw error;
    }
    return data as Achievement[];
  },

  async unlockAchievement(userId: string, milestoneId: string) {
    log('unlockAchievement', { userId, milestoneId });
    
    const { error } = await supabase
      .from('achievements')
      .insert({ 
        id: crypto.randomUUID(), 
        userId, 
        milestoneId,
        unlockedAt: new Date().toISOString()
      });
    
    if (error && error.code !== '23505') {
       console.error('[DataService] Error unlocking achievement:', error);
       throw error;
    }
    log('unlockAchievement success');
  }
};
