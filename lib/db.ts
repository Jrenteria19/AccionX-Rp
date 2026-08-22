import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import path from "path";

const isProduction = process.env.NODE_ENV === "production" || !!process.env.LIBSQL_DB_URL;

let client: any;
let localDb: any;

if (isProduction) {
  client = createClient({
    url: process.env.LIBSQL_DB_URL || "",
    authToken: process.env.LIBSQL_DB_TOKEN || ""
  });

  // Initialize tables asynchronously in Turso
  (async () => {
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS forms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          questions TEXT NOT NULL
        )
      `);
      await client.execute(`
        CREATE TABLE IF NOT EXISTS responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          form_id INTEGER NOT NULL,
          user_id TEXT NOT NULL,
          username TEXT NOT NULL,
          avatar TEXT,
          answers TEXT NOT NULL,
          status TEXT DEFAULT 'Pendiente',
          submitted_at TEXT NOT NULL
        )
      `);
      await client.execute(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `);
      await client.execute(`
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
        )
      `);
      // Run migration
      await client.execute("ALTER TABLE phase1_progress ADD COLUMN is_phase2_completed INTEGER DEFAULT 0").catch(() => {});
    } catch (err) {
      console.error("Turso Initialization Error:", err);
    }
  })();
} else {
  const dbPath = path.resolve(process.cwd(), "data.db");
  localDb = new Database(dbPath);

  // Initialize tables locally
  localDb.exec(`
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

  try {
    localDb.exec("ALTER TABLE phase1_progress ADD COLUMN is_phase2_completed INTEGER DEFAULT 0");
  } catch (e) {}
}

export const dbQuery = {
  async get(sql: string, params: any[] = []): Promise<any> {
    if (isProduction) {
      const res = await client.execute({ sql, args: params });
      return res.rows[0] || null;
    } else {
      return localDb.prepare(sql).get(...params);
    }
  },

  async all(sql: string, params: any[] = []): Promise<any[]> {
    if (isProduction) {
      const res = await client.execute({ sql, args: params });
      return res.rows;
    } else {
      return localDb.prepare(sql).all(...params);
    }
  },

  async run(sql: string, params: any[] = []): Promise<{ lastInsertRowid: number | bigint }> {
    if (isProduction) {
      const res = await client.execute({ sql, args: params });
      return { lastInsertRowid: res.lastInsertRowid || 0 };
    } else {
      const info = localDb.prepare(sql).run(...params);
      return { lastInsertRowid: info.lastInsertRowid };
    }
  }
};

export default dbQuery;
