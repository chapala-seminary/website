# C-C2 — Sermon III authorship, chronology and public-question source audit (28 Oct 2026)

**Scope:** research/faculty handoff only; **no** student data, accepted answers, production or exam modification. This is an additional *source-to-assessment* gate, not a declaration that existing digest-based exams are defective.

## Exact repository evidence

- Staged course manifest: `books/C-C2/SOURCE.md`, blob `c22198db9949279ac44de993a806a7503d39e6a5`. It describes all ten sermons as “John Wesley (1703–1791)” material from *Works*, vol. I (Bristol: William Pine, 1771).
- Staged R2: `books/C-C2/reading-2.md`, blob `bf3fcbf617c31d750ea323bf2a05731edb705762`. It begins `SERMON III.[6]`, Ephesians 5:14, and contains no literal “Charles,” “1742,” “Oxford,” or “preached” in its body. It proceeds into Sermon IV. The `[6]` marker survives without the explanatory note in this extracted window.
- Public beta/main reading prompts: `src/content/readings/elecwestworeadings.json`, blob `d6be0d44cd41d1a865aca4883fe35a6d53a5850d`, 40 prompts (8 per reading); **accepted answers are private and were not read**.
- Staged R1 blob `79125bcde2739c90d5d7e217c5e96729330c1678`; R3 blob `89b7dc66626783ff0ddc90cd2732ae702b75a78d`. R1 explicitly contains “Grace is the source, faith the condition” and “a disposition of the heart,” so the first two public prompts are supported by the original excerpt.
- The 26 Oct reading-independence audit already demonstrates 99.86–99.93% 12-token containment of the five readings in the textbook. This note does not repeat or reclassify that measurement.

## High-priority public-prompt checks (question numbers 1-based)

| Q | Reading | Verified result | Required faculty action |
|---|---|---|---|
| 3 | R1 | Prompt asserts `Salvation by Faith` preached **18 days** after the May 24, 1738 Aldersgate event, implying **June 11**. The *Museum of Methodism / John Wesley's House* and Nazarene WHDL catalog independently give **June 18, 1738**; a *Good News* history gives **June 11**. Neither date nor the Aldersgate anecdote appears in staged R1. | **HOLD historical-date fill-in** until the primary sermon imprint/journal is collated; do not select a date by majority vote or change private accepted answers without faculty approval. |
| 9 | R2 | Public question correctly identifies **Charles Wesley** as preacher of “Awake, Thou That Sleepest.” The Wesley Center reproduces the attribution to Charles and Sunday **April 4, 1742**; an 1832 historical printed sermon title page explicitly names Charles. However, the staged R2 text and C-C2 manifest do not acknowledge Charles as a distinct contributor. | Amend manifest/editorial source attribution (not the historic sermon words) to **Charles Wesley (1707–1788), preached; included in John Wesley's collected Works**; collate 1771 and 1832 title/footnote evidence. Update rights ledger per contributor. |
| 13 | R2 | Prompt adds St Mary's Oxford date and “never invited ... again” history. Neither `1744` nor the invitation claim is established by the staged R2 window. | Treat as **contextual-history question** needing a specifically assigned, verified historical source if replacing CTS digests with staged primary excerpts. |
| 24 | R3 | The prompt invokes the **1763 Model Deed**, the `Notes on the New Testament` and Methodist doctrinal standards; none of those terms occurs in staged Sermons V–VI. The Wesley Center's scholarly introduction supports the historical context, but it is not staged R3. | Attach a rights-reviewed source note/assigned reading or revise this item for source alignment after faculty decision. |

**Additional QA:** Q9's *fact* is not the error; the problem is the manifest's all-John attribution and the missing Charles metadata. Do not remove the question as “incorrect.” Q3's contested historical date is a different, independent potential grading-fairness risk. No inference is made about which private answer the server accepts.

## Evidence outside the staged files (not permission to republish modern editions)

