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
| Single-page courses | `sp:<page>/<kind>/<i>`; `<page>` is chosen per graded section (section 15) |

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
    `--apply-migration` runs `0015_grading.sql` first if, and only if, the
    `grading_keys` table is missing; both deploy scripts pass it, as
    `prepare-study-plans.mjs` and `prepare-beta-activation.mjs` do for theirs.
  - It also deletes rows for questions that no longer exist (among `u:`,
    `tb:` and `rd:` only).
  - In tests it is applied to the local D1 (`--env local`).
  - A textbook or reading test also gets a **meta row**
    `tb:<slug>/meta/0` (`rd:` likewise): `{draw, pass, perReading, perChapter,
    n, code, kind, page}`. Its fill rows carry `group` (the reading or
    chapter number) in `data_json`, which the draw uses. A single-page course
    gets `sp:<page>/meta/0` (section 15 says what is in it).
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
  - otherwise, ask the model. The prompt (from `2026-10-15.2`) accepts the
    same thing named with extra sentence words, a surname alone where the
    sentence makes the person clear, a numeral for a number word, another
    common spelling or transliteration, singular or plural, and a clear
    one-letter typo; it rejects a different thing, even a related one.

  Passing is 9 of 10.
- **Short answer**, checked in this order:
  1. Fewer than 15 words: **returned for expansion, ungraded**, with no model call or grade record. Otherwise `copiedOnly`: **not met**, with no model call.
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

  **The server derives the verdict; the model does not decide it.** The model
  reports, per rubric point, whether it is made (with a quote), and a boolean
  `contradicts` (the answer contradicts the teaching of the model answer and
  rubric, or denies a point). Its own `verdict` counts only when it is
  "pending". The rule, in order:
  1. the model said "pending": pending;
  2. `contradicts`: not met;
  3. every essential point made: **met**;
  4. any point made: partly;
  5. otherwise: not met.

  A point is "made" when the answer states its central claim in substance,
  even briefly and in general words; if the point joins a claim with a
  reason or example, the central claim counts. A missing example, name,
  date, number or reason is not grounds for "not made" unless the rubric
  point itself is that item. The model must back each point it claims with
  one short contiguous quote (at most 15 words) of the student's own words;
  how the server checks it, and the one repair call, are in section 8. "partly" counts as not met. Passing is 9 of 10 met. A "met" answer is banked
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

## 6. Migration `0015_grading.sql`

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
file is named `0015_grading.sql` and sorts before `0014_thm_study_plans.sql`.

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
  waiting). `answered[qid]` is described in section 12.
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
  - `GRADER_PROMPT_VERSION` = `2026-10-15.2`.
- **Call:**
  `env.AI.run(model, { messages, response_format: { type: 'json_schema', json_schema }, max_tokens, temperature: 0 })`.
- **Validation:** the reply must parse, match the schema, and cover exactly
  the item ids sent. For short answers:
  - every point made must quote text found in the student's answer. Both
    sides go through `normalise` and `fold` (case, punctuation and accents
    are ignored, so a model that drops an accent while copying is not
    penalised, in Spanish and French as much as English). A quote is found if
    (1) it is a contiguous run of the answer's words; or (2) it is segments
    joined by `...` or `…`, each segment at least 3 words and found in order;
    or (3) it has at least 4 words, at least 90% of them appear in the answer
    in the same order (longest common subsequence), and no word it adds is a
    negation ("not", "no", "nunca", "pas" ...). A quote whose words are not
    the student's matches none of these, so the model can never credit words
    the student did not write. (Before 15 Oct 2026, prompt `.2`, only (1)
    existed and without folding; the loss of one point to a stitched or
    accent-altered quote was the main cause of false rejects in the eval of
    15 Oct.);
  - **one repair call.** If the model claims a point with a quote that is not
    found, the server does not silently downgrade it. It makes ONE more call
    on the same model (the original messages, the model's reply, then a short
    message listing the failed point ids per item) asking for an exact
    contiguous quote of at most 15 words, or `made: false`. Repairs for a
    whole batch go in one call. The call is counted in `ai_usage` like any
    other. A point whose quote still fails is treated as **not made**, but
    only if the rest of the reply is valid; if more than half of the quotes
    the model claimed for an item are still not found, or the repair reply is
    malformed, the item's reply is invalid (see below). A repair call that
    errors changes nothing except the count;
  - the verdict is **derived** from the validated points (section 5): the
    model's own verdict is used only when it is "pending". `points_json`
    stores `{ points, model_verdict, contradicts }` for audit, plus, when
    they apply: `dropped` (the claimed quotes that were not found, with their
    point ids), `repaired` (ids saved by the repair call), `first_failed`
    (what failed before it), and `quote_dropped: true` when the derived
    verdict differs from the model's own because of dropped quotes (the
    model's feedback is then not kept, because it describes a different
    verdict). Staff can filter on `quote_dropped` to find grades the server
    changed.
  - **Reply shape.** Short answers: `qid`, `contradicts`, `points`, `verdict`,
    `feedback`, in that order, so the verdict follows the evidence. Fill-ins:
    `qid`, `reason`, `verdict`, `points` (empty), `feedback`. `reason` is one
    line the model writes before it decides; the server ignores it (it is
    never shown or stored).

  On an invalid reply, retry once (with its own repair call if quotes fail), then try the fallback model. If that fails too, the
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

