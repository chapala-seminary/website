# Review of ChatGPT's "23 fixes" to seven live textbook exams

**Source:** Google Drive `CTS_Seven_Existing_Textbook_Exam_Source_Alignment_23_Fixes_2026-10-10.zip` (id `1pBiQZ0SjxgxJ94JRdlLu_UPklMbMrhAq`, uploaded 11 Oct 2026). Its "before" checksums match the live files in the website repo exactly, so every proposal applies to what students see today.

## Summary

- **23 proposals checked: 10 APPROVE, 4 APPROVE WITH CHANGE, 9 REJECT.**
- **No student's score changes either way.** In 21 of the 23, the old answer and the new answer are both accepted already. The proposal only changes which word the exam shows as "Answer:" when a student gets it wrong. The other 2 also reword the question.
- **Why so many rejections:** ChatGPT's test was "does this word appear *anywhere* in the book?" Several of its new answers come from an unrelated sentence. For example, "aceptan" comes from a sentence about Mormons, "obras" from Ephesians 2, and "rechazo" from "rechazo de facciones". In those cases the current answer is closer to what the book actually says.
- **Two questions are not supported by the book at all**, and swapping the answer word cannot fix them: Pentecostal Q29 (the book never mentions Malachi) and Deaconship Q11. Optional replacement questions taken from the book's own sentences are given below.

Numbering: Q# = position in the exam's question list, counting from 1 (ChatGPT's numbering is the same). The JSON at the end uses 0-based `index` = Q# − 1.

## Cults (3 proposals — 0 approve, 3 reject)

| Q# | Lang | What it asks now | Proposed | Verdict | Reason |
|---|---|---|---|---|---|
| 8 | ES | "Los cristianos no inventan el evangelio; lo ____." Answer **reciben** (also accepts aceptan, heredan) | Show **aceptan** | **REJECT** | The Spanish book says "No inventamos el evangelio; **lo recibimos**", so "reciben" is the book's verb. "Aceptan" appears only in a sentence about Mormon scripture. |
| 24 | ES | "…el Verbo verdaderamente se hizo ____." Answer **carne** (also hombre, humano) | Show **hombre** | **REJECT** | "Se hizo carne" is John 1:14 and matches the English "became flesh". "Hombre" was picked up from a different sentence ("verdadero hombre"). |
| 31 | ES | "Jesús dice que los falsos profetas se conocen por sus ____." Answer **frutos** (also fruto, obras) | Show **obras** | **REJECT** | Jesus says "por sus frutos" (Mt 7:16), and the book says "Jesús habla del fruto". "Obras" comes from the Ephesians 2 paragraph and has a different meaning. |

## Deaconship (4 proposals — 3 approve, 1 reject)

| Q# | Lang | What it asks now | Proposed | Verdict | Reason |
|---|---|---|---|---|---|
| 1 | ES | "En su raíz, la palabra diácono significa ____." Answer **servidor** (also siervo, ministro) | Show **siervo** | **APPROVE** | The book says "un diácono es un **siervo** o ministro". "Servidor" is never used. |
| 9 | EN | "Howell rejects the idea that a ____ man is automatically disqualified…" Answer **single** (also unmarried, bachelor) | Reword to "…that being ____ automatically disqualifies a man from the deaconship." Answer **unmarried** | **APPROVE** | The book says "an **unmarried** man". The new wording avoids the awkward "a unmarried", and "single" stays accepted. |
| 11 | EN | "Ordination recognizes character and ____ already present." Answer **calling** (also call, gifts) | Show **gifts** | **REJECT** | The book's sentence is "Ordination does not manufacture spiritual character. The church recognizes what should already be present." It names neither "calling" nor "gifts", so the swap fixes nothing. See the optional rewrite below. |
| 40 | ES | "…el diácono es ante todo un ____." Answer **servidor** (also siervo, siervo de Cristo) | Show **siervo** | **APPROVE** | The book's closing line is "Un diácono es ante todo un **siervo**." |

## Doctrinal Preaching (2 proposals — 2 approve with change)

