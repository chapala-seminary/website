# D-C1 / Ref1 — all 40 public reading prompts versus staged Calvin and current CTS context

**Independent report-only audit — 2026-10-29 — `handoff/book-sources`**

## Decision summary

The public D-C1 reading bank is identical on main and beta at blob `1b50a4514d1145f94318286662e163b173926e6f`. It contains 40 prompts, eight per reading, draws 20, requires 18, and is publicly required for M.Div./Th.M. from 28 October 2026 while preserving earlier completions.

Compared with the five exact staged Calvin/Allen reading files:

- **34 D** — directly witnessed by the assigned staged Calvin reading;
- **2 P** — staged Calvin supports the subject but not the whole historical/terminological framing (Q4, Q19);
- **4 C** — current CTS digest context outside the staged Calvin excerpt (Q8, Q16, Q24, Q25).

This does **not** establish a defect in the current digest-based live test. The four context items and the expanded framing of Q4/Q19 are present in the current assigned CTS room. It does show that replacing the current digests with raw Calvin excerpts without rebuilding the assessment would create a source-version mismatch.

## Verified artifacts

- public bank: `src/content/readings/elecrefonereadings.json`, main = beta blob `1b50a4514d1145f94318286662e163b173926e6f`
- main reading room: `src/body/rooms/CTSElecRef1Readings.html`, blob `3fa5725653edb3da3673a77f3e29e6a07898354d`
- staged source blobs:
  - R1 `d3d1840ab0ec15d0342e58fc34d7a385afa07457`
  - R2 `e6ff57e060dfabec39ac3b0273ab4c90eadaa7fc`
  - R3 `06ce0fbe7c5305bd6eb76b96e2b3d173c6929f13`
  - R4 `92739ecb474f9c15f7fe17db2d930705e885b033`
  - R5 `58867a35ff4c1f93130816c901dccc48e4cf2f48`
- live page: https://chapalaseminary.org/CTSElecRef1ReadingsTest.html
- activation: `2026-10-28T06:00:00Z`

## Language and private-bank gate

EN/ES/FR are present for 40/40 prompts. Swahili is present for **39/40**: Q24 has no `sw` field. The live page exposes French and Swahili tabs but says answers may be in English or Spanish. The private accepted-answer mapping and durable FR/SW grading path were not accessed or verified.

## Forty-prompt non-answer register

