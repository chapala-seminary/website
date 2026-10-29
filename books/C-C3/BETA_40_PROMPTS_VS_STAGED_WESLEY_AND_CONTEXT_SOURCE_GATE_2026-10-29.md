# C-C3 — Beta 40-prompt versus staged Wesley source crosswalk

**Date:** 2026-10-29 (Mexico City)  
**Course:** Holiness, Sanctification, and Christian Perfection  
**Scope:** non-answer-bearing provenance audit only. No accepted answer, key, grade, or student record was inspected or changed.

## Verified inputs

- Beta public reading-test JSON: `src/content/readings/elecwesthreereadings.json`; 40 prompts, 8 per reading, EN/ES/FR/SW all 40/40; draw 20, pass 18, per-reading draw 4; requiredFrom 2026-10-28T06:00:00Z.
- Current beta reading room: `src/body/rooms/CTSElecWes3Readings.html`.
- Staged source manifest and five readings: `books/C-C3/SOURCE.md`, `reading-1.md` … `reading-5.md`.
- Source: John Wesley, *A Plain Account of Christian Perfection* (1777 revision), Thomas Jackson 1872 edition, vol. 11, via CCEL transcription. Scan collation remains pending.

## Result

- **35 DIRECT**: the staged excerpt contains the core fact needed by the prompt.
- **2 PARTIAL**: the staged excerpt contains the doctrinal/textual core, but the prompt also relies on CTS historical attribution or chronology.
- **3 CTS CONTEXT**: the prompt is supported by the current CTS digest, not by the assigned staged primary-source excerpt.
- Current room coverage is therefore not the same thing as primary-source provenance.
- All five readings are extracts from the staged textbook, not five independent works. Normalized 12-token containment in the textbook is R1 **97.5771%**, R2 **98.8425%**, R3 **98.7175%**, R4 **99.2999%**, R5 **97.9077%**. The small shortfall is dominated by file headers/provenance wrappers.

## Prompt-by-prompt source classification

| # | Reading | Class | Non-answer source locator |
|---:|:---:|:---|:---|
| 1 | R1 | DIRECT | §2 |
| 2 | R1 | DIRECT | §2 |
| 3 | R1 | DIRECT | §2 |
| 4 | R1 | DIRECT | §3 |
| 5 | R1 | DIRECT | §3 |
| 6 | R1 | DIRECT | §4 |
| 7 | R1 | CTS CONTEXT | Not in §§1–6; room digest adds Oxford nickname |
| 8 | R1 | CTS CONTEXT | Not in §§1–6; room digest adds 24 May 1738 event |
| 9 | R2 | DIRECT | §10 |
| 10 | R2 | DIRECT | §10 |
| 11 | R2 | DIRECT | §10 |
| 12 | R2 | DIRECT | §10 |
| 13 | R2 | DIRECT | §10 |
| 14 | R2 | DIRECT | §10 |
| 15 | R2 | DIRECT | §12 |
| 16 | R2 | DIRECT | §12 |
| 17 | R3 | DIRECT | §16 |
| 18 | R3 | PARTIAL | §17 attests conference discussion; exact first-conference date/place is digest context |
| 19 | R3 | DIRECT | §17 |
| 20 | R3 | DIRECT | §17 |
| 21 | R3 | DIRECT | §17 |
| 22 | R3 | DIRECT | §17 |
| 23 | R3 | PARTIAL | §16 attests phrase in quoted hymn; Charles-specific attribution is digest framing |
| 24 | R3 | DIRECT | §18 |
| 25 | R4 | DIRECT | §19 |
| 26 | R4 | DIRECT | §19 |
| 27 | R4 | DIRECT | §19 |
| 28 | R4 | DIRECT | §19 |
| 29 | R4 | DIRECT | §19 |
| 30 | R4 | DIRECT | §19 |
| 31 | R4 | DIRECT | §19 |
| 32 | R4 | DIRECT | §19 |
| 33 | R5 | DIRECT | §26 |
| 34 | R5 | DIRECT | §26 |
| 35 | R5 | DIRECT | §26 |
| 36 | R5 | DIRECT | §26 |
| 37 | R5 | CTS CONTEXT | Not in §§26–28; room digest supplies later controversy/date |
| 38 | R5 | DIRECT | §27 |
| 39 | R5 | DIRECT | §27 |
| 40 | R5 | CTS CONTEXT | Source contains final prayer language; Book of Common Prayer identification is digest context |

## Rights, translation, and academic gates

- Wesley died in 1791 and the represented Jackson edition is 1872; preliminary historical-source status is favorable, but the CCEL transcription has not yet been collated against the printed scan.
- CTS-authored EN/ES/FR digests and the public SW prompts require native-language academic review; this audit did not inspect private accepted variants.
- Faculty must choose and label one of two honest designs: (a) an integrated close-reading assessment of Wesley’s single work, with CTS-context prompts explicitly labeled, or (b) one Wesley textbook plus five genuinely independent readings. The present package is not design (b).
- Preserve existing student credits. Do not silently substitute sources or edit private keys before the faculty-approved source/version contract is fixed.

## Recommended fail-closed source contract

For every public prompt and private accepted variant, record without exposing answers: course code, reading number, source blob, exact section/page span, classification (`PRIMARY`, `CTS_CONTEXT`, or `MIXED`), prompt blob/version, and private-bank version. A source-hash change should require fresh provenance and answer-parity review before activation.
