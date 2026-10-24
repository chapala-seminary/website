# Denominational electives

_24 Oct 2026._ There are twenty interim electives, five for each of four traditions:

| Group | Courses | Page prefix | Drive code |
|---|---|---|---|
| Pentecostal–Charismatic | 5 | `CTSElecPC1`–`5` | A-C1–A-C5 |
| Baptist–Congregational | 5 | `CTSElecBap1`–`5` | B-C1–B-C5 |
| Methodist–Wesleyan–Nazarene | 5 | `CTSElecWes1`–`5` | C-C1–C-C5 |
| Reformed–Presbyterian | 5 | `CTSElecRef1`–`5` | D-C1–D-C5 |

Each course has 10 units in English, Spanish and French. The Spanish and French are marked as machine translations. The short names (`elecpc1` …) and completion codes (`CTSELECPC1` …) are permanent.

**Credit.** Wayne's decision of 23 Oct 2026: every one of the twenty earns full elective credit toward every CTS degree, Reformed courses included. The degree rules count a new course as an elective without any change. Like every course outside the foundation, these stay locked until a student finishes the seven foundation courses. Each lesson page says it is an interim edition that counts toward degrees like any other course, and that lecture material from faculty of the tradition will be added.

## Where the answer keys are

The keys for these exams are **not** in this repository.

- `src/content/units-public/<Prefix>/<n>.json` holds the questions without keys.
- The private repository `chapala-seminary/assessment-keys` holds the keys in `units/<Prefix>/<n>.json`.
- `tools/private-units.mjs` runs before every build (`prebuild`) and before both deploy scripts. It merges the two into `src/content/units/<Prefix>/<n>.json`, which `.gitignore` excludes. Everything else (the engine, grading-key sync, tests) reads that merged file as it does for any other course.
- The tool stops the build if:
  - a public file carries a key field;
  - the counts don't match;
  - a key file is missing;
  - `.gitignore` doesn't list the merged folder.

  `test/run-tests.sh` runs it with `--check`.
- `tools/content-baseline.mjs` records these courses without answer data.

Locally, check out `assessment-keys` beside this repository (`../assessment-keys`) or set `ASSESSMENT_KEYS`. CI reads the `main` branch of `assessment-keys`.

The editor (Sveltia CMS) shows the lessons of these courses but not their exams, because the merged exam files are not in git. Edit the exam keys in `assessment-keys`.

## Rebuilding from the sources

The Drive exports are in `assessment-keys/sources/denominational/<CODE>/U<n>-<lang>-<lesson|exam>.md`, with a `manifest.tsv` of Drive file IDs.

```sh
node tools/import-electives.mjs ../assessment-keys/sources/denominational ../assessment-keys          # report only
node tools/import-electives.mjs ../assessment-keys/sources/denominational ../assessment-keys --write  # write
```

It writes:
- the course cards;
- the lessons;
- the public question files;
- the private key files;
- the certificate pages;
- the catalog groups;
- the `.gitignore` lines.

It refuses a language in a unit if:
- the language's multiple-choice answer key differs from the English key;
- its lesson paragraphs don't pair with the English ones.

Afterwards:
- regenerate the worker catalog, certificate names and CMS config, as for any course (`docs/adding-a-course.md` step 7);
- then run `node tools/content-baseline.mjs --check`.
