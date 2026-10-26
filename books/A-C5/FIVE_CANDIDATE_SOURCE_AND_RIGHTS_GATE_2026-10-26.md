# A-C5 — five candidate source map and rights/workload gate

**Independent source-corpus audit | 2026-10-26 | research branch only**

## Scope and result

The six staged *Apostolic Faith* issue transcripts (Nos. 8–13) were read from exact GitHub blobs. Five candidate windows were selected for the proposed A-C5 learning themes and measured without publishing a textbook, translations, or assessment keys.

The official Apostolic Faith archive separately lists **original facsimiles** and **modern reproductions** for issues 8–13: https://www.apostolicfaith.org/library/azusa-papers . The staged text derives from the readable reproductions, not from a completed original-facsimile collation.

**Result:** the five candidate windows total **3,411 normalized words**. All ten candidate-to-candidate comparisons share **zero exact unique 12-word sequences**, so the windows are textually distinct. That does **not** make them five independent works or rights-cleared readings: all come from one periodical, three are composite multi-voice reports, and two are anonymous/institutional editorial blocks.

No A-C5 textbook is staged, so textbook-to-reading independence cannot yet be tested. A-C5 remains **source-incomplete with contributor/edition rights holds**, not student-ready.

## Exact candidate map

| Candidate | Issue and heading | UTF-16 source window | Normalized words | Exact source blob | Contributor/rights status |
|---|---|---:|---:|---|---|
| R1 — cross-cultural/regional mission reports | Issue 11, **“PENTECOST SPREADS TO OTHER LANDS”** | `[300,6153)` | **1,000** | `4ba5ac1883a4c1d71faa03dd18d8918ac58ca8d0` | Composite report with named and unnamed voices from several countries; not a single-author reading. |
| R2 — congregational leadership and accountability | Issue 8, **“AT AZUSA MISSION”** | `[27790,30859)` | **543** | `110e83d64c13ec2ba1cf54e24b07444e44c75804` | Anonymous editorial/reporting voice; original page boundary and editorial responsibility unresolved. |
| R3 — missionary commissioning and correspondence | Issue 11, **“PENTECOSTAL MISSIONARY REPORTS”** | `[15543,18989)` | **603** | `4ba5ac1883a4c1d71faa03dd18d8918ac58ca8d0` | Composite of editorial narration plus named missionary correspondence; window includes reproduction page-seam material requiring trimming/collation. |
| R4 — organizational publishing and financial practice | Issue 12, **“THE APOSTOLIC FAITH MISSION”** publication block | `[19223,22594)` | **607** | `5ef43a13e6e6bebef3682b397fa73f928eb12054` | Institutional/anonymous editorial explicitly states that no editor name was printed; authorship and collective/anonymous-work status unresolved. |
| R5 — travel, church planting, and missionary correspondence | Issue 13, **“THE LORD IS SENDING MISSIONARIES”** | `[59071,62807)` | **658** | `7aedd4c62e54e4d9f350ee1c56615cb45decb3d9` | Composite item containing several named correspondents and editorial bridges; contributor-by-contributor rights review required. |

Offsets are zero-based and end-exclusive in the exact staged blobs. Counts use lowercase ASCII-alphanumeric normalization with URLs and punctuation removed. They are reproducible audit counts, not final printed-page counts.

## Independence and workload findings

- Pairwise exact unique 12-word overlap: **0 across all 10 pairs**.
- Total candidate workload: **3,411 normalized words**, before introductions, annotations, and study questions.
- R2–R5 are only **543–658 words** each. They may be useful primary-source excerpts, but their academic sufficiency as “substantive readings” requires Wayne/editorial review.
- R1 and R3 are different windows in the same issue; all five remain from a single periodical ecosystem.
- Several windows mix editorial narration, quotations, letters, testimony, and reports. A heading boundary is not proof of one author or one rights holder.
- Reports of travel, conversions, healing, languages, or attendance are primary-source claims and must be presented as such, not as independently verified facts.

## Required completion gates

1. Open the original facsimiles for issues 8, 11, 12, and 13 and record exact original page/column boundaries, signatures, omissions, and reproduction/OCR differences.
2. Build a contributor register for every retained paragraph and quotation. Verify authorship, death dates or permissions, modern reproduction restrictions, and Mexico use/translation status; this report makes no legal clearance decision.
3. Trim page headers, URLs, reproduction marks, and adjacent material from the candidate windows. Recalculate counts and hashes after collation.
4. Decide whether one-periodical, multi-voice close reading meets the course design or whether independent works/authors are required.
5. Create an original CTS English textbook or coursebook distinct from the readings, then rerun textbook-to-reading containment and reading-to-reading overlap.
6. Only after exact-version academic and rights approval, prepare EN/ES/FR student materials and private 40-question banks. Keep answer keys in private `assessment-keys`.

## Release posture

**HOLD.** This map saves source-location work and establishes a realistic preliminary workload, but it is not a five-reading approval, copyright clearance, translation authorization, textbook completion, assessment bank, or production release. No grades, student records, keys, merge, or deployment were changed.
