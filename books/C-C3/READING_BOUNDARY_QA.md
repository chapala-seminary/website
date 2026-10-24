# C-C3 — Independent reading-boundary and completeness QA (24 October 2026)

**Scope:** The six staged Markdown files on `handoff/book-sources` were fetched through GitHub and checked against each other. This is an **internal transcription-extraction check only**, not an original-scan collation, independent historical-text verification, translation approval, or publication clearance.

## Results

After excluding the Markdown title and source-note preamble (first four lines) from each file, the five reading bodies each match an **exact, contiguous substring** of the staged `textbook.md` body. The matches require **no whitespace normalization or fuzzy matching**.

| Reading | Body words | Start character offset in textbook body (zero-based) | Exact contiguous match | Order / overlap |
| --- | ---: | ---: | --- | --- |
| 1 — Formation, §§1–6 | 1,319 | 0 | PASS | ordered, no overlap |
| 2 — First tract, §§10–12 | 3,501 | 10,195 | PASS | ordered, no overlap |
| 3 — Hymns and conference, §§16–18 | 3,044 | 44,855 | PASS | ordered, no overlap |
| 4 — 1759 conference, §19 | 5,373 | 61,348 | PASS | ordered, no overlap |
| 5 — Mature summary, §§26–28 | 1,821 | 172,801 | PASS | ordered, no overlap |

The staged textbook body has **33,777 words**; the five assigned reading bodies total **15,058 words**. Each reading has at least 1,300 words, satisfying a basic length screen. This does not establish reading-level pedagogical adequacy.

## Reproduction / limitations

Fetch `books/C-C3/textbook.md` and `reading-1.md` through `reading-5.md` from the **same branch revision**. For each file, split on newline, remove the first four lines (title, blank, provenance note, blank), join the remainder with newline and trim. Compute `textbookBody.indexOf(readingBody)` and count words with `body.split(/\\s+/).length`. Check that each start offset exceeds the preceding reading's end offset. This test verifies only that the **staged** readings faithfully reproduce portions of the **staged** textbook. Shared errors in both files would pass.

**Still required before release:** compare the 1872 Jackson-edition source scan with the underlying CCEL transcription, record corrections and edition variations, verify ES/FR translations and digests against the corrected English source, inspect private question banks for key/answer consistency, and obtain academic publication approval. Do not treat this note as a legal or academic approval. No answer keys, student data, or privileged content are included.
