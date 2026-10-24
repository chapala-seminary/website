# C-C4 — Methodist/Nazarene Polity: Historical Source Handoff

**Status:** a GitHub-transportable public-domain OCR package is now staged from the 1798 Coke–Asbury annotated discipline. The previously identified 1850 edition remains the preferred later historical comparison, but its scan hosts are blocked in Claude's workspace. **Do not publish or silently represent the 1798 text as modern Nazarene polity.**

## Staged transport package — 1798 Coke–Asbury edition

- **Title:** *The Doctrines and Discipline of the Methodist Episcopal Church in America, with explanatory notes*
- **Edition:** tenth edition, Philadelphia, Henry Tuckniss, 1798
- **Authors/editors:** Methodist Episcopal Church; explanatory notes by Thomas Coke (1747–1814) and Francis Asbury (1745–1816)
- **Source scan:** Internet Archive item `doctrinesanddis18churgoog`, Bodleian/Google Books scan
- **Source derivative:** the item's `_djvu.txt` OCR
- **Source rights marker:** `NOT_IN_COPYRIGHT`
- **Upstream GitHub mirror:** `mchadwick25-droid/CIC-Project`
- **Exact upstream path:** `cic/texts/methodist-episcopal-church_doctrines-and-discipline_coke-asbury1798.txt`
- **Upstream blob SHA:** `86ef5bcacf4b508fd8ed09aedac8e829f47574bf`
- **Recorded upstream raw-byte SHA-256:** `1f0627900b4c66ec21947c33ef8c5ab55d80fc8f8860e78bfd3d99357ff4d861`
- **Staged full OCR:** `textbook-ocr-1798.txt` — 421,830 characters; 74,861 tokenized words
- **OCR condition:** uncorrected long-s OCR with page noise and garbling. Suitable for fast-lane drafting and range construction, not final student release until collated.

### Five staged non-overlapping readings

All five bodies are exact contiguous byte-for-byte slices of the staged OCR source. Boundaries use visible section headings in the OCR; no answer keys are present.

| File | Topic and source boundary | Characters | Tokenized words |
|---|---|---:|---:|
| `reading-1-general-and-yearly-conferences.txt` | `SECTION IIL Of the General and Tearly Conferences` up to `SECTION IV` | 18,596 | 3,154 |
| `reading-2-episcopal-and-ordained-leadership.txt` | `SECTION IV` up to `SECTION VIII` | 52,179 | 9,070 |
| `reading-3-receiving-preachers-and-circuit-duty.txt` | `SECTION VIII` up to `SECTION XL` (OCR for XI) | 65,423 | 11,703 |
| `reading-4-ministerial-practice-and-accountability.txt` | `SECTION XL` through XVIII, ending before `SECTION XIX` | 62,577 | 11,296 |
| `reading-5-united-societies-and-membership-discipline.txt` | Chapter II `SECTION I. The Nature, Design, and general Rules` up to `SECTION IX. Of Slavery` | 78,752 | 14,095 |

Combined staged reading length: **49,318 tokenized words**. The readings omit the slavery section from the assigned sequence; the full OCR retains it for historical integrity and scholarly context. Any course treatment of the work must address its historical setting and contested social assumptions explicitly.

### Verification performed

- Re-fetched the upstream 421,830-character file through GitHub.
- Confirmed the source header identifies the 1798 edition, Coke and Asbury, the IA item and raw-byte checksum.
- Confirmed all five selections use ascending, non-overlapping source offsets.
- Recorded each staged file's character and tokenized-word counts at commit time.
- Kept exam answers and private assessment material out of this public handoff.

## Preferred 1850 historical comparison — scan links

The 1850 Methodist Episcopal discipline remains useful for later polity development and comparison. It is not yet transcribed here.

- Wikimedia/Emory metadata: https://commons.wikimedia.org/wiki/File:The_doctrines_and_discipline_of_the_Methodist_Episcopal_Church_(microform)_(IA_26977752.1850.emory.edu).pdf
- Direct scan: https://archive.org/download/26977752.1850.emory.edu/26977752_1850.pdf
- Internet Archive accession: https://archive.org/details/26977752.1850.emory.edu
- No Project Gutenberg ID has been verified for this exact 1850 edition.
- Gutenberg 66484 is the 1918 Colored Methodist Episcopal Church discipline of a distinct church and must not be substituted.

## Rights screen — not legal advice

The 1798 and 1850 originals are public domain in the United States. Coke died in 1814, Asbury in 1816, and the identified 1850 prefatory signatories all died before 1900; their identified contributions are beyond Mexico's life-plus-100 term. The staged 1798 file is an uncorrected mechanical OCR derivative whose own source header records `NOT_IN_COPYRIGHT`. The upstream repository has no root `LICENSE` file; this handoff relies only on the public-domain underlying work and factual provenance, not on reusable repository code or modern editorial content.

## Historical comparison shelf

1. [1798 Coke–Asbury OCR upstream path](https://github.com/mchadwick25-droid/CIC-Project/blob/main/cic/texts/methodist-episcopal-church_doctrines-and-discipline_coke-asbury1798.txt)
2. [1850 Emory edition](https://commons.wikimedia.org/wiki/File:The_doctrines_and_discipline_of_the_Methodist_Episcopal_Church_(microform)_(IA_26977752.1850.emory.edu).pdf)
3. [1848 Emory edition](https://commons.wikimedia.org/wiki/File:The_doctrines_and_discipline_of_the_Methodist_Episcopal_Church_(microform)_(IA_26977704.1848.emory.edu).pdf)
4. [1844 Emory edition](https://commons.wikimedia.org/wiki/File:The_doctrines_and_discipline_of_the_Methodist_Episcopal_Church_(microform)_(IA_26977660.1844.emory.edu).pdf)
5. [1828 Emory edition](https://commons.wikimedia.org/wiki/File:The_doctrines_and_discipline_of_the_Methodist_Episcopal_Church_(microform)_(IA_26971492.1828.emory.edu).pdf)
6. [1853 Open Library record](https://openlibrary.org/works/OL20943804W/The_doctrines_and_discipline_of_the_Methodist_Episcopal_Church)

## Claude handoff

Use the staged 1798 OCR immediately for transport-safe EN cleanup, source-range verification, ES/FR drafting and digests. Before final course release:

1. Decide academically whether C-C4's principal historical textbook should be the foundational 1798 Coke–Asbury edition, the later 1850 edition, or an explicitly labeled comparative reader.
2. Collate selected text against page images; normalize long-s OCR without changing meaning.
3. Record printed pages and SHA-256 values for final normalized artifacts.
4. Distinguish historical MEC governance from modern United Methodist, Wesleyan and Nazarene polity.
5. Create the 40-question textbook/reading banks only in private `assessment-keys`.
6. Obtain Wayne's academic approval. Do not deploy from this handoff branch.