| Q# | Lang | What it asks now | Proposed | Verdict | Reason |
|---|---|---|---|---|---|
| 24 | ES | "…una invitación honesta a «____ quiera»." Answer **todo el que** (also el que, quienquiera que) | Show **el que** | **APPROVE WITH CHANGE**: show **todo aquel que**, and keep "todo el que", "el que" and "quienquiera que" accepted | The book says "a **todo aquel que** quiera venir" (the Reina-Valera wording). ChatGPT's "el que" was matched from a sentence about Christ. |
| 36 | ES | "…elija una idea ____." Answer **rectora** (also central, principal) | Show **central** | **APPROVE WITH CHANGE**: show **gobernante**, and keep "rectora", "central" and "principal" accepted | The book says "Seleccione una idea **gobernante**". "Central" comes from a different chapter. |

## Narrative Preaching (2 proposals — 1 approve, 1 reject)

| Q# | Lang | What it asks now | Proposed | Verdict | Reason |
|---|---|---|---|---|---|
| 6 | ES | "…encontrar la unidad ____." Answer **de predicación** (also narrativa, del sermón) | Show **narrativa** | **REJECT** | The English book says "**preaching** unit", and "de predicación" is its exact translation. The Spanish book just says "la unidad". "Narrativa" only shows up elsewhere in the book. |
| 19 | ES | "…ese error se llama ____." Answer **moralizar** (also moralismo, moralización) | Show **moralismo** | **APPROVE** | The Spanish chapter title is "Significado teológico sin **moralismo**", and a noun fits "se llama ____" better than a verb. |

## Pentecostalism (5 proposals — 2 approve, 3 reject)

| Q# | Lang | What it asks now | Proposed | Verdict | Reason |
|---|---|---|---|---|---|
| 23 | EN | "…not only what happened during it, but what happened ____." Answer **afterward** (also after, afterwards) | Show **after** | **REJECT** | "What happened after." is poor English. The book says "what followed it", so "afterward" is the natural answer. |
| 25 | ES | "La afirmación «Dios me dijo» debe ser ____…" Answer **probada** (also examinada, evaluada) | Show **evaluada** | **APPROVE** | The same section of the book says "1 Corintios 14 exige que la profecía sea **evaluada**". Both words are fine, and this one is the book's. |
| 29 | EN | "Malachi 3:10 belongs to Israel's covenant setting and must not become a Christian money-back ____." Answer **guarantee** | Show **promise** | **REJECT** | The book never mentions Malachi, tithing or "money-back", so the whole question is unsupported and changing the answer word doesn't help. See the optional rewrite below. |
| 29 | ES | Same question in Spanish. Answer **garantía** | Show **promesa** | **REJECT** | Same reason as the English version. |
| 32 | ES | "…las cifras sobre Irán deben fecharse y ____." Answer **matizarse** (also calificarse) | Show **calificarse** | **APPROVE** | The Spanish book says exactly "deberán fecharse y **calificarse**". "Matizarse" stays accepted. |

## Counseling Situations (4 proposals — 1 approve, 2 approve with change, 1 reject)

| Q# | Lang | What it asks now | Proposed | Verdict | Reason |
|---|---|---|---|---|---|
| 6 | ES | "Elías quedó agotado y ____." Answer **desanimado** (also deprimido, abatido) | Show **abatido** | **APPROVE** | The book says "Elías quedó exhausto y **abatido**". |
| 15 | ES | "…descargar **el** ____ de los padres." Answer **enojo** (also ira, coraje) | Show **ira** (prompt unchanged) | **APPROVE WITH CHANGE**: also change the prompt to "La disciplina debe enseñar en vez de solo descargar **la** ____ de los padres." | The book says "descargar la **ira** del adulto", but "ira" is feminine, so "el ira" would be a grammar mistake on screen. "Enojo" and "coraje" stay accepted, and the grader ignores a leading article. |
| 39 | ES | "Desarrolle una red de ____ antes de una crisis." Answer **derivación** (also referencia, apoyo) | Show **referencia** | **APPROVE WITH CHANGE**: show **referencias**, and accept "referencia", "derivación" and "apoyo" | The book says "una red de **referencias**". The grader does not treat singular and plural as the same word, so the book's plural form should be accepted too. |
| 40 | ES | "Derivar es colaboración, no ____." Answer **abandono** (also rechazo, desentendimiento) | Show **rechazo** | **REJECT** | The book says "Referir es colaborar, no **abandonar**", so "abandono" carries that meaning. "Rechazo" was picked up from "rechazo de facciones" in another section. |

## Worship (3 proposals — 3 approve)

