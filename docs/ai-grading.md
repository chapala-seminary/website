# AI grading — the build contract

The plan, its reasons and the decisions behind it are in the brain:
`projects/website/ai-grading-plan.md` (accepted by Robert on 14 Oct 2026).
This file is the contract the code is built to. If code and this file
disagree, fix one of them in the same change.

Terms:

- **Grader of record**: the decision that counts for credit. For written
  answers that is the server, never the browser.
- **Rubric**: the 2–4 points a short answer must make.
- **Attempt**: one sitting of one unit's test by one student.
- **Pending**: graded later, because the model was unavailable or a person
  must look.

## 1. Modes

`GRADING_MODE` is set in two places, and both must agree:

| Where | Name | Read by |
|---|---|---|
| Worker variable (`wrangler.jsonc`, per environment) | `GRADING_MODE` | `worker/grading/*` |
| Build-time environment variable | `CTS_GRADING_MODE` | `Unit.astro`, textbook pages, single-page courses |

The modes:

- **`live`** (the default on branch `ai-grader`). The pages carry **no**
  answers, `accept` lists, model answers, keywords, rubrics or MC `answer`
  indexes, and `why` texts are fetched only after answering. The browser
  grades nothing: every MC click, fill-in and short answer goes to the API.
  Credit is written only by the server.
- **`shadow`**: used only for the production trial before the switch date.
  - Pages and browser grading are exactly as on `beta` today, and credit
    comes from today's rules (`/api/sync`).
  - The browser also posts each submitted unit to `POST /api/shadow`. The
    server grades it with the AI and records it, flagged
    `attempts.shadow = 1`. Students see nothing from this.

There is no "off".

## 2. Question ids (`qid`)

Indexes are 0-based, in array order.

| Source | Form |
|---|---|
| Unit files `src/content/units/<Prefix>/<n>.json` | `u:<Prefix>/<n>/<mc\|fill\|sa>/<i>` |
| Textbook banks `src/content/textbooks/<slug>.json` | `tb:<slug>/<kind>/<i>` |
| Reading banks `src/content/readings/<slug>.json` | `rd:<slug>/<kind>/<i>` |
| Single-page courses | `sp:<page>/<kind>/<i>`, where `<page>` is the HTML file name without `.html` |

A qid is stable for as long as the source array is not reordered. The sync
(§4) records `content_hash`, so a changed question gets a new hash.

## 3. Rubrics

Every short-answer item gets:

```json
"rubric": {
  "v": 1,
  "points": [
    { "id": "a", "essential": true,  "en": "The Word existed before creation (eternal, uncreated)." },
    { "id": "b", "essential": true,  "en": "The Word is distinct from God the Father (\"with God\")." },
    { "id": "c", "essential": false, "en": "The Word is fully God, not a lesser being." }
  ]
}
```

- **Shape:** 2–4 points, at least one `essential`, and ids `a`–`d`.
- **Language:** points are written in English only. A rubric is a grading
  instrument for the model and the faculty, not text a student sees. The model
  also receives the model answer in the student's language. Faculty review is
  in English.
- **Source:** points come from the model answer (and the lesson), never from
  the keyword list alone. Keywords may hint.
- **`v`** increments whenever a point changes. Every grade records it.
- **Check:** `tools/verify-rubrics.mjs` fails the build if any `sa` item in
  `src/content/units` lacks a valid rubric.
- **CMS:** `tools/build-cms-config.mjs` declares the field, so that Sveltia
  does not drop it on save.

## 4. Keys on the server