| Q | Reading | Source status | Public English stem |
|---:|---:|---|---|
| 1 | R1 | D — direct staged Calvin witness | Calvin’s first sentence says true wisdom consists of two parts: the knowledge of God and the knowledge of ____. |
| 2 | R1 | D — direct staged Calvin witness | Calvin says that when we look straight at the ____, our sight is “dimness itself.” |
| 3 | R1 | D — direct staged Calvin witness | Calvin defines piety as “a reverence and love of God, arising from a knowledge of his ____.” |
| 4 | R1 | P — concept in staged Calvin; Latin label appears only in current CTS digest | Calvin’s Latin phrase divinitatis sensus means a sense of ____. |
| 5 | R1 | D — direct staged Calvin witness | Calvin cites the Roman orator ____: no nation is so barbarous that it has no belief in a god. |
| 6 | R1 | D — direct staged Calvin witness | Calvin says “we scarcely find one man in a ____” who cherishes what God has sown. |
| 7 | R1 | D — direct staged Calvin witness | Calvin calls the world “a ____ erected for displaying the glory of God.” |
| 8 | R1 | C — Geneva/Brazil mission history appears in current CTS digest, not staged Calvin | In 1557 Geneva sent two pastors to a French colony on Guanabara Bay in ____. |
| 9 | R2 | D — direct staged Calvin witness | Calvin compares Scripture to ____ that help an old man with weak eyes read distinctly. |
| 10 | R2 | D — direct staged Calvin witness | No one can have even the least knowledge of sound doctrine “without having been a ____ of the Scripture.” |
| 11 | R2 | D — direct staged Calvin witness | From Ephesians 2:20 Calvin answers that the church is built upon the ____ of the apostles and prophets. |
| 12 | R2 | D — direct staged Calvin witness | Certainty that Scripture is from God comes “from the secret testimony of the ____.” |
| 13 | R2 | D — direct staged Calvin witness | Calvin says “the testimony of the Spirit is superior to all ____.” |
| 14 | R2 | D — direct staged Calvin witness | Scripture has always, “like a ____, risen superior to all opposition.” |
| 15 | R2 | D — direct staged Calvin witness | Some enthusiasts despised the reading of Scripture as “the dead and killing ____.” |
| 16 | R2 | C — Reina–Valera history appears in current CTS digest, not staged Calvin | The Spanish Bible of 1569, revised in 1602, is the ancestor of the ____ that many Latin American churches still read. |
| 17 | R3 | D — direct staged Calvin witness | Calvin says “God lisps, as it were, with us, just as ____ are accustomed to speak to infants.” |
| 18 | R3 | D — direct staged Calvin witness | Against Arius, Calvin says that to call Christ consubstantial is to tear off the ____ from the hypocrite. |
| 19 | R3 | P — Servetus appears in staged Calvin; 1553 execution details are CTS context | In 1553 the anti-Trinitarian Spanish physician Michael ____ was burned in Geneva. |
| 20 | R3 | D — direct staged Calvin witness | Asked whether each believer has a guardian ____, Calvin says, “I cannot venture certainly to affirm.” |
| 21 | R3 | D — direct staged Calvin witness | Calvin teaches that “the proper seat of his image is in the ____.” |
| 22 | R3 | D — direct staged Calvin witness | Providence describes God as holding the ____ of the universe and regulating all events. |
| 23 | R3 | D — direct staged Calvin witness | Joseph could forgive his brothers because he saw God’s ____ at work. |
| 24 | R3 | C — Heidelberg Catechism context appears in current CTS digest, not staged Calvin; SW stem missing | The Heidelberg Catechism (1563) opens by asking for our only ____ in life and in death. |
| 25 | R4 | C — Luther/Erasmus history appears in current CTS digest, not staged Calvin | In 1525 Martin Luther answered Erasmus with The Bondage of the ____. |
| 26 | R4 | D — direct staged Calvin witness | Calvin says of Adam’s fall: “____, therefore, was the root of that defection.” |
| 27 | R4 | D — direct staged Calvin witness | Original sin keeps producing the works of the flesh, like flame and sparks from a heated ____. |
| 28 | R4 | D — direct staged Calvin witness | The monk ____ claimed that Adam harmed only himself and that others sin only by imitating him. |
| 29 | R4 | D — direct staged Calvin witness | Calvin sets a course between sloth and pride, “to avoid striking on either of these ____.” |
| 30 | R4 | D — direct staged Calvin witness | “The Spirit of God is the only fountain of ____,” so we must not despise it wherever it appears. |
| 31 | R4 | D — direct staged Calvin witness | Calvin’s key distinction is between necessity and ____: fallen man sins voluntarily, not under force. |
| 32 | R4 | D — direct staged Calvin witness | Augustine compares the human will to a ____ guided by its rider. |
| 33 | R5 | D — direct staged Calvin witness | Calvin calls justification “the principal ____ by which religion is supported.” |
| 34 | R5 | D — direct staged Calvin witness | Reconciled by Christ’s innocence, we have “in heaven a propitious father instead of a ____.” |
| 35 | R5 | D — direct staged Calvin witness | Justification “consists in the remission of sins and the ____ of the righteousness of Christ.” |
| 36 | R5 | D — direct staged Calvin witness | Calvin compares faith to a ____ that we bring empty to receive Christ. |
| 37 | R5 | D — direct staged Calvin witness | Calvin rejects the teaching of Andreas ____ that Christ’s divine essence is poured into us. |
| 38 | R5 | D — direct staged Calvin witness | Following Ambrose, Calvin pictures ____ wearing his elder brother’s garments to receive his father’s blessing. |
| 39 | R5 | D — direct staged Calvin witness | In Jesus’ parable, the ____ cried, “God be merciful to me a sinner,” and went home justified. |
| 40 | R5 | D — direct staged Calvin witness | In justification, Calvin says, “faith is a thing merely ____.” |

## Academic/source gates

1. **Current-version contract.** Current CTS digests deliberately mix Calvin excerpts with historical and confessional context. Faculty must decide whether those digests, raw Calvin, or a new independent-voices set is authoritative before any assessment change.
2. **Five-voice design.** All five staged readings are chapters from the same Calvin/Allen work, totaling about 130,559 words. They are separate chapter ranges, not five independent authors.
3. **Workload.** R3 and R4 are especially long. Any abridgment requires explicit objectives and a new prompt-to-source map.
4. **Source fidelity.** Original printed-page collation, footnote preservation, provider provenance, and an emendation ledger remain required.
5. **Rights/translation.** Calvin's underlying work is historical, but the Allen translation, transcription/provider status, Mexico reuse, and any new translations still require documented review.
6. **Student fairness.** Preserve earned credit and earlier completions. Do not silently swap sources, remove requirements, or alter public/private banks without faculty/Wayne approval and synthetic durable-state testing.

## Recommended next actions

- Repair the missing Swahili Q24 stem only after native review and private accepted-variant parity.
- Version-lock the current room blob, public prompt blob, private bank version and source paragraph/page references in a nonsecret faculty manifest.
- If faculty selects raw Calvin, replace or re-source Q8, Q16, Q24 and Q25; rewrite Q4/Q19 framing as needed; then rebuild and privately test the bank in EN/ES/FR/SW.
- Run synthetic tests for answer acceptance, server receipt and durable course completion without touching real student records.

**Scope:** research artifact only. No public reading, assessment, answer key, grade, student record, course requirement, production deployment or correspondence setting changed.
