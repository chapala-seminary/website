# Swahili translation brief (CTS pilot)

Chapala Theological Seminary (CTS) is a free, non-denominational evangelical seminary. These drafts are reviewed by Rev. Dr. Jacob Wakambi (Malawi) before use.

## Output shape
Write `<COURSE>-unit<N>-sw.json` next to the source file:

```
{
 "course": "...", "unit": N, "title": "<Swahili title>",
 "blocks": [{"id": "<same id>", "sw": "..."}],        // one per source block, same order and ids
 "mc":   [{"stem": "...", "options": ["...x4"], "why": "..."}],
 "fill": [{"prompt": "...", "answer": "...", "accept": ["..."]}],
 "sa":   [{"prompt": "...", "keywords": [["..."]], "model": "..."}],
 "notes": ["..."]
}
```
Write it with a Python script (json.dump, ensure_ascii=False). Then reload and validate: same block ids in order; same mc/fill/sa counts; 4 options per mc (or the source count); every fill prompt has exactly one "____"; each sa has the same number of keyword groups as the source; HTML tags and emojis in each block identical to the source.

## Language
- Standard East African Swahili (Kiswahili sanifu), plain warm teaching style, understood in Kenya, Tanzania and Malawi.
- Scripture names and quotations in Swahili Union Version (Biblia Takatifu, SUV) style: Mwanzo, Kutoka, Yohana, Warumi... Keep verse numbers.
- Some "en" fields contain Spanish duplicates; translate them into Swahili too.
- Preserve HTML tags, emojis, numbers. Dates: "c. 2000 BC" -> "takriban 2000 K.K.", AD -> B.K.
- Hebrew/Greek transliterations stay as-is (yada, agape, logos); add a Swahili gloss only where the English glosses.

## Glossary (use consistently)
God = Mungu; LORD = BWANA; Holy Spirit = Roho Mtakatifu; Trinity = Utatu; Scripture = Maandiko; revelation = ufunuo; inspiration = uvuvio; covenant = agano; sin = dhambi; grace = neema; faith = imani; salvation = wokovu; redemption = ukombozi; Redeemer = Mkombozi; atonement = upatanisho; justification = kuhesabiwa haki; sanctification = utakaso; glorification = kutukuzwa; regeneration = kuzaliwa upya; repentance = toba; church = kanisa; Messiah = Masihi; image of God = sura ya Mungu; Flood = Gharika; evangelicals = Wainjilisti (wahafidhina = conservative); remnant = mabaki; omnipotent = mwenyezi; omniscient = mjuzi wa yote; omnipresent = aliye kila mahali; sovereignty = enzi / ukuu wa Mungu.

## Theology guardrails
Translate faithfully; never add or change doctrine. CTS is Arminian-leaning (conditional election, unlimited atonement, resistible grace) and presents Calvinist/Arminian views and eternal-security questions fairly. Never describe Scripture's own accounts as "myth" (no "hadithi za kubuni"/"visasili" for the Bible).

## Questions
- Multiple choice: keep option ORDER identical; the answer index does not change. "Correct." -> "Sahihi."
- Fill-in: keep "____"; "answer" fits the blank in Swahili; "accept" = 3–5 synonyms / spellings (for names include English and Swahili spellings).
- Short answer: "keywords" = same number of synonym groups in the same order; each group 4–8 lowercase Swahili words/short phrases incl. stems and inflections. "model" = full Swahili model answer, similar length.

## Notes
Under 12 short English notes listing uncertain terms or places where regional usage differs. When done, reply only with: output path, validation result, notes.
