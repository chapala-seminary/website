# Staged textbook (full-book) exams: review only, NOT installed

These are three bilingual 40-question banks by ChatGPT (10 Oct 2026), one for each of the first three full English textbooks, now in `public/textbooks/`. Each bank has five chapter groups of eight questions; a test draws four from each group (20 in all), and 18 correct answers are needed to pass. They test the commentary, and are kept separate from the CTS-digest reading tests.

| Course | Book | Bank | Assigned chapters |
|---|---|---|---|
| Joshua | Blaikie (PG 42319) | `joshua-blaikie.bank.v3.json` | I–III, X–XI, XVIII–XX, XXI–XXVI, XXX–XXXIII |
| Galatians | Findlay (PG 42645) | `galatians-findlay.bank.v1a.json` | IV; X; XIV, XVI; XXII, XXV; XXVI, XXVII |
| Romans | Moule (PG 48858) | `romans-moule.bank.v1.json` | III, VIII; IX, XII; XIV, XVII; XX, XXIV; XXV, XXIX |

Check (read-only): `node tools/verify-exam-separation.mjs <bank> src/data/readings/<course>readings.bank.json public/textbooks/<book>.html`. All three pass. Every quoted sentence is found in its stated chapter, and no primary answer repeats a digest answer. Source ledgers are in `docs/textbooks-staged/`.

**Not installable yet:** the assigned chapters have no Spanish translation. The banks stay here, inactive, until the Spanish chapters are online and faculty approve.
