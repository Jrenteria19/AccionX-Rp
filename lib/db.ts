import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "data.db");
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    questions TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    avatar TEXT,
    answers TEXT NOT NULL,
    status TEXT DEFAULT 'Pendiente',
    submitted_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS phase1_progress (
    user_id TEXT PRIMARY KEY,
    is_completed INTEGER DEFAULT 0,
    is_started INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 0,
    current_question_idx INTEGER DEFAULT 0,
    answers TEXT DEFAULT '{}',
    started_at TEXT DEFAULT '',
    abandoned_apps TEXT DEFAULT '[]',
    is_phase2_completed INTEGER DEFAULT 0
  );
`);

// Dynamic schema migration
try {
  db.exec("ALTER TABLE phase1_progress ADD COLUMN is_phase2_completed INTEGER DEFAULT 0");
} catch (e) {
  // Ignore if column already exists
}

export default db;
