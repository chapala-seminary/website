# Content fixes 2026-10-15 — fix-c (non-doctrinal findings)

Source of findings: `docs/rubric-review-notes.md` on the AI-grader branch (14 Oct 2026).
Unit (U) and question (Q) numbers are 1-based; Q n is `sa[n-1]` in `src/content/units/<Prefix>/<U>.json`.
Every change below was made in English, Spanish and French together. A French model or prompt that
changed carries `tr.fr` = `machine` with the new source hash (the hash `tools/translation-plan.mjs` computes).
Where a question's prompt or model changed, the keyword lists were checked with the shipped grader
(`public/assets/js/cts-engine.js`, same setup as `test/sa-keywords.test.mjs`): every model passes in
en/es/fr; no prompt that failed as its own answer before passes now.

## CTSNT

- **1 Q5 (Septuagint), model.** Before: said "most" Old Testament quotations follow the LXX and that an apostle "was usually quoting" it. After: follows the lesson (b014): the NT writers "frequently" quote in forms close to the LXX, the textual picture is more complex, and not all derive from one form. Added the lesson's Alexandria/250 BC and Acts 8 eunuch facts. Finding: model stated too strongly.
- **1 Q8 (Maccabees/Hanukkah), prompt, model, keywords.** Before: asked how the revolt "anticipated Christ's own ministry of cleansing the temple" — the lesson never says Christ cleansed the temple or that Hanukkah anticipated it. After: asks what the revolt achieved in 164 BC and what Hanukkah celebrates; the model gives the lesson's account (Judah "the Hammer", altar torn down, lamps rekindled, Jesus at Solomon's Colonnade, John 10:22). The "cleansing" keyword group became "lamps" (es lámparas, fr lampe).
- **1 Q9 ("spine of the course"), prompt and model.** Before: "The unit calls Galatians 4:4 the spine of this entire course" — the lesson says no such thing. After: asks what "the fullness of the time" means and what God prepared in the 400 years of silence; the model lists the lesson's common language, road system, peace and need.
- **12 Q3 (postmillennialism crisis), model and one keyword group.** Before: "the world was steadily getting better … shattered that optimism … remained vital for those emphasizing the Church's present authority". After: restates the lesson's careful wording (b015): influential among nineteenth-century theologians and missionaries, confidence weakened by the twentieth-century catastrophes, renewed interest in other frameworks, but the biblical question not settled. Keyword "shattered" → "confidence" (es confianza, fr confiance).

Left alone: NT 3 Q9 and unit 9 (contested, for Wayne).

## CTSBible

- **3 Q6 (two things the unit does not claim), model and keywords.** Before: second item was a "fixed first-century Alexandrian canon" and "set a believer up to stumble" — neither is a claim the lesson says it avoids. After: the two things the lesson says it does not do (b027, b029): claim that Jesus explicitly refuted the Apocrypha ("straining a gnat"), and pretend the question was never open (an old, real disagreement, not the same as doubting the gospel). Keyword groups "alexandr/alejandr" became "disagreement/desacuerdo" (fr désaccord).

Left alone: Bible 3 and 6 stance on the Apocrypha and Received Text (the lesson takes a CTS position; for Wayne).

## CTSWorship

- **1 Q2, prompt, model, keyword.** English "imminent" → "immanent" in the question and the model (Spanish and French already said immanent); English keyword "immin" → "imman" so the corrected model still scores. French `tr` hash refreshed (French text unchanged, already correct).

Left alone: Worship 3, 4, 9, 10 (Baptist/anti-Catholic stance; wording softening is a faculty decision).

## CTSPT

