import { dataService } from './src/lib/data-service';

async function test() {
  try {
    console.log('--- TEST START ---');
    const user = await dataService.getOrCreateUser();
    console.log('User:', user.id);
    
    const mood = await dataService.createMoodEntry({
      userId: user.id,
      mood: 'happy',
      moodScore: 4,
      moodEmoji: '😊',
      tagsJson: JSON.stringify(['test']),
      journalNote: 'Test note',
      date: new Date().toISOString().split('T')[0]
    });
    console.log('Success:', mood);
  } catch (e) {
    console.error('--- TEST FAILED ---');
    console.error(e);
  }
}

test();