As built (`worker/staff-grading.js`, `worker/grading/review.js`,
`worker/grading/appeal-email.js`; routed from `handleStaff` after its Access and
same-origin checks). The pages are `/staff/grading/{appeals,pending,calibration,
rulings,copying,usage}`, plus `/staff/grading/calibration.json` (the agreement
figures, no answer text) and `/staff/grading/synonyms.json`. Where the build
adds to or differs from the table above:

- **Students are shown as "student n"** (the roster's row number) and a name,
  never a student code. Every page is `no-store`, `noindex`, and no answer text
  is logged.
- **Appeals.** A grader must take (claim) an appeal before ruling on it;
  ruling on an unclaimed one takes it. Only the person who took it can decide
  or release it. The ruling needs an internal note (kept in `appeals.ruling_note`,
  never sent to the student) and, optionally, a sentence of feedback for the
  student. An overturn picks the new verdict (it must differ from the current
  one). It updates the `answer_grades` row (`graded_by='human'`,
  `grader_email`) and calls `settle()` only if the attempt was submitted
  (`failed` or `pending`); an attempt still `open` is scored when the student
  submits. **The student is emailed on an uphold as well as an overturn** (the
  contract named only the overturn): the student asked, and would otherwise
  never hear. Only if their email is confirmed; wording in
  `worker/grading/appeal-email.js`, EN/ES/FR by the student's language.
- **What the AI said is kept.** A human grade writes
  `points_json = {"ai_verdict", "ai_points", "held"}` (it was the AI's point
  array or `{"held": ...}`), so the verdict column can change without the
  calibration figures forgetting what the AI decided. `aiRecord()` in
  `review.js` reads either shape.
- **Pending** lists exactly the answers with no `grade_queue` row (recorded
  deviation in section 5). Grading one runs `settle()` for a submitted attempt
  and, when the attempt leaves `pending`, emails the student through the same
  `tellStudent()` the cron uses. Feedback is required.
- **Calibration sample.** 20 answers: short answers graded by the AI in a live
  attempt (`graded_by='ai'`, or a human regrade that kept `ai_verdict`), picked
  by a hash of the ISO week and the grade id. The pool is what was graded
  before Monday 00:00 UTC of the week, so it stops moving; while that holds
  fewer than 20, the pool is everything so far (the first weeks). Answers
  already marked this week always stay in the sample. Blind: an unmarked
  answer shows the question, rubric, model answer and the student's words
  only; no AI verdict, per-point result, feedback or other mark, and no student
  identity. A mark is final (one per grader and answer); after marking, the AI's
  verdict and the other graders' marks for that answer appear. The agreement
  table is aggregate and is shown to everyone.
- **Agreement** is over the current and the three previous ISO weeks.
  "Same result" counts met against not met ("partly" counts as not met, as it
  does for credit); "exactly the same" also needs the same one of met, partly,
  not met. Shown as a percentage with the counts, for the AI against all
  graders together, the AI against each grader, and each pair of graders on the
  answers both marked.
- **Fill-in rulings** read the `grade_cache` rows the AI marked right. Keep
  writes a `grade_overrides` row `right`, Reject a row `wrong`, and either
  can be flipped later. A ruling applies to later answers only (the override is
  checked before the cache). The tab shows the student's own spelling (from
  `answer_grades`), the cache holding only the normalised form.
  **"Download approved synonyms"** is `{version, exportedAt, exportedBy,
  approved: [{qid, lang, text}]}` for every kept answer.
  **`tools/apply-accepts.mjs <file> [--content DIR] [--dry-run]`** adds each to
  the `accept` list (in that language, placed right after `answer`) of the unit,
  textbook or reading fill-in the qid names. It is idempotent (an answer the item
  already accepts, compared as the grader compares, is skipped), writes only
  files that change, in their existing layout (unit files and reading banks are
  `JSON.stringify(x, null, 1)`, textbook banks are a mix of 1 and 2 spaces; the
  tool detects which), and refuses a file it cannot reproduce byte for byte.
  Run `node tools/content-baseline.mjs --write` afterwards: the baseline hashes
  accept lists.