1. Wesley Center, `Sermon 3 - Awake, Thou That Sleepest`: https://wesley.nnu.edu/john-wesley/the-sermons-of-john-wesley-1872-edition/sermon-3-awake-thou-that-sleepest/ — credits Charles Wesley, 4 April 1742.
2. Historical 1832 title-page facsimile: https://wesleyscholar.com/wp-content/uploads/2021/12/Sermon-Awake-Thou-that-Sleepest-1832.pdf — printed author Charles Wesley. **1832 is a later witness, not proof of exact 1771 layout.**
3. Museum of Methodism / John Wesley's House, “A Sermon on Salvation by Faith”: https://wesleysheritage.org.uk/object/a-sermon-on-salvation-by-faith/ — June 18, 1738.
4. Nazarene WHDL institutional repository, `Salvation by Faith`: https://tnu.whdl.org/en/browse/resources/7046 — June 18, 1738; hosted modern transcription has its own usage conditions.
5. *Good News* historical article: https://goodnewsmag.org/wesleys-faith-decision/ — June 11, 1738, conflicting with the preceding catalogs.
6. Wesley Center scholarly introduction: https://wesley.nnu.edu/john-wesley/the-sermons-of-john-wesley-1872-edition/an-introduction/ — describes the 1763 Model Deed and doctrinal standards. This secondary introduction is **not** part of staged Sermons V–VI.

## EN / ES / FR proposed editorial notices (not historic-text alterations)

**EN — source header for R2:** “Sermon III, ‘Awake, Thou That Sleepest,’ was preached by **Charles Wesley** at Oxford on 4 April 1742 and was later included in the collected works published under John Wesley's name. This staged transcription currently omits the separate attribution; verify the original 1771 printed heading and notes before release.”  
**ES — encabezado de R2:** «El sermón III, “Despierta, tú que duermes”, fue predicado por **Charles Wesley** en Oxford el 4 de abril de 1742 y posteriormente se incluyó en las obras reunidas publicadas bajo el nombre de John Wesley. Esta transcripción provisional omite la atribución individual; coteje el encabezado y las notas de la edición de 1771 antes de publicarla».  
**FR — en-tête de R2:** «Le sermon III, “Réveille-toi, toi qui dors”, fut prêché par **Charles Wesley** à Oxford le 4 avril 1742 et fut ensuite inclus dans les œuvres rassemblées publiées sous le nom de John Wesley. La transcription provisoire omet cette attribution distincte ; vérifier l'en-tête et les notes de l'édition de 1771 avant publication.»

**EN — Q3 faculty warning:** “The June 1738 sermon date is disputed across available historical references and absent from the assigned 1771 sermon excerpt. Do not test a single date until a primary witness and the actual assigned student material establish it.”  
**ES — advertencia Q3:** «Las referencias históricas consultadas discrepan sobre la fecha del sermón de junio de 1738, y esa fecha no aparece en el extracto asignado. No se debe examinar una fecha única sin cotejar una fuente primaria y el material realmente asignado».  
**FR — avertissement Q3:** «Les références historiques consultées divergent sur la date du sermon de juin 1738, absente de l'extrait assigné. Ne pas imposer une seule date à l'examen sans confronter une source primaire et le support effectivement attribué aux étudiants.»

## Mexico rights and assessment release gates

John Wesley (d. 1791) and Charles Wesley (d. 1788) each require an explicit contributor record. Their original eighteenth-century words are preliminarily beyond Mexico's general author-life-plus-100 term, **not** a blanket clearance of later annotations, 1832 editorial additions, Gutenberg transcription contributions, new ES/FR translations, or website editorial apparatus. Verify governing Mexican law, edition and translation provenance; faculty/legal approval remains pending. Do not copy modern Wesley Center/WHDL editorial matter into CTS without permission.

1. Faculty decides whether five excerpts of one textbook meet the five-reading standard; preserve prior student credits regardless.
2. Collate the original 1771 Sermon III heading/footnote `[6]` against its page image and document Charles's role; reconcile any 1832/1872 wording.
3. Verify 1738 sermon date with a primary printed title page or dated contemporary record; record the conflicting catalog metadata rather than silently selecting one.
4. Assign a versioned source for contextual questions Q3, Q9, Q13, Q24 if the current digests are replaced; audit all 40 prompts against that **exact assigned version** before any live change.
5. Obtain native EN/ES/FR theological and linguistic review; verify all displayed prompts and the private bank only through authorized private-repo access. Do not write answer keys in this public handoff.
6. No release, exam replacement, grade changes, student-data changes, or retroactive certificate action authorized by this research note.
