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