- **Possible copying** looks at the 20,000 most recent live short answers of 60
  or more characters and groups identical `normalise`d text of 12 or more words.
- **Usage** prices tokens per million: Llama 3.3 70B fp8-fast $0.293 in / $2.253
  out; gpt-oss-120b $0.35 in / $0.75 out (Cloudflare's published Workers AI
  prices; the plan's section 5 gave only per-call figures, which these
  reproduce: 3,500 in and 1,200 out is about $0.004). A model with no listed
  price is priced as Llama and flagged. Queue size and ages come from
  `grade_queue` and from the pending answers with no queue row.
- **The Monday digest line** (`gradingDigestLine`): "WRITTEN-ANSWER GRADING: n
  open appeals, m answers with faculty, AI and faculty agree on p% of N marked
  answers over 4 weeks", with "BELOW 85%: Robert decides whether to pause AI
  grading" appended when p is under 85, or "no calibration marks yet".

## 10. Privacy

- `public/CTSPrivacy.html` (EN, ES, FR) changes, in this sense: written
  answers are sent to the server, graded by an AI model running on
  Cloudflare, and kept as part of the academic record; Cloudflare does not use
  them for training; Delete My Record erases them.
- `deleteStudent` also deletes, for that student:
  - `attempts`, `answer_grades` and `appeals`;
  - `calibration` rows for their grades;
  - `grade_queue` rows for their grades.

As built:

- `public/CTSPrivacy.html` is written in English and Spanish (`en-only` /
  `es-only` spans). French is not in the page: it comes from the page's
  dictionary `src/data/french-pages/CTSPrivacy.json`, keyed by the English
  text, and the build stops on a changed English sentence with no French. The
  change is one new paragraph, one new line in "That copy holds", the old promise
  ("Your answers to individual questions are not sent") removed from the
  paragraph about the student code, and "every written answer with its result"
  added to the Delete card. English, Spanish and French all changed together;
  the French is a faithful draft for Wayne's review like the page's other
  French.
- `deleteStudent` deletes in one batch, for the student and any record merged
  into it: `calibration` and `grade_queue` (through their grades), `appeals`,
  `answer_grades`, `attempts`. `test/api.test.mjs` checks every one of them
  (it needs `STATE`, which `test/run-tests.sh` passes).

## 11. Tests

- `test/staff-grading.test.mjs` covers the faculty pages: Access required, a
  cross-origin POST refused, each tab, an appeal overturn that passes a unit
  and writes server credit, uphold, no email without a confirmed address,
  pending grades settling an attempt, blind calibration and the agreement
  arithmetic against marks worked out in the test, rulings changing later
  `/api/grade` results, the export and `tools/apply-accepts.mjs` on a temporary
  copy of the content, possible copying, usage cost and the digest line.
- `test/run-tests.sh` stays the single entry point. The local Worker uses
  `AI_FAKE=1` and `GRADING_MODE=live`.
- The live-mode build is what is tested. A separate small check builds with
  `CTS_GRADING_MODE=shadow` and confirms the pages still carry keys and post
  to `/api/shadow`.

