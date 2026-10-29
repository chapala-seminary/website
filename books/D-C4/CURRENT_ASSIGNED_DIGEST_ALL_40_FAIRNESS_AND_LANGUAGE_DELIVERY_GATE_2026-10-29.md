# D-C4 — all 40 public prompts versus current assigned digests, with language-delivery gate

**Research-only; 29 October 2026. No private answers, student records, grades, credits, policy, or production changed.**

## Executive finding

The current main and beta public reading-bank files are identical and the current main and beta reading-room bodies are identical. All **40/40** public English prompt topics and blank-bearing clauses have a witness in the assigned current CTS digest section: **37 direct assigned-digest witnesses** and **3 CTS-context witnesses** (Q1 historical introduction, Q13 etymology, Q36 communion-token history). Therefore the previously documented R4/R5 mismatch applies to the *older staged Form-only research files*, not to the five digests actually assigned to students.

A separate language-delivery gate remains open. The public bank contains **40/40 prompt stems in EN/ES/FR/SW**, but the checked room source contains full digest blocks only in English and Spanish. It has no `lang-sw` digest block and only five `lang-fr` occurrences associated with controls/attestation rather than five full French digests. The live page nevertheless says the digests are available in English, Spanish and French and exposes Français/Kiswahili controls. The live test says answers may be submitted in English or Spanish only. Do not infer French or Swahili instructional/grading parity from multilingual prompt fields.

## Exact inspected evidence

- Public bank: `src/content/readings/elecreffourreadings.json`, main and beta byte-identical in this inspection; prior verified blob `ce621d71dee9d8a8a8645ae1c53167c3e443d56e`; `requiredFrom: 2026-10-28T06:00:00Z`; draw 20, pass 18, four from each reading; keys marked `private`.
- Assigned room: `src/body/rooms/CTSElecRef4Readings.html`, main and beta byte-identical in this inspection; prior verified blob `cbf6377fe988ae7faacb80a57820d1a3849d6782`.
- Live reading room: https://chapalaseminary.org/CTSElecRef4Readings.html
- Live required-reading test: https://chapalaseminary.org/CTSElecRef4ReadingsTest.html
- Earlier source-identity report: `books/D-C4/BETA_40_PROMPT_SOURCE_IDENTITY_AND_TRILINGUAL_GATE_2026-10-28.md`.
- Older staged-source integrity files remain research evidence, not the current student-assigned R4/R5.

## Complete non-answer register

This table intentionally records only public prompt provenance. It does not reproduce accepted answers, aliases, explanations, or grading logic.

