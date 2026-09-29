# What the conversion changed about what a reader sees

The move from 451 hand-written HTML files to lesson data was held to one rule:
**nothing a reader sees may change.** It is checked on every build —
`tools/verify-lesson-render.mjs` compares all 451 built pages, element by
element, against 119,528 elements recorded from a build made while every page
still rendered from its original HTML.

This file is the list of deliberate exceptions. Everything here is a change
someone asked for or approved. Nothing else on the site has changed.

---

## 1. Eight translations written by a machine — **these want a human reader**

Eight blocks existed in one language only. A reader in the other language saw
nothing there. The text below was written by Claude (an AI), not by a
translator, and is marked `machine` in the data.

Find them at any time with:

```
node tools/lesson-status.mjs | grep machine
```

| Course | Unit | Block | Added | Length |
|---|---|---|---|---|
| CTSBibleCharacters | 1 | `b039` | Spanish | 850 |
| CTSJosh | 2 | `b016` | Spanish | 512 |
| CTSJosh | 2 | `b029` | Spanish | 400 |
| CTSJosh | 9 | `b027` | Spanish | 189 |
| CTSRadical | 4 | `b014` | Spanish | 172 |
| CTSWR | 10 | `b033` | English | 63 |
| CTSWR | 11 | `b028` | English | 56 |
| CTSST | 7 | `b056` | *(see §2 — merged, not translated)* | — |

**One of these was nearly wrong.** The first pass reported CTSRadical unit 4
`b015` as untranslated and it was translated. It was not untranslated: an
English paragraph *before* it had no Spanish, and the alignment had slipped by
one, so `b015` was sitting beside the Spanish of the paragraph after it. Both
halves were real, careful text — they simply were not each other's. The
alignment now weighs length as well as tag, the slip is gone, and the block
that actually lacks Spanish is `b014` ("Then came a Samaritan…"). The wrong
translation was discarded, not shipped.

**What "marked `machine`" buys you.** Each carries the hash of the source it
was translated from. When someone fluent corrects one, the CMS marks it
`machine-edited` and no automatic pass will ever overwrite it. Until then it
reads as what it is. The texts are also kept verbatim in
`tools/data/translations.json`, so they can be diffed or replaced wholesale.

**The Spanish was written to match each unit's own conventions** — CTSST unit
12 uses straight quotes and `— Referencia`, others use `« »` — rather than a
house style imposed across the site. Scripture quotations follow Reina-Valera
Gómez, which is what the surrounding Spanish uses.

## 2. CTSST unit 7 — one heading instead of two

The page had **"The Heart of Glorification"** after the Romans 8:30 quotation
and **"El Corazón de la Glorificación"** three elements earlier, before the
paragraph that defines glorification. Two headings, in two different places,
and neither language could see the other's.

Both now sit immediately before the quotation, as one bilingual block
(`b056`), so the two languages read in the same order:

> …the final and complete stage of salvation → **The Heart of Glorification**
> → *"Whom He justified, these He also glorified." — Romans 8:30* → The most
> significant element of glorification…

The old Spanish-only block `b053` is gone; its text is the `es` side of `b056`.

## 3. CTSDP unit 7 — an author's note removed

A note to a reviewer was live on the site, in Spanish, in the middle of the
lesson:

> *(Nota del autor para revisión: el **bosquejo** de las cuatro obras se armó
> de textos estándar para su aprobación en la Puerta 2; la enseñanza y las
> ilustraciones ahora reflejan su propio ministerio.)*

Block `b025` and the `<p>` that held it are removed. Nothing replaced it.

---

## Still open, and deliberately not changed

*(Nothing. CTSST unit 12, listed here previously, is fixed — see below.)*

## Resolved since: CTSST unit 12

Ten and a half thousand characters of Spanish were frozen in that unit's page
template, rendering correctly and editable by nobody. Its English sat in a
`lang-en` div plus a `lesson-section` div; its Spanish in one `lang-es` div
outside them both, so the two never aligned and the whole thing was taken
whole. The extractor now flattens a wrapper when doing so lines the two sides
up, and pairs the wrapper rather than the marked div when the English is split
across both. The unit is 42 properly paired blocks — 475/481, 489/491,
847/905 characters — and `tools/verify-editable.mjs` now fails the build if
lesson text is ever left in a template again.

---

## 5. Furniture text taken out of the lesson data — **nothing on the site changed**

Not a content change: **every one of the 800 built pages is byte-for-byte
identical before and after.** It is recorded here because 1,925 blocks of text
left the lesson files, and a number that large deserves an explanation rather
than a diff.

`src/lib/shell.ts` deletes a list of page furniture from every lesson body at
build time — unit navigation, the registration card, language toggles, page
headers and footers — because the layout renders each of those once, correctly,
for all 451 pages. That markup had therefore been sitting in the data and *not*
on the site ever since. Some of it held text, and the extractor had dutifully
turned that text into editable blocks, so the CMS was offering a teacher fields
like "📝 Course Registration", "📚 Catalog", "Next Unit →" and "Clear Saved
Data" — fields they could change with no effect on anything. That is worse than
useless; it is misleading.

`tools/strip-chrome.mjs` removed it, taking its selector list from `shell.ts`
itself rather than a copy, so the two cannot drift.

| | before | after |
|---|---|---|
| template markup | 4.37 MB | 3.33 MB |
| editable blocks | 20,864 | 18,939 |
| text frozen in templates | 73,208 chars | 7,323 chars |

1,925 blocks and 131,852 characters of furniture text were removed, from 40
courses. The largest groups:

| Selector | Blocks |
|---|---|
| `#regCard` | 531 |
| `#regModal` | 422 |
| `#catalogLink` | 189 |
| `#registrationCard` | 143 |
| `#registrationSection` | 80 |
| `nav.unitnav` | 70 |
| `.nav-bar` | 58 |

**Every word of it is kept**, verbatim and in both languages, in
`docs/removed-chrome-text.json`, keyed by course, unit and selector. Nothing
has to be recovered from the history to read it or put it back.

The proof is `tools/verify-unchanged.mjs`, which compares a build made before
the change against the build made after, element by element and in document
order — 800 pages, 196,105 elements, no difference. `diff -rq` on the two
`dist/` directories is also empty.

