const Database = require('better-sqlite3');
const db = new Database('mindflow.db', { readonly: true });
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('DB Tables:', JSON.stringify(tables, null, 2));
db.close();
