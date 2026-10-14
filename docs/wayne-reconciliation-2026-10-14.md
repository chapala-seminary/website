# Wayne's editorial directions — 14 October 2026

Source: Wayne's message supplied by Robert in Codex; Robert authorized implementation.
Prepared against beta `af4cb3d3`. No student identity or submitted work is retained.

## This change

- Reading rooms identify historical authors' viewpoints as their own, with a
  notice welcoming supported evangelical alternatives and a route to request
  review of an automated score. Wesley's Galatians, Holy Spirit and Systematic
  Theology shelf captions identify his Arminian tradition rather than
  attributing his positions to CTS.
- Joshua's reading room, textbook introduction and all three standalone
  Blaikie readers carry the racial/colonial-language notice. Reader generators
  use the same wording, so regeneration retains it.
- Acts 6 SA6 and its lesson distinguish Reformed and Arminian readings of
  Acts 13:48. Acts 7 SA9 and its lesson emphasize the Lord's presence and care
  without requiring unconditional election. Independent supported answers in
  EN/ES/FR are checked against the shipped grader. Existing completion keys
  and passing records are unchanged.
- French passages referring to the Great Commission use « Grande Commission ».
  Ordinary secular counseling, work, history and wellness use « séculier »
  with the appropriate grammatical ending. Non-sacred uses and Scripture
  quotations retain « profane ». Historical review snapshots retain their
  provenance; the published fields are edited and marked `machine-edited`.
- Pentecostal textbook Q24 now asks about immediate healing, using the book's
  actual sentence; Q31 now tests its explicit “Global South” wording. Q17 is
  supported by the book's Holiness three-stage paragraph. World Religions Q27
  now asks for Vedanta in Clarke's named trio of philosophical systems, from
  the assigned Chapter III §6 selection. EN/ES bank sources and correction
  ledgers retain the changes on re-import; French keys are updated together.
- For these two corrected banks, revised test pages reset unfinished attempts and remove waiting periods
  imposed by the old questions. Existing pass dates, pass lists and server
  completions remain intact. The revision mechanism keeps the wait for a
  failed attempt on the current questions and for unrelated bank revisions;
  students see why an old attempt was restarted in their language. A learner
  who already passed instead sees that the earlier pass remains valid.

French remains a draft pending theological review. Wayne intends to ask
Pastor Aimé Kalo; this does not establish a confirmed reviewer or sign-off.
Review answer keys first, then Scripture and theological terminology.

## Three historical claims checked

The latest brain main (`ffe694f`) identifies the three claims in Old Testament
Survey, units 3 and 13. The source checks led to these corrections in EN/ES/FR:

