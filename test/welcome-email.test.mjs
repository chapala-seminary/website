// The welcome note a student gets right after registering (worker/outreach.js
// welcomeNote, sendWelcome; Wayne, 12 Nov 2026). Pure: a small fake database
// stands in for D1, and email is in log mode.
//
//   node test/welcome-email.test.mjs
//
// test/welcome-email.api.mjs checks the same through the real Worker.

import { register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(
  `export async function load(url, ctx, next) {
     if (url.endsWith('.json')) return next(url, { ...ctx, importAttributes: { ...ctx.importAttributes, type: 'json' } });
     return next(url, ctx);
   }`));
const { welcomeNote, sendWelcome } = await import('../worker/outreach.js');

let checks = 0;
const fails = [];
const ok = (cond, label, detail) => { checks++; if (!cond) fails.push(label + (detail !== undefined ? `\n        ${JSON.stringify(detail)}` : '')); };

const site = 'https://chapalaseminary.org';
const stopUrl = `${site}/stop-notes/TOKEN`;
const CODE = 'CTS-ABCD-EFGH-TEST';

/* ---- the message --------------------------------------------------------- */
for (const [lang, hello, unitLink, subject] of [
  ['en', 'Dear Maria,', `${site}/CTSUnit1.html`, 'Welcome to Chapala Theological Seminary'],
  ['es', 'Estimado/a Maria:', `${site}/es/CTSUnit1.html?cts_lang=es`, 'Bienvenido/a al Seminario Teológico de Chapala'],
  ['fr', 'Bonjour Maria,', `${site}/fr/CTSUnit1.html?cts_lang=fr`, 'Bienvenue au Séminaire théologique de Chapala'],
]) {
  const m = welcomeNote({ id: CODE, name: 'Maria  Lopez', lang }, { stopUrl, site });
  ok(m.subject === subject, `${lang}: subject`, m.subject);
  ok(m.text.startsWith(hello), `${lang}: greets the student by first name`, m.text.slice(0, 40));
  ok(m.text.includes(unitLink), `${lang}: links to the first foundation course in the student's language`);
  ok(m.text.includes(stopUrl), `${lang}: says how to stop notes`);
  ok(m.text.includes('Wayne Cook'), `${lang}: signed by Wayne Cook`);
  ok(!m.text.includes(CODE) && !/CTS-[0-9A-Z]{4}-[0-9A-Z]{4}/.test(m.text), `${lang}: never carries a student code (the address is not verified)`);
}
ok(welcomeNote({ name: 'Ana', lang: 'sw' }, { stopUrl, site }).subject === 'Welcome to Chapala Theological Seminary', 'a language without its own note gets English');

/* ---- sending: once, only when on, never to the wrong people -------------- */
function fakeDb(students) {
  const outreach = [], tokens = new Map();
  const db = {
    outreach,
    prepare(sql) {
      let args = [];
      const stmt = {
        bind(...a) { args = a; return stmt; },
        async first() {
          if (/FROM students WHERE id = \?/.test(sql)) return students[args[0]] ?? null;
          if (/FROM outreach WHERE student_id = \? AND kind = 'welcome' AND status = 'sent'/.test(sql))
            return outreach.find((o) => o.student_id === args[0] && o.kind === 'welcome' && o.status === 'sent') ? { 1: 1 } : null;
          if (/SELECT token FROM contact_tokens/.test(sql)) return tokens.has(args[0]) ? { token: tokens.get(args[0]) } : null;
          throw new Error('unexpected first(): ' + sql);
        },
        async run() {
          if (/INSERT INTO contact_tokens/.test(sql)) { if (!tokens.has(args[1])) tokens.set(args[1], args[0]); return {}; }
          if (/INSERT INTO outreach/.test(sql)) { outreach.push({ student_id: args[0], kind: args[1], status: args[2], error: args[3] }); return {}; }
          throw new Error('unexpected run(): ' + sql);
        },
      };
      return stmt;
    },
  };
  return db;
}
const S = {
  a: { id: 'a', name: 'Ana Ruiz', email: 'ana@example.test', lang: 'es' },
  noEmail: { id: 'noEmail', name: 'No Email', email: null, lang: 'en' },
  bad: { id: 'bad', name: 'Bad', email: 'not-an-address', lang: 'en' },
  optedOut: { id: 'optedOut', name: 'Opted Out', email: 'out@example.test', contact_opt_out_at: '2026-11-01T00:00:00Z' },
  merged: { id: 'merged', name: 'Merged', email: 'm@example.test', merged_into: 'a' },
  tester: { id: 'tester', name: 'Tester', email: 'Tester@ChapalaSeminary.org' },
};
const env = (over = {}) => ({ DB: fakeDb(S), WELCOME_MODE: 'send', EMAIL_MODE: 'log', EMAIL_FROM: 'CTS <certificates@chapalaseminary.org>', ...over });

{
  const e = env();
  const r = await sendWelcome(e, 'a');
  ok(r.status === 'sent', 'a student with an email address gets the note', r);
  ok(r.message && /Bienvenido/.test(r.message.subject), 'in the language the student registered in', r.message?.subject);
  ok(e.DB.outreach.length === 1 && e.DB.outreach[0].kind === 'welcome' && e.DB.outreach[0].status === 'sent', 'and it is recorded as a welcome note', e.DB.outreach);
  const again = await sendWelcome(e, 'a');
  ok(again.status === 'already' && e.DB.outreach.length === 1, 'never twice', again);
  for (const id of ['noEmail', 'bad', 'optedOut', 'merged', 'tester', 'nobody'])
    ok((await sendWelcome(e, id)).status === 'skipped', `no note: ${id}`);
  ok(e.DB.outreach.length === 1, 'and nothing is recorded for them', e.DB.outreach);
}
{
  const e = env({ WELCOME_MODE: undefined });
  ok((await sendWelcome(e, 'a')).status === 'off' && e.DB.outreach.length === 0, 'WELCOME_MODE unset: nothing is sent or recorded');
  const e2 = env({ WELCOME_MODE: 'off' });
  ok((await sendWelcome(e2, 'a')).status === 'off', 'WELCOME_MODE "off": nothing is sent');
}
{
  // no way to send: recorded as failed, so it can be seen, and nothing throws
  const e = env({ EMAIL_MODE: undefined });
  const r = await sendWelcome(e, 'a');
  ok(r.status === 'failed' && e.DB.outreach[0]?.status === 'failed', 'a failed send is recorded as failed', r);
  ok((await sendWelcome({ ...e, EMAIL_MODE: 'log' }, 'a')).status === 'sent', 'and a later attempt can still send it');
}
{
  // a broken database never breaks registration: sendWelcome does not throw
  const r = await sendWelcome({ WELCOME_MODE: 'send', DB: { prepare() { throw new Error('db down'); } } }, 'a');
  ok(r.status === 'error', 'a database error is caught and reported, not thrown', r);
}

if (fails.length) {
  console.error(`welcome-email: ${fails.length} of ${checks} checks failed`);
  for (const f of fails) console.error('  FAIL ' + f);
  process.exit(1);
}
console.log(`welcome-email: ${checks} checks pass`);
