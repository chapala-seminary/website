# Swahili (Kiswahili)

Swahili is the site's fourth language (Dr. Cook, 27 Oct 2026). Students read
the courses and take the tests at `/sw/<same file>`, the same way French uses
`/fr/`. Every English, Spanish and French page, address and grade is
unchanged.

Swahili is the first language added as **data** rather than written into the
layouts beside the English. A later language can follow the same steps.

## Where things are

| What | Where |
| --- | --- |
| The list of site languages | `src/lib/languages.mjs` |
| Interface words (buttons, exam labels, registration, certificates, notices) | `src/data/interface/sw.json` |
| Course text (lessons, questions) | the lesson and question files, field `sw`, as for French |
| Answer keys (`answer`, `accept`, `keywords`, `model`) | the private assessment-keys repo only |
| Reading-room digests in Swahili | `src/data/interface/rooms/sw/<Page>.json` |
| The packets the Swahili came from | assessment-keys `review/swahili/` |

### Interface words

`src/data/interface/sw.json` maps the English wording to Swahili. The build
uses it twice: on the page frame when it builds `/sw/` pages
(`tools/language-dictionary.mjs`), and in the browser for the messages the
exam scripts put together while a student works (`/assets/js/cts-ui-sw.js`,
written by the build). A number in the English is a slot: `"Unit {0}":
"Sehemu ya {0}"` covers every unit. `{0}`, `{1}` stand for any other text too.
Section names (`frame`, `exam`, `courses` ...) are only for people editing the
file. `@course` gives each course's Swahili title, `@notice` the notices.

After each build, `.astro/interface-missing-sw.json` lists frame text that
still shows in English. It is a to-do list, not an error.

Program names are fixed (archive `PROGRAM-NAMES.md`, 20 Oct 2026):
Certificate = Cheti; Associate = Shahada ya Mshiriki; Th.M. = Shahada ya
Uzamili ya Teolojia (Th.M.); M.Div. = Shahada ya Uzamili ya Huduma ya Kiungu
(M.Div.). A unit is "Sehemu ya N".

### Notes students see

- A page whose Swahili is missing shows the English with: "Maandishi haya bado
  hayajatafsiriwa kwa Kiswahili; yanaonyeshwa kwa Kiingereza." It never shows
  a broken page. Where the page asks questions, it adds that answers may be
  given in English.
- A lesson that is only partly in Swahili says so, and shows those parts in
  English.
- An imported translation is a draft (`tr.sw.status: machine`). The page says
  it is published for review and offers "Onyesha Kiingereza" (show English).
- Swahili pages are `noindex` until the translation is reviewed.

### Grading

- A Swahili page accepts the Swahili answer and its alternatives, and the
  English answer (the source), on the server (`worker/grading/text.js`) and in
  the browser engine.
- An apostrophe inside a word (`ng'ombe`) may be typed straight, curly or left
  out: all are the same answer. This rule applies to Swahili only.
- Noun-class prefixes are part of the word: `mitume` is not `mtume`.
  Swahili has no accents to fold.
- Multiple choice is graded by option position, shared by all languages. The
  importer puts the Swahili options in the site's English order, so the key
  stays the key.
- Written answers are graded by the same AI grader, told the answer is in
  Swahili.

## Importing courses

### Core courses (packets)

A packet is two JSON files per unit: `<Course>-unit<N>-source.json` (the
English it was translated from) and `<Course>-unit<N>-sw.json` (the Swahili).
The 45-course archive `CTS_Swahili_source_and_tools.zip` is in this form; its
packets are kept in assessment-keys `review/swahili/core/` (they hold answers).

```sh
export ASSESSMENT_KEYS=../assessment-keys      # the private keys checkout
node tools/import-language.mjs --lang sw --from $ASSESSMENT_KEYS/review/swahili/core \
  --key-fix <keys>/review/swahili/key-fix.json \
  --report $ASSESSMENT_KEYS/review/swahili/import-report.json   # check only; the report names keys, so it stays private
node tools/import-language.mjs ... --write               # then write
npm run build && test/run-tests.sh
```

It stops, writing nothing, if a block or question is missing or malformed.
Where the site's English changed after the packet was made, that item stays
in English (with the pending note) and the report lists it. `--key-fix`
holds the translators' corrections to multiple-choice keys
(`frprint/build_sw.py` `KEY_FIX`); the report says, for each, whether the
site's key already agrees. The site's key is never changed by an import.

### Electives

The units come from the Swahili Google Docs, exported as Markdown into
assessment-keys `sources/denominational/<CODE>/U<n>-sw-lesson.md` and
`U<n>-sw-exam.md` (as for English, Spanish and French). Turn them into
packets, then import as above:

```sh
node tools/elective-packets.mjs --lang sw --sources <keys>/sources/denominational \
  --out <keys>/review/swahili/electives B-C2 B-C3
node tools/import-language.mjs --lang sw --from <keys>/review/swahili/electives --write
```

The textbook, its test, the reading test and the five reading-room digests
come from the handoff (website branch `handoff/swahili-electives`,
`translations/sw/electives/<CODE>/`) and the key file (assessment-keys branch
`swahili-electives`, `translations/sw/electives/<CODE>.keys.sw.json`):

```sh
node tools/import-language-books.mjs --lang sw --code B-C2 \
  --from <dir with textbook.sw.md, textbook-test.sw.md, readings-test.sw.md, readings.sw.md> \
  --keys-file <CODE>.keys.sw.json --write
```

It checks that every English answer in the key file is the site's and that
the book has as many paragraphs as the English.

## Adding another language later

1. Add its code to `SITE_LANGUAGES` in `src/lib/languages.mjs`, with its name,
   the word for "English" in it, and its locale.
2. Copy `src/data/interface/sw.json` to `<code>.json` and translate it.
3. Add its frame words for electives to `FRAME` in `tools/elective-packets.mjs`.
4. Import its packets as above.
