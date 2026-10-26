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
| **B-C4** | Manifest says Broadus `textbook.md` combines all five readings, but measured containment is **mixed**: R1 77.70%, R2 1.12%, R3 42.35%, R4 40.07%, R5 99.94%. The manifest/file relationship is therefore inconsistent. | Reconcile manifest to exact files before any source or assessment decision; do not classify as uniform duplication. |
| **B-C5** | Carey sections are uniformly contained: **97.82%, 99.36%, 98.97%, 98.48%, 98.59%**; reading-to-reading overlap is nearly zero. | Replace or academically redefine the separate reading requirement. |
| **C-C2** | Wesley reading pairs are uniformly contained: **99.86%, 99.93%, 99.90%, 99.87%, 99.91%**; pairwise reading overlap max 0.36%. | Independent companion sources or single integrated exam; Wayne decision. |
| **D-C3** | Westminster readings are uniformly contained: **99.11%, 98.99%, 98.89%, 99.36%, 99.06%**; each of all ten reading pairs shares 48 exact 12-word shingles. | Avoid treating the split confession as an independent reading source. |
| **D-C4** | Presbyterian polity readings are uniformly contained: **97.85%, 98.44%, 96.42%, 95.52%, 96.73%**; pairwise reading overlap max 0.49%. | Additional independent historical voices required if a distinct reading test is mandatory. |
| **D-C5** | Baxter selections are uniformly contained: **99.57%, 99.58%, 99.60%, 99.59%, 99.48%**; pairwise reading overlap max 0.26%. | Find independent sources if a distinct reading assessment is required. |
| **B-C2** | Measured **0.00%, 0.00%, 0.00%, 0.00%, 0.12%** textbook containment; pairwise reading overlap max 0.37%. Confirmed category B: disjoint passages from one Dagg work, not duplicate text and not independent voices. | Wayne decides whether deliberate same-work close reading meets the course purpose or five distinct Baptist voices are required. |
| **A-C1** | Azusa source reader and periodical readings partly share the same issues; signed contributors and Mexico rights remain held. | Contributor-level rights and exact overlap, not blanket periodical clearance. |
| **C-C3, C-C4** | Staged complete work/OCR plus five nonoverlapping sections from the same work. **Likely containment**, not measured. | Run exact shingle check before describing as independent. |
| **A-C2, A-C3, A-C4, A-C5, C-C1, C-C5, D-C1, D-C2** | Source corpora, proposals or provisional extracts; final textbook/reading pairs and full QA are **not complete**. | First finalize page-collated excerpts; then test independence and rights. |

## Consolidated eight-course measurement result

All eight manifest-risk courses have now been measured with the same report-only exact-word-sequence method. **Seven** (B-C1, B-C3, B-C5, C-C2, D-C3, D-C4, D-C5) show consistently broad textbook-to-reading containment across all five readings. **B-C4 is different:** only R5 is near-total, R1 is partial, R3–R4 are mixed, and R2 is essentially absent, contradicting the manifest's blanket “combined readings” description. Evidence reports: [B-C4](B-C4/CURRENT_READING_INDEPENDENCE_AUDIT.md), [B-C5](B-C5/INDEPENDENCE_AND_FIVE_VOICE_REPLACEMENT_GATE.md), [C-C2](C-C2/CURRENT_READING_INDEPENDENCE_AUDIT.md), [D-C3](D-C3/INDEPENDENCE_AND_FIVE_VOICE_GATE.md), [D-C4](D-C4/CURRENT_READING_INDEPENDENCE_AUDIT.md), and [D-C5](D-C5/INDEPENDENCE_AND_FIVE_VOICE_GATE.md).

The other eleven still require individual classification; **do not generalize these results to them**. C-C3/C-C4 appear to use separate passages from one work but remain unmeasured; A-C1 still needs contributor-level rights and exact-overlap review; the remaining eight are not source-complete. B-C2 is now measured separately in [its audit](B-C2/CURRENT_READING_INDEPENDENCE_AUDIT.md).

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
1. Require three separate evidence axes for every course: textbook-to-reading containment, reading-to-reading overlap, and manifest-to-file consistency. Record `course_id`, exact source `textbook.md` blob SHA, five reading blob SHAs, author/edition, passage boundaries, 10- and 12-word shingle containment percentages, longest exact run, and reviewed quotation exceptions. Use a report-only script on nonproduction content.
2. Mark **A** = independent authors/work and low overlap; **B** = same work, disjoint passages; **C** = readings contained in textbook; **D** = unready/missing source; **R** = contributor or translation rights hold. Categories are evidence labels, **not** automatic academic approvals.
3. For **C**, do not build a second nominally independent 40-question reading bank from identical text. Present Wayne with either genuinely independent readings or an explicitly integrated, nonduplicative assessment policy. The existing Master's requirement must not be silently changed.
4. For **B**, an academic reviewer decides whether separate passages from the same work meet learning outcomes; numerical disjointness alone is not enough.
5. Verify all original U.S./Mexico rights and modern edition/translation/provider restrictions per passage, not just per author. No student-facing release before approval.
6. Keep all assessment answer keys in private `assessment-keys`; do not place keys, student records, grades, or secret tokens in public issues, this file or the coordination sheet. Migration must preserve previously valid completions.
7. Gate public release on a **course-level evidence bundle**: original scan + printed pages + SHA-256 + exact word counts + five independent learning objectives + ES/FR translation audit + private bank consistency test + Wayne's exact-version approval.

## Strategic student-experience opportunity
Use **one source provenance card per reading** (author, year, tradition, original page span, why it differs from textbook, 1–2 questions for comparison) in EN/ES/FR. This makes historically different voices visible to students, reduces duplicated work, and improves course quality without lengthening lessons. First pilot in B-C1/B-C3; no student-facing change until approved.

**Status:** all 20 manifests read; all eight manifest-risk courses measured, plus B-C2. Seven show consistent broad containment; B-C4 shows mixed containment plus a manifest/file inconsistency; B-C2 shows disjoint same-work passages. Eleven courses remain unmeasured, preliminary or source-incomplete. No live-course audit, copyright clearance, new private banks, student correspondence or production changes performed.