- **Table:** `grading_keys` (§6).
- **Sync:** `tools/sync-grading-keys.mjs [--env beta|production|local]`.
  - It reads every source in §2.
  - It writes SQL upserts for changed rows only, comparing `content_hash`
    with the database.
  - It runs from `npm run deploy` and `npm run deploy:beta`, after
    migrations.
  - It uses the same pinned-account wrangler wrapper those scripts already
    use (the config's `account_id` must be the Chapala account; an
    environment `CLOUDFLARE_ACCOUNT_ID` naming another is refused).
    `--apply-migration` runs `0014_grading.sql` first if, and only if, the
    `grading_keys` table is missing; both deploy scripts pass it, as
    `prepare-study-plans.mjs` and `prepare-beta-activation.mjs` do for theirs.
  - It also deletes rows for questions that no longer exist (among `u:`,
    `tb:` and `rd:` only).
  - In tests it is applied to the local D1 (`--env local`).
  - A textbook or reading test also gets a **meta row**
    `tb:<slug>/meta/0` (`rd:` likewise): `{draw, pass, perReading, perChapter,
    n, code, kind, page}`. Its fill rows carry `group` (the reading or
    chapter number) in `data_json`, which the draw uses. A single-page course
    gets `sp:<page>/meta/0` with `{code}`, the completion code its page
    records; `worker/grading/attempts.js` `creditPass()` and the
    `singlePageRows()` extension point in the sync tool are where the
    single-page agent plugs in.
- **Build check:** `tools/verify-no-keys.mjs` fails a `live` build if any page
  in `dist/` contains:
  - an MC `answer` index;
  - fill-in `answer` or `accept` values;
  - `model`, `keywords` or `rubric` data.

  It works by sampling known answer strings from the content and searching
  `dist/` for them. Expected words in lesson prose are allowed by checking
  only inside the inlined data scripts.

## 5. Grading rules (server, `worker/grading/`)

Modules:

| Module | Contents |
|---|---|
| `text.js` | `normalise`, `fold`, `bare`, `exactFill(key, answer, lang)`, `copiedOnly(prompt, answer)`, `wordCount` |
| `model.js` | The Workers AI call, schema, validation, fallback |
| `rules.js` | Pass rules per track |
| `attempts.js` | Attempt lifecycle, D1 writes, credit |
| `queue.js` | Pending queue and cron |

The rules:

- **MC:**
  - right if `choice === answer`;
  - the first answer to a qid in an attempt stands;
  - passing is ≥ 90% right; a pass is banked across attempts.