| Q | Current assigned digest locus | Classification |
|---:|---|---|
| 1 | R1 §1 — An Assembly at Westminster | CTS-context witness |
| 2 | R1 §2 — Christ, upon Whose Shoulders the Government Is | Direct assigned-digest witness |
| 3 | R1 §4 — Officers Who Ceased, Officers Who Remain | Direct assigned-digest witness |
| 4 | R1 §5 — The Pastor’s Work, and the Teacher or Doctor | Direct assigned-digest witness |
| 5 | R1 §5 — The Pastor’s Work, and the Teacher or Doctor | Direct assigned-digest witness |
| 6 | R1 §5 — The Pastor’s Work, and the Teacher or Doctor | Direct assigned-digest witness |
| 7 | R1 §6 — Elders and Deacons | Direct assigned-digest witness |
| 8 | R1 §6 — Elders and Deacons | Direct assigned-digest witness |
| 9 | R2 §1 — Why Fixed Congregations? | Direct assigned-digest witness |
| 10 | R2 §2 — The Officers of a Congregation and Their Meeting | Direct assigned-digest witness |
| 11 | R2 §3 — The Ordinances of Worship | Direct assigned-digest witness |
| 12 | R2 §4 — The Keys and Three Kinds of Assemblies | Direct assigned-digest witness |
| 13 | R2 §4 — The Keys and Three Kinds of Assemblies | CTS-context witness |
| 14 | R2 §5 — The Session and the Lord’s Table | Direct assigned-digest witness |
| 15 | R2 §5 — The Session and the Lord’s Table | Direct assigned-digest witness |
| 16 | R2 §6 — The Presbytery and the Church at Jerusalem | Direct assigned-digest witness |
| 17 | R3 §2 — A Fast, a Sermon, and the Presbytery | Direct assigned-digest witness |
| 18 | R3 §3 — The Questions Put to the Minister | Direct assigned-digest witness |
| 19 | R3 §3 — The Questions Put to the Minister | Direct assigned-digest witness |
| 20 | R3 §4 — The Promises of the People | Direct assigned-digest witness |
| 21 | R3 §5 — Hands, Prayer, and Charge | Direct assigned-digest witness |
| 22 | R3 §6 — Other Orders, Records, and No Money | Direct assigned-digest witness |
| 23 | R3 §6 — Other Orders, Records, and No Money | Direct assigned-digest witness |
| 24 | R3 §7 — The Extraordinary Way, and Today | Direct assigned-digest witness |
| 25 | R4 §2 — By a Minister, before the Congregation | Direct assigned-digest witness |
| 26 | R4 §2 — By a Minister, before the Congregation | Direct assigned-digest witness |
| 27 | R4 §2 — By a Minister, before the Congregation | Direct assigned-digest witness |
| 28 | R4 §3 — What Baptism Means | Direct assigned-digest witness |
| 29 | R4 §4 — Believers and Their Seed | Direct assigned-digest witness |
| 30 | R4 §4 — Believers and Their Seed | Direct assigned-digest witness |
| 31 | R4 §6 — Words, Water, and Prayer | Direct assigned-digest witness |
| 32 | R4 §6 — Words, Water, and Prayer | Direct assigned-digest witness |
| 33 | R5 §1 — “Frequently to Be Celebrated” | Direct assigned-digest witness |
| 34 | R5 §1 — “Frequently to Be Celebrated” | Direct assigned-digest witness |
| 35 | R5 §2 — Preparing to Come | Direct assigned-digest witness |
| 36 | R5 §2 — Preparing to Come | CTS-context witness |
| 37 | R5 §3 — Warning and Welcome | Direct assigned-digest witness |
| 38 | R5 §4 — Sitting at the Table | Direct assigned-digest witness |
| 39 | R5 §5 — The Prayer of Thanksgiving | Direct assigned-digest witness |
| 40 | R5 §6 — Breaking, Giving, and Giving Thanks | Direct assigned-digest witness |

## Language-delivery findings

| Layer | English | Spanish | French | Swahili |
|---|---:|---:|---:|---:|
| Public bank prompt fields | 40/40 | 40/40 | 40/40 | 40/40 |
| Current room source, full digest prose | Present | Present | Not established; UI/attestation markers only | Not present |
| Live test answer instruction | Accepted | Accepted | Not stated as accepted | Not stated as accepted |

This is a fairness and release gate, not proof that a student experienced a failure. A browser translation control may alter displayed text, but browser translation is not a version-pinned CTS source and does not establish accepted-answer or durable-grading parity.

## Source and academic boundaries

1. Q1, Q13 and Q36 depend on CTS historical/editorial context, not merely a straightforward clause in the underlying Westminster standards. Their secondary sources should be cited separately from the primary-source locus.
2. The current student fairness register must be kept distinct from the proposed-source manifest. Maintain two provenance columns: (a) assigned digest version/section and (b) original or secondary source edition/page.
3. The five assigned digests remain highly dependent on the integrated textbook/source family. Faculty must decide whether D-C4 is an intentional integrated close-reading course or needs five independent works.
4. The 1645 underlying works are strong public-domain candidates, but modern transcript/editorial apparatus, machine-assisted translations, quotations and hosted scans remain subject to version and rights review.
5. Private accepted answers, aliases, explanations, receipt behavior and durable completion were not accessed or tested.

## Required next steps

- Preserve current assigned digests and all valid earlier completions while faculty decide the final academic model.
- Version-lock every public prompt to the assigned digest section and separately cite the original/secondary source page.
- Supply or remove unsupported language claims only after native review of full French and Swahili reading bodies.
- Private-key owner: validate accepted variants and synthetic EN/ES/FR/SW grading/receipt/durable-completion behavior without exposing keys.
- Wayne/faculty approval is required before public wording, source substitution, assessment, policy or production changes.
- Keep PR #164 sending disabled.

## Correspondence exception observed in the same run

A new message from Daniel Valentin De Jesus asks why CTS does not offer bachelor's and doctoral programs. No reply was sent because describing future degree offerings could create an academic-program commitment. Wayne/Claude should approve the factual response and decide whether to mention the Associate/Th.M./M.Div. structure or any future B.A./D.Min. exploration.
