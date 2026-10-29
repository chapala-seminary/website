# D-C4 — live beta versus staged source: 40-prompt assessment/translation alignment

**Research-only; 28 October 2026. No student-facing edits, private answers, grades, credits or release authorization.**

## Exact inspected evidence

- Live-beta textbook `src/content/textbooks/elecreffour.json`, blob `f111db7715935ab84b21a7ec86cbab3a55efe9ef`, has five integrated chapters, 18,500 whitespace-delimited English words including notes, with English/Spanish/French/Swahili body fields. It explicitly combines Westminster Assembly's *Form of Presbyterial Church-Government* and *Directory for Publick Worship* (1645). Four language fields are not proof of editorial approval.

- Live-beta reading-room body `src/body/rooms/CTSElecRef4Readings.html`, blob `cbf6377fe988ae7faacb80a57820d1a3849d6782`, includes five explanatory digests. Its substantive markup contains English and Spanish blocks; French/Swahili full-room prose was not established by this inspection (check runtime translation/fallback before declaring a missing-language defect).

- Live-beta public reading exam `src/content/readings/elecreffourreadings.json`, blob `ce621d71dee9d8a8a8645ae1c53167c3e443d56e`, has 40 public stems, eight per reading; `keys` is marked private. No accepted answers were read.

- Staged Form source manifest `books/D-C4/SOURCE.md` blob `a319fd521e70589b471fe33631dece290d36ee3b` describes 19 Form sections and a 5,369-word Form-only textbook. Staged `reading-4.md` blob `52113abb1a612c040b9a8d828f74381c5997a7ec` concerns examination/ordination; staged `reading-5.md` blob `d3dff49ee0022d7ca42abad24d8c06c03804ae02` concerns ordination rules. These are **not the same required readings** as the current live-beta R4/R5.

- Staged `SOURCE-directory.md` blob `8243345a62d83bbf362a3736ccc50a8db8a9d496` separately acknowledges the *Directory* and proposed baptism/communion excerpts. The supplemental integration is present in beta; the old Form-only handoff manifest is not a complete description of beta.

## Live-beta five-chapter textbook structure

1. 1. One Church, Many Congregations: Officers and Assemblies

2. 2. Synods and Ordination: Setting Apart Ministers of the Word

3. 3. Gathered to Hear: Reading, Prayer, and Preaching

4. 4. Signs and Seals: Baptism and the Lord’s Supper

5. 5. Holy Days and Life’s Passages: The Lord’s Day to the Psalms


## Live reading versus research-stage reading identity

| Reading | Current beta room/exam topic | Staged `reading-N.md` | Source-identity result |

|---|---|---|---|

| R1 | Christ the Head, and the Officers He Gives | Form §§1–6, church and officers | Related subject, exact evidence/edition still needs mapping |

| R2 | Many Congregations, One Government | Form §§7–13, congregations/assemblies | Related subject, exact evidence/edition still needs mapping |

| R3 | Set Apart by the Laying On of Hands | Form §§14–18, synods/ordination | Related subject, exact evidence/edition still needs mapping |

| R4 | A Seal of the Covenant of Grace — baptism | Form §19, ministerial examination and ordinary ordination rules 1–4 | **MISMATCH: beta tests Directory sacrament material; staged Form ordination excerpt is not an interchangeable assigned source** |

| R5 | Fed by Faith at the Lord's Table — communion | Form §19, ordination rules 5–13 and extraordinary rules 1–4 | **MISMATCH: beta tests Directory sacrament material; staged Form ordination excerpt is not an interchangeable assigned source** |


## All 40 public stems — topical crosswalk, NOT answer-key verification

### R1 — Christ the Head, and the Officers He Gives (8/8)

**Source gate:** Current beta digest and Form primary text; distinguish digest-only contextual statements from original 1645 wording.

1. England and Scotland joined in 1643 under the Solemn League and ____.

2. The Preface presents Christ as the one “upon whose ____ the government is.”

3. The Form says the extraordinary officers, apostles, evangelists and prophets, have ____.

4. In prayer the pastor speaks as “the ____ of the people unto God.”

5. The Form defines catechising as “a plain laying down the first ____” of the faith.

6. A minister who excels in explaining Scripture and teaching sound doctrine may be called a teacher or ____.

7. Church-governors who join the ministers in rule are the officers reformed churches commonly call ____.

8. Deacons do not preach but take special care in distributing to the necessities of the ____.

### R2 — Many Congregations, One Government (8/8)

**Source gate:** Current beta digest and Form primary text; distinguish digest-only contextual statements from original 1645 wording.

1. Congregations are ordinarily divided by the respective bounds of their ____.

2. In the meeting of a congregation’s officers it is most fitting that a minister should ____, that is, chair the meeting.

3. Among the ordinances, the word is to be read even when no immediate ____ follows.

4. The Form names three sorts of assemblies: congregational, classical, and ____.

5. The word “classical” comes from the Dutch and Latin word ____, still used by Dutch Reformed churches.

6. The session may suspend from the Lord’s ____ a person not yet cast out of the church.

7. The first reason for suspension is that “the ordinance itself must not be ____.”

8. The Form’s first proof that many congregations may be under one presbyterial government is the church of ____.

### R3 — Set Apart by the Laying On of Hands (8/8)

**Source gate:** Current beta digest and Form primary text; distinguish digest-only contextual statements from original 1645 wording.

1. On the day of ordination the congregation keeps a solemn ____.

2. The candidate is asked about his persuasion of the truth of the ____ religion according to the Scriptures.

3. He must maintain the truth of the gospel and the unity of the church “against error and ____.”

