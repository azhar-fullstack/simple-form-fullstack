import fs from "fs";
import path from "path";
import initSqlJs, { type Database } from "sql.js";

let initPromise: ReturnType<typeof initSqlJs> | null = null;
let db: Database | null = null;

function dbFilePath() {
  return path.join(process.cwd(), "data", "contacts.db");
}

async function getSql() {
  if (!initPromise) {
    initPromise = initSqlJs({
      locateFile: (file) =>
        path.join(process.cwd(), "node_modules", "sql.js", "dist", file),
    });
  }
  return initPromise;
}

async function getDb(): Promise<Database> {
  if (db) {
    return db;
  }
  const SQL = await getSql();
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = dbFilePath();

  if (fs.existsSync(filePath)) {
    const buf = fs.readFileSync(filePath);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

function persist() {
  if (!db) {
    return;
  }
  const data = db.export();
  fs.mkdirSync(path.dirname(dbFilePath()), { recursive: true });
  fs.writeFileSync(dbFilePath(), Buffer.from(data));
}

/** Local-only persistence (sql.js + file under `data/`). */
export async function insertContactSqlite(
  name: string,
  phone: string,
): Promise<string> {
  const database = await getDb();
  database.run("INSERT INTO contacts (name, phone) VALUES (?, ?)", [name, phone]);
  const rows = database.exec("SELECT last_insert_rowid() AS id");
  const raw = rows[0]?.values[0]?.[0];
  persist();
  return String(raw ?? "");
}
