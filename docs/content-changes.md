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

---

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