4. The people promise to submit to their minister “as having ____ over them in the Lord.”

5. The presbytery solemnly sets the man apart by laying their ____ on him.

6. An ordination already received in the Church of England was held “for substance to be ____.”

7. No ____ or gift may be received from the person to be ordained, a rule that guards against simony.

8. In the extraordinary way, godly ministers in or about the city of ____ were to be associated to ordain.

### R4 — A Seal of the Covenant of Grace — baptism (8/8)

**Source gate:** Current beta digest/Directory, not staged Form R4. All eight prompts require Directory/digest passage-span verification.

1. Baptism is not to be administered by any ____ person, but only by a minister of Christ.

2. Baptism is to be administered publicly, “in the face of the ____.”

3. The child is presented for baptism by the ____, or by a Christian friend in his necessary absence.

4. The Directory teaches that baptism is “a seal of the ____ of grace.”

5. According to the Directory, “the promise is made to believers and their ____.”

6. Children of believers are said to be “federally ____ before baptism.”

7. The minister urges everyone present “to look back to their ____.”

8. Baptism by pouring or ____ of water on the face of the child is called lawful and sufficient.

### R5 — Fed by Faith at the Lord's Table — communion (8/8)

**Source gate:** Current beta digest/Directory, not staged Form R5. All eight prompts require Directory/digest passage-span verification.

1. The Directory says the Lord’s Supper is “____ to be celebrated.”

2. When the Supper is held, it is to come after the morning ____.

3. The Directory says that the ignorant and the ____ are not fit to receive the Supper.

4. In Scotland, those found ready for communion received a small metal ____ to hand in at the table.

5. The weak and weary are assured of “ease, refreshing, and ____” for their souls.

6. The communicants are to sit orderly about or at the ____, not kneel at an altar.

7. In this sacrament Christ and all his benefits “are applied and ____ up unto us.”

8. Giving the cup, the minister says, “drink ye ____ of it.”


## Source fidelity and rights gates

The ten specific corrupted phrases catalogued in `WITNESS_CORRUPTION_LEDGER.md` were scanned as exact strings in the current beta English textbook: **0/10 exact defective phrases found**. This does **not** prove complete fidelity; one corrected phrase differs from the ledger's expected normalization and source image collation is still needed. The staged research Form transcription remains an immutable historical handoff, not a live release.

Mexican copyright screen is **NOT CLEARED**: Westminster's 1645 underlying work is a strong historic public-domain candidate, but modern transcript/editorial additions, source-host terms, machine-assisted ES/FR/SW derivatives, biblical quotations and collection scans require independent provenance/rights review. Verify Mexico LFDA Article 29 and separate translation/adaptation protections (Articles 78–79) with counsel before legal approval.

## Concrete faculty/Claude actions

1. Update the research manifest to distinguish (a) staged Form-only slices, (b) supplemental Directory source, and (c) **actual beta** five-reading sequence. Never overwrite historical source witness without a versioned record.

2. Freeze exact beta source blob and build a **nonsecret** per-stem map for all 40 prompts: digest paragraph ID, primary source title/section, edition/page, language source hash and whether a stem depends only on secondary editorial context. Do not infer answer correctness from keyword overlap.

3. Specifically review R1 Q1 (Solemn League historical introduction), R2 Q5 (Dutch/Latin `classis` etymology), and R5 Q4 (Scottish communion tokens) for secondary-source provenance, since these are contextual assertions rather than straightforward verbatim excerpts from the primary standards.

4. Compare actual current room prose and textbook against verified 1645 facsimile, including biblical proof-text apparatus, sacramental positions and editorial glosses. Faculty to decide how to contextualize denominational differences without misrepresenting the historic source.

5. Confirm EN/ES/FR/SW reading-room delivery through the actual runtime, not just source `lang-*` counts; audit translation and typography after source version is frozen. Keep private accepted answers in `assessment-keys`, and preserve existing student credits.

6. **No automatic bank rewrite or student-facing publication.** Recheck exam source identity and faculty approval before any replacement reading is made required.


## EN / ES / FR faculty notice — proposed editorial text, not historical translation

**EN:** The current D-C4 course combines two distinct Westminster Assembly standards. The first three reading-room digests concern Presbyterian polity and ordination; the last two concern baptism and the Lord's Supper in the *Directory for Public Worship*. An older staged Form-only reading set has different R4–R5 content. Confirm the exact assigned version before grading or replacing any examination.

**ES:** El curso D-C4 actual reúne dos documentos distintos de la Asamblea de Westminster. Las primeras tres lecturas tratan del gobierno presbiteriano y la ordenación; las dos últimas tratan del bautismo y de la Cena del Señor según el *Directorio para el culto público*. Un conjunto preliminar anterior tenía otros contenidos en las lecturas 4 y 5. Confírmese la versión asignada antes de modificar cualquier examen.

**FR:** Le cours D-C4 actuel réunit deux textes distincts de l'Assemblée de Westminster. Les trois premières lectures portent sur le gouvernement presbytérien et l'ordination; les deux dernières traitent du baptême et de la Cène dans le *Directoire pour le culte public*. Un ancien ensemble provisoire présentait d'autres textes pour les lectures 4 et 5. Vérifier la version effectivement assignée avant toute modification d'examen.


## Verification limits

This is a source-identity and topical mapping audit, **not** an original-page collation, exact per-question evidence finding, a legal opinion, a translated historical edition, or a review of private accepted answers. It does not establish that the current live-beta questions are unfair: the current five digests appear aligned with their current topics. It establishes that substituting the older research-stage Form-only R4/R5 would be unsafe.
