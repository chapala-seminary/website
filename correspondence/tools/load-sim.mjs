// M4 planning simulation (issue #163): how much work the console does per
// message, run against Node's SQLite with the real migrations and state machine.
//
//   node correspondence/tools/load-sim.mjs [messages=20000]
//
// It measures statements per message (D1 bills per row read/written and each
// statement is a round trip inside the Worker), the share of messages that
// would reach a model, and local throughput. It does NOT measure D1's network
// latency or Gmail's quotas; the architecture doc turns these numbers into
// the 100,000-student estimate.
import { d1, clock } from '../test/d1-shim.mjs';
import { ingestMessage } from '../src/ingest.js';
import { dashboardData } from '../src/digest.js';

const N = Number(process.argv[2] || 20000);
const db = d1();
let statements = 0;
const counted = { prepare: (sql) => { statements++; return db.prepare(sql); } };
const c = clock('2026-11-01T00:00:00Z');
await db.prepare("INSERT INTO mailboxes (id, address, enabled, created_at) VALUES ('cts-gmail', 'chapalatheological@gmail.com', 1, ?)").bind(c.now()).run();
const env = { DB: counted, NOW: c.now, OWN_ADDRESSES: 'certificates@chapalaseminary.org' };

// The mix, from the 22 Oct baseline: most mail is automated; of the human
// mail, most is a student with a short question, and conversations run a few
// messages. Students are drawn from a pool so cases repeat as they would.
const QUESTIONS = ['¿Cómo me registro?', 'No puedo iniciar sesión con mi código.', '¿Dónde descargo mi certificado?',
  'La lección 6 no funciona.', 'Somos un grupo de estudio sin internet.', 'Could we discuss accreditation?', 'Bendiciones, gracias.'];
const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const students = 100000;
let id = 0, modelEligible = 0;
const t0 = performance.now();
for (let i = 0; i < N; i++) {
  c.advance(60000);
  const r = rnd();
  const ms = Date.parse(c.now());
  let m;
  if (r < 0.7) m = { from: 'certificates@chapalaseminary.org', subject: 'Course completed', body: 'Name: x' };
  else if (r < 0.75) m = { from: 'mailer-daemon@googlemail.com', subject: 'Delivery Status Notification (Failure)', body: `Final-Recipient: rfc822; p${Math.floor(rnd() * 5000)}@example.org\nStatus: 5.1.1` };
  else {
    const s = Math.floor(rnd() * students);
    const out = rnd() < 0.4;
    m = out ? { from: 'chapalatheological@gmail.com', to: [`s${s}@example.org`], subject: 'Re: Pregunta', body: 'Puede hacerlo desde la página principal.' }
            : { from: `s${s}@example.org`, subject: 'Pregunta', body: QUESTIONS[Math.floor(rnd() * QUESTIONS.length)] };
    m.thread = `th${s}`;
  }
  const res = await ingestMessage(env, { mailbox_id: 'cts-gmail', provider_msg_id: `m${++id}`, provider_thread_id: m.thread || `t${id}`,
    rfc_message_id: `<m${id}@example.org>`, from: m.from, to: m.to || ['chapalatheological@gmail.com'], cc: [], internal_ms: ms,
    subject: m.subject, body: m.body, headers: {}, label_ids: [], references: [] });
  if (res.lane === 'human' && res.category === 'general') modelEligible++;
}
const secs = (performance.now() - t0) / 1000;
const before = statements;
await dashboardData(env);
const cases = (await db.prepare('SELECT COUNT(*) n FROM cases').first()).n;
console.log(JSON.stringify({
  messages: N, seconds: +secs.toFixed(1), per_second_local: Math.round(N / secs),
  statements_per_message: +(before / N).toFixed(1), dashboard_statements: statements - before,
  cases, model_eligible_share: +(modelEligible / N).toFixed(3),
}, null, 1));
const t1 = performance.now();
const d = await dashboardData(env);
console.log(JSON.stringify({ dashboard_ms: Math.round(performance.now() - t1), open_rows: Object.values(d.sections).flat().length }));
