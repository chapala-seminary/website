# Content fixes: fix-b (15 Oct 2026)

Branch `cf/fix-b`. Findings from `rubric-review-notes.md` (14 Oct), checked against the current files.
Every change below was made in English, Spanish and French together. Where English changed, `tr.fr` was
re-stamped `machine` with the new source hash (hash of `{prompt, keywords, model}` in English, as
`tools/translation-plan.mjs` computes it). Keywords were adjusted only where the old ones came from
wording the lesson does not support. Checks: every EN/ES/FR model answer still passes its keywords with
the shipped engine; no prompt newly passes as its own answer; `test/published-models.test.mjs` passes.

## CTSEvangelism
- 5 Q3: four motives now the lesson's (love of Christ constrains, Christ commands, lostness, wrath of God) with their verses. Was obedience/compassion/glory. Keywords updated.
- 5 Q7: four reasons to pray now the lesson's (God desires all saved, only God draws, God is seeking, the Enemy blinds). Was doors/boldness/conviction/dependence. Keywords updated.
- 6 Q6: seven styles as in the lesson, each with the lesson's example (harvesting has none in the lesson, said so). Was six styles with other examples.
- 8 Q6: Jay Brown's first three presuppositions now: people without Christ are lost; preaching is God's chief means; the pulpit is the best opportunity. Keywords kept.

## CTSPent
- 9 Q6: Meribah answer now the unit 9 lesson's reason (struck the rock twice in anger instead of speaking, as commanded). Removed "honor God's holiness". 11 Q6 (the rock as a type of Christ struck once) already agrees with lesson 11 and was left alone. Keywords updated.

## CTSAL
- 2 Q6: question and model now use the lesson's illustration (Arthur, the inmate chaplain) instead of "two pastors". Keywords updated.
- 10 (and 1, 7): literal `&mdash;` (48 places in unit 10) and Spanish HTML entities (`&eacute;` etc., units 1 and 7) replaced by the characters. Rendering is unchanged; tr stamps re-computed only where they were current.

## CTSHS (6 and 10): checked, nothing to restore
Both lesson files end at complete sentences (unit 6 "...near the end of this course."; unit 10 "...brought to maturity in love.") and match the end of `CTS_Classes_¥¥zz/CTSHSUnit6.html` and `CTSHSUnit10.html` and `orig/superseded-bodies/`. No text was cut off in the current files; the finding appears already fixed or came from a truncated reading. No change.

## CTSMatt: nothing in scope
Only contested-doctrine notes (9 Q5, 7 Q8, 11 Q6). Left for Wayne.

## CTSPM
- 4 Q6: question no longer asks for the paedobaptist argument (not in the lesson); model follows the lesson (believers' baptism, Romans 6:3-4, immersion, faith then baptism, eunuch and jailer). Stance unchanged.
- 4 Q9: the four worship errors now the lesson's (entertainment, deadness, pastor-centeredness, casualness). Keywords updated.
- 8 Q1: question and model limited to the two Greek words the lesson gives (parakaleo, noutheteo), with encouragement; "parainos" removed. Keywords updated.
- 8 Q3: the ten steps and their questions now exactly the lesson's. Keywords updated.
- 11 Q9: question no longer assumes "yourself" comes first; model says Paul commands both together and no longer contradicts itself. Keywords updated.
- 4 Q7 (Lord's Supper): contested, left.

## CTSApol
- 9 Q4: model no longer claims the atheist has "no real good or evil" or must "borrow" morality; it gives the lesson's hedged argument (some atheist philosophers ground morality without God; on pure naturalism obligation is not obvious; Judges; theism a more natural ground). Keywords updated.
- 9 Q5: model no longer says gospel is the "one" message of grace or that "every other faith centers on do"; it gives the lesson's emphasis-not-absolute contrast (Pure Land, bhakti, rahma). Keywords updated.

## CTSEvanPreach
- 1 Q3: three reasons now the lesson's (lost without Christ, gospel is God's power, every sermon has an evangelistic purpose). Keywords updated.
- 2 Q7: EN and ES now list the lesson's four preparation questions (FR already did).
- 10 Q2: EN and ES now list the lesson's seven challenges (cultural pressure and digital distractions separate; FR already did).

## CTS (Bible survey)
- 9 Q5: "four titles" changed to "five titles" in the question and model (EN/ES/FR). Note: the lesson's own sentence still says "four titles" before listing five; lessons were not edited, for Wayne.

## CTSPsalms
- 6 Q3: EN and ES models now give the foreshadowing example (animal sacrifices fulfilled in Christ).
- 11 Q9: second caution now the lesson's (tossing "all things work together for good" at fresh grief); third caution adds Psalm 103 and Paul's thorn.
- All units: literal `&Eacute;` in Spanish text replaced by the character.

## CTSRE
- 5 Q5: three purposes only (God uses whomever, Purim, providence); removed the anti-Semitism claim. Keywords updated.
- 5 Q7: "Conable" to "Constable" (EN/ES), with Tom Constable's quote as in the lesson.
- 5 Q10: removed "Cush in Africa" and the Susa/positioning point; now the lesson's extent, "largest empire to date", Xerxes and Greece, and God using Persian kings to rebuild the temple. Keywords updated.
- 6 Q3-Q7 rewritten to lesson 6: names and two identities (Q3); Mordecai's silence vs Joseph (Q4); how Esther won Hegai's favor and her character (Q5); non-kosher meals and Ted's fraud example (Q6); accountability and response to betrayal (Q7). The old Q3-Q7 asked about the plot, the gate, the delay and Joseph/Daniel, which are taught in lesson 7 or not at all. Keywords updated.

## Checked and left alone
- CTSRE 5 Q4 ("only OT history set entirely in the time of the Gentiles"): the lesson says it; the doubt is about the lesson. For Wayne.
- CTSRE 3 Q4-Q5, 8 Q5; CTSRE 9 Q5, Q7 (lesson asserts what the model hedges): lesson-level, not touched.
- All contested-doctrine notes (Pent 1 Q9, 3 Q7; HS 6 Q5, Q6, Q8, 7 Q4; Matthew 7, 9, 11; CTSPM 4 Q7; CTS 4 Q4, 9 Q4, 11 Q9): unchanged.
- CTSLA is not in this task's course list.