---

## 6. The honours-readings box now has one definition

Also not a content change, and also byte-identical on every page.

The box — *"📖 Honors Readings · Lecturas con Honores"* — was written out in
434 of the 451 templates, 406 KB of markup. All 434 copies were the same
character for character except the link to that course's reading room, which
`tools/lift-honours-partial.mjs` proved before it changed anything. Rewording
it used to mean editing 434 files.

It now lives once, in `src/lib/partials.ts`, and the templates say
`<!--cts-part:honours-->`. See `docs/templating.md`.

---

## 7. Every unit page gained one footer link — **Your information · Su información**

A change a reader sees, so it is listed here rather than slipped in.

The footer of all 451 unit pages, and of `cts-backup.html`, now carries a third
link beside *All courses* and *Save my progress*:

> Your information &middot; Su información

It goes to `CTSPrivacy.html`, which says what the seminary keeps about a
student, shows them their own record, and deletes it on request. That page had
to exist before the student database is deployed: storing names, emails and
countries on identifiable people across several countries without a visible way
to see or delete them is not something to fix afterwards.

Nothing else on any page changed. `test/fixtures/lesson-render.json` was
re-recorded for this and this alone — the build before the link was added was
compared against the reference first, and matched all 451 pages, so the only
difference the new reference encodes is the link itself.

The page is also in the sitemap, deliberately and at low priority: a student who
wants their record deleted will search for it rather than hunt through a footer.

---

## 8. After Wayne's review of the beta (24 Sept 2026)

Wayne ran the beta past an AI review and sent the findings. Two were
regressions the unified engine had introduced against the original per-course
engines; the rest were pre-existing and are dealt with here as well.

### 8a. Multiple choice scores on click again — engine, no page content changed

Every original engine marked a multiple-choice answer the moment it was
clicked: the chosen option red or green, the correct letter shown, on every
track. The unified engine of 18 Sept graded only on submit, and on the master's
tracks showed nothing at all. `public/assets/js/cts-engine.js` now does what
the originals did. A question, once answered, stays answered for that attempt
(the verdict shows the key, so changing it would be free marks); after a
failed attempt the answers stay on screen for review but the next visit, or
the next click after the lock has expired, starts a fresh attempt.

### 8b. Short answer counts on the master's tracks only — engine, no page content changed

The originals required the short-answer section only on the M.Div. track
(`// Certificate track — only MC matters`); the home page says the same
("multiple-choice review, and short-answer work for the master's tracks"); the
Counseling Situations course says outright that "unit completion is based on
the multiple-choice questions". The unified engine had required it at 90% on
every track. It now counts on M.Div. and Th.M. only. On the Certificate and
Associate tracks the prompts are for reflection and the model answers are
shown on submit, as before.

`tools/engine-test-built.mjs` encodes both rules and fails on the 18 Sept
behaviour.

### 8c. "Saved only on this device" copy — five pages changed

Written before student codes existed, and wrong since: the home-page banner,
the caution card on `cts-backup.html`, and the "no registration found" notice
on four certificate pages (CTSAL, CTSDP, CTSST, ethics) all said progress lived
only in the browser. They now say that progress is kept under the student
code, that the code is the key to the record (not filed under name or email,
so keep it safe and do not share it), and that a backup file still works
offline. The backup page's list of how to protect your work gained one item:
write your code down the day you register.

### 8d. The server refuses awards its record does not support — API, no page content changed

`POST /api/certificate` used to issue a course certificate for any recorded
progress in the course and a degree certificate for nothing at all. It now
requires every unit of the course (from `worker/catalog.json`, generated from
the unit files by `tools/gen-worker-catalog.mjs`, checked in the suite and
before every deploy) and, for the degrees, the course counts and required
courses the certificate pages themselves enforce (`worker/awards.js`), plus a
master's track for the master's degrees. Grading is still in the browser;
this stops a fabricated certificate needing anything less than a fabricated
complete record. `test/api.test.mjs` pins the numbers.

### 8e. Every unit now has ten short-answer questions — 29 units, 189 questions added

Wayne asked that the units short of ten be brought up to ten to match the
rest. Counseling Situations had five per unit (13 units), Pentecostalism and
the Charismatic Movement three per unit (12 units), and Doctrinal Preaching
unit 1, John unit 4, Revelation unit 12, and Systematic Theology unit 10 had
none — which matched the live site. The new questions were written from each
unit's own lesson text, in both languages, in the same shape as the existing
ones (prompt, eight keyword stems a side, model answer), avoiding the ground
the existing questions already cover. `tools/add-short-answer.mjs` merged
them and checks that every model answer passes the engine's own grader, so a
student who writes the model answer is never marked wrong. No multiple-choice
question changed: `tools/content-baseline.json` was re-recorded and differs
only in short-answer counts (4,321 → 4,510). All 451 units now carry ten.

### 8f. Counseling Situations navigation — 13 pages changed

The course numbers its units 0..12. The unified layout counted 1..13, so
every page showed a pill for a Unit 13 that does not exist and none for
Unit 0, unit 12's Next button led to a 404, and unit 1 had no Previous. The
pills are now built from the units a course actually has, unit 12 has no
Next, unit 1's Previous goes to Unit 0, and the engine's "Continue to Unit N"
message reads the next page from `nextHref` rather than adding one. The live
site's Counseling pages had no pills or Next buttons at all, so nothing there
regressed; this corrects the migration.

### 8g. WiseSpeak gains a unit: "Preaching from the Inside Out" — 1 page changed