- **2 Q4 (1 John 1:7), model.** Before: English and Spanish said "fellowship with one another"; French said "mutuellement" and added "the blood of Jesus cleanses us from all sin" — the lesson (unit 2, section II, in all three languages) says "fellowship with Him". After: all three say fellowship with Him and no longer add the blood clause. **For faculty:** the NKJV verse itself reads "fellowship with one another"; the lesson's paraphrase is "with Him". The model follows the lesson, as instructed; faculty may want to correct the lesson text instead.
- **2, 3, 4 Q10 (personal reflection), model.** Before: "This is a personal reflection question…" (a description, not an answer). After: a short, labelled sample answer ("Sample answer / Respuesta de ejemplo / Exemple de réponse") with an honest self-assessment and one concrete step, built from each lesson: unit 2 (continual fellowship, abiding, small daily steps), unit 3 (set time, quiet place, the Word, prayer journal, "come back to the table"), unit 4 (listening and praise; the Lord's Prayer order). Keyword lists untouched; all three models pass.
- **1 Q10.** Already has a real model on main (not a placeholder). Only the French "Cela compte pour moi" was made impersonal to match the English (English unchanged, hash unchanged).

## CTSST

Rule applied: a question that asks about something the lesson never teaches was rewritten minimally onto a topic the lesson does teach (keeping the unit's subject), and its model written from the lesson. Keyword groups that no longer matched the new model were replaced in all three languages (the other groups were kept).

- **4 Q1.** Before: grammar of "He" with the neuter "Spirit" in John 16:13 (not in the lesson; John 16:13 is only the epigraph). After: the three faculties (intellect, emotions, will) that show the Spirit is a Person (1 Cor 2:11, Eph 4:30, 1 Cor 12:11).
- **4 Q2.** Before: relation of "Seal" and "Earnest (down payment)" — the lesson explains only the seal. After: what the Spirit's seal is (permanent resident, mark of ownership, guarantee of the final inheritance, Eph 1:13; 4:30) and how it assures.
- **4 Q4.** Before: how regeneration answers "Total Depravity" (term not used in unit 4). After: what regeneration is and why the new birth is necessary (chains of spiritual death, Titus 3:5).
- **4 Q6.** Before: indwelling versus "filling" (filling is not taught). After: indwelling versus walking in the Spirit (b029, b047).
- **4 Q9.** Before: why sanctification is "synergistic" (term not in the lesson). After: what it means to walk in the Spirit and each party's part (b047, b042).
- **5 Q2.** Before: ontological vs functional views of the image (not taught). After: why intelligence alone cannot explain the image and what else it includes (b021–b024).
- **5 Q3.** Before: Trinity as a "blueprint" for relationality (not taught). After: why the capacity for relationship is central to the image (b024).
- **5 Q7.** Before: "common grace" (not taught). After: total depravity does not mean as evil as possible; what it means instead (b038–b040).
- **5 Q8.** Before: "sub-creativity" (not taught). After: what the Thanksgiving story shows about believing in the image of God (b032–b034).
- **6 Q1, model.** Before: sin = nature, sins = acts, and the answer was "new heart and new birth, not self-improvement". After: the lesson's distinction (Sin: condition, helpless, needs liberation; sins: willful acts, guilty, need forgiveness; the gospel does both, b036–b039).
- **6 Q5.** Before: "Alcohol-Logic" described as grain fermenting, sin as "counterfeit, parasitic". After: the lesson's illustration (same substance, different direction; sin is misdirection of the good). Prompt changed from "borrows from the good" to "relates to the good".
- **6 Q6.** Before: Lucifer's fall (Isaiah 14) linked to Genesis 3 — Lucifer is not in the lesson. After: the first sin and how sin entered the race (b018).
- **7 Q2, model.** Before: placed the enmity "on our side, not God's" and said it guards against "an angry God" — the lesson (b031) says God's wrath is real and propitiation was needed. After: follows b031.
- **7 Q5.** Before: "from Genesis to Revelation", with Revelation and the sacrificial system — the lesson's thread runs Eden (animal skins), Passover, the cross (b044). After: "from Eden to the cross" and the model follows b044. Keyword "Revelation" → "Passover".
- **11 Q1, model.** Before: a boy sneaking cookies and being given away by evidence. After: the lesson's story (a man ate the batch, the smell of cookies gave him away, b011–b012).

Attributions checked against the lesson (left as the lesson states them; for faculty to verify): Peter Stoner's 1 in 10^17 (unit 11 b019, already hedged in the lesson); Chuck Colson on the Watergate cover-up (unit 11 b025); the Scofield Reference Bible (1909) (unit 10 b022). The models agree with the lessons. "Voltaire's house" is not in any ST lesson (it is in CTS 12, CTSHermeneutics 1 and CTSCE 1, see below).

Left alone: ST 9, 10, 12, 13 and DP/ST "Absolute Authority" wording (contested; for Wayne).

## CTSJosh

- **3 Q10 (personal Gilgal), model.** Before: described the Gilgal stones and never composed a personal Gilgal. After: a labelled sample answer with four personal memorial stones (using the lesson's own examples: the night one should have died, the temptation, the financial collapse, plus conversion), how each provokes the question, and the answer ("Son, let me tell you what God did for our family", b023, b040).
- **5 Q7 (Achan's name), model.** Before: never explained the name. After: the valley's name comes from the same Hebrew root as Achan, meaning trouble (b035); then Hosea 2:15.
- **9 Q5 (bird and hymn), prompt and model.** Before: "John Wesley". The lesson (b036) says Charles Wesley. After: Charles in the question and the model; the model adds his severe trials from the lesson.
- **10 Q5 (seven faith-motifs), model.** Before: garbled ("trusting the I have given", "the long obedience of made war a long time") and a list that did not match the lesson. After: the lesson's seven (b049–b063).
- **10 Q10 (doctrinal summary), model.** Before: mapped the motifs to justification, sanctification and consecration (not in the lesson). After: the lesson's "doctrinal trellis" and the daily shape of the choosing (b064, b074).