## 12. The shapes the pages and the Worker agree on

Section 7 gives the routes; this section is the exact shape of each reply, as
the browser (`cts-grading.js`, `cts-engine.js`, `cts-fill.js`,
`cts-textbook.js`) reads it and `worker/grading/routes.js` sends it.
`test/grading-e2e.test.mjs` drives the two together, so a change to either side
that breaks the agreement fails the suite.

- **Page data (live build).** `window.CTS_UNIT` / `CTS_TEXTBOOK_TEST` carry
  `grading: "live"`, `scope` (`u:<Prefix>/<n>`, `tb:<slug>`, `rd:<slug>`) and,
  per item, `qid` plus only what a student reads (`stem`, `prompt`, `options`,
  and `group` / `chapter` / `reading` on a test bank). A textbook or reading
  bank ships all forty prompts; the server draws, and `items.fill` of the
  attempt names the twenty.
- **`POST /api/attempt`** replies with `attemptId`, `status` (`open` or
  `pending`), `track`, `lang`, `needs`, `totals`, `banked`, `answered`, `lock`
  (null) and `items`. A browser on a new device learns that the latest attempt
  is already submitted from `status: "pending"`.
- **`answered[qid]`** (in the attempt, submit and GET replies alike) holds, for
  what the student has already done and nothing else:
  - always `gradeId`, `verdict`, `feedback`, `gradedBy` (`exact`, `cache`,
    `override`, `rule`, `ai` or `human`; the page offers an appeal only on a
    fill-in not graded `exact` or `rule`);
  - multiple choice: `choice`, and `answer` (index of the right option) and
    `why` (a string in the attempt's language, or null), which the click that
    answered it already returned;
  - fill-in and short answer: `answerText`, the student's own words;
  - a fill-in graded `wrong`: `correctAnswer`, a string in the attempt's
    language. A graded item is final (the first answer to a question stands),
    so this is sent once the item is graded and never before; a pending
    fill-in carries none;
  - a banked short answer: `{ verdict: "met", banked: true, answerText }`, the
    text being the latest answer that met the standard.
- **Locked refusal**: `POST /api/attempt` answers 423 with
  `{ error, lock: { until, kind }, track }`. The browser accepts any 4xx
  carrying `lock`. `until` is an ISO date; `kind` `sa` locks the written part
  (mirrored into `_sa_lock`), `full` the whole unit (`_full_lock`).
- **`POST /api/mc`** replies `{ right, answer, why, choice }`; `answer` is the
  0-based index of the right option; `why` is a string in the attempt's
  language or null (null means "none", absent means "ask again").
- **`POST /api/grade`** items are `{ qid, gradeId, verdict, feedback, gradedBy,
  points?, correctAnswer? }` (`correctAnswer` as above, for a fill-in graded
  wrong). A banked short answer comes back `{ verdict: "met", banked: true }`.
- **Submit / `GET /api/attempt/<id>`**: `status` `passed|failed|pending`;
  `scores` as `{ mc: {right,total,need,banked}, fill: {...}, sa: {...} }`;
  `lock`; `unitDone`; `courseDone` (true is what makes the browser write
  `cts_done_codes` through `cts-record.js`; `unitDone` is not read); `answered`.
- **`models`** in a submit or GET reply: `{ qid: {en,es,fr} }` for the short
  answers of the attempt, sent only once the attempt is no longer open and only
  on a track where written answers do not count (Certificate, Associate). On a
  track where they count, no model answer is ever sent, because one shown after
  a failed attempt would be copied into the retake. The page shows a model
  answer beside a short answer the student wrote, and not beside one left empty.
- **`POST /api/appeal`** is sent `{ code, gradeId, attemptId, qid, note }`. The
  Worker acts on `gradeId`, and finds the answer from `attemptId` + `qid` if
  `gradeId` is missing. 429 means three are open.
- **Not in live mode.** There is no practice set after a textbook-test pass (a
  second draw is a second attempt). The old exam-view hiding
  (`cts-exam-view.js`) is unchanged.
- **Mode check.** `tools/verify-no-keys.mjs` fails a live build with any key;
  `--expect-keys` (or `CTS_GRADING_MODE=shadow`) checks the shadow build. Both
  run in `test/run-tests.sh`, and `npm run deploy[:beta]` runs the check for its
  mode. `tools/verify-worker-config.mjs --deploy --mode live|shadow` (passed by
  both deploy scripts) refuses a deploy whose build mode differs from the
  environment's `GRADING_MODE`, and the same agreement is checked from
  `package.json` in every run of the suite. Shadow pages are byte-for-byte the
  old pages plus one `<script src="/assets/js/cts-shadow.js" defer>`; the engine
  announces each submit as a `cts:submitted` event which that script posts to
  `/api/shadow`. Browser tests written for the old engine run against
  `dist-shadow/` (`npm run build:shadow`, served beside the Worker by
  `test/shadow-server.mjs`).
- **The single-page courses** (Counseling, Narrative and WiseSpeak Preaching,
  Ethics) are converted: section 15.

## 13. Running the eval

The eval (`tools/eval-grader.mjs`) is the check that must pass before the AI
grades real students (plan section 6.2). It grades 2,346 answers written by
agents (`test/eval/*.json`) through **the same code the server runs**:

1. the cheap checks, in the order of `attempts.js` `gradeWritten()`: blank or
   exact fill-in; fewer than 15 words; `copiedOnly` against the question in the
   student's language and in English; instruction-like text, which is held for
   faculty;
2. `prompt.js` builds the messages (including the language fallback
   `pickText`, so a French-only model answer is sent as French);
3. `model.js` `gradeBatch()` makes the call, checks the reply, retries once and
   falls back to `GRADER_MODEL_FALLBACK`.

The keys it reads are built by `tools/grading-keys-lib.mjs`, the same code
`tools/sync-grading-keys.mjs` uses to write `grading_keys`. What the eval does
not have is the database: no `grade_cache`, no `grade_overrides`, no attempts, so
nothing but the model answers for the model. Only the model call is swapped:
`env.AI` is `tools/eval-ai-shim.mjs`, which posts to the Cloudflare REST API on
the Chapala account pinned in `wrangler.jsonc`.

**What the results file records (prompt `2026-10-15.2`).** Each short-answer
item that reached the model has `quotes`: `model_verdict` (what the model
said itself), `claimed` (every quote the model gave, with `dropped: true` on
those the server did not find in the student's answer), `dropped` (point
ids), and, when a repair call ran, `repaired` and `first_failed`;
`quote_dropped: true` marks an item whose verdict the server changed by
dropping a quote. Use it to see whether a false reject is a judgement or a
dropped quote. A repair call counts as a call in the usage and cost figures.

**Item labels.** An item may carry `"relabelled": "<date> <reason>"` where a
review of the 15 Oct 2026 run showed the first label was wrong (the answer
omits an essential point, or the fill-in synonym is not clearly the same
word). A fill-in whose label is genuinely arguable has `expected: "debatable"`:
it is graded and shown in the report (`debatable` section: how many the model
accepted and rejected) but is **excluded from the bar**. Hand-written files
are edited in place; the generated files (`gen-*.json`) are changed through
`tools/eval-build.mjs`, so `node tools/eval-build.mjs --check` stays green.

**See the prompt first (no network).**

    node tools/eval-grader.mjs --print-prompt "u:CTSJohn/1/sa/9" --lang es
    node tools/eval-grader.mjs --print-prompt "u:CTSCH/9/fill/4" --lang fr

It prints the system message, the user message (the JSON the model reads), the
JSON schema, `max_tokens` and `temperature`, for a sample answer to that
question (`--answer "..."` to try your own). It says so when the server would
settle that answer without the model, and warns when the model answer sent is a
generic placeholder.

**Dry run (no network, no quota, exit 0).**

    node tools/eval-grader.mjs --dry-run            # all 2,346 items, under a second

The "model" is `worker/grading/fake-ai.js`, which answers `not_met` or `wrong`
to everything without a `[[hint]]`. The report says in capitals that no real
model was asked and that the bar result is meaningless. What it is for: checking
the harness, the cheap rules (how many answers never reach the model), the
prompts, and the estimate of what a real run costs.

**The real run.** Prerequisites:

- A Cloudflare API token that has the **Workers AI** permission on the Chapala
  account, kept in a file that **Robert creates in his own terminal** with
  mode 600 (`chmod 600 ~/.config/cts/workers-ai-token`). No agent writes it,
  and the tool never prints, logs or writes the token or its length:

      node tools/eval-grader.mjs --token-file ~/.config/cts/workers-ai-token ...

  `--token-file` refuses a file that is missing, empty, or readable by group or
  others (exit 2). `CLOUDFLARE_API_TOKEN` in the environment still works; if
  both are given, the file wins.
  The account id comes from `wrangler.jsonc`. If `CLOUDFLARE_ACCOUNT_ID` is set
  to a different account, the tool refuses (two accounts are reachable from this
  machine).
- Workers AI usage is billed in neurons. **Workers Paid is not needed to
  run it, but it uses real quota**: the free allowance is 10,000 neurons a day,
  and the full run below is about 90,000 neurons (at $0.011 per 1,000 neurons, $1
  is about 91,000). On the free plan a full run stops at a capacity error
  (3036) about a tenth of the way through, and the rest of the items come back
  `pending`. Either run it on Workers Paid, or run it in slices with `--limit`
  over several days. Check the neuron count on the Workers AI page of the
  dashboard before and after.
- The rubrics are all in (check: `node tools/verify-rubrics.mjs`); the eval
  refuses a real run if a short-answer question in it has none.

**The spending cap.** A real run must carry `--max-cost <usd>`; without it the
tool refuses to start (exit 2) before any network call. Before each model call
(including the retry and the fallback model that `model.js` makes on its own)
the tool adds up what has been spent so far, counted from the **real token
counts the API returns** at the list prices above (a call whose reply has no
usage is counted at its ceiling, `max_tokens` as output plus the input
estimate), plus the worst case of calls still in flight and of the next call.
If that would pass the cap, the call is not sent. The tool lets calls already
in flight finish, marks the items it did not reach `not run (budget)`, writes
the results file, prints how much it spent and how many items ran, and exits
**3**. (1 stays "the bar failed".) Before starting it prints the estimated
typical and ceiling cost of the selected items, and refuses (exit 2) if the
ceiling is more than 3 times the cap; use `--limit` to run a slice.

A run stopped by the cap is **partial**. The report says so in capitals, and
the bar is **not evaluated** on it, unless every category in the run still has
at least 30 graded items; then the bar is evaluated but labelled partial. A
partial run never establishes the bar. Failed calls (HTTP errors) are not
billed, so they cost nothing against the cap. A dry run can exercise the cap
with `--dry-run --max-cost N`; add `--fake-usage-scale 5` so the fake model's
tiny token counts cost something (a dry run's spend is synthetic).

The command (the flag is the signature that you know it spends quota). The
recommended one, on the primary model, with a $2.40 cap:

    node tools/eval-grader.mjs --i-understand-this-uses-quota --token-file ~/.config/cts/workers-ai-token --model @cf/meta/llama-3.3-70b-instruct-fp8-fast --max-cost 2.40

For the full 2,346 items the tool estimates about $1.11 typical and $2.61 ceiling
on that model (its input estimate includes the JSON schema, so it sits a little
above the table below). The ceiling is under 3 times the cap, so it starts; the
cap stops the run if real spending approaches $2.40.

`--repeat 2` grades 100 of the model-routed answers a second time; without it
the repeatability check of the bar is "not evaluated" and the bar is not
established. `--model`, `--fallback-model`, `--truth wayne|ted`, `--limit`,
`--category` and `--lang` narrow or change the run (see the top of the file).
It writes `test/eval-results/<date>-<model>.json` (answers, verdicts, feedback;
this is agent-written text, not student data) and exits 0 only if the bar passes
and there was no harness error.

**What it costs.** The dry run works the cost out from the exact prompts. Of
the 2,346 items about 1,640 reach the model (the rest are settled by the cheap
rules). That is about 1.58 million input tokens (prompt characters / 4, with a
15% margin) and about 236,000 output tokens (typical reply: 200 tokens for a
short answer, 50 for a fill-in; the ceiling is `max_tokens`, 550 an item). At
list prices as of 14 Oct 2026:

| Model | $ per M tokens in / out | Typical | Ceiling |
|---|---|---|---|
| `@cf/meta/llama-3.3-70b-instruct-fp8-fast` (primary) | 0.293 / 2.253 | $1.00 | $2.50 |
| `@cf/openai/gpt-oss-120b` (fallback) | 0.35 / 0.75 | $0.73 | $1.23 |
| `@cf/openai/gpt-oss-20b` | 0.20 / 0.30 | $0.39 | $0.59 |

`--repeat 2` adds about 6%. The gpt-oss models are reasoning models; their
reasoning tokens bill as output and are not in these figures, so treat the
gpt-oss rows as a floor. The report of a real run uses the token counts the API
returns, not these estimates. Re-check the prices at
developers.cloudflare.com/workers-ai/platform/pricing before relying on the
dollar figure.

## 15. The courses on engines of their own (plan step 6)

Four courses are not unit-engine courses: **Counseling**, **Narrative
Preaching**, **WiseSpeak Preaching** (one page each, a test per unit section)
and **Pastoral & Christian Ethics** (a page per unit). Their questions, keys and
grading are inline in the pages in `public/`, so they follow the rules of this
contract in a different way. The **Genesis Intensive is not one of them**: its
twelve units are unit-engine pages (`CTSGenesisUnitN.html`, `u:CTSGenesis/N`,
rubrics in `src/content/units`). `public/cts-genesis-engine.js` is loaded only by
`CTSGenesisCertificate.html` and reads progress; it grades nothing and holds no
question.

**Scopes and ids.** One scope per graded section, `sp:<page>`:

| Course | `<page>` | Sections |
|---|---|---|
| Ethics | `ethics_unit01` ... `ethics_unit10` | one per page |
| Counseling | `CTSCounseling-u0` ... `-u10` | 11 units on `CTSCounseling.html` |
| Narrative Preaching | `CTS_Narrative_Preaching-u1` ... `-u8` | 8 units on `CTS_Narrative_Preaching.html` |
| WiseSpeak Preaching | `CTS_WiseSpeak_Preaching-u1` ... `-u10` | 10 units on `CTS_WiseSpeak_Preaching.html` |

Every section has 20 multiple-choice questions, 10 fill-ins and 10 short answers
(essays), ids `sp:<page>/mc|fill|sa/<i>` in page order, plus a meta row
`sp:<page>/meta/0` = `{code, course, unit, units, page, file, lockMinutes?}`.
The keys are read from the pages as they are (`tools/single-pages-lib.mjs`), the
French from the drafts in `_review/french`, so the data was not moved and shadow
pages are unchanged. The course table (`code`, the name its units are recorded
under, the unit numbers, any lock rule) is one file, `worker/grading/singles.js`:

| Code | Recorded as (`unit_progress.course`) | Units | Browser state key |
|---|---|---|---|
| `COUNSELING` | `counseling` | 0-10 | `cts_drakeford_state` |
| `STORYTEL` | `storytel` | 1-8 | `cts_storytel_state` |
| `WISESPEAK` | `wisespeak` | 1-10 | `cts_wisespeak_state` |
| `ETHICS` | `ethics` | 1-10 | `cts_ethics_progress` |

`cts-sync.js` now sends the first three's passed units too (its `LEGACY` table),
so progress made before the switch is on the server when it comes.

**Rubrics.** `src/data/single-rubrics/<course>/<unit>.json`, an array of ten
rubrics in section order (counts: Counseling 110, Narrative 80, WiseSpeak 100,
Ethics 100), written by `tools/rubric-guidelines.md` from each lesson.
`tools/verify-rubrics.mjs` checks them with the unit courses'. `tools/single-rubric-dump.mjs <course> <unit>`
prints a unit's lesson, questions and model answers for whoever revises them.
For Narrative and WiseSpeak the page's `rubricEn` text (what a strong answer
holds) is the model answer.

**Thresholds** are the engines' own, and are the server's: multiple choice
90% (18 of 20), fill-ins 9 of 10, short answers 9 of 10; Certificate: multiple
choice; Associate: and fill-ins; Th.M./M.Div.: and short answers. What changes is
how a short answer is judged: at least 15 words (was 100 or 120 characters) and
the AI against the rubric (was 3 keywords). Lock after a failed unit: 15 minutes
on the master's tracks and 2 elsewhere (Counseling, Ethics, the site's rule),
**15 minutes on every track** for Narrative and WiseSpeak (their own
`LOCKOUT_MINUTES`, kept as `meta.lockMinutes`). Differences from the old
engines, accepted as the unit engine's rules: a multiple-choice pass is banked
across attempts on every course (Counseling, Narrative and WiseSpeak locked and
redid everything); the first answer to a question stands in an attempt.

