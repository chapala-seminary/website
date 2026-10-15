# fix-sp: single-page courses (Counseling, Narrative Preaching, WiseSpeak Preaching, Ethics)

Branch `cf/fix-sp`. Source of the findings: the "Single-page courses" section of
`docs/rubric-review-notes.md` on the ai-grader branch. Rule applied throughout: the lesson on
the same page is the authority; a model answer that goes beyond it is cut back to the lesson;
a question the lesson does not cover is reworded minimally. No lesson text was changed.

## Where these courses keep their content

- English and Spanish questions, model answers (`modelEn/modelEs`, `rubricEn/rubricEs`) and
  keyword lists (`kw_en/kw_es`) live inside the page HTML: `public/CTSCounseling.html`,
  `public/CTS_Narrative_Preaching.html`, `public/CTS_WiseSpeak_Preaching.html`,
  `public/ethics_unit01..10.html`.
- French drafts: `_review/french/<Course>/<Course>-unitN-fr.json` (and `-source.json`, the English
  and Spanish packet the French was drafted from). WiseSpeak French keywords are built from
  `tools/data/french-wisespeak-keywords.json` and `-labels.json` (English keyword to French forms
  and label).
- Numbering: units are 1-based and equal the page's unit number. Counseling, Narrative and
  WiseSpeak: Q = position in the short-answer list. Ethics: 20 multiple-choice (Q1-20) come first,
  so short-answer Q21-30 are numbered 21-30 on the page; the notes' Q22, Q23 ... are short answers
  2, 3 ...
- Provenance: Counseling, Narrative and Ethics French packets carry `tr.from`, the sha256 of the
  source packet (`node tools/french-static-courses.mjs --extract`). Each changed unit's source
  packet was re-extracted and its `tr.from` updated, so the French stays status "machine" and
  matches its source. WiseSpeak packets have no hash; their `-source.json` was updated to match
  the page. French text I wrote is machine draft; every changed French model and prompt needs the
  same review as the rest of the French pilot.

## Counts

| Course | Model answers corrected | Questions reworded | Checked, left alone |
|---|---|---|---|
| Counseling | 37 | 12 | 0 |
| Narrative Preaching | 7 | 1 | 1 (U7 Q4) |
| WiseSpeak Preaching | 34 | 12 | 0 |
| Ethics | 8 | 1 | 2 (U3 Q23; U7 Q22 contested) |

Every changed item has its English, Spanish and French model answer (and prompt, where reworded)
changed together, and a keyword list (English, Spanish, French) realigned with the new model.

## Counseling (CTSCounseling.html)

Each entry: what the model said that the lesson does not, then what it says now.

- U1 Q4 (long sessions): dropped the critique "acute grief or suicidal disclosure need more time";
  now defends the claim from the lesson (poor technique, closure, wandering, the frame). Keyword
  "discipline" became "frame".
- U1 Q6 (opposite-sex appointment, 7 PM): dropped chaperone, referral to a female counselor,
  documenting; now uses the lesson's own measures (reschedule to when a secretary is in the next
  room, glass panel, door ajar, no closed opaque door). Keywords chaperone/refer/document became
  ajar/secretary/glass panel.
- U1 Q9 (theology of time discipline): dropped "finite counselor, not the Savior, Holy Spirit
  through Scripture"; now the lesson's frame, trust in God, the settled center (1 Chr 27:32), boundaries as
  love, the vessel. Keywords reworked.
- U1 Q10 (phone counseling): dropped body language and on-call; now bounded time, close with thanks,
  permission to extend, privacy (marketplace counseling), midnight calls; the setting changes.
- U2 Q10 (misusing "understanding"): dropped disarming defenses and extracting disclosures;
  now the lesson's warnings (love, not technique; performing feelings; managing the story; enjoying being needed).
- U3 Q4 (clarifying vs probing): dropped "whose interest it serves, curiosity, agenda"; now gentle
  clarifying questions vs Porter's probing becoming interrogation, directness specific and non-accusatory with the option to decline.
