import db from './db.js';

const requestStats = {
  flightsApiRequests: 0,
  favoritesApiRequests: 0,
  flightsOpenSkyRequests: 0,
  favoritesOpenSkyRequests: 0,
};

export const REQUEST_STATS_KEYS = Object.freeze(Object.keys(requestStats));
const REQUEST_STATS_KEY_SET = new Set(REQUEST_STATS_KEYS);

let incrementRequestStatTx;
let resetRequestStatsTx;

function initRequestStats() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS counters (
      key TEXT PRIMARY KEY,
      value INTEGER NOT NULL DEFAULT 0
    )
  `);

  const insertCounterStmt = db.prepare(`
    INSERT INTO counters (key, value)
    VALUES (?, 0)
    ON CONFLICT(key) DO NOTHING
  `);

  const selectAllCountersStmt = db.prepare(`
    SELECT key, value
    FROM counters
  `);

  const selectCounterValueStmt = db.prepare(`
    SELECT value
    FROM counters
    WHERE key = ?
  `);

  const incrementCounterStmt = db.prepare(`
    UPDATE counters
    SET value = value + 1
    WHERE key = ?
  `);

  const resetCounterStmt = db.prepare(`
    UPDATE counters
    SET value = 0
    WHERE key = ?
  `);

  for (const key of REQUEST_STATS_KEYS) {
    insertCounterStmt.run(key);
  }

  const rows = selectAllCountersStmt.all();

  for (const row of rows) {
    if (REQUEST_STATS_KEY_SET.has(row.key)) {
      requestStats[row.key] = row.value;
    }
  }

  incrementRequestStatTx = db.transaction((key) => {
    const result = incrementCounterStmt.run(key);

    if (result.changes !== 1) {
      throw new Error(`Failed to increment request stat key: ${key}`);
    }

    const row = selectCounterValueStmt.get(key);
    if (!row) {
      throw new Error(`Counter row missing after increment for key: ${key}`);
    }

    return row.value;
  });

  resetRequestStatsTx = db.transaction(() => {
    for (const key of REQUEST_STATS_KEYS) {
      resetCounterStmt.run(key);
      requestStats[key] = 0;
    }
  });
}

initRequestStats();

export function incrementRequestStat(key) {
  if (!REQUEST_STATS_KEY_SET.has(key)) {
    throw new Error(`Unknown request stat key: ${key}`);
  }

  const nextValue = incrementRequestStatTx(key);
  requestStats[key] = nextValue;
  return nextValue;
}

export function getRequestStats() {
  return {
    ...requestStats,
  };
}

export function resetRequestStats() {
  resetRequestStatsTx();

  return getRequestStats();
}
