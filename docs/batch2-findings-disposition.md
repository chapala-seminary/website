# French Batch 2 findings: what was done with each one

Source: `_review/french/BATCH2-FINDINGS.md` at commit `1d3af426` (PR #68). Each claim
was checked against `beta` at `28fc79c7`, reading the lesson block, the question, its
answer key, its explanation and the model answer together, and against the NKJV / Reina-Valera
Gómez text or historical sources (cited in the PR's working notes). Numbering follows the
report: MC 3 is the third multiple-choice question; block ids are lesson-data ids.

Finding ids (F1.x, F2.x, J/M/A/R, T, D) are assigned here so every line of the report has one.

- **Fixed** — corrected in English and Spanish (and in the French review drafts, see below).
- **Already fixed** — beta no longer had the problem (none).
- **Unsubstantiated** — the claim does not hold.
- **Awaiting Wayne/Robert** — a theological or editorial choice reserved for them; nothing
  changed. Their questions are in [Decisions for Wayne and Robert](#decisions-for-wayne-and-robert).

## Content (sections 1 and 2 of the report)

| Id | Disposition | Where | What was wrong / what changed |
|---|---|---|---|
| F1.1 | Fixed | units/CTSActs/11.json mc 3; lessons/CTSActs/11.json b016 (also 10 b056 under A10d) | b016 now states what Acts lacks without the false uniqueness claim; MC 3 stem asks what the lesson points out, key 'It ends with no doxology, amen, or formal closing', EN+ES. Answer index unchanged (2). |
| F1.2 | Fixed | units/CTSActs/11.json mc 13; lessons/CTSActs/11.json b032 (b028 already says "Caesar's own household") | MC 13 key -> 'Caesar's own household (Philippians 4:22)'; b032 now names the palace guard (1:13) and Caesar's household (4:22) separately, EN+ES. Answer index unchanged (3). |
| F1.3 | Fixed | units/CTSActs/6.json mc 6 (also sa 3 checked); lessons/CTSActs/6.json b021 | b021 now says the new name appears at 13:13 and Paul is usually, not always, named first (with references), EN+ES; MC 6 stem asks what Luke calls the team at 13:13 instead of 'from Pamphylia onward'. Answer unchanged. SA 3 (the 13:13 shift and mentoring) still matches. |
| F1.4 | Fixed | units/CTSActs/8.json mc 12; lessons/CTSActs/8.json b031 | Key option now says her temple was the wonder, EN+ES; answer index unchanged (3). |
| F1.5 | Fixed | lessons/CTSRomans/1.json b028; units/CTSRomans/1.json mc 10 stem, sa 9 | b028 name-order claim replaced with an accurate human-name/title point grounded in 1:3-4 (keeps "complete man and complete God"); MC10 stem "Christ Jesus" -> "Jesus Christ" (ES already "Jesucristo"); SA9 prompt and model rewritten to test the same humanity/deity point. |
| F1.6 | Fixed | units/CTSActs/1.json mc 9, sa 4; lessons/CTSActs/1.json b029 | Key reworded to match b029 ('Known human languages — each pilgrim heard in his own dialect'), 'primarily' dropped from stem; SA 4 model's 'the miracle was hearing' aligned. Answer index unchanged (0). |
| F1.7 | Fixed | units/CTSActs/11.json mc 10, mc 11; lessons/CTSActs/11.json b041; lessons/CTSActs/7.json b019; lessons/CTSActs/8.json b017; units/CTSActs/11.json fill 6 | MC 10 key -> 'In private — they took him aside (Acts 18:26)' with the stem reworded to 'Where did...'; MC 11 key -> 'Her own house'; b041 and Acts 7 b019 changed to the biblical wording (the 'kitchens and conversations' application kept), EN+ES. Answer indexes unchanged (2, 2). Fill 6 prompt likewise ('took ____ aside and discipled him in private'); answer Apollos unchanged. |
| F1.8 | Awaiting Wayne/Robert (see decisions) | units/CTSRomans/6.json mc 6; lessons/CTSRomans/6.json b025 | Collected only; see decision T4. |
| F2.1 | Fixed | units/CTSJohn/5.json mc 20, sa 10; lessons/CTSJohn/5.json b013 | Added one sentence to Unit 5 b013 naming light as the second of the seven I AM sayings and listing all seven; items unchanged. |
| F2.2 | Fixed | units/CTSJohn/10.json mc 1; lessons/CTSJohn/10.json b013 | Added to Unit 10 b013 (EN+ES) that these chapters (John 14-17) are often called the Upper Room Discourse; MC 1 unchanged. |
| F2.3 | Fixed | units/CTSMatt/5.json mc 2 (mc.1); lessons/CTSMatt/5.json b011; lessons/CTSMatt/4.json | Stem narrowed from 'give, pray, and fast' to 'pray' (EN+ES). Key, options and why unchanged. |
| F2.4 | Fixed | units/CTSMatt/11.json mc 9 (mc.8), mc 10 why (mc.9), sa 5 (sa.4), also sa 4 last sentence (sa.3); lessons/CTSMatt/11.json b025 | Added one sentence to b025 (EN+ES) teaching the field/mill images, Matt 24:40-41, 'not seeing it coming' and 'Are you ready?'. Added 'the bridegroom was delayed' to the ten-virgins clause. This covers MC 9, the MC 10 why, SA 4's last sentence and SA 5 without changing any item. |
| F2.5 | Fixed | units/CTSActs/2.json mc 13, sa 6; lessons/CTSActs/2.json b032, b036 | b032 now quotes Acts 5:34 (teaches MC 13's key, replaces the unsupported 'wise man' attribution); one sentence added to b036 teaching that Luke never says Gamaliel believed; SA 6 model 'no evidence' -> 'Scripture never says'. MC 13 unchanged. |
| F2.6 | Fixed | units/CTSActs/3.json mc 19; lessons/CTSActs/3.json b040 | One clause added to b040 (EN+ES) so the lesson teaches 'found at Azotus'; MC 19 unchanged (smaller than rewriting four options). |
| F2.7 | Fixed | units/CTSActs/5.json sa 8; lessons/CTSActs/5.json b040, b041 | Two short sentences added at the end of b041 (EN+ES) teaching the contrast as the SA 8 model states it; SA 8 unchanged. Wording is general providence, not an election claim. |
| F2.8 | Fixed | units/CTSActs/11.json mc 12; lessons/CTSActs/9.json b043, b023, b032; lessons/CTSActs/11.json b027 | Stem now 'Paul's unnamed nephew' (not 'teenager'); key adds 'the commander,' before Lysias so it is answerable from the Unit 11 review too; Unit 9 b043 'Jewish teenager' -> 'Jewish boy', EN+ES. Answer index unchanged (1). |
| F2.9 | Fixed | units/CTSRomans/1.json sa 1, sa 4; lessons/CTSRomans/1.json b019 | Added one sentence to b019 (EN+ES) teaching that Paul was a Pharisee (Acts 26:5). SA4 needs no content change; its untaught "tower/torre" keyword is left to the keyword pass. |
| F2.10 | Fixed | units/CTSRomans/2.json mc 4, mc 19; lessons/CTSRomans/2.json b022, b026 | Added a 1:21 sentence to b022 and a 1:32 clause to b026 (EN+ES). Also corrected the quotations in MC4 why (KJV wording -> NKJV) and MC19 why (NKJV "righteous judgment"; ES to RVG wording). |
| F2.11 | Fixed | units/CTSRomans/4.json mc 11, mc 12, sa 10; lessons/CTSRomans/4.json b026 | Added one sentence to b026 (EN+ES) quoting 5:10 and defining reconciliation versus justification, which covers MC11, MC12 and SA10; MC11 why quote "by" -> NKJV "through". |
| F2.12 | Fixed | units/CTSRomans/10.json sa 10; lessons/CTSRomans/10.json b050 | Added one summary sentence to b050 (EN+ES) giving the letter's five-part outline exactly as the SA10 model uses it; the SA is unchanged, so its difficulty stays the same. |
| F2.13 | Fixed | units/CTSJohn/8.json sa 1 prompt+model; lessons/CTSJohn/8.json b021 heading | SA 1 prompt and model now say 'triumph over death' / 'triunfo sobre la muerte'. |
| F2.14 | Fixed | units/CTSMatt/11.json sa 5 (sa.4) model | Removed 'two are sleeping in a bed' and 'sleeping' from the SA 5 model (EN+ES). Keywords not touched; 'sleeping' was not one of them. |
| F2.15 | Fixed | units/CTSActs/2.json sa 8; lessons/CTSActs/2.json b035 | SA 8 model now says an American handed Fuchida DeShazer's tract (matches b035); 'preached across Japan together' softened to match corrected b035. ES model already said only 'por todo Japón' — first edit covers the tract-giver. |
| F2.16 | Fixed | units/CTSActs/4.json sa 6 | EN model: 'acoger' -> 'welcoming'. Spanish unchanged. |
| F2.17 | Fixed | units/CTSActs/6.json sa 10 | SA 10 model: split now placed 'as the second journey began'; 'first journey' moved to the Cyprus clause so the model still names it (keyword list untouched), EN+ES. |
| F2.18 | Fixed | units/CTSActs/7.json sa 6; lessons/CTSActs/7.json b035 | SA 6 model: 'quoting their own philosophers' -> 'quoting their own poets to the philosophers' (keeps 'philos' for the keyword pass), EN+ES. |
| F2.19 | Fixed | units/CTSActs/8.json sa 6; lessons/CTSActs/8.json b029 | SA 6 model now gives the lesson's figure (about 150 years of wages), EN+ES. |
| F2.20 | Fixed | units/CTSActs/9.json sa 4; lessons/CTSActs/9.json b029 | SA 4 model now follows the verse (tore off their clothes, threw dust into the air), EN+ES; lesson b029 left (it gives the literal Greek sense). |
| F2.21 | Fixed | units/CTSRomans/5.json sa 3; lessons/CTSRomans/5.json b022, b023, b025 | SA3 model sentence (EN+ES) replaced: the water does not create the union; it pictures and confesses the believer's real identification with Christ by faith. |
| F2.22 | Fixed | units/CTSRomans/9.json sa 8; lessons/CTSRomans/9.json b046, b047 | SA8 model foundations 3-4 changed to match b047 (despise/judge kept as b046's point); the prompt range "Romans 14:1-12" became "Romans 14" so the four foundations fall within it (EN+ES). |
| F2.31 | Fixed | units/CTSMatt/6.json mc 12 (mc.11); lessons/CTSMatt/6.json b023 | Stem now reads 'In the lesson's teaching on the new wine and the old wineskins,' (EN+ES). Key unchanged. |
| F2.32 | Fixed | units/CTSJohn/1.json mc 20 option 0 | Replaced stray distractor with 'set the mystery aside as unimportant' / 'dejar de lado el misterio como algo sin importancia'. |
| F2.33 | Fixed | units/CTSActs/4.json mc 1, mc 18; lessons/CTSActs/4.json b016, b024 | MC 18 replaced with an item on Ananias's first response (b024); MC 1 kept. Answer index stays 3; 4 options kept. |
| F2.34 | Fixed | units/CTSRomans/9.json mc 3 option 0 | Distractor relabelled "Syschēmatizō (to conform to a pattern)" / "Syschēmatizō (conformarse a un molde)". The answer index stays 3. |
| F2.35 | Unsubstantiated | units/CTSActs/11.json mc 5 | Note only; 5 options render and grade correctly; left as is. |
| J3 | Fixed | lessons/CTSJohn/3.json b025; units/CTSJohn/3.json sa 8 model | 'three years under the Lord' -> 'men in training under the Lord Himself' in b025 and the SA 8 model, EN+ES; contrast point kept. |
| J4 | Fixed | lessons/CTSJohn/4.json b017; units/CTSJohn/4.json mc 6 why, fill 4 prompt, sa 3 model | 'Six times' -> 'At least eight times' / 'Por lo menos ocho veces' in all four places. SA 3 keyword 'six times'/'seis veces' now needs the keyword pass. |
| J6 | Fixed | lessons/CTSJohn/6.json b028, b031; units/CTSJohn/6.json fill 7 prompt, sa 7 model | 'council' -> 'the Pharisees'; 'warned him, then threatened him' -> 'questioned him twice, reviled him', EN+ES in lesson, fill 7 and SA 7. |
| J10 | Fixed | lessons/CTSJohn/10.json b021 | 'two hundred feet' -> 'some one hundred and twenty feet' / 'unos ciento veinte pies'. |
| J12a | Fixed | lessons/CTSJohn/12.json b021; units/CTSJohn/12.json fill 5 prompt, sa 4 model | Lesson and SA 4 now say 'In the Greek of John's Gospel it is a single word'; fill 5 says 'is, in Greek, ____'. |
| J12b | Fixed | lessons/CTSJohn/12.json b019 | Named the right painting and described the figure correctly (centre, blue cap, raising the cross); heading 'The figure in the shadows' -> 'The painter at the cross'; application kept. |
| J12c | Fixed | lessons/CTSJohn/12.json b027 | Rewrote the anecdote with the correct name and documented facts (five converts, never allowed back, Magdalena and the New Testament, Genadendal); dropped the unverified 13,000 figure. No exam item uses it. |
| M3 | Fixed | lessons/CTSMatt/3.json b041 | 'nineteen' changed to 'sixteen' (ES 'diecinueve' to 'dieciséis'); added 'and felt no pain' / 'y no sintió dolor', so the story makes its point. |
| M5 | Fixed | lessons/CTSMatt/5.json b031 | '(Exodus 33:18)' changed to '(Exodus 33:18–23)', EN+ES. That covers both the request and God's answer. |
| M11 | Fixed | lessons/CTSMatt/11.json b023 | 'He ate fish on the shore' changed to 'He ate broiled fish before their eyes (Luke 24:42–43)'. ES: 'comió pescado asado delante de ellos (Lucas 24:42–43)'. |
| M12 | Fixed | lessons/CTSMatt/12.json b027; units/CTSMatt/12.json sa 9 (sa.8) model | b027 now says 'its veil and its graded courts'. The SA 9 model now says 'the temple's veil and graded courts' (EN+ES). Smallest accurate fix; the list is unchanged. |
| A1 | Fixed | lessons/CTSActs/1.json b020; units/CTSActs/1.json mc 18 | Morison was an ~49-year-old advertising writer, not a young lawyer; b020 (EN+ES) and MC 18 stem corrected; '1930s' -> '1920s' (research preceded 1930 publication) and 'three quarters of a century' -> 'nearly a century'. |
| A2a | Fixed | lessons/CTSActs/2.json b017 | b017 now paraphrases Acts 4:4 accurately (men who believed, about five thousand), EN+ES. |
| A2b | Fixed | lessons/CTSActs/2.json b035 | Rank at Pearl Harbor corrected to Commander; 'thirty years together' and 'tens of thousands' replaced with what the record supports, EN+ES. |
| A3a | Fixed | lessons/CTSActs/3.json b021 | 'four hundred years' -> 'centuries' (EN+ES); the rhetorical point is kept without a false number. |
| A3b | Fixed | lessons/CTSActs/3.json b028 | 'seven months into his ministry' -> 'so early in his ministry' (EN+ES). |
| A4 | Fixed | lessons/CTSActs/4.json b030 (cf. b032) | 'within weeks' replaced with Luke's 'after many days' (Acts 9:23), EN+ES (RVG 'como pasaron muchos días'). |
| A5a | Fixed | lessons/CTSActs/5.json b036 | 'autumn of 1904' -> 'February 1904', EN+ES. |
| A5b | Fixed | lessons/CTSActs/5.json b042 | Same-day claim removed; self-contradicting 'only book' sentence reworded to 'Acts tells us what happened next, and why' (Luke gives heaven's reason), EN+ES. |
| A6a | Fixed | lessons/CTSActs/6.json b036 | 'first ecumenical council' -> 'first church council in recorded history, nearly three centuries before Nicaea, the first of the ecumenical councils', EN+ES. No exam item uses 'ecumenical'. |
| A6b | Fixed | lessons/CTSActs/6.json b020 | 'first Roman official' -> 'first Roman governor', EN+ES. |
| A7a | Fixed | lessons/CTSActs/7.json b033 | Attribution moved to Petronius and the quip correctly located (Italy), with the Athens application kept as the author's comment, EN+ES. |
| A7b | Fixed | lessons/CTSActs/7.json b038 | b038 now attributes the 'thousand cult prostitutes' to old Greek Corinth per Strabo, EN+ES; 'Corinthianize' and the city's reputation kept. |
| A8a | Fixed | lessons/CTSActs/8.json b022 | 'about two thousand, mostly in Iraq and Iran' -> 'some tens of thousands... from Iraq and Iran to a worldwide diaspora'; 'call themselves disciples' / 'gospel of John the Baptist' made accurate (honor him as greatest prophet; the Book of John), EN+ES. |
| A8b | Fixed | lessons/CTSActs/8.json b017 | EN 'Read those eight words.' -> 'Read those words.' (matches ES). |
| A9a | Fixed | lessons/CTSActs/9.json b023 | 'thirty years earlier' -> 'about twenty-five years earlier', EN+ES. No exam item uses the figure. |
| A9b | Fixed | lessons/CTSActs/9.json b032 | 'Lex Porcia of 195 BC made it a capital crime' -> 'the Porcian laws of the early second century BC forbade scourging a Roman citizen under heavy penalty', EN+ES. |
| A10a | Fixed | lessons/CTSActs/10.json b044 (cf. b041) | 'five or six days later' -> 'the next morning', with Acts 27:29 supplying the waiting the paragraph teaches, EN+ES. |
| A10b | Fixed | lessons/CTSActs/10.json b046 | 'on Paul's orders' removed, EN+ES. |
| A10c | Fixed | lessons/CTSActs/10.json b053 | 'sailed... to Syracuse for three days' -> 'sailed... to Syracuse and stayed there three days', EN+ES. |
| A10d | Fixed | lessons/CTSActs/10.json b056, b060; lessons/CTSActs/11.json b015; units/CTSActs/10.json sa 10; units/CTSActs/11.json mc 1, sa 1 | Every 'mid-sentence' claim changed to 'mid-story' or 'stops on its participles' (lessons 10 b056/b060, 11 b015; Unit 10 SA 10 prompt+model; Unit 11 MC 1 key option and SA 1 model), and the 'only book that does not end' claim removed, EN+ES. Kept the true point that the last verbs are participles, so Unit 11 Fill 1 ('dangling ____ (preaching, teaching)' = participle) and b048 still stand. MC 1 answer index unchanged (1). |
| A11 | Fixed | lessons/CTSActs/11.json b028 | Clarified which hearing was in Jerusalem and which three at Caesarea, EN+ES. |
| R1a | Fixed | lessons/CTSRomans/1.json b021 | "stonings" -> "a stoning"; ES "apedreamientos" -> "un apedreamiento". |
| R1b | Fixed | lessons/CTSRomans/1.json b036 | Changed to "the rest of the letter" (EN+ES), which avoids the miscount. |
| R2 | Fixed | lessons/CTSRomans/2.json b041; lessons/CTSRomans/3.json b014 | "sixty-six" -> "sixty-four" in both blocks (EN+ES). |
| R3 | Fixed | lessons/CTSRomans/3.json b037; units/CTSRomans/3.json fill 8 | b037: "Greek logizomai" -> "in Paul's Greek, logizomai". Fill 8 prompt now reads "as Paul quotes Genesis 15:6 in Romans 4:3" (EN+ES). The answer is unchanged. |
| R6 | Fixed | lessons/CTSRomans/6.json b034; units/CTSRomans/6.json mc 13 why, fill 9, sa 7 | b034, MC13 why, Fill 9 prompt and SA7 model (EN+ES) now give it as a preacher's illustration from Virgil's tale of a tyrant, uncertain as Paul's background. The keyed answers (MC13 option 3, Fill 9 "corpse/cadáver") are unchanged. |
| R7 | Fixed | lessons/CTSRomans/7.json b038 | Inserted "Years later, over his son Absalom," / "Años después, por su hijo Absalón," before the lament. |
| R10 | Fixed | lessons/CTSRomans/10.json b028 | "were facing famine and poverty" -> "were poor — 'the poor among the saints who are in Jerusalem' (15:26)" (EN+ES, RVG wording). |

Also corrected while checking these items: Romans 2 b026 (Spanish) quoted Romans 1:28 as
"una mente depravada" under the RVG label; the RVG reads "una mente reprobada".

## Short-answer grading (section 2, "keyword sets")

Details, method and figures: [short-answer-keyword-repairs.md](short-answer-keyword-repairs.md).

| Id | Disposition | Where | Result |
|---|---|---|---|
| F2.23 | Fixed | all 460 SA in units/CTSJohn, CTSMatt, CTSActs, CTSRomans | Reproduced exactly with the shipped engine: 213/460 English prompts (John 67, Matthew 33, Acts 99, Romans 14) and 215/460 Spanish prompts passed as their own answer. Now 0/460 in both languages; no copied prompt hits more than 1 keyword group. 411 items' groups rewritten. |
| F2.24 | Fixed | units/CTSRomans/5.json SA 3 | Wrong answer scored 4, now 1 (fails). Model also corrected (F2.21). Negation limit noted. |
| F2.25 | Fixed | units/CTSRomans/7.json SA 10 | Scored 4, now 0. "for", "against", bare "Son" removed. |
| F2.26 | Fixed | units/CTSActs/6.json SA 6 | Scored 3, now 0. Groups kept neutral on election (T6). Negation limit noted. |
| F2.27 | Fixed | units/CTSJohn/7.json SA 9 | Scored 3, now 1. Groups are the words of John 10:27–30; neutral on eternal security (T8). Negation limit noted. |
| F2.28 | Fixed | units/CTSActs/4.json SA 2 | Scored 3, now 0. |
| F2.29 | Fixed | Acts 4 SA 2 "me"; Romans 7 SA 10 "for"; Acts 9 SA 2 "away", "him"; Acts 4 SA 1 "against", "god" | All removed, with their Spanish counterparts; no filler or bare god/Christ/Jesus/Lord keywords remain in the four courses (checked by test/sa-keywords.test.mjs). |
| F2.30 | Fixed | units/CTSActs/6.json SA 1–5, 7–9 | Raised from 5 to 8 groups, English and Spanish. |

## Section 3: edition-wide French decisions and theology flags

| Id | Disposition | Where | Note |
|---|---|---|---|
| T1 | Awaiting Wayne/Robert (see decisions) | lessons/CTSJohn/2.json b021; units/CTSJohn/2.json mc 9 (why) | 'The new birth is His work before it is ever our choice' can read as regeneration before faith. |
| T2 | Awaiting Wayne/Robert (see decisions) | lessons/CTSRomans/1.json b033 | Collected; see decisions. |
| T3 | Awaiting Wayne/Robert (see decisions) | lessons/CTSRomans/4.json b036; units/CTSRomans/4.json mc 16, sa 6 | Collected; see decisions. |
| T4 | Awaiting Wayne/Robert (see decisions) | lessons/CTSRomans/6.json b025, b036; units/CTSRomans/6.json mc 6, sa 4, sa 6 | Collected; see decisions. |
| T5 | Awaiting Wayne/Robert (see decisions) | lessons/CTSRomans/8.json b022-b025 | Collected; see decisions. |
| T6 | Awaiting Wayne/Robert (see decisions) | lessons/CTSActs/6.json b028; units/CTSActs/6.json sa 6 | Election framing reserved for Wayne/Robert; options and recommendation in decisions. |
| T7 | Awaiting Wayne/Robert (see decisions) | lessons/CTSActs/7.json b040; units/CTSActs/7.json sa 9 | Election framing reserved for Wayne/Robert; options and recommendation in decisions. |
| T8 | Awaiting Wayne/Robert (see decisions) | lessons/CTSJohn/7.json b025; units/CTSJohn/7.json mc 17 (why), sa 9 (model) | 'What He buys at such a price, He does not lose' goes beyond restating John 10:28 on eternal security. |
| T9 | Awaiting Wayne/Robert (see decisions) | lessons/CTSRomans/10.json b049; units/CTSRomans/10.json sa 9 | Collected; see decisions. |
| T10 | Awaiting Wayne/Robert (see decisions) | units/CTSRomans/3.json sa 10; lessons/CTSRomans/4.json b015, b047; lessons/CTSRomans/7.json b016, b043, b051 | Collected; see decisions. |
| T11 | Awaiting Wayne/Robert (see decisions) | lessons/CTSRomans/8.json b043; units/CTSRomans/8.json mc 18, sa 8 | Collected; see decisions. |
| T12 | Awaiting Wayne/Robert (see decisions) | _review/french CTSMatt unit 11 b011, MC2, SA1; unit 13 b025, b029, MC16, MC18 (French drafts @1d3af426; not in beta src) | French edition / end-times wording: collected for decision. |
| T13 | Awaiting Wayne/Robert (see decisions) | units/CTSMatt/9.json mc 7 (mc.6) option A; lessons/CTSMatt/9.json (Matt 16:18 block) | Denominational framing: collected for decision. No edit. |
| T14 | Awaiting Wayne/Robert (see decisions) | lessons/CTSMatt/12.json b027 | Denominational anecdote: collected for decision. No edit. |
| T15 | Awaiting Wayne/Robert (see decisions) | _review/french/CTSRomans unit 10 (b033, b037, fill 6, mc 12, sa 6); also English lessons/CTSRomans/1.json b024 and units/CTSRomans/1.json mc 4 why, fill 7, sa 2 ("deaconess") | Collected; see decisions. |
| D1 | Awaiting Wayne/Robert | French drafts, all courses | "païens" vs "non-Juifs" for Gentiles. |
| D2 | Awaiting Wayne/Robert | French drafts, John | "le Consolateur" as the Spirit's title, "Paraclet" once. |
| D3 | Awaiting Wayne/Robert | French drafts | "septante fois sept fois" with a one-time gloss. |
| D4 | Awaiting Wayne/Robert | French course headers | One pattern for intensives ("Cours intensif sur …"); Joshua drafts still mixed. |
| D5 | Awaiting Wayne/Robert | French diagrams | French/English vs other diagram language pairing (Robert to decide how). |
| D6 | Fixed by F2.30 | units/CTSActs/6.json | The English now has 8 groups, so the French can follow convention 10 without an exception. |

## Section 4: per-unit questions in the review files

Not part of this repair. They stay in each unit's `-review.md` for Wayne (Segond wording
questions, mostly yes/no).

## French review drafts

The matching corrections to the Batch 2 French drafts are on branch
`claude/batch2-french-corrections`, stacked on PR #68's branch, in their own PR. Each
changed `-fr.json` lists its changes in an `updates` field and each changed `-review.md`
opens with "Updated after English corrections (12 Oct 2026)". The `-source.json` snapshots
(English at `2887884`) are unchanged. Nothing French is imported or published by either PR,
and no French theological review has taken place.

## Decisions for Wayne and Robert

Each item: the exact passage, where it is, the choices, and a recommendation. Nothing
here has been changed. CTS's brain records no decision on these topics; the review brief in
PR #68 describes the intended stance (non-denominational; Arminian-leaning soteriology;
perseverance an open question; end-times views presented even-handedly) but that is a
drafting brief, not a recorded decision, so each item is left to Wayne and Robert.

### Election, grace and faith

1. **T1** — lessons/CTSJohn/2.json b021 (EN+ES 'El nuevo nacimiento es obra suya antes de ser nuestra elección'); units/CTSJohn/2.json mc 9 why ('the new birth is God's work before it is our choice'); MC 9 keyed answer 'the Holy Spirit's (God draws us)'
   - Passage: And mark this well, brother: did you think you became a Christian because one day you decided it on your own? You did not. "No one can come to Me," Jesus said, "unless the Father who sent Me draws him." The new birth is His work before it is ever our choice.
   - Choices: A. Keep as written. / B. 'God's drawing comes before our choice, and the new birth is His work, not ours.' (Reformed and Wesleyan readers both agree that grace goes first, John 6:44; this does not say rebirth comes before faith.) Change MC 9 why to match. / C. 'The new birth is God's work from first to last; we come only because the Father first draws us.'
   - Recommendation: B: it keeps John 6:44 and the 'not our own doing' point, and leaves the order of rebirth and faith open. Minor: MC 9's key credits 'the Holy Spirit' while the verse quoted is about the Father drawing; consider 'God's (the Father draws us; the Spirit gives new birth)'.
2. **T2** — lessons/CTSRomans/1.json b033
   - Passage: The faith that receives it is itself a gift.
   - Choices: A Keep as is (Reformed reading of Eph 2:8). / B "Even the faith that receives it is God-enabled: He draws us and we respond." (fits both prevenient-grace and Reformed views) / C Delete the sentence; the paragraph still says "The whole transaction is from Him".
   - Recommendation: B or C. Both keep the pastoral point without taking a side on whether faith itself is the gift.
3. **T3** — lessons/CTSRomans/4.json b036; units/CTSRomans/4.json mc.15, sa.5
   - Passage: His guilt was imputed to all his descendants by representation, the same way the act of a head of state binds the nation. (b036); MC16 key: "Adam's guilt was imputed to all his descendants by federal headship"; SA6 model same.
   - Choices: A Keep the federal-headship wording. / B "Through Adam, sin and death passed to all; many hold that his guilt is imputed to all (federal headship), others that we inherit a corrupted nature." Change the MC16 key to "Through Adam's sin, sin and death passed to the whole human race" and adjust the SA6 model to match.
   - Recommendation: B. It states what 5:12 says and names both views. If chosen, MC16 key wording and the SA6 model/keywords change.
4. **T5** — lessons/CTSRomans/8.json b022, b023, b025
   - Passage: God chose Jacob. Even within the elect family, the promise advanced by sovereign election, not by birth order or merit. (b022) … They were owed to those God had sovereignly chosen (b023) … Mercy is God's prerogative; hardening is His prerogative; salvation is not owed. (b025)
   - Choices: A Keep. / B Soften to "God's free choice" and note that interpreters differ on whether Romans 9 speaks of individuals' salvation or of nations' roles in history (Jacob/Esau = Israel/Edom, Mal 1:2-3).
   - Recommendation: B. One clause naming the corporate/vocational reading keeps the text neutral on election.
5. **T6** — lessons/CTSActs/6.json b028; units/CTSActs/6.json sa 6 (prompt and model; keywords include 'predestined','foreknowledge')
   - Passage: b028: "Luke says one of the most quietly thunderous things in the New Testament. <em>\"And as many as had been appointed to eternal life believed\"</em> (Acts 13:48, NKJV). The doctrine of election is in the bedrock of Acts. The Lord knows His own, and He calls them when the gospel comes through town." SA 6 model: "...language that points to God's sovereignty in electing those He would save before they ever responded — Luke's phrasing implies the elected were marked out for eternal life in advance. ... those predestined by a sovereign God respond in faith, and Luke credits the growth of the church to His electing hand."
   - Choices: A. Keep as is (Reformed reading of Acts 13:48 stated as the lesson's view). / B. Keep the verse and its weight but present both readings, as Acts 7 b019 already does for Lydia: e.g. b028 '...The verse plainly puts God's appointing first. Reformed Christians read it as unconditional election; Arminian Christians read it as God's appointing of those He foreknew would believe, or of those disposed toward eternal life. Both should let Luke's emphasis stand: the Lord knows His own, and He calls them when the gospel comes through town.' and the SA 6 model rewritten to accept either reading while requiring the verse's emphasis on God's initiative and the people's real believing. / C. Soften only the SA 6 model ('marked out... in advance', 'His electing hand') so students are not graded on one reading, leaving b028 as the author's view.
   - Recommendation: B — it matches the neutral pattern the site already uses in Acts 7 b019 (Lydia), keeps Acts 13:48 central, and stops grading one side of a live debate. Reserved for Wayne/Robert; no edit made. Any SA 6 change will need the keyword pass (F2.26 already flags SA 6 keywords).
6. **T7** — lessons/CTSActs/7.json b040; units/CTSActs/7.json sa 9 (model; keyword 'elect'/'elec')
   - Passage: b040: "I have many people in this city. The Lord knew the elect of Corinth before Paul knew their names." SA 9 model: "...meaning God already had many elect people in that city whom Paul had not yet met, hidden believers-to-be... God may have many people already marked for salvation hidden in a seemingly hostile city..." (keywords include 'elect').
   - Choices: A. Keep as is. / B. Neutral wording that keeps the verse's comfort: b040 'The Lord knew His people in Corinth before Paul knew their names.' SA 9 model '...God already knew many people in that city who would believe, whom Paul had not yet met...' and drop 'already marked for salvation'. / C. Keep b040 but add the same both-views sentence used in Acts 7 b019 (Lydia), and soften only the SA 9 model.
   - Recommendation: B — Acts 18:10 says 'I have many people in this city'; foreknowledge wording fits both Reformed and Arminian readers without changing the encouragement. Reserved for Wayne/Robert; no edit made. If changed, the 'elect' keyword must go to the keyword pass.

### Romans 7: who is the "I"? (also F1.8)

7. **T4** — lessons/CTSRomans/6.json b025, b036; units/CTSRomans/6.json mc.5, sa.3, sa.5
   - Passage: The "I" that wants the good is the new self — the believer regenerated by the Spirit. (b025); MC6 marks "Paul's pre-conversion self" wrong; SA4/SA6 models; b036 "this is the cry of a believer — not an unbeliever".
   - Choices: A Keep (regenerate reading). / B Add one sentence to b025 noting that many (e.g. Wesleyan/Arminian) read 7:14-25 as the awakened but unregenerate man under law. Rewrite MC6 to ask "According to this lesson, the 'I' who wants the good is:", or replace option 2 with a clearly wrong distractor. / C Present both readings and make SA6 "explain the lesson's reasons for reading the cry as a believer's".
   - Recommendation: B. MC6 currently marks a mainstream reading wrong. Framing it as "according to this lesson" keeps the answer index and the difficulty.

### Eternal security and assurance

8. **T8** — lessons/CTSJohn/7.json b025 first sentence (ES 'Y lo que compra a tal precio, no lo pierde.'); echoed in units/CTSJohn/7.json mc 17 why and sa 9 model ('This is the security of the believer... a hand from which no enemy can ever snatch them away')
   - Passage: And what He buys at such a price, He does not lose.
   - Choices: A. Keep as written (eternal security stated firmly). / B. 'And what He buys at such a price, He holds in His own hand.' Keep the rest; MC 17 why and SA 9 model already stay close to John 10:28-29. / C. Keep A and add one sentence noting that Christians differ on whether a believer can turn away from Christ, while all agree no one can snatch them from His hand.
   - Recommendation: B: it restates what the verse says (no one snatches them) without settling the question of apostasy, which fits an open-question stance. SA 9 model can stay; its 'security' is tied to the verse. The keyword pass (F2.27) should make sure 'Christ does not keep His sheep' cannot pass.
9. **T9** — lessons/CTSRomans/10.json b049; units/CTSRomans/10.json sa.8
   - Passage: <em>Able to establish you</em> — the doctrine of perseverance. (b049); SA9 model "'Able to establish you' = the doctrine of perseverance."
   - Choices: A Keep. / B "Able to establish you — God's power to keep His people standing."
   - Recommendation: B. It says what 16:25 says without naming a contested doctrine. If chosen, the SA9 model changes too, so the keywords need checking again.
10. **T10** — units/CTSRomans/3.json sa.9; lessons/CTSRomans/4.json b015, b047; lessons/CTSRomans/7.json b016, b043, b051
   - Passage: "…the believer's standing rests on something already finished and unchangeable" (U3 SA10); "a fact already accomplished and standing forever" (U4 b015); "settled it forever in our favor" (U4 b047); "Not now, not in the future, not ever." (U7 b016); golden chain "already accomplished" (U7 b043); "Not one. Not now, not ever." (U7 b051)
   - Choices: A Keep (these mostly paraphrase 8:1, 8:30, 8:38-39). / B Change only the wording that goes past the text, e.g. U4 b015 "standing forever" -> "a settled verdict", and leave the verse paraphrases.
   - Recommendation: A for the 8:1/8:38-39 paraphrases, which are Scripture's own claims. For U3 SA10 and U4 b015, Wayne/Robert should confirm.

### End times

11. **T11** — lessons/CTSRomans/8.json b043; units/CTSRomans/8.json mc.17, sa.7
   - Passage: There is no second covenant alongside the new covenant in Christ's blood. There is no separate destiny for ethnic Israel apart from the church. (b043); MC18 why "There is no separate destiny for ethnic Israel apart from the church."; MC18 option 2 "A separate millennial program for ethnic Israel apart from the church" marked wrong.
   - Choices: A Keep. / B Delete the "no separate destiny" sentence from b043 and from the MC18 why. Change MC18 option 2 to a clearly wrong distractor (e.g. "Salvation for Jews by keeping the law apart from Christ"). Keep the key.
   - Recommendation: B. It keeps the lesson's two-reading neutrality and the answer index (3). The SA8 model is already neutral.
12. **T12** — _review/french/CTSMatt/CTSMatt-unit11-fr.json b011, MC2, SA1; CTSMatt-unit13-fr.json b025, b029, MC16, MC18 (@1d3af426)
   - Passage: NKJV Matt 24:3 "...what will be the sign of Your coming, and of the end of the age?"; Matt 28:20 "...I am with you always, even to the end of the age." French draft unit 11 b011: « ...quel sera le signe de la fin du monde ? Le texte grec dit littéralement « l'achèvement de l'âge », c'est-à-dire la fin de l'époque présente. »
   - Choices: A. Keep Segond's 'la fin du monde' in quotations, with the existing one-time gloss « l'achèvement de l'âge » (current drafts). / B. Keep Segond in quotations, but use 'la fin de l'âge' in the lesson's own sentences and in the exam stems and options (keywords already accept 'fin de l'âge'). / C. Quote a French version that reads 'age/siècle' at these verses (this departs from the Segond convention used across the edition).
   - Recommendation: A. The gloss already gives the literal sense. The English lesson leaves the A.D. 70 and final-coming readings open (b015). Making the exam options 'fin du monde' (Segond) means students are not graded on a reading the lesson does not take. Wayne or Robert to confirm.

### Denominational framing

13. **T13** — src/content/units/CTSMatt/9.json mc.6.options.0
   - Passage: Q: "According to the lesson, the 'rock' on which Christ builds His church is:" Option A: "Peter made the first pope" (ES "Pedro hecho el primer papa")
   - Choices: A. Keep as is. / B. Neutral distractor that tests what the lesson teaches: "Peter himself, as a man" / "Pedro mismo, como hombre" (the lesson says 'not built on a man'). / C. Unrelated neutral distractor, e.g. "The Mount of Olives" / "El monte de los Olivos".
   - Recommendation: B. It tests the petros/petra point the lesson teaches without naming the papacy. It also fixes the grammar (A does not complete the stem). The answer index stays 2.
14. **T14** — src/content/lessons/CTSMatt/12.json b027 (EN+ES; French draft unit 12 b027)
   - Passage: "My own great-grandfather left one church to become a Baptist the day a priest told him, \"I have the power to forgive sin\" — for that power belongs to Christ alone."
   - Choices: A. Keep as written (the professor's own testimony). / B. Keep the testimony but drop the label: "...left his church the day a priest told him...". / C. Remove the sentence (the point about one Mediator stands without it).
   - Recommendation: A. It is Dr. Cook's personal story in his own voice and names no other church. Nothing is tested on it. Choose B if the French edition must avoid denominational labels.

### Women in ministry

15. **T15** — lessons/CTSRomans/1.json b024; units/CTSRomans/1.json mc.3.why, fill.6, sa.1; lessons/CTSRomans/10.json b033, b034, b037; French drafts unit 10
   - Passage: The letter was carried to Rome by a woman named Phoebe, a deaconess from the nearby seaport church of Cenchrea. (U1 b024; also U1 MC4 why, Fill 7, SA2 model); U10 b033 "She was a recognized minister of the church in Cenchrea"; French drafts: Segond "diaconesse", "Junias (Junia)" with a gloss.
   - Choices: A Keep "deaconess" and the French notes. / B Use the NKJV's "servant (Greek diakonos)" in Unit 1 and in the French notes, and keep the Junia gloss as is.
   - Recommendation: B. It matches the NKJV and CTS's stated neutrality. The Junia note ("ancient readers most often understood it as the woman's name Junia") is accurate and can stay.

### French edition conventions

16. **D1** — French review drafts, all Batch 2 courses
   - Passage: French drafts mix Segond's « païens » and « non-Juifs » for "Gentiles".
   - Choices: A. « païens » inside Segond quotations, « non-Juifs » in the lesson's own sentences (current majority practice). / B. « païens » everywhere (Segond). / C. « non-Juifs » everywhere, with Segond quoted exactly but glossed once.
   - Recommendation: A: it keeps Segond exact and avoids a word that can sound insulting in Congolese church usage.
17. **D2** — French review drafts, CTSJohn (and later courses)
   - Passage: John drafts call the Spirit « le Consolateur » (Segond) and mention « Paraclet » once.
   - Choices: A. « le Consolateur » as title, « Paraclet » glossed once (current). / B. « le Paraclet » as title.
   - Recommendation: A: Segond's word, familiar to readers of Segond.
18. **D3** — French review drafts (Matthew 18:22 and wherever quoted)
   - Passage: Segond reads « septante fois sept fois »; drafts gloss once: « septante, c'est-à-dire soixante-dix ».
   - Choices: A. Quote Segond and gloss once (current). / B. Replace with « soixante-dix » outside quotations only.
   - Recommendation: A: it follows the settled convention of quoting Segond exactly; the gloss serves readers in Kinshasa, where « septante » is uncommon.
19. **D4** — French review drafts, course headers (Joshua, Matthew, Acts)
   - Passage: Intensive course names appear in several forms; Joshua drafts have three.
   - Choices: A. « Cours intensif sur Matthieu » pattern for every intensive. / B. « Matthieu : cours intensif ».
   - Recommendation: A, applied when the drafts are imported.

### Diagram language

20. **D5** — French review drafts with diagrams (e.g. Matthew 11)
   - Passage: Where English pages show English and Spanish diagram labels side by side, the French drafts show French and English.
   - Choices: A. French/English (current). / B. French only. / C. French/Spanish, like the site's bilingual design.
   - Recommendation: Robert to decide how French diagrams render (a site/template question as much as an editorial one). A keeps the source visible for reviewers until then.

### For awareness (no decision needed unless Wayne disagrees)

- Romans 5 SA 3: the model answer said baptism is "more than symbol"; the lesson (b025) says the water pictures union with Christ. The model now follows the lesson (F2.21). If the course should not take the symbolic view, the lesson itself is the place to change.