| Q# | Lang | What it asks now | Proposed | Verdict | Reason |
|---|---|---|---|---|---|
| 11 | EN | "…a life marked by justice, mercy, and walking ____ with God." Answer **humbly** | Reword to "Micah 6:6–8 moves from extravagant offerings to justice, mercy, and a ____ walk with God." Answer **humble** | **APPROVE** | The book says "**humble** walking with God". The new wording reads well, and "humbly" stays accepted. |
| 25 | ES | "Dar no es un ____ de entrada…" Answer **cobro** (also pago, precio, boleto) | Show **precio** | **APPROVE** | The book says "La ofrenda no es **precio** de entrada". |
| 35 | ES | "La adoración contextual no es ____ ilimitada." Answer **acomodación** (also adaptación, compromiso) | Show **adaptación** | **APPROVE** | The book says "no significa **adaptación** ilimitada". See the note below about "compromiso". |

## Optional rewrites (not ChatGPT's proposals; for the 2 unsupported questions)

- **Deaconship Q11.** EN: "Ordination does not manufacture spiritual character; the church ____ what should already be present." Answer **recognizes**. ES: "La ordenación no fabrica carácter espiritual; la iglesia ____ lo que ya debe estar presente." Answer **reconoce**. Both are the book's own sentences.
- **Pentecostal Q29.** EN: "Generosity is Christian obedience, not an investment ____ by which a donor purchases a larger return from God." Answer **contract**. ES: "La generosidad es obediencia cristiana, no un ____ de inversión mediante el cual el donante compra de Dios un rendimiento mayor." Answer **contrato**. These are also the book's own sentences, and they don't give away any other question's answer.

## Other problems noticed in the nine exams (short)

1. **Pentecostal Q29 is the most serious issue:** it tests material that isn't in the book (see above).
2. **Answer give-aways when both questions are drawn** (about a 1-in-4 chance per pair). Pentecostal Q16 begins "Azusa's…", which answers Q15 (Azusa). Pentecostal Q17 contains "entire sanctification", which answers Q14. Situations Q40 ("Referral is…" / "Derivar…") hints at Q39.
3. **Worship Q35 accepts "compromiso" in Spanish.** It is a false friend: it means "commitment", not "compromise". Consider removing it.
4. **Pentecostal Q24** ("every unhealed believer simply lacks ____") is only loosely supported. The book says prayer for the sick has no promise of immediate healing, but it never states this claim directly.
5. All 360 questions in the nine exams have exactly one blank in each language. No question is broken in that way.

## Approved edits (machine-usable)

`index` is 0-based. `accept` values are the full replacement list. Applying `approved_edits` never removes a currently accepted answer. `optional_rewrites_not_proposed_by_chatgpt` is separate and should be applied only if Dr. Cook wants the two replacement questions.