- U3 Q7 ("I don't know how to explain it"): dropped offering feeling alternatives; now painful/shameful
  words, the patient request, order of events first, facts before feelings, directness only if hedging, sessions.
- U3 Q9 ("depression"): dropped a list of clinical/spiritual causes and referral; now presenting vs real problem,
  the lesson's layers (shame, fear, anger, grief), self-naming language, the open invitation.
- U4 Q5 (Prov 11:14): dropped "triangulation" and "coordinated care is the biblical norm"; now the lesson's
  protective question, the therapy gypsy, the omnipotent-pastor fantasy, referral as the start of coordinated care.
- U4 Q7 (limits of competence): dropped "Christ alone heals / servant"; now honesty, referral as care, spiritual being in
  God's image, and the warning that referring in fear is failure of nerve disguised as humility.
- U5 Q3 (verbal abuse): dropped "stop enabling, involve authorities"; now the genuinely-innocent exception, release
  from the false 100%, the assurance. U5 Q5 (Matt 7:3): dropped Jesus-does-not-deny-the-speck; now the lesson's moral agency
  and image of God. U5 Q8 (counselor's dangers): dropped leniency to be liked and projection; now mistiming, rigid
  80/20, absorbing therapeutic culture. U5 Q9: the question asked about the Roman Catholic confessional, which the
  lesson never mentions. Reworded to "According to Integrity Therapy, how is owning one's failure connected to
  health and freedom?" and answered from Mowrer/Drakeford.
- U6 Q4 (behavior before feeling): dropped "before the feelings are ready ... commit"; now 5.5 and 6.1 as written.
  U6 Q6 (failed homework): dropped fear/schedule/unwillingness diagnosis; now debrief, rehearse more responses, pinpoint, model from beside.
  U6 Q7 (male pastor, female counselee): dropped co-counselor/Titus; now brief disclosure, explicit role-play frame, careful technique, Step One's visibility.
- U7 Q3: asked about 1 Cor 10:13, not in the lesson. Reworded to Proverbs 11:14 (the lesson's verse); answered from tsar,
  the wider circle of counsel. U7 Q6: removed "on paper or whiteboard" from the question; answered from generate-then-evaluate.
  U7 Q7 ("only one biblical option"): dropped "shield / masquerade"; now the lesson's three causes of resistance. U7 Q8: asked about
  providence, which the lesson does not teach. Reworded to trust in the body of Christ; answered from 7.7. U7 Q10 (vs secular coaching): dropped
  claims about secular coaching; now what the lesson says (problem-solving theory, scriptural filter, counselor does not decide).
- U8 Q3: asked about Luke 14:28, not in the lesson. Reworded to Proverbs 22:3. U8 Q4 ("I don't care what happens"): dropped despair and return
  to listening; now locked in on self, draw eyes outward, horizons. U8 Q6 (vs fortune-telling): dropped "sovereign God, seer"; now probable outcomes,
  offering not insisting. U8 Q8: asked about God's sovereignty. Reworded to the judgment seat of Christ and why the counselor cannot foresee.
- U9 Q3 (vs a sermon): dropped "dialogue, watch and adjust"; now timing, selection, method, writing. U9 Q5: asked how Step 9 connects to modeling, which the lesson
  never says. Reworded to Step 8 (the choice). U9 Q7 (cannot answer): dropped "look into it for next time"; now refer, the lesson's own sentence. U9 Q8: asked about
  warnings, absent from the lesson. Reworded to written provision (9.5).
- U10 Q3, Q4, Q5 (release, never closing, structure): dropped "enjoying being needed, finite creature, gospel-shaped"; now releasing too late, dependency,
  closure as ministry, entrusted for a season. U10 Q6: asked about hugging across gender lines (absent). Reworded to "I'm not sure I can do this without you."
  U10 Q7: asked about a benediction (absent). Reworded to James 5:16. U10 Q8: asked about a new issue at the close (absent). Reworded to the two errors of release.
  U10 Q9: asked about the priesthood of all believers (absent). Reworded to the assurance that the Lord will be present.

## Narrative Preaching (CTS_Narrative_Preaching.html)

- U2 Q8 (visual method): the question asked about avoiding "spectacle", which the lesson does not discuss. Reworded to "How can the visual method serve preaching? Give
  examples from the unit." Answered with Willow Creek, Ezekiel, Jeremiah, Jesus.
- U2 Q9 (preaching leans left): dropped invented causes; now the prose method, the Middle Ages outline, half the hearer untouched.
- U3 Q1: "controlling metaphor/story" is the lesson's controlling-story form; named it that, kept Nathan, Volkswagen, Miller, Bugg.
- U4 Q4 (humor): dropped "disarming the hearer"; now the lesson's wording. U4 Q5 (Dr. Cook's Matt 16 sermon): "Salome" and "fire and prayer" are not in the
  lesson; now the girl's dance and the shut heavens.
- U7 Q9 (humor): dropped "engages, disarms, contemporizes, rests the hearer"; now the lesson's "opens a closed face", its limits.
- U8 Q5: dropped "Bow River"; the lesson says the great river through the Alberta valley.
- Left alone: U7 Q4 (borrowed stories); every claim is in the lesson (Hastings, Taillon "used by permission", Dr. Fish and Francis Dixon).

## WiseSpeak Preaching (CTS_WiseSpeak_Preaching.html)

- U1 Q4 (1 Cor 13): asked for idea, probing question and outline, which Units 2-4 teach. Reworded to which text-selection method this is (a chapter) and how
  to handle reading it. U1 Q6 (parable vs character): dropped "single moral / role models / focus"; now the lesson's seventy parables, a third of His teaching,
  characters who inspire, easiest and most engaging. U1 Q7 (consecutive): the lesson names two advantages and one disadvantage, not three and two. Reworded and answered.
  U1 Q8: dropped the list of four "better texts"; keeps Luke 19:10 as one example. U1 Q9 (house): the lesson gives functions, not errors. Reworded to functions only.
- U3 Q5, Q7: trimmed to the lesson (authority and the rule; which marks the Matt 14 outline meets). U3 Q6 (Psalm 23): asked for an inductive outline, taught in Unit 4. Reworded to a
  deductive one. U3 Q9: dropped the induction half.
- U4 Q7, Q8: dropped invented reasons (agenda, sermon bank); now topical vs inductive, Bible's first and last word, take it slowly. U4 Q10: dropped "short text, limited time"; now the textual/expository distinction as taught.
- U5 Q2: dropped "propitiation", the Red Sea, the burning bush; now Daniel/Abraham and the five senses. U5 Q5, Q10: the lesson gives sources, one advantage or caution for some; the
  question no longer asks a strength and caution for each. U5 Q7: dropped the Leviticus and California-judge claims; sample is now the Psalm 103 outline with a Bible illustration.
  U5 Q8: dropped the master/servant "structural" theory; now Spurgeon, application, one illustration per division.
- U6 Q1: dropped Hebrews 11 and "I shall not want"; now five-or-fewer words, Luke 15 revision, John the Baptist. U6 Q3 (Romans 13 exception): not in the lesson. Reworded to
  why Wayne revises for beauty and what revision must not change. U6 Q7 (Ingersoll): dropped lecture titles and "three times"; now the lesson's version. U6 Q8 (Ephesians 1 analysis): not in the lesson;
  reworded to chapter outline vs preaching analysis. U6 Q10: "direct appeal" became the lesson's fourth method, the prayer conclusion.
- U7 Q3: dropped "Roads / Postal / Protection" (note not transcribed); now the condensed outline's entries. U7 Q5: dropped "Bruno / My family"; now Alexander / Aristotle, Brooklyn Bridge, the exercise. U7 Q7: dropped the
  "later than planned" scenario; now internalized structure, road map.
- U8 Q2: dropped Wayne memorized, "Simmons", "stilted"; now the lesson's strengths and weaknesses; the question asks for the preachers he names. U8 Q4: dropped Little Engine and Wayne's "conviction"; now the lesson.
  U8 Q5: dropped Phillips Brooks and "110 wpm textbooks"; now 180 wpm, Jack Benny, pauses. U8 Q6: the question and model said "seven body topics" and "Day 5"; the lesson has six elements and no Day 5.
  Question now "at least four of the six elements"; sincerity is the closing remark. U8 Q7: dropped "soft-spoken", "raise three or four points"; now the lesson. U8 Q8: dropped paradoxical intention, Buerlein's "Blah!", the mind-blank move; now breaths, prayer, mirror, dignity, authority, lower note, fairy tales.
- U9 Q4: dropped Knox exiled, "audience inside the church"; now the lesson (Eudoxia, Mary, imprisoned). U9 Q5: dropped steamship and postal system; now German Bible, stenographers, Wednesday printing, Atlantic. U9 Q6: dropped Whitefield and Calvin;
  now Moody, Jasper, Chrysostom, Augustine, the bow and arrow.
- French keywords: new English keywords were added to `french-wisespeak-keywords.json` and `-labels.json`; `upward` gained "montante" and `return` gained "revenir" (the French drafts already used those words).

## Ethics (ethics_unit01..10.html)

- U4 Q22 (order of priorities): dropped "reverse the order and the ministry is a contradiction"; now the lesson's reason (home as proving ground and witness, nothing gained by winning the church and losing children).
  Keywords changed: prompt-only passed 4/4 before.
- U4 Q24 (Eph 6:4): "nurture / atmosphere preaches louder than pulpit" dropped; now firm but not cruel, warm but not indulgent, aimed at the heart.
- U5 Q30 (Col 4:5): dropped "not reputation or legal safety"; now the platform for the gospel.
- U7 Q26 (pain relief, bedside): dropped "presence and prayer matter more than technical mastery"; now intent, stewardship vs despair, dying well.
- U8 Q25 (divorce example): dropped "what changed was the church's willingness to name its comfortable sins" and Jesus' attention to pride/greed; now Malachi 2:16, Matthew 19:9, Mark 7:21-23, no single sin elevated.
- U8 Q28: dropped 1 Cor 6:11 (not in the lesson); now the lesson's closing assurance.
- U10 Q28: dropped "Paul's testimony from a Roman prison", "well done"; now Unit 3's testimony and the flock He bought with His own blood.
- U10 Q29: "how does the believer decide" has no answer in the lesson. Reworded to "what must the pastor teach his people about it?" (best of citizens, never the state's lapdogs).
- Left alone: U3 Q23 (every claim traces to 3.2); U7 Q22 (personhood, contested; Wayne's decision).

## Checks run

- `node tools/french-static-courses.mjs --check`: the three static courses' source packets match the pages and every French hash matches.
- `node tools/verify-french-static-packets.mjs`: PASS, 0 problems (Counseling 839, Narrative 579, Ethics 738 items). Same warnings as before for questions I did not touch.
- Keyword checks with the pages' own matchers (word-boundary for Counseling/Ethics, accent-insensitive for Narrative/WiseSpeak), English, Spanish and French: every changed model answer
  meets at least 3 keywords; no changed question passes pasted back (all under 3). Where a question already passed itself before, the new keywords lower it. Remaining pre-existing flags are on questions I did not change
  (Counseling 7, Narrative 47, Ethics 24, WiseSpeak 40, all "the question alone reaches 3 keywords").
- `node tools/verify-fill-single.mjs` against `public/` served locally: PASS (149 assertions).
- The French page builders run on the edited pages without error (`frenchStaticCourse` for the three static courses, `frenchWiseSpeak` for WiseSpeak), and WiseSpeak's keyword vocabulary has no forms of 4 letters or fewer that are not whole words.
- Not run: `verify-french-static.mjs` and `verify-french-wisespeak.mjs` (they need the built `/fr/` site, and a build was out of scope for this task). The orchestrator's full build and test run should include them.

## Noticed but not changed (not in the notes)

- WiseSpeak U5 Q1 (why EAI is simplest) and U8 Q1 give reasons or details the lesson does not state ("predictable rhythm", "index cards").
- WiseSpeak U8's French notes (`questions_for_wayne`) still mention the "Day 5 / seven topics" mismatch; it is now resolved in the page.
- Counseling Unit 0 (the landscape unit) was outside the notes and was not reviewed.