- **Fill-in:**
  - right if `exactFill` matches (today's `bare()` logic, against `answer`
    and `accept` in the reader's language and the source language);
  - otherwise, look up `grade_overrides`, then `grade_cache`;
  - otherwise, ask the model.

  Passing is 9 of 10.
- **Short answer**, checked in this order:
  1. `copiedOnly`, or fewer than 15 words: **not met**, with no model call.
  2. Instruction-like text: **pending**, sent to faculty, no model call. The
     patterns are in `worker/grading/rules.js` (`looksLikeInstruction`) in
     English, Spanish and French. They are narrower than the bare words
     "ignore" and "instructions?" the first draft of this contract listed: "the
     Torah is God's instruction" and "do not ignore the Old Testament" are
     ordinary answers in a seminary, and holding them would flood the faculty.
     The patterns need an imperative aimed at the grader ("ignore ... previous
     instructions", "mark this as correct", "system prompt", "you are an AI").
     `test/grading-unit.test.mjs` pins both lists.
  3. Otherwise the model grades it.

  `copiedOnly(prompt, answer)` removes from the answer every run of four or
  more words that also appears in the question (after `normalise` and
  `fold`) and is true when fewer than six words are left. It is checked
  against the prompt in the student's language and in English.

  **Who grades what is left pending.** A pending answer with a row in
  `grade_queue` waits for the model (the cron). A pending answer with **no**
  queue row is with a person: held for injection (`points_json` `{"held":
  "injection"}`), the model answered "pending" (`"model"`), or escalated after
  24 hours or 6 tries (`"escalated"`). The Pending tab lists exactly those.
  An attempt whose pass or fail depends on a pending item is `pending`; if it
  passes (or cannot pass) whatever the pending items turn out to be, it is
  settled at once.

  **met** needs every essential point made and no contradiction. "partly"
  counts as not met. Passing is 9 of 10 met. A "met" answer is banked
  across attempts, so a retake asks only for the rest.
- **What each track must pass:**

  | Track (`studentLevel`) | Must pass |
  |---|---|
  | Certificate | MC |
  | Associate | MC + fill |
  | Th.M., M.Div. | MC + fill + SA |

  The track comes from the stored student record, not from the request.
- **Lockout** after a failed submit, enforced by the server
  (`attempts.locked_until`):
  - 15 minutes on master's tracks, 2 minutes otherwise;
  - `_sa_lock` (MC banked) or `_full_lock`, as today: `lock_kind` `sa` or
    `full`. The browser mirrors these into the same `localStorage` keys.
  - A test already passed can be taken again for practice. A practice
    attempt starts from nothing (nothing is banked from before the pass),
    gives no new credit, and never locks.
  - A lock set when a pending attempt is settled counts from the time of
    submission, not from the time of settling.
  - Textbook and reading tests: 18 of the 20 drawn (the bank's `pass`) on
    every track, one lock kind (`full`), 15 or 2 minutes by track.

## 6. Migration `0014_grading.sql`

```sql
CREATE TABLE grading_keys (qid TEXT PRIMARY KEY, kind TEXT NOT NULL, source TEXT NOT NULL,
  data_json TEXT NOT NULL, rubric_version INTEGER, content_hash TEXT NOT NULL, updated_at TEXT NOT NULL);
-- data_json: {prompt:{en,es,fr}, answer, accept, options?, why?, model, keywords, rubric}

CREATE TABLE attempts (id TEXT PRIMARY KEY, student_id TEXT NOT NULL, scope TEXT NOT NULL, -- 'u:CTSJohn/1', 'tb:john', ...
  track TEXT NOT NULL, lang TEXT NOT NULL, shadow INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',        -- open|pending|passed|failed
  mc_right INTEGER, mc_total INTEGER, fill_right INTEGER, fill_total INTEGER, sa_met INTEGER, sa_total INTEGER,
  locked_until TEXT, lock_kind TEXT, started_at TEXT NOT NULL, submitted_at TEXT, graded_at TEXT);
CREATE INDEX attempts_student ON attempts(student_id, scope);

CREATE TABLE answer_grades (id INTEGER PRIMARY KEY AUTOINCREMENT, attempt_id TEXT NOT NULL, student_id TEXT NOT NULL,
  qid TEXT NOT NULL, kind TEXT NOT NULL, lang TEXT NOT NULL, answer_text TEXT NOT NULL,
  verdict TEXT NOT NULL,                       -- right|wrong (mc, fill) · met|partly|not_met (sa) · pending
  feedback TEXT, points_json TEXT, graded_by TEXT NOT NULL, -- exact|cache|override|rule|ai|human
  model TEXT, prompt_version TEXT, rubric_version INTEGER, grader_email TEXT, created_at TEXT NOT NULL, graded_at TEXT);
CREATE INDEX answer_grades_attempt ON answer_grades(attempt_id);
CREATE INDEX answer_grades_student_qid ON answer_grades(student_id, qid);

CREATE TABLE grade_cache (qid TEXT NOT NULL, lang TEXT NOT NULL, norm_answer TEXT NOT NULL, verdict TEXT NOT NULL,
  feedback TEXT, model TEXT, prompt_version TEXT, seen_count INTEGER NOT NULL DEFAULT 1,
  first_seen TEXT NOT NULL, last_seen TEXT NOT NULL, PRIMARY KEY (qid, lang, norm_answer));

CREATE TABLE grade_overrides (qid TEXT NOT NULL, lang TEXT NOT NULL, norm_answer TEXT NOT NULL, verdict TEXT NOT NULL,
  decided_by TEXT NOT NULL, decided_at TEXT NOT NULL, note TEXT, PRIMARY KEY (qid, lang, norm_answer));

CREATE TABLE appeals (id INTEGER PRIMARY KEY AUTOINCREMENT, grade_id INTEGER NOT NULL, student_id TEXT NOT NULL,
  note TEXT, status TEXT NOT NULL DEFAULT 'open', -- open|upheld|overturned
  claimed_by TEXT, decided_by TEXT, decided_at TEXT, ruling_note TEXT, created_at TEXT NOT NULL);

CREATE TABLE calibration (grade_id INTEGER NOT NULL, marked_by TEXT NOT NULL, human_verdict TEXT NOT NULL,
  marked_at TEXT NOT NULL, week TEXT NOT NULL, PRIMARY KEY (grade_id, marked_by));

CREATE TABLE grade_queue (grade_id INTEGER PRIMARY KEY, attempts INTEGER NOT NULL DEFAULT 0,
  next_try_at TEXT NOT NULL, last_error TEXT, created_at TEXT NOT NULL);

CREATE TABLE ai_usage (day TEXT NOT NULL, model TEXT NOT NULL, calls INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER NOT NULL DEFAULT 0, output_tokens INTEGER NOT NULL DEFAULT 0, errors INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, model));

ALTER TABLE course_completions ADD COLUMN source TEXT NOT NULL DEFAULT 'legacy';  -- server|client|legacy
ALTER TABLE unit_progress ADD COLUMN source TEXT NOT NULL DEFAULT 'legacy';
ALTER TABLE textbook_results ADD COLUMN source TEXT NOT NULL DEFAULT 'legacy';
```

The views that count degrees (`degree_progress`) must count only `server` and
`legacy` rows once `GRADING_MODE=live`. Rebuild them in the same migration,
copying the latest definitions from 0010.

As built, the migration differs from the SQL above in three small ways:

- `attempts.client_result TEXT`: for a shadow attempt, what the browser's own
  grader decided (JSON), kept for comparison with the AI.
- `UNIQUE INDEX answer_grades_attempt_qid ON answer_grades(attempt_id, qid)`:
  one grade per question per attempt, so the first answer stands and two
  requests at once cannot count a question twice. A human regrade updates
  the row.
- `student_activity` is rebuilt as well as `degree_progress` (both read
  `course_completions`).

The migration adds columns, so it cannot be applied twice. `sync-grading-keys
--apply-migration` applies it only when `grading_keys` does not exist; the
file is named `0014_grading.sql` and sorts before `0014_thm_study_plans.sql`.

## 7. API

All bodies are JSON. The student is identified by `code`, as in `/api/sync`.
Errors are `{ error }` with the usual status codes. Every route is throttled
like `/api/sync`, plus a per-student cap of 150 graded items an hour (429).

| Route | Body | Reply |
|---|---|---|
| `POST /api/attempt` | `{ code, scope, lang }` | `{ attemptId, track, needs: {mc, fill, sa}, banked: { mc: bool, fill: [qid], sa: [qid] }, answered: {qid: {verdict, feedback, choice?}}, lock: {until, kind} \| null, items: { mc: [{qid, why?}], fill: [qid], sa: [qid] } }` |
| `POST /api/mc` | `{ code, attemptId, qid, choice }` | `{ right, answer, why }` |
| `POST /api/grade` | `{ code, attemptId, items: [{qid, answer}] }` | `{ items: [{ qid, verdict, feedback, points? }] }` |
| `POST /api/attempt/<id>/submit` | `{ code }` | `{ status: passed\|failed\|pending, scores: {...}, lock, unitDone: bool, courseDone: bool }` |
| `GET /api/attempt/<id>?code=` | — | Same as the submit reply, plus the current verdicts, so pending results can be collected |
| `POST /api/appeal` | `{ code, gradeId, note }` | `{ ok }`. At most 3 open per student. Only for `not_met`, `partly` or `wrong` written answers. |
| `POST /api/shadow` | `{ code, scope, lang, answers: [{qid, answer, choice?}], clientResult }` | `{ ok }`, returned at once; the work runs in `ctx.waitUntil` |

Notes on the routes (as built):

- **`needs`** in the attempt reply is the number that must be right in each
  part (`{mc: 18, fill: 9, sa: 9}`, 0 for a part the track does not count),
  and **`totals`** the number asked. `banked.fill` is always `[]`: only
  multiple choice and short answers bank. `status` is also in the reply
  (`open`, or `pending` when the student comes back to an attempt that is
  waiting). `answered[qid]` carries `gradeId` (what `/api/appeal` takes) and,
  for a banked short answer, `banked: true`.
- **Locked:** `POST /api/attempt` answers 423 with
  `{error, lock: {until, kind}, track}`; `lock` in a normal reply is null.
- **`/api/grade`** items are `{qid, gradeId, verdict, feedback, points?}`
  (`points` is `[{id, made}]`, never the quotes or the rubric text). A banked
  short answer comes back `{verdict: "met", banked: true}`. The first answer to
  a question stands in an attempt, for fill-ins as for multiple choice; asking
  again returns it. Fill-ins are at most 80 characters, short answers 2,000.
  The per-student cap (150 written items an hour) counts written items in
  `answer_grades`, so it applies to the shadow trial too.
- **Submit** on an attempt that is no longer open returns the current result.
  **GET** on a pending attempt settles it first if nothing is left waiting
  (a person graded the last item).
- **A grade made by a person** (appeal, Pending tab) updates the
  `answer_grades` row (`graded_by='human'`, `grader_email`) and calls
  `settle(env, attemptId)` from `worker/grading/attempts.js`, which recomputes
  the attempt and writes credit or the lockout. It never takes credit away.
- **Scopes** are the first part of the qids: `u:CTSJohn/1`, `tb:john`,
  `rd:johnreadings`, `sp:<page>`. A textbook or reading test is drawn by the
  server (seeded by the attempt id; by reading or chapter when the bank says
  so) and the same twenty come back for the same attempt.
- **Course completion** is written (and the seminary told, once) when a pass
  makes the record support it: every unit, and on the master's tracks every
  required test (`worker/awards.js courseShortfall`). A unit passed on the
  Certificate track and a textbook test passed later on a master's track
  complete the course at the master's level, as the browser rules did; the
  unit rows carry no track.

- **`POST /api/attempt`** reuses the open attempt for the same scope if there
  is one, and refuses a new one while locked. `items` repeats the order the
  page renders.
- **`POST /api/mc`:** a second answer to the same qid returns the first
  result.
- **`POST /api/grade`:** written items only; 1 to 10 items, all from the
  attempt. It can take up to about 20 s.
- **Submit** computes the rules in §5:
  - **On a pass:** writes `unit_progress` (`source='server'`); if that
    completes the course, writes `course_completions` (`source='server'`,
    track) and the notification, through the same code `/api/sync` uses
    today.
  - **On a fail:** sets the lockout.
  - **Pending:** if any required item is pending, the status is `pending`,
    and the cron finishes the job.
  - **Textbook and reading tests:** a pass writes `textbook_results`
    (`source='server'`).
- **`/api/sync` with `GRADING_MODE=live`:** it still stores the student's
  details and the client's progress for restoring devices. But it no longer
  creates `unit_progress`, `course_completions` or `textbook_results` from the
  client, and it no longer sends completion notices from them. It returns the
  server's records, and the browser treats those as the truth.
- **Mode, per request, in the test suite only:** a request with the header
  `x-test-grading-mode: shadow` gets the old `/api/sync` rules from a Worker
  that holds `AI_FAKE` (worker/grading/mode.js). The suites written for the
  old rules send it; no deployed Worker listens.

## 8. The model call (`worker/grading/model.js`)

- **Models** (variables):
  - `GRADER_MODEL` = `@cf/meta/llama-3.3-70b-instruct-fp8-fast`;
  - `GRADER_MODEL_FALLBACK` = `@cf/openai/gpt-oss-120b`;
  - `GRADER_PROMPT_VERSION` = `2026-10-14.1`.
- **Call:**
  `env.AI.run(model, { messages, response_format: { type: 'json_schema', json_schema }, max_tokens, temperature: 0 })`.
- **Validation:** the reply must parse, match the schema, and cover exactly
  the item ids sent. For short answers:
  - every point made must quote text found in the student's answer, compared
    after `normalise`;
  - "met" must be consistent with the essential points.

  On failure, retry once, then try the fallback model. If that fails too, the
  item is pending and goes into `grade_queue`.
- **Errors:** AI error codes 3036, 3040 and 3007 make the item pending at
  once (no retry, no fallback). The cron `*/15 * * * *` retries the queue,
  waiting 15, 30, 60, 120, 240 minutes between tries; a capacity error is not
  counted as a try. A batch the model cannot take at all is retried item by
  item, so one bad answer does not hold up the others. Anything still
  pending after 24 h, or after 6 tries, is escalated to faculty, who see it
  under Pending. When the cron settles an attempt a student was waiting on,
  they are emailed if their email is confirmed.
- **Usage:** every call adds to `ai_usage`.
- **Tests:** if `env.AI_FAKE` is set, the model call is replaced by
  `worker/grading/fake-ai.js`. That fake returns verdicts from hints in the
  answer text, such as `[[met]]`, `[[not_met]]`, `[[pending]]`, `[[error]]`
  and `[[bad-json]]`. It is used only by `test/wrangler.local.jsonc`, never
  by the deploy configs. `tools/verify-worker-config.mjs` fails if a deploy
  config sets `AI_FAKE`.
- The system prompt and JSON schema are in `worker/grading/prompt.js`.
- **No rubric yet:** a question without one is graded against its model
  answer as a single essential point, and `rubric_version` is recorded NULL.
- **Crons:** `worker/index.js` runs the queue when `event.cron` is
  `*/15 * * * *` and the daily job otherwise.

## 9. Faculty pages (`/staff/grading`)

These sit behind Cloudflare Access, rendered like `worker/staff.js`. Every
action records the Access email.

| Tab | What it shows | Actions |
|---|---|---|
| Appeals | Open appeals | Claim, then uphold or overturn with a note. An overturn re-grades the answer as `graded_by='human'` and runs the submit rules again, which may pass the unit and the course. The student is emailed if their email is confirmed. |
| Pending | Escalated and injection-held answers | Grade as met, partly or not met, with feedback |
| Calibration | This ISO week's 20 random AI-graded short answers, from live attempts, chosen deterministically by week | Each grader marks them without seeing the AI's verdict or the other grader's mark. Agreement over 4 weeks: AI vs each grader, and grader vs grader. |
| Fill-in rulings | AI-accepted fill-in answers grouped by qid, with counts | Keep or reject, which writes `grade_overrides`. A JSON export feeds `tools/apply-accepts.mjs`. |
| Possible copying | Identical short-answer text (after `normalise`, 12 or more words) from different students for the same qid | View only |
| Usage | `ai_usage` for the last 30 days, estimated cost, queue size and oldest pending | View only |

The Monday digest gains one line: open appeals, pending count, and
calibration agreement.

## 10. Privacy

- `public/CTSPrivacy.html` (EN, ES, FR) changes, in this sense: written
  answers are sent to the server, graded by an AI model running on
  Cloudflare, and kept as part of the academic record; Cloudflare does not use
  them for training; Delete My Record erases them.
- `deleteStudent` also deletes, for that student:
  - `attempts`, `answer_grades` and `appeals`;
  - `calibration` rows for their grades;
  - `grade_queue` rows for their grades.

## 11. Tests

- `test/run-tests.sh` stays the single entry point. The local Worker uses
  `AI_FAKE=1` and `GRADING_MODE=live`.
- The live-mode build is what is tested. A separate small check builds with
  `CTS_GRADING_MODE=shadow` and confirms the pages still carry keys and post
  to `/api/shadow`.