**Credit.** A pass writes `unit_progress` (`source = 'server'`) under the
course's name above. The course completes when all its units are recorded and,
on the master's tracks, its required tests (`textbook_results`); the completion is
`course_completions` (`source = 'server'`, the track). A textbook or reading test
passed after the last unit completes it (`completeCourseIfDone` ->
`completeSingleIfDone`). `catalog.json` does not list these courses (they have
no `units` there) and is unchanged.

**The pages.** `tools/single-pages.mjs` runs when the build finishes, after the
language pages, on `X.html`, `es/X.html` and `fr/X.html` of the 13 pages:

- *live*: the unit data in each page keeps only wording (a question, its
  options); the French draft literals lose `why`, `model`, `kw`, `answer`,
  `accept`; `assets/js/fill/<course>.js` is rewritten with sentences and ids and
  no answer; `cts-grading.js` and `cts-single-live.js` take the place of the
  page's grading. Everything else on the page, and every localStorage key, is
  the page's own; the live script mirrors the server's outcome into them. The
  attempt starts on first use of a section, not at page load. Ethics units 2-10
  gain `cts-sync.js`, which only unit 1 loaded.
- *shadow*: the page is untouched; `cts-shadow.js` and `cts-shadow-single.js`
  post each submitted unit (`sp:` ids) to `/api/shadow`.

