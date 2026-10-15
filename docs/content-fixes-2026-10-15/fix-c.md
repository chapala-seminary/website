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