```json
{
 "approved_edits": [
  {"slug": "deaconship", "index": 8, "field": "prompt", "lang": "en", "new_value": "Howell rejects the idea that being ____ automatically disqualifies a man from the deaconship."},
  {"slug": "deaconship", "index": 8, "field": "answer", "lang": "en", "new_value": "unmarried"},
  {"slug": "deaconship", "index": 8, "field": "accept", "lang": "en", "new_value": ["bachelor", "single"]},
  {"slug": "deaconship", "index": 0, "field": "answer", "lang": "es", "new_value": "siervo"},
  {"slug": "deaconship", "index": 0, "field": "accept", "lang": "es", "new_value": ["ministro", "servidor"]},
  {"slug": "deaconship", "index": 39, "field": "answer", "lang": "es", "new_value": "siervo"},
  {"slug": "deaconship", "index": 39, "field": "accept", "lang": "es", "new_value": ["siervo de Cristo", "servidor"]},
  {"slug": "doctrinal", "index": 23, "field": "answer", "lang": "es", "new_value": "todo aquel que"},
  {"slug": "doctrinal", "index": 23, "field": "accept", "lang": "es", "new_value": ["todo el que", "el que", "quienquiera que"]},
  {"slug": "doctrinal", "index": 35, "field": "answer", "lang": "es", "new_value": "gobernante"},
  {"slug": "doctrinal", "index": 35, "field": "accept", "lang": "es", "new_value": ["rectora", "central", "principal"]},
  {"slug": "narrative", "index": 18, "field": "answer", "lang": "es", "new_value": "moralismo"},
  {"slug": "narrative", "index": 18, "field": "accept", "lang": "es", "new_value": ["moralización", "moralizar"]},
  {"slug": "pentecostal", "index": 24, "field": "answer", "lang": "es", "new_value": "evaluada"},
  {"slug": "pentecostal", "index": 24, "field": "accept", "lang": "es", "new_value": ["examinada", "probada"]},
  {"slug": "pentecostal", "index": 31, "field": "answer", "lang": "es", "new_value": "calificarse"},
  {"slug": "pentecostal", "index": 31, "field": "accept", "lang": "es", "new_value": ["presentarse con cautela", "matizarse"]},
  {"slug": "situations", "index": 5, "field": "answer", "lang": "es", "new_value": "abatido"},
  {"slug": "situations", "index": 5, "field": "accept", "lang": "es", "new_value": ["deprimido", "desanimado"]},
  {"slug": "situations", "index": 14, "field": "prompt", "lang": "es", "new_value": "La disciplina debe enseñar en vez de solo descargar la ____ de los padres."},
  {"slug": "situations", "index": 14, "field": "answer", "lang": "es", "new_value": "ira"},
  {"slug": "situations", "index": 14, "field": "accept", "lang": "es", "new_value": ["enojo", "coraje"]},
  {"slug": "situations", "index": 38, "field": "answer", "lang": "es", "new_value": "referencias"},
  {"slug": "situations", "index": 38, "field": "accept", "lang": "es", "new_value": ["referencia", "derivación", "apoyo"]},
  {"slug": "worship", "index": 10, "field": "prompt", "lang": "en", "new_value": "Micah 6:6–8 moves from extravagant offerings to justice, mercy, and a ____ walk with God."},
  {"slug": "worship", "index": 10, "field": "answer", "lang": "en", "new_value": "humble"},
  {"slug": "worship", "index": 10, "field": "accept", "lang": "en", "new_value": ["in humility", "humbly"]},
  {"slug": "worship", "index": 24, "field": "answer", "lang": "es", "new_value": "precio"},
  {"slug": "worship", "index": 24, "field": "accept", "lang": "es", "new_value": ["pago", "boleto", "cobro"]},
  {"slug": "worship", "index": 34, "field": "answer", "lang": "es", "new_value": "adaptación"},
  {"slug": "worship", "index": 34, "field": "accept", "lang": "es", "new_value": ["compromiso", "acomodación"]}
 ],
 "optional_rewrites_not_proposed_by_chatgpt": [
  {"slug": "deaconship", "index": 10, "field": "prompt", "lang": "en", "new_value": "Ordination does not manufacture spiritual character; the church ____ what should already be present."},
  {"slug": "deaconship", "index": 10, "field": "answer", "lang": "en", "new_value": "recognizes"},
  {"slug": "deaconship", "index": 10, "field": "accept", "lang": "en", "new_value": ["recognises", "acknowledges"]},
  {"slug": "deaconship", "index": 10, "field": "prompt", "lang": "es", "new_value": "La ordenación no fabrica carácter espiritual; la iglesia ____ lo que ya debe estar presente."},
  {"slug": "deaconship", "index": 10, "field": "answer", "lang": "es", "new_value": "reconoce"},
  {"slug": "deaconship", "index": 10, "field": "accept", "lang": "es", "new_value": ["afirma", "confirma"]},
  {"slug": "pentecostal", "index": 28, "field": "prompt", "lang": "en", "new_value": "Generosity is Christian obedience, not an investment ____ by which a donor purchases a larger return from God."},
  {"slug": "pentecostal", "index": 28, "field": "answer", "lang": "en", "new_value": "contract"},
  {"slug": "pentecostal", "index": 28, "field": "accept", "lang": "en", "new_value": ["deal", "agreement"]},
  {"slug": "pentecostal", "index": 28, "field": "prompt", "lang": "es", "new_value": "La generosidad es obediencia cristiana, no un ____ de inversión mediante el cual el donante compra de Dios un rendimiento mayor."},
  {"slug": "pentecostal", "index": 28, "field": "answer", "lang": "es", "new_value": "contrato"},
  {"slug": "pentecostal", "index": 28, "field": "accept", "lang": "es", "new_value": ["acuerdo", "trato"]}
 ]
}
```