- **Unit 13 b038:** replace the Edinburgh/immigrant/grave-inscription account
  with a short, attributed account of Fido in Luco di Mugello, Italy. The
  local [Borgo San Lorenzo tourism guide, printed page 7](https://www.mugellotoscana.it/images/Libretto_a_spasso_per_Borgo_IT_2020.pdf)
  identifies the dog, the 1943 factory bombing and the monument. The unsupported
  Edinburgh setting and grave inscription are withdrawn.
- **Unit 3 b009:** withdraw “82 funerals per day.” Even the paragraph's own
  two-million/forty-year arithmetic gives roughly 137 daily, not 82; neither
  number is a biblical daily count. Replace the estimate with the judgment
  described in [Numbers 14:29–35](https://www.biblegateway.com/passage/?search=Numbers+14%3A29-35&version=NKJV),
  identifying the condemned numbered generation and the stated exceptions.
- **Unit 3 b037, MC10 explanation and SA7 model:** remove the claim that the
  disobedience was forty years before Moses' death. Distinguish the later
  [Numbers 20:8–12 incident](https://www.biblegateway.com/passage/?search=Numbers+20%3A8-12&version=NKJV)
  from Exodus 17. [Deuteronomy 32:51](https://www.biblegateway.com/passage/?search=Deuteronomy+32%3A51&version=NKJV)
  names Meribah Kadesh as the reason for exclusion;
  [Numbers 33:38](https://www.biblegateway.com/passage/?search=Numbers+33%3A38&version=NKJV)
  dates Aaron's subsequent death in the Numbers 20 sequence to year forty.
  The date inference is stated as a distinction between the two incidents,
  not a new precise date for Moses' action. Scripture quotations and answer
  indexes are preserved.

## Scripture choices stay open

The designated translations remain NKJV (English), RVG for unit-course
Spanish, and Louis Segond 1910 for French. Some historical textbook readers
use Reina-Valera 1960, as their existing edition notice specifies; do not
silently change those quotations or conflate those edition-specific keys.
Accept appropriate equivalents from each assessment's designated translation.

Existing reviewer annotations are retained in `_review/french/BATCH*-FINDINGS.md`
and the individual unit review packets. Specific open choices include:

| Passage / location | Theological reviewer question |
|---|---|
| Job 13:15, Bible Characters II | Segond wording differs substantially from NKJV; preserve the difference and review the lesson's interpretation and key together. |
| Hebrews 9:14, Holy Spirit 3/5 and Pentecostalism 2 | Review Segond's « un esprit éternel » against the lesson's argument; do not silently capitalize or substitute another version. |
| Genesis 1:2, Psalm 51:11, Zechariah 4:6 and Judges | Review lowercase « esprit » and any explanatory gloss; case alone must not invalidate an equivalent answer. |
| Genesis 6:6 / Jonah 3:10 | Review « se repentit » and the explanation of God's action; no silent harmonization. |
| Proverbs 27:17, Practical Theology 8 | Review Segond's wording and its difference from the sharpening imagery used by the lesson. |
| Esther / Ruth | Review « le bois », « Assuérus » / « Xerxès », and « celui qui a droit de rachat » against the designated edition before changing assessment keys. |
| Acts 13:48 and 18:9–10 | Scripture quotations remain as supplied. In particular, the French Acts 18 quotation includes an extra « parle »; leave it explicitly flagged for comparison with Segond by the reviewer. The surrounding model changes do not approve that quotation. |

This is a reviewer checklist, not a claim that those choices have been resolved.

## Public requirements reconciliation

Read-only HTTP checks on 14 October found production at `2026-10-06 431b826`
and beta at `2026-10-14 af4cb3d3`:

| Surface | Current beta evidence | Production disposition |
|---|---|---|
| `CTSBeforeYouBegin.html` | Th.M. 15: seven foundation courses plus eight electives, in EN/ES/FR | Production still says 12 / five electives; open until authorized promotion and live verification. |
| Home / registration guidance | Th.M. 15; signup email labeled required | Production email field still says needed for a certificate. |
| `CTSThMCertificate.html` | 15-course notice and `TOTAL_REQUIRED=15`; French dictionary agrees | Deployed cross-surface acceptance remains part of production promotion. |
| Browser and Worker degree rules | Both `DEGREES.thm.courses` are 15 | Existing degree tests cover 14/15 and required foundation boundaries. |
| New signup | Required form field and API validation already on beta | Existing email-less students must retain access and recovery. Verification remains separate from enrollment. |
| Student messages | No separate conflicting Th.M. count found in Worker email/outreach copy | Review actual notices during release acceptance; no real messages sent here. |

No production item is closed merely because it is corrected on beta.

## Remaining work

- Server grading: include all 120 Genesis short answers, meaning-aware
  assessment, useful question-level feedback, supported denominational and
  Scripture-wording alternatives, and preservation of valid prior completions.
  French Genesis keyword drafts are not a runtime repair. Use the existing
  `docs/short-answer-keyword-repairs.md` and brain server-completion plan;
  this PR does not implement server grading or change thresholds.
- Anonymous Unit 7 report: scores of 5/10–8/10 without question feedback.
  Course/page/questions/answers remain pending from Wayne. Handle any actual
  answers outside Git; no exact-case diagnosis is claimed.
- Unsupported questions: Pentecostal Q17 was source-checked; Q24/Q31 and World
  Religions Q27 are corrected above. Beta's Pentecostal Q29 now asks about
  the book's investment-contract wording rather than Malachi, and Deaconship
  Q11 asks what the church recognizes at ordination; those source-based
  replacements predate this PR. This does not establish a complete audit of
  every bank. Do not enable the staged World Religions replacement merely
  because it exists; its bilingual review and OCR-source check remain open.
- The three identified historical corrections above still need faculty review
  and deployed verification before production closure.
- Obtain the original October 9 list and reconcile every item separately with
  deployed evidence. Do not close it wholesale from subsequent PRs.
- The latest French report supersedes the Unit 1 drafting task. Retain that
  earlier request only as history, not as the current next action.

Production promotion and complete faculty review remain separate from this PR.
