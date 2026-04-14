import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';

const configuredDbPath = process.env.APP_DB_PATH?.trim();
const dbPath = configuredDbPath
  ? isAbsolute(configuredDbPath)
    ? configuredDbPath
    : join(process.cwd(), configuredDbPath)
  : join(process.cwd(), 'data', 'app.db');

mkdirSync(dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('busy_timeout = 5000');

export default db;
