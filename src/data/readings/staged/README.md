# Staged reading-test banks: faculty review only, NOT installed

These are eight bilingual five-reading banks prepared by ChatGPT on 10 Oct 2026, staged for review. Each bank has 40 questions: eight on each of the course's five CTS reading digests. A test draws four from each reading (20 in all), and 18 correct answers are needed to pass. These are tests on the digests and do not replace any textbook test.

| Course | Card ID | Completion code | Proposed test page | Bank |
|---|---|---|---|---|
| Old Testament Survey | `CTS` | `CTSOTS` | `CTSOTSReadingsTest.html` | `otsreadings` |
| New Testament Survey | `CTSNT` | `CTSNT` | `CTSNTReadingsTest.html` | `ntreadings` |
| Systematic Theology | `CTSST` | `CTSST` | `CTSSTReadingsTest.html` | `streadings` |
| Evangelism | `CTSEvangelism` | `CTSEVANGELISM` | `CTSEvangelismReadingsTest.html` | `evangelismreadings` |
| Pastoral Ministries | `CTSPM` | `CTSPM` | `CTSPMReadingsTest.html` | `pmreadings` |
| Church History | `CTSCH` | `CTSCH` | `CTSCHReadingsTest.html` | `chreadings` |
| WiseSpeak / Preaching | `CTS_WiseSpeak_Preaching` | `WISESPEAK` | `CTSPreachingReadingsTest.html` | `wisespeakreadings` |
| Hermeneutics | `CTSHermeneutics` | `CTSHERMENEUTICS` | `CTSHermeneuticsReadingsTest.html` | `hermeneuticsreadings` |

- `academic_manifest.json`: status `DRAFT_NEEDS_FACULTY_REVIEW`, `requiredFrom: null`, and the SHA-256 of each delivered file.
- Faculty notes and answer ledgers are in `docs/readings-staged/`.
- To check: run `node tools/verify-staged-readings.mjs`. It is read-only. It checks shape, inactive status and the hashes, and confirms that every primary answer appears in the reading room in both languages.
- 299 of the 320 questions still need faculty-approved accepted answers. Do not invent synonyms.
- **Do not** add these banks to `tools/import-readings.mjs` or run its `--write` until faculty approve, course by course.
