# Swahili translation brief — CTS denominational electives (textbooks, readings, tests)

You translate one course into Swahili for Chapala Theological Seminary (CTS), a free seminary.
Wayne Cook (Dr. Cook) approved this on 27 Oct 2026. Students are pastors and lay leaders in
East Africa (Kenya, Tanzania, Uganda, DR Congo). Write clear, standard Swahili (Kiswahili sanifu)
at the level of an educated pastor: natural, not word-for-word. Keep the meaning exact.

## Inputs (read-only; never edit these repos)
Given COURSE code (e.g. B-C1), SLUG (e.g. elecbapone) and PAGE (e.g. CTSElecBap1):
- Textbook: /home/claude/website/src/content/textbooks/SLUG.json
  - `title.en`, `subtitle.en`, `body.en` (HTML, chapters start at `<h2 id="en-N">`).
  - `test.questions[]`: `prompt.en` (fill-in-the-blank, 40 items), `chapter`.
  - Answers (PRIVATE): /home/claude/assessment-keys/textbooks/SLUG.json
- Readings room: /home/claude/website/src/body/rooms/PAGEReadings.html
  - Use only elements with class `lang-en` (the five readings, about 2,500 words each, plus short intro text).
- Reading test bank (PRIVATE, has answers): /home/claude/assessment-keys/readings-src/SLUGreadings.bank.json
  (`questions[]`: `id`, `reading`, `en`, `answer_en`).
- Spanish and French versions exist in the same files; consult them only when the English is unclear.

Extract text with python or node (strip HTML, keep headings, paragraphs, block quotes, lists).
Don't retype the source by hand.

## Outputs
Write to /home/claude/swahili-electives/COURSE/ :
1. `textbook.sw.md`: Markdown. A title block (Swahili title; keep the author's name; "Kitabu cha kiada"),
   then each chapter as `## N. <Swahili heading>`. Translate the CTS notes (`cts-note`) and the source
   notes (`small muted`) too. Keep `[…]` omission marks. Keep footnotes and citations as given.
2. `readings.sw.md`: the five readings as `## Somo la N: <title>` with their source lines and CTS notes.
3. `textbook-test.sw.md`: STUDENT version, NO answers. Title "Mtihani wa Kitabu cha Kiada", a short
   instruction paragraph (20 of 40 questions are drawn, 18 correct to pass, fill each blank with one
   word or short phrase), then the 40 items numbered, grouped by chapter, each blank shown as `______`.
4. `readings-test.sw.md`: STUDENT version, NO answers, same shape, grouped by reading
   ("Mtihani wa Masomo Matano").
5. `private/keys.sw.json`: `{ "textbook": [{"n":1,"chapter":1,"answer_en":"…","answer_sw":"…","accept_sw":["…"]}], "readings": [{"id":1,"reading":1,"answer_en":"…","answer_sw":"…","accept_sw":["…"]}] }`.
   Each Swahili answer must fit its blank grammatically. `accept_sw`: 2–4 reasonable alternates
   (synonyms, with and without noun-class prefix variants, spelling variants). Proper names stay as
   the source spells them (accept a Swahili spelling too where one is common).
6. `NOTES.md`: at most 15 lines: word counts (EN source vs SW), terms you chose for key concepts,
   anything uncertain.

Write each file in pieces as you go (chapter by chapter), so a crash loses little. If a file already
exists and is complete, skip it (resume support).

## Rules
- Bible quotations: use the Swahili Union Version (SUV, Biblia Takatifu, 1952 public domain). If you are
  not sure of the exact SUV wording, translate faithfully and keep the reference; never invent a version.
- Keep each tradition's own terms and voice. These courses are written from inside their tradition
  (Baptist, Methodist/Wesleyan, Pentecostal, Reformed). Do not neutralize or soften their positions.
  Useful terms: ubatizo wa waumini kwa kuzamishwa (believers' baptism by immersion); utakaso (sanctification);
  utakaso kamili (entire sanctification); ubatizo katika Roho Mtakatifu; karama za Roho; mafundisho ya neema
  (doctrines of grace); agano (covenant); kanisa la mahali (local church); mzee (elder); shemasi (deacon);
  Meza ya Bwana (Lord's Supper); Kazi Iliyokamilika (Finished Work); kunena kwa lugha (speaking in tongues).
  Match the terms already used in the Swahili unit lessons where you can.
- Historical sources quoted in the readings and textbooks are old; translate them faithfully, including
  views CTS doesn't share. The CTS notes already frame those; translate the notes faithfully too.
- Never mention homosexuality or same-sex topics; if the source does, keep the CTS treatment as given and
  don't add anything. Marriage is stated positively as one man and one woman where it comes up.
- Never call Scripture's own narratives "myth" (hadithi za kubuni); use another word if needed.
- Women in ministry: translate the source and CTS notes as they are; don't add commentary.
- Don't include answers anywhere except private/keys.sw.json.
- No student data. Don't touch git, Drive, Gmail or the web; only write files under the output folder.

## Report back (under 12 lines)
Files written with word counts; total EN vs SW words; anything unfinished; any doubts worth a reviewer's look.

## Test items: no give-aways (learned from the pilot)
- Never add the English name in brackets after a Swahili name if the English contains the answer
  (e.g. "Umoja wa ______ wa Marekani (American Bible Union)" gives the answer away).
- No `accept_sw` alternate may appear in the question's own wording.
- Before reporting, run: python3 /home/claude/swahili-electives/tools/check-leaks.py COURSE
  and fix every item it lists.