Wayne added a unit to the Preaching course (WiseSpeak) on 22 Sept, sent as
`CTS_Preaching_New.html`. His placement note puts it after sermon construction
and before delivery, so it is **Unit 7**, between Beautify and Refine and
Preparation and Delivery. The former units 7, 8 and 9 are now 8, 9 and 10; their
text and questions are unchanged apart from the numbers (headings, "Section 8.7"
references, one rubric's "Unit 7").

* **Saved progress moves with the units.** WiseSpeak stores progress by unit
  number in `cts_wisespeak_state`. On first load the page moves saved units
  7–9 to 8–10 (answers, passes and any lockout go with them) and records
  `cts_wisespeak_layout = "2"` so it never moves them twice. The marker is
  written only after the moved state is saved. A student who had finished all
  nine units keeps the course credit already recorded; the page now shows 9 of
  10 until the new unit is passed.
  *Rollback caution:* the old ZIP page reads the new layout wrongly (its Unit 7
  slot would hold the old Unit 7's progress under the new Unit 8's number), so
  do not roll back to the ZIP after students have loaded this page without
  reversing the move.
* **Grading follows the course's existing rules**, as Wayne's handoff asks:
  20 multiple choice for everyone at 90%; the 10 essay questions (his 21–30)
  required on Th.M./M.Div. The 10 fill-in-the-blank items, with Wayne's five or
  six accepted equivalents in each language, are **practice for every track and
  never count toward passing**. WiseSpeak has no "Standard" track, and an
  Associate student is graded here as Certificate.
* **Written for the site, not by Wayne:** the Spanish of the whole unit
  (Wayne's file had Spanish only for the pulpit note and the fill-in answers),
  the multiple-choice explanations, and the essay rubrics and keywords. Every
  rubric passes the course's own essay grader in both languages. Scripture in
  the lesson uses the ASV/RV1909 like the rest of the course; Scripture inside
  the preserved manuscript is translated from the version the manuscript used,
  and the page says so.
* **Left out:** Wayne's notes addressed to Robert (integration note, degree-use
  table, technical handoff) and the instructor answer key; his script that
  recorded the unit as "Unit 10".
* **The pulpit-note photo** was an 8.7 MB PNG inlined as base64 (11.7 MB page).
  It is now `public/assets/img/wisespeak-galatians-4-4-pulpit-note.jpg`,
  1200 px, 288 KB, loaded lazily. The course page grew from 651 KB to 750 KB.
* **For Wayne to confirm:** his Spanish duplicate of the note lists "Barna"
  where the handwritten note reads "Bruno", and it titles the points
  Preparación / Provisión / Privilegio where the handwritten note has
  Reasons / Results. Reproduced as he wrote it.
* **Not changed, but stale before this:** Evangelistic Preaching cites
  "WiseSpeak Unit 8" for evangelistic planning methods and "units 1–7" for the
  keyword method. No unit of the current WiseSpeak has that material, so those
  references were already wrong and need Wayne's word, not a renumber.

### 8h. Every certificate unlocks again — 7 pages and 3 scripts changed

Wayne reported a student finishing Ruth and Esther and being sent back to
Unit 1 for ever. The cause reaches further than that course. Each certificate
page was written against its own course's old engine, and several of those
engines kept progress under a different slug (1 Peter was `1pet`, Galatians
`gal`, Evangelism `ev`, Hermeneutics `herm`, Evangelistic Preaching
`evenpreach`, Bible Characters `CTSBC`/`CTSBC2`, Deacon Family Ministry
`CTSDFM`) or a different key shape (`re_unit3_passed`, `cts_pent_unit3_passed`,
`cts_romans_unit3_passed`, `cts_bible_u3_mcpass`, `cts_cs_state`, the Genesis
completion records). The unified engine of 18 Sept standardised on
`cts_<slug>_progress` and `cts_<slug>_uN_mc_passed` and wrote nothing else, so
on the new site **thirteen courses' certificates could never unlock**, and a
student's progress from before the change was invisible to the engine.

The engine and the sync client now carry a table of those old keys
(`LEGACY`, checked identical by `tools/verify-legacy-table.mjs`): a unit
passed under the old keys counts as passed, a pass writes the old keys too,
and a device restored from a student code gets them. No certificate page had
to learn new keys. `tools/verify-certificate-unlock.mjs` seeds a fully passed
student the way the engine would, opens every certificate page (and the four
degree pages), and requires the diploma to unlock and the completion code to
be recorded — and, with nothing passed, neither.

That check also turned up, and this change fixes:

* **Four certificates showed to everyone.** Church Growth, Deacon Family
  Ministry, Holy Spirit and Life of Christ kept the certificate box on screen
  when locked (with a "not yet" message inside, or a disabled print button),
  and `cts-completion.js` records a completion the moment it sees a visible
  certificate — so opening the page recorded the course as finished. The box
  is now hidden until earned. Holy Spirit and Life of Christ also read only
  the old numeric progress keys and could not unlock at all.
* **Three certificates printed the registration record as the name.** Church
  Growth, Evangelistic Preaching and Ruth and Esther read `cts_student` as a
  bare name; since registration it has been a JSON record, so the diploma
  said `{"name":"…"}`. Two of them also *wrote* a bare name back over the
  record when the student edited it. Fixed on all three.
* **Genesis never recorded its completion** unless the student pressed
  "Notify the seminary" — the shared completion script records on unlock,
  the Genesis copy did not. Genesis is a required M.Div. core course.

Live-site note: the old engines and their certificate pages matched, so
none of the unlock failures existed on the ZIP site; the always-visible
certificates, the JSON-as-name and the Genesis recording gap did.

### 8i. Two unit-1 pages restored from the live site — 2 pages changed

Found in a review of the beta. Both losses date from `c769367`, when the last
courses moved to the unified engine, and both are the same kind of unit: the
first unit of the course ran its own engine variant (`engine-al-v2.js`,
`engine-missions-v2.js`) rather than the one the other nine units shared, and
part of its content did not survive the move. For AL 1 the lesson lived in the
variant's `DATA` object; for Missions 1 the questions were in its data file,
and why the conversion wrote an empty bank for it was not traced further.

* **Administration & Leadership, Unit 1** had lost its lesson: the unit title,
  key Scripture, epigraph, and the whole teaching (5 headings, 15 paragraphs,
  starting with the scene of Moses and Jethro in Exodus 18). The page drew them
  from a `DATA` object at run time, so they were never in the page's HTML and
  the prose baseline, which was recorded from the HTML, never held them. They
  are restored from the live site (`24dbaa8`) in both languages, as 23 blocks
  of lesson data like every other unit. HTML entities were decoded to
  characters, and the key Scripture line is split into its English and Spanish
  halves (the original showed both, with the entities undecoded).
* **World Missions, Unit 1** had lost its 20 multiple-choice questions; only
  the 10 short-answer questions remained. Restored from the live site with
  their answer keys unchanged.

A sweep of all 438 unit pages in `24dbaa8` against the current content found
no other lesson paragraph or multiple-choice bank missing. `tools/content-baseline.json`
(which had recorded Missions 1 with no questions) and
`test/fixtures/lesson-render.json` were updated for these two pages only.

### 8j. After Wayne's consolidated audit (25 Sept 2026) — 9 pages, 2 scripts, 3 tests changed

* **A unit is reported to the seminary only when it is fully passed** (audit
  item 2). The engine banks a passed multiple-choice section in
  `cts_<course>_uN_mc_passed` while short answer is still to do, and
  `cts-sync.js` had read that flag as a passed unit: a master's student who
  passed multiple choice and failed short answer reached the records as having
  passed the unit, and a restore onto another device marked it complete. Sync
  now reads only `cts_<course>_progress`, which the engine writes when every
  part the track requires is passed. `test/sync.test.mjs` fails on the old
  behaviour. No page content changed.
* **Short answer counts on the master's tracks only, again.** On 24 Sept the
  Associate had been made to pass short answer (8b's rule reversed); Wayne's
  audit sets the Associate's extra requirement as ten fill-in-the-blank
  questions per unit instead, still to be built. The engine, the four
  single-page courses (Counseling, WiseSpeak, Narrative Preaching, Ethics ×10)
  and their track notes say master's only; the home page's "How to Proceed"
  step 4 likewise. `tools/engine-test-built.mjs` asserts it.
* **"Treat your student code like a password"** (item 8), where the code is
  first shown: the home-page code card, the unit registration box
  (`src/layouts/Unit.astro`), and the Save & Restore page's code card and
  caution list.
* **Three certificate pages** (Pentecostal, Radical Discipleship, Genesis)
  said only "no registration found on this device — begin at Unit 1"; they now
  also point a student who registered elsewhere to the Save & Restore page,
  as the other certificate pages already did (item 7).
* **Privacy page fallback** (item 7): the message shown when the records
  server cannot be reached said the records were "not switched on yet"; it
  now says they can't be reached right now and the work on the device is
  unaffected.
* `docs/curriculum.md` records the degree rules, the two intentional gate
  exceptions (How We Got the Bible, Deacon Family Ministry — item 14) and
  every file the curriculum is currently written into (item 12);
  `docs/apps-script/completion-notice.md` is the `MailApp.sendEmail` change
  for the Apps Script (item 5a).

### 8k. Certificates can be registered with the seminary (25 Sept) — 71 pages gained one script tag

Every certificate page now loads `assets/js/cts-certify.js` after the sync
client (the Certificate of Ministry and the Ethics certificate, which had no
sync client, gained that too). For a student with a student code it asks the
seminary to register the award: once the student has confirmed an email
address (a six-digit code sent to it), the certificate gets a verification
code that anyone can check at `/verify/<code>`, shown on the page and printed
as one line at the foot of the diploma. Nothing else on the page changed, and
a student without a code, or offline, sees the page as before.
`docs/student-records.md` §4 has the detail.

### 8l. The seminary is told of completions by the Worker (25 Sept) — no page content changed

`worker/notify.js` emails info@chapalaseminary.org from the request that
records a course completion or issues a certificate, and keeps a row per
notice in D1. Wayne's audit item 5. Nothing on any page changed; the Apps
Script post in `cts-record.js` stays for the sheet.

### 8m. Fill-in-the-blank questions (25 Sept) — 12 unit pages gained questions; 452 pages' registration note and 3 pages' track copy changed

Wayne's rule from his consolidated audit: every unit gets ten fill-in-the-blank
questions, required (9 of 10) on the Associate, Th.M. and M.Div. tracks, and
shown for review on the Certificate of Ministry with the answers revealed on
submit. The ten short-answer questions are unchanged and count on Th.M. and
M.Div. only.

* **Engine** (`public/assets/js/cts-engine.js`). A "Fill in the Blank /
  Complete el espacio en blanco" section between multiple choice and short
  answer, on any unit whose file has a `fill` list. An answer is right when,
  after the engine's `normalise()` (lower case, punctuation removed, spaces
  collapsed, accents kept), it is exactly the expected word or phrase or a
  listed alternative, in English or Spanish. A unit is recorded as passed
  (`cts_<course>_progress`) only when every part the track requires passes. A
  failed fill-in section keeps the multiple-choice pass and locks only the
  written part, using the existing `_sa_lock` key; no storage key was added or
  renamed. A unit without fill-ins is graded as before.
* **Content: CTS1Peter only, as a pilot** — 120 questions, 10 in each of its
  12 units, drafted from each unit's lesson text with `tools/add-fill-ins.mjs`.
  Every answer appears in that unit's lesson in its language and is accepted
  by the engine's own grader. **Not yet reviewed by Wayne**; the review sheet
  is `_review/fill-ins/CTS1Peter.md`. No other course has fill-ins, and none
  will be drafted until the pilot is reviewed.
* **Copy.** Home page: the Associate and Th.M. track cards and "How to
  Proceed" step 3 (the Associate card had said "the ten short answers").
  `CTSBeforeYouBegin.html`: three levels of work instead of two, and the
  Associate row. `CTSCounseling.html`: the Associate's work, and that the
  fill-ins come to that course later. The registration note on every unit page
  (`src/layouts/Unit.astro`).
* **Not changed:** the "Answer 1–20 / all 30" line inside each lesson's text
  (lesson content; to be revised with Wayne's review), the two NT master's
  certificates' wording, and the five courses that still run their own
  engines — Genesis, WiseSpeak, Counseling, Narrative Preaching, Ethics ×10 —
  which get fill-ins when they move onto the shared engine (server-side plan
  Phase 5).
* **Checks.** `tools/engine-test-built.mjs` tests the fill-in rules on every
  sampled course (units without fill-ins are given ten made-up ones in the test
  browser). `tools/content-baseline.mjs --check` fingerprints fill-ins, and
  fails a unit with fill-ins that does not have ten, a unit with no multiple
  choice, and any multiple-choice count other than twenty outside Pentecostal
  (7), Counseling Situations (10) and CTSRE unit 1 (18).

### 8n. Certificate pages for the three single-page courses (25 Sept) — 3 pages added, 3 changed

Counseling, WiseSpeak and Narrative Preaching printed their certificate from a
pop-up inside the course page, which no registration or verification could
reach. Each now has a certificate page like every other course —
`CTSCounselingCertificate.html`, `CTSPreachingCertificate.html`,
`CTSNarrativePreachingCertificate.html` — built from the Pentateuch page's
layout, unlocking on the course's completion code, with the same registration
panel and verification stamp. Scripture on each: Galatians 6:2, 2 Timothy 4:2,
Matthew 13:34. The "View Course Certificate" button on each course page is
now a link to its certificate page; nothing else on the course pages changed.
Students also receive their certificate by email once it is registered
(`docs/student-records.md` §6–7).

### 8o. After Wayne tried the fill-ins on beta (26 Sept) — engine and tester bar, no page content changed

* **Each fill-in is marked when it is checked**, as a multiple-choice answer is
  marked when it is clicked: a Check button (or Enter) says right or wrong at
  once and shows the answer, and a checked fill-in cannot be changed in that
  attempt. Submitting checks any left unchecked. On the tracks where fill-ins
  count, a failed section stays on screen for review until its lock ends and
  then starts again empty — its answers have been shown, so they are not kept.
  On the Certificate of Ministry they are still for review only.
* **The course-tester bar names the track being graded** ("Test mode on —
  graded as M.Div. — …"). Wayne reviewed in tester mode, whose placeholder
  student is on the M.Div. track, believing he was a Certificate student, and
  so met master's rules: fill-ins and short answer required, a 15-minute lock,
  and — by tester mode's design — every unit's state cleared on reload, which
  took his multiple-choice answers with it. A real Certificate student is
  graded on multiple choice alone with a 2-minute lock, and keeps their
  answers; `tools/engine-test-built.mjs` holds both.

### 8p. Fill-in-the-blank questions for every unit (26 Sept) — 439 unit pages gained questions; 2 pages' track copy and 451 pages' registration note changed

* **Content.** The other 39 courses on the shared exam engine now have ten
  fill-ins per unit, as 1 Peter did (8m): 451 units, 4,510 questions in all.
  Drafted from each unit's lesson with `tools/add-fill-ins.mjs`, at Robert's
  request before Wayne's review of the 1 Peter pilot came back; the pilot
  review's style changes are to be applied to all of them. Every answer is in
  that unit's lesson text in its language and is accepted by the engine's own
  grader, which `tools/content-baseline.mjs --check` now confirms for every
  stored answer. A number written in words also accepts its digits, and an
  answer that copies a lesson typo also accepts the right spelling.
  Genesis is included: its unit pages run on the shared engine; only its
  certificate page uses `cts-genesis-engine.js`.
* **Grading.** A leading article ("the", "a", "la", "un"...) no longer makes a
  right answer wrong; an article alone is still wrong.
* **Review material** for Wayne, in `_review/fill-ins/`: a sheet per course,
  `unsure.md` (questions where another answer might also be right) and
  `lesson-text-issues.md` — 335 problems the drafters found in the lessons
  themselves (typos, mistranslations, English and Spanish saying different
  things, unfinished sections, a few factual slips). No lesson text was
  changed.
* **Copy.** "Being added course by course" is gone: the home page's How to
  Proceed step and `CTSBeforeYouBegin.html` now name the four single-page
  courses (Counseling, WiseSpeak, Narrative Preaching, Ethics) that will add
  fill-ins later; the registration note on every unit page drops "where a unit
  has them".
* **Not in this change:** the four single-page courses; and ten lesson blocks
  in CTSDP unit 1, CTSHS unit 3 and CTSLOC unit 7 that show literal escape
  codes such as "\u00f3" to students (found while drafting; a separate fix).

### 8q. Wayne still saw the old fill-ins; escape codes in three lessons (26 Sept) — 451 pages' script addresses and 3 pages' text changed

* **Every unit page now asks for its scripts and stylesheet by a fingerprint
  of their contents** (`/assets/js/cts-engine.js?v=0758bb53e1`), made at
  build time in `src/layouts/Unit.astro`. Wayne's screenshot after the
  8o fix showed the code from before it: no Check button, the old test-mode
  bar. Either that deploy did not include 8o or his browser kept the old
  scripts. The fingerprint makes the second impossible after any deploy: new
  contents, new address. The hand-kept `cts-curriculum.js?v=20260915a` in
  every unit's script list is replaced by the fingerprint the same way.
* **Ten lesson blocks showed escape codes to students**, e.g. "serm\u00f3n"
  for "sermón": CTSDP unit 1 (b020–b023, both languages), CTSHS unit 3 (b011)
  and CTSLOC unit 7 (b004). Decoded; nothing else in those blocks changed, and
  each translation keeps its status (its "made from" hash follows the decoded
  source). The build now refuses lesson text containing an escape code
  (`src/content.config.ts`).
* `test/fixtures/prose-baseline.json`: the 10 blocks' entries replaced, nothing
  else. `test/fixtures/lesson-render.json`: re-recorded; the only differences
  are the script and stylesheet addresses and those 10 blocks.

### 8r. Fill-in synonyms; lesson-text corrections (27 Sept) — 451 pages' fill-in answers and 187 lessons' text changed

* **Fill-ins accept fair synonyms.** Dr. Cook answered one with a synonym and
  was marked wrong. Every question was gone through for the other answers a
  student who understood the lesson could fairly write: true synonyms, other
  forms (singular/plural, verb forms, Spanish without the enclitic), other
  standard names and spellings, and the wording of other common Bible
  translations. 4,249 accepted answers were added (227 before). Where too many
  words would fit the gap to list, the sentence was reworded so only the
  intended answer fits: 137 questions, answers unchanged. One wrong accepted
  answer was removed (CTSAL unit 6 q10 took "100" for "eighty-twenty").
  Accents are still graded, so two Spanish answers of "sí" (CTSCS 10 q2,
  CTSPsalms 4 q4) mark "si" wrong; left as they are for now.
* **284 writing errors fixed** in the lesson text: misspellings, missing or
  wrong accents, wrong words ("sobriar", "directez"), letters from other
  alphabets, a thinking-aloud aside ("— wait, no —"), a leftover author's note.
  Lists in `_review/lesson-fixes/<Course>.json`, applied with
  `tools/fix-lesson-text.mjs`, which refuses a fix that does not match exactly
  once in its block. A translation that was current stays current.
* **153 edits settling Dr. Cook's items as the site owner decided them**
  (`_review/lesson-fixes/<Course>-2.json`): where English and Spanish said
  different things, the Spanish now says what the English says; untranslated
  passages translated; factual slips fixed in both languages (e.g. "Jesus,
  Lover of My Soul" is Charles Wesley's; Ruth 4 is at the gate of Bethlehem);
  tú/usted mixing brought into line with each course's own form. Spanish
  written or rewritten this way is marked "Translated automatically" in the
  CMS (`tr.es.status = machine`, `from` = the current English), so it can be
  found and reviewed. A heading printed twice in CTSWR unit 10 was removed.
* **Left for Dr. Cook**: 73 items in `_review/lesson-fixes/FOR-DR-COOK.md` —
  Bible wording choices, doctrine, the unfinished "Pending Dr. Cook's own
  sermon" sections in Matthew, and points only the author can settle.
* `tools/content-baseline.json` re-recorded (fill-in accepted answers and
  prompts). `test/fixtures/prose-baseline.json`: only the 354 changed blocks'
  hashes replaced, chrome entries kept. `test/fixtures/lesson-render.json`:
  re-recorded; the differences are the unit-data script (the accept lists) and
  the lesson text of the 187 corrected lessons.

### 8s. Fill-in-the-blank questions on the four single-page courses (27 Sept) — 13 pages changed, 2 scripts and 4 data files added

* **Counseling, Narrative Preaching, WiseSpeak Preaching and Ethics** now have
  ten fill-in-the-blank questions per unit (390 in all: 11, 8, 10 and 10 units),
  with the same rules as every other course: 9 of 10 for Associate, Th.M. and
  M.Div.; review only on the Certificate track; each answer marked the moment
  it is checked; a failed set shown for review, locked, then started again
  empty. These pages still grade their own tests (moving them onto the unit
  engine is Phase 5), so the fill-ins are drawn and marked by a small shared
  script, `public/assets/js/cts-fill.js`, whose grader is the engine's word for
  word, and each page's own submit decides the pass.
* **The questions** live in `public/assets/js/fill/<course>.js`, written by
  `tools/add-fill-ins-page.mjs` from `_review/fill-ins/drafts/<course>/`
  (review sheets `_review/fill-ins/{counseling,narrative,wisespeak,ethics}.md`).
  They include accepted synonyms from the start.
* **Saved progress:** no new storage keys. The answers go inside each page's
  existing saved state (`fillAnswers`, `fillChecked`); a state saved before
  this loads unchanged, and a unit already passed stays passed.
* **Locks:** Narrative and WiseSpeak already lock a failed unit (15 minutes);
  Ethics locks the written part with its short-answer lock, banking the
  multiple choice. Counseling had no lock at all; a failed set of fill-ins now
  locks the fill-ins only (15 minutes on the master's tracks, 2 otherwise,
  `lockedUntil` in the unit's state), since otherwise the answers just shown
  could be typed straight back. On Counseling a unit already passed now stays
  passed when it is submitted again.
* **Copy:** Counseling's course description no longer promises the fill-ins
  "in a later update"; the test notes on Narrative, WiseSpeak and Ethics say
  who must answer them. Spanish typos corrected in Ethics units 4, 9 and 10
  ("rebaño", "rehúsa", "Gástate", "Descuídela").
* **Test:** `tools/verify-fill-single.mjs` (in `test/run-tests.sh`) drives all
  four in a browser — Certificate, Associate at 8 and 9 of 10, M.Div., a
  reload, and a pre-change saved state — and fails if `cts-fill.js`'s grader
  differs from the engine's. Mutation-checked: removing the fill-in pass rule
  from Narrative or Ethics, or the review-during-lock rule from the widget,
  each fails it.

### 8t. Dr. Cook's answers applied (27 Sept) — 88 lessons, 11 unit tests, 2 charts changed

* **Dr. Cook answered every item** in `_review/lesson-fixes/FOR-DR-COOK.md`
  (his answers are summarised in that file's history and in the fix lists).
  They are applied as 620 text edits (`_review/lesson-fixes/<Course>-3.json`,
  Genesis `-3a`/`-3b`, `culminacion.json`) with `tools/fix-lesson-text.mjs`,
  and 10 structural changes (`<Course>-3-ops.json`) with a new tool,
  `tools/restructure-lesson.mjs`, which adds, moves or removes whole blocks
  in both languages and refuses any block that is not on a line of its own.
* **Bible wording:** NKJV word for word in English and RVG word for word in
  Spanish for every verse his answers named, and for other quotations of the
  same verse in the same course; where the lesson's point needs a word the RVG
  lacks, the RVG quote is followed by "(es decir, …)". Verses whose exact RVG
  text should be checked against a printed Bible are listed for him.
* **New and rewritten text:** Matthew 3 is built from his sermon "Reasons We
  Mourn" (19 new blocks); the persecuted Beatitude (Matthew 3) and the last
  three petitions of the Lord's Prayer (Matthew 5, 4 new blocks) are written
  by Claude in his voice for his review; Evangelistic Preaching units 6, 7, 8
  and 10 are cut by about a quarter (repetition only; 7 blocks removed);
  Genesis's Spanish is smoothed throughout (268 blocks); Radical Discipleship
  13 has a new illustration, written in his voice, for him to confirm.
* **Unit tests** that quoted changed wording follow it (Radical 13's questions
  on the replaced story; "certezas", "José Smith", "Jehová-jireh", "Tema",
  "posmilenialismo", "Luisiana", "Príncipe", "longanimidad", "six units",
  "culminación"). `tools/content-baseline.json` re-recorded for those.
* **Charts:** Pentateuch 12 and Systematic Theology 9 now follow the language
  switch: each chart is drawn once per language, the author's own Spanish split
  from the English, three lines that had no Spanish translated.
* Spanish written or rewritten by these changes is `machine` in its translation
  state, so it shows as "Translated automatically" in the CMS for review.
* `test/fixtures/prose-baseline.json`: only the changed blocks' hashes
  replaced. `test/fixtures/lesson-render.json`: re-recorded; the 89 pages that
  differ are exactly those whose lesson or test changed.

---

### 8u. Certificates as a PDF, in English or Spanish (28 Sept) — 74 certificate pages gained one script tag

* **Why:** students saving their certificate from a phone got a blurry image
  and wrote to the seminary for a PDF; Spanish-speaking students asked for
  their certificates in Spanish (Dr. Cook, 27 Sept).
* **What:** every certificate page now has a **Download PDF** button under an
  unlocked certificate (next to Print on the Th.M. and M.Div. pages, whose
  diploma is drawn for print only). It builds a one-page, letter-landscape,
  vector PDF in the browser -- sharp at any size -- in the language the student
  is reading the site in (cts-lang.js chooses it from their saved choice or
  their browser), with a link for the other language. Nothing is sent
  anywhere.
* **Wording and design** follow the seminary's Certificate Maker, so a
  downloaded certificate matches one the office emails: the course
  certificate (name, course, track, With Honors when the class's honors
  reading is done, both signatures, the seal, the date) and the degree
  diploma for the Certificate of Ministry, Associate, Th.M. and M.Div. The
  verification code is printed when the certificate has been registered.
  Course names in both languages come from the catalog
  (`src/content/courses`), written to `public/assets/js/cts-cert-names.js` by
  `tools/build-cert-names.mjs`.
* **Files:** `public/assets/js/cts-cert-pdf.js` (the button and the drawing);
  `public/assets/vendor/jspdf.umd.min.js` (jsPDF 4.2.1, MIT, loaded only when
  the button is pressed); `public/assets/img/sig-cook.png`, `sig-rogers.png`
  (the signatures already on the certificate pages).
* **Test:** `tools/verify-cert-pdf.mjs` builds real PDFs for a course and a
  degree, in both languages, and checks their text; it fails if any
  certificate page lacks the script or the names are out of date.
  `tools/verify-certificate-unlock.mjs` now also checks that the button appears
  with every unlocked certificate and never with a locked one.

---

### 8v. The catalog unlocks for students from the old site; tester mode needs a key; the student tracker (28 Sept) — 4 scripts, 12 lesson templates, the privacy page and the Preaching page changed

* **Why:** Wayne's tracker of 27 Sept: Paul Cox finished the foundation but the
  catalog stayed locked until he was given `?ctstest=on`, and Daniel Johnson
  was given the same link. Wayne also asked for a way to follow each student's
  progress and write to the ones who go quiet.
* **The lock (what students see).** On the old site a course was recorded as
  finished only when its certificate page was opened, and the notice to the
  seminary was sent at the same moment. Paul's three missing notices (OT
  Survey, NT Survey, Preaching) are three of the seven foundation courses, so
  his catalog stayed locked. The new site records a course when its last unit
  is passed, and the front page catches up any course finished earlier. That
  catch-up missed two cases, now fixed in `public/assets/js/cts-record.js`:
  * courses whose progress is still under the old per-course storage names
    (14 courses, including Evangelism, a foundation course);
  * the single-page courses, Preaching (a foundation course) and Counseling.
  A student who passed all nine Preaching units before unit 7 was added (24
  Sept) keeps the course: it is recorded before the Preaching page renumbers
  their units (`CTS_WiseSpeak_Preaching.html`). The old-storage table is now
  in three scripts; `tools/verify-legacy-table.mjs` holds all three copies
  equal.
* **Tester mode** (`public/cts-curriculum.js`): `?ctstest=on` no longer does
  anything. The switch is `?ctstest=<the tester key>`, and the key is not in
  the repository. The small unlock square on a locked course page asks for the
  key, and the console route needs it too. The key is removed from the address
  bar once used. The placeholder "Course Tester" account is no longer uploaded
  to the seminary's records (`cts-sync.js`). Genesis's certificate page read
  `?ctstest=on` directly; it now reads the same stored switch. Genesis's 12
  lesson templates had a hidden banner reading "CTS TEST MODE — ?ctstest=on";
  it now reads "CTS TEST MODE". See `docs/course-tester-mode.md`.
* **Privacy page:** the list of what the seminary keeps gains "the language
  you read the site in, and any notes the seminary has sent you about your
  progress", and a paragraph on when the seminary may write (both languages).
* **Student tracker** (no page changes; `docs/student-tracker.md`):
  * a staff roster behind Cloudflare Access;
  * a daily note to students who have gone quiet;
  * a weekly summary to the seminary;
  * a returning student's history arriving as one completion notice, not one
    per course;
  * the sync now carries the student's language.
  Confirming an email no longer deletes the record of notices sent about that
  student.
* **Test:**
  * `tools/verify-completion.mjs`: an old-site student with the foundation
    finished and nothing recorded gets all seven courses and an open catalog
    from one visit to the front page.
  * `tools/verify-devmode.mjs`: `?ctstest=on`, a wrong key, the console and
    the unlock square all open nothing without the key.
  * `test/staff.test.mjs`: the roster and the notes, 78 assertions.
  * `test/api.test.mjs`: the single notice.

---

---

### 8w. Dr. Cook's answers of 29 Sept — 5 lessons, 2 units' questions, the Counseling page and the Pentateuch PDF changed

* **Matthew, Unit 5:** the three sections on the last petitions of the Lord's
  Prayer, written by Claude in #6, are replaced with Dr. Cook's own teaching:
  "Give Us This Day Our Daily Bread", "Forgive Us Our Debts, As We Forgive Our
  Debtors" and "Lead Us Not into Temptation". The Spanish is Claude's
  translation, marked "Translated automatically". Scripture in the Spanish
  follows the wording the course already uses (Mateo 6:11–13, 6:14–15, Lucas
  15:19, 22:42).
* **Matthew, Unit 3:** "Edgar, the great musician" → "Elgar", in both
  languages. The persecuted Beatitude section stays as written.
* **Radical Discipleship, Unit 13:** the hospital illustration is replaced with
  Dr. Cook's own account, "Jim's Last Words". Multiple-choice question 12 and
  short-answer question 4 asked about the old illustration and now ask about
  Jim.
* **Joshua 5:13–15 in NKJV wording:**
  * Old Testament Survey Unit 4: the heading, the quotation and the summary
    now read "Commander of the army of the LORD" and "Take your sandal off your
    foot, for the place where you stand is holy". Three of its questions
    changed with them. The fill-in's answer is now "Commander", with
    "Captain" and "Prince" accepted.
  * Joshua Unit 10: the same verses are quoted from the NKJV, and the Spanish
    from the RVG.
  * The Joshua course's own teaching keeps "the Captain", as Dr. Cook asked on
    27 Sept; only its quotations change.
* **Counseling 7.7:** "What does she think?" → "What does he think?". The
  Spanish now reads "su anciano … ¿Qué piensa él?".
* **Unchanged, as Dr. Cook decided:**
  * WiseSpeak keeps Philip's daughters "preached" in English and
    "profetizaban" in Spanish.
  * Every "Solomon" in Narrative Preaching refers to the author whose
    framework the course follows. The one mention of King Solomon is
    already "Salomón".
* **Pentateuch PDF certificate:** Dr. Ted Rogers, who wrote the course, is
  "Course Author" on it, and Dr. Cook is "Founder & Instructor", the roles the
  certificate page itself shows. Every other course is unchanged.
  `tools/verify-cert-pdf.mjs` checks both.
* **Still open:**
  * The Spanish course names from the current bilingual Certificate Maker.
    The copy in hand is the older English-only one.
  * The RVG wording checks listed in `_review/lesson-fixes/FOR-DR-COOK.md`.
* **Files:** `_review/lesson-fixes/CTSMatt-4.json`, `CTSRadical-4.json`,
  `joshua5-nkjv.json` (applied with `tools/fix-lesson-text.mjs`);
  `src/content/units/CTS/4.json`, `src/content/units/CTSRadical/13.json`;
  `public/CTSCounseling.html`; `public/assets/js/cts-cert-pdf.js`. The
  baselines were updated for exactly these pages.

---

### 8x. Course names and authors from the Certificate Maker (29 Sept) — the PDF, 18 catalog names, 34 certificate pages

* **Why:** Dr. Cook asked that the site's certificates use the names in the
  seminary's current, bilingual Certificate Maker, and that the website
  catalog use the same terms (e.g. "Ministerio Pastoral", not "Ministerios
  Pastorales"). Robert confirmed the co-authors on 29 Sept.
* **Source:** the Maker's course list is copied into
  `src/data/certificate-courses.json`: English name, Spanish name and
  author(s) for 44 courses. The authors are:
  * Pentateuch: Dr. Ted Rogers;
  * Christian Education: Andi Cook;
  * Romans and Practical Theology: Dr. Cook and Dr. Rogers;
  * Ruth and Esther: Glenda Rogers;
  * every other course: Dr. Cook.

  Counseling Situations is not in the Maker, so it keeps the catalog's name.
  "Parables of the Bible" is in the Maker but not on the site.
* **PDF certificate** (`cts-cert-pdf.js`, names from `cts-cert-names.js`, now
  written from that file):
  * Names are the Maker's in both languages.
  * Signatures follow the Maker: the course's author on the left as Course
    Author, the Seminary Director on the right.
  * On the Pentateuch, Dr. Rogers signs as "Course Author · Seminary Director"
    and Dr. Cook as "Founder".
  * On Romans and Practical Theology, both sign as Course Author.
  * Andi Cook and Glenda Rogers have no signature on file, so their names are
    printed in a script hand.
  * The Spanish wording is the Maker's: "Se otorga este certificado a",
    "Programa: Certificado de Ministerio", "Por la presente se hace constar
    que", and the Maker's body text.
  * The English track band reads "Certificate of Ministry Track".
  * The director signs as "Seminary Director", the Maker's default, where it
    was "Director of Education".
* **Catalog** (`src/content/courses`): 18 Spanish names now follow the Maker.
  Among them: "Hechos: Curso Intensivo" and the other intensives, "Personajes
  Bíblicos", "Adoración Cristiana", "Ministerio Pastoral", "Pentateuco", "La
  Doctrina del Espíritu Santo" and "Ética Pastoral y Cristiana".
  * Preaching is "Predicación": the Maker's "(WiseSpeak)" is left off the
    course's own name.
  * The English names are unchanged.
  * `tools/verify-catalog.mjs` lists the 18 renames and applies exactly those
    to the hand-written reference, so any other change still fails.
* **Certificate pages:**
  * Where a page names its course in Spanish, it now uses the Maker's name:
    title, heading, locked-page message, and the M.Div. and Th.M. diplomas'
    course checklists. That covers 34 pages across 17 courses.
  * "Profesor de Ministerios Pastorales" is Dr. Cook's title as a professor,
    not a course name, and is left as is.
* **Test:** `tools/verify-cert-pdf.mjs`, 112 assertions, now including who
  signs for a course by Dr. Cook, the Pentateuch in both languages, Romans,
  Ruth and Esther, and Christian Education.

## How to check any of this yourself

```
node tools/lesson-status.mjs             # every block's translation state
node tools/verify-lesson-render.mjs      # all 451 pages against the reference
node tools/prose-baseline.mjs check dist # 25,773 recorded text blocks
node tools/verify-editable.mjs           # is every word reachable from the CMS
node tools/verify-partials.mjs           # partials and templates still agree
```

The reference in `test/fixtures/lesson-render.json` was re-recorded after each
change listed above, so it now encodes the site *with* these changes. The
commits are the audit trail: `git log -- src/content/lessons` shows each one,
and every change here was proved to alter only what it claims to — the page
was re-rendered with the change backed out and compared against the previous
reference, element for element.
