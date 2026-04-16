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

export type ContactRow = {
  id: number;
  name: string;
  phone: string;
  created_at: string;
};

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

export async function listContactsSqlite(): Promise<ContactRow[]> {
  const database = await getDb();
  const result = database.exec(
    "SELECT id, name, phone, created_at FROM contacts ORDER BY id DESC",
  );
  if (!result.length || !result[0].values.length) {
    return [];
  }
  const { columns, values } = result[0];
  const idx = (name: string) => columns.indexOf(name);
  const iId = idx("id");
  const iName = idx("name");
  const iPhone = idx("phone");
  const iAt = idx("created_at");
  return values.map((row) => ({
    id: Number(row[iId]),
    name: String(row[iName]),
    phone: String(row[iPhone]),
    created_at: String(row[iAt]),
  }));
}