`tools/verify-no-keys.mjs` fails a live build if any of the 39 pages (or the fill
data) carries a key field, a French key, or a model answer or explanation of 40
characters or more in a script. Left on the pages on purpose: the WiseSpeak
practice exercises (`U1_ANSWERS`, `U7_FILL`), which never count for credit.
`test/single-live.test.mjs` runs Genesis, Ethics, Counseling, Narrative and
WiseSpeak against the real Worker; `test/shadow-mode.test.mjs` the shadow pages.


## Wayne’s pilot length policy — 15 October 2026

Requested by Robert from Wayne’s note; for consideration and beta testing in
[PR #98](https://github.com/chapala-seminary/website/pull/98). No production deployment or promotion is authorized.

Student instruction: “Please answer each question in a short paragraph that demonstrates your understanding of the material.”

The internal minimum remains 15 words; do not show a numerical word count or
require three sentences. Below the minimum, return: “Your answer is too short
to evaluate. Please expand your response to explain your understanding of the
question.” The API returns 422 with `needsExpansion` question IDs, before any
item in that batch is graded. No answer grade, model call, grading quota use,
failed exam, submission timestamp or lockout is recorded for that rejection.
The open sitting and saved typing remain available for revision and resubmission.
Blank responses retain the existing grading policy: nine met responses out of ten
can pass with one blank. A nonempty short response stops the browser before exam
submission, is focused and receives accessible inline guidance. Editing clears
the field error. Existing completed grades stand.
Clearing the length check still requires the substantive rubric to pass.

Beta acceptance: test short responses in EN/ES/FR; revise and resubmit in the
same sitting, including after reloading; check no failed grade or examination
was recorded. Test the exact 14/15-word boundary, a substantive one-sentence
answer, and a long but substantively wrong answer. Repeat on unit and
single-page course engines. Production stays unchanged pending separate approval.


### PR #100 behaviors retained (15 October 2026)

Adapted the focused, accessible field feedback from #100 to both live exam
engines, using the server's rejected question IDs rather than a second word
counter in the browser. Blank answers remain ordinary missed responses under
the existing 90% threshold; only nonempty answers below the internal length
floor request expansion. Certificate/Associate reflection remains optional.
Robert authorized publication to beta and closure of #100 after this replacement.
Production promotion and deployment remain separate.
