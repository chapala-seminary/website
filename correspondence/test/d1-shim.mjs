// A D1-shaped wrapper over Node's own SQLite, with every migration applied.
// D1 is SQLite; the console's SQL runs here unchanged.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const MIG = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'migrations');

export function d1() {
  const db = new DatabaseSync(':memory:');
  for (const f of fs.readdirSync(MIG).filter((f) => f.endsWith('.sql')).sort()) db.exec(fs.readFileSync(path.join(MIG, f), 'utf8'));
  const stmt = (sql, args = []) => ({
    bind: (...a) => stmt(sql, a),
    first: async () => db.prepare(sql).get(...args) ?? null,
    all: async () => ({ results: db.prepare(sql).all(...args) }),
    run: async () => { const r = db.prepare(sql).run(...args); return { meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
  });
  return { prepare: (sql) => stmt(sql), raw: db };
}

/** A fixed, advancing clock so tests are repeatable. */
export function clock(start = '2026-10-22T12:00:00.000Z') {
  let t = Date.parse(start);
  return { now: () => new Date(t).toISOString(), advance: (ms) => { t += ms; } };
}
