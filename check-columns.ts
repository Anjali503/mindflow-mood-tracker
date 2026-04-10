import { supabase } from './lib/supabase';

async function check() {
  const { data, error } = await supabase.rpc('inspect_table', { table_name: 'mood_entries' });
  if (error) {
     // If RPC is missing, try raw query through a common table if possible, 
     // but usually we can't do that.
     // Let's try to select 1 row and check keys.
     const { data: rows, error: selError } = await supabase.from('mood_entries').select('*').limit(1);
     if (rows && rows.length > 0) {
       console.log('Columns in mood_entries:', Object.keys(rows[0]));
     } else {
       console.log('No rows in mood_entries to inspect.');
       // Try selecting user table
       const { data: urows } = await supabase.from('users').select('*').limit(1);
       if (urows && urows.length > 0) {
         console.log('Columns in users:', Object.keys(urows[0]));
       }
     }
  }
}
check();
