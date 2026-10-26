# Twenty denominational electives — textbook/reading independence release gate
**Independent strategic and source-manifest audit | 2026-10-26 | research branch only**

## Critical distinction
Five *non-overlapping chapters* do not necessarily constitute five *independent companion readings*. If `textbook.md` is assembled from those five chapters, a separate reading exam may simply retest the same content. This is an **academic design and assessment-validity risk**, not proof that a student cheated or that a completed award is invalid. Preserve earlier valid completions. Do not make policy or release changes without Wayne.

## Verified source-manifest observations
Read the `SOURCE.md` manifests for all **20** courses on `handoff/book-sources` on 2026-10-26. The following are **manifest descriptions of staged files**, not a 20-course quantitative text overlap test or a claim about the live website.

| Course(s) | Documented staging relationship | Next action |
|---|---|---|
| **B-C1** | Armitage textbook **contains the same five reading passages**; fresh 12-word-shingle containment **98.41%–99.44%** across all five; new five-author research candidates in `B-C1/INDEPENDENT_READING_CANDIDATES.md`. | Choose and collate distinct authors; hold separate bank. |
| **B-C3** | Hiscox five readings are **textbook slices**; a reproducible 12-word-shingle file audit measured **98.90–99.99%** matched reading shingles. | Five independent-author historical candidates already proposed; exact excerpts and approval pending. |
| **B-C4** | Broadus `textbook.md` expressly described as **combined five selected readings** (about 90,024 words). | Seek five distinct companion readings and reassess student workload. |
| **B-C5** | Carey `textbook.md` includes Introduction + Sections I–V; five readings are **those same five sections**. | Replace or academically redefine the separate reading requirement. |
| **C-C2** | Wesley `textbook.md` holds Sermons I–X; five readings are pairs I–II, III–IV, etc., explicitly derived from textbook. | Independent companion sources or single integrated exam; Wayne decision. |
| **D-C3** | Westminster Confession `textbook.md` includes all 33 chapters; five readings cover chapters 1–33 exactly once. | Avoid treating the split confession as an independent reading source. |
| **D-C4** | Presbyterian polity `textbook.md` contains all 19 sections; five readings cover the same 19 sections exactly once. | Additional independent historical voices required if a distinct reading test is mandatory. |
| **D-C5** | Baxter `textbook.md` is a complete upstream source; five reading blocks are selections from it. | Verify exact containment and find independent sources. |
| **B-C2** | Dagg textbook is Books I/IV/VI; five readings are **different nonoverlapping sections** from the same larger work. This is **not established duplicate text** but still one author. | Confirm with shingle audit; Wayne decides whether distinct passages satisfy independence. |
| **A-C1** | Azusa source reader and periodical readings partly share the same issues; signed contributors and Mexico rights remain held. | Contributor-level rights and exact overlap, not blanket periodical clearance. |
| **C-C3, C-C4** | Staged complete work/OCR plus five nonoverlapping sections from the same work. **Likely containment**, not measured. | Run exact shingle check before describing as independent. |
| **A-C2, A-C3, A-C4, A-C5, C-C1, C-C5, D-C1, D-C2** | Source corpora, proposals or provisional extracts; final textbook/reading pairs and full QA are **not complete**. | First finalize page-collated excerpts; then test independence and rights. |

**At least eight courses** (B-C1, B-C3, B-C4, B-C5, C-C2, D-C3, D-C4, D-C5) explicitly describe a textbook assembled from or containing the five readings. The other twelve need individual classification; **do not generalize B-C1/B-C3 measured overlap to them**.

## New independent B-C1 quantitative audit (2026-10-26)
Fetched six exact `handoff/book-sources/books/B-C1` blobs using the GitHub AI account, normalized to lowercase ASCII words by removing Markdown links/tags and punctuation, built the set of every 12-word contiguous sequence in `textbook.md`, and counted reading sequences present in that set. These are **exact word-sequence matches**, not fuzzy semantic overlap. The B-C1 textbook has blob SHA `8acde3d20e7b76c759050a24aef29343079d35f7`.

| B-C1 reading | Source blob SHA | Normalized words | Matched 12-word shingles / total | Containment | Longest exact word run |
|---|---|---:|---:|---:|---:|
| 1 | `829205ade5a684aa8f4f0c210fa23ebcdbae0b86` | 6,229 | 6,154 / 6,218 | **98.97%** | 6,165 |
| 2 | `1ccb63471a291104abe5d4edbc654f1a6e489dd3` | 4,092 | 4,016 / 4,081 | **98.41%** | 4,027 |
| 3 | `65c059f8a8ad1d02616aa7cf42254171cb97c669` | 11,351 | 11,276 / 11,340 | **99.44%** | 11,287 |
| 4 | `5bb0cdde76089f2253daf464c9eb871273113b93` | 7,443 | 7,365 / 7,432 | **99.10%** | 7,376 |
| 5 | `a8053f66a974298ae9248e5913e3673ebceb0f99` | 7,486 | 7,412 / 7,475 | **99.16%** | 7,423 |

Nearly all unmatched text is front matter/provenance. These figures substantiate the **staged B-C1** duplication; they do not prove the published site or student exam currently contains the same text. No grades, policies or files were changed.

## Release-quality gate proposed for Claude/Robert (reversible, no policy change)
1. Record `course_id`, exact source `textbook.md` blob SHA, five reading blob SHAs, author/edition, passage boundaries, 10- and 12-word shingle containment percentages, longest exact run, and reviewed quotation exceptions. Use a report-only script on nonproduction content.
2. Mark **A** = independent authors/work and low overlap; **B** = same work, disjoint passages; **C** = readings contained in textbook; **D** = unready/missing source; **R** = contributor or translation rights hold. Categories are evidence labels, **not** automatic academic approvals.
3. For **C**, do not build a second nominally independent 40-question reading bank from identical text. Present Wayne with either genuinely independent readings or an explicitly integrated, nonduplicative assessment policy. The existing Master's requirement must not be silently changed.
4. For **B**, an academic reviewer decides whether separate passages from the same work meet learning outcomes; numerical disjointness alone is not enough.
5. Verify all original U.S./Mexico rights and modern edition/translation/provider restrictions per passage, not just per author. No student-facing release before approval.
6. Keep all assessment answer keys in private `assessment-keys`; do not place keys, student records, grades, or secret tokens in public issues, this file or the coordination sheet. Migration must preserve previously valid completions.
7. Gate public release on a **course-level evidence bundle**: original scan + printed pages + SHA-256 + exact word counts + five independent learning objectives + ES/FR translation audit + private bank consistency test + Wayne's exact-version approval.

## Strategic student-experience opportunity
Use **one source provenance card per reading** (author, year, tradition, original page span, why it differs from textbook, 1–2 questions for comparison) in EN/ES/FR. This makes historically different voices visible to students, reduces duplicated work, and improves course quality without lengthening lessons. First pilot in B-C1/B-C3; no student-facing change until approved.

**Status:** 20 manifest files read; eight self-described containment cases identified; B-C1 and B-C3 measured independently. No full 20-course overlap percentages, live-course audit, copyright clearance, new private banks, student correspondence or production changes performed.
