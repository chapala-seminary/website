# A-C5 R5 exact contributor decomposition and rights gate

**Independent source audit | 28 October 2026 | nonproduction handoff only**

## Result

The provisional A-C5 R5 window, “THE LORD IS SENDING MISSIONARIES,” is **not one reading by one author**. In exact staged issue-13 blob `7aedd4c62e54e4d9f350ee1c56615cb45decb3d9`, the window at UTF-16 offsets `[59071,62807)` contains a heading plus **five distinct segments**, totaling 3,736 characters and 661 alphanumeric tokens under this audit's tokenizer.

The official Apostolic Faith archive separately lists an **original facsimile** and a modern reproduction for issue 13: https://www.apostolicfaith.org/library/azusa-papers . The staged text came from the readable reproduction. Original page-image collation and contributor-specific Mexico rights verification remain mandatory.

This report identifies source voices and narrows the remaining work. It does **not** clear any passage, approve a five-reading design, provide a legal opinion, or authorize translation/publication.

## Exact segment register

| Segment | Exact source offsets | Characters | Audit tokens | Source voices visible in staged text | Current disposition |
|---|---:|---:|---:|---|---|
| Heading | `[59071,59105)` | 34 | 5 | Institutional heading | Not a self-contained work. |
| Egypt | `[59105,59493)` | 388 | 63 | First-person unsigned item ending “SGS. Brelsford,” apparently a reproduction/OCR form of a Brelsford name | **HOLD:** exact signature must be read from facsimile; identity and death date not established from this text. |
| Ceylon | `[59493,60265)` | 772 | 139 | Editorial bridge plus two quoted letters attributed to “Brother A. H. Post” | **HOLD:** attributed writer identified only by initials in the paper; letter dates, original wording, and identity/death evidence are not settled. |
| Ireland | `[60265,60984)` | 719 | 130 | First-person plural letter signed “Brother and Sister Thos. Griffin,” followed by an editorial parenthesis | **HOLD:** two correspondents are jointly credited; Mrs. Griffin is unnamed and both identities/death dates remain unresolved. Do not reduce this to Thomas Griffin alone. |
| Johannesburg | `[60984,62251)` | 1,267 | 219 | Editorial report about eleven unnamed Indianapolis missionaries; Brother and Sister H. M. Turney; an anonymous Johannesburg letter; closing editorial sentence | **HOLD:** composite item with at least four voice classes and multiple unnamed people. It cannot receive one author record. |
| Palestine | `[62251,62807)` | 556 | 105 | Editorial report about Brother and Sister T. J. McIntosh, including short statements attributed indirectly to him | **HOLD:** both missionaries are contributors/subjects, Mrs. McIntosh is unnamed, and the narrator is not identified. |

Offsets are zero-based and end-exclusive in `books/A-C5/azusa-issue-13-source.txt`. Token counts use alphanumeric tokens and preserve contractions; they intentionally differ slightly from the earlier normalized-word count.

## Identity and edition findings

1. The official Apostolic Faith history says issue 13 was published in Los Angeles in May 1908 after Florence Crawford moved to Portland, and that later publication responsibility moved to Portland: https://www.apostolicfaith.org/doctrinal-and-historical/florence-crawfords-testimony . This transition evidence does **not** identify the writer/editor of each R5 bridge.
2. The same institution describes Florence Crawford, Clara Lum, and other workers as participating in the early newspaper work: https://www.apostolicfaith.org/doctrinal-and-historical/headquarters-office-publication-ministry-roots . Collective production context is not a safe basis for assigning every unsigned paragraph to any one person.
3. Later historical scholarship identifies **George Brelsford and his wife** as early Pentecostal missionaries to Egypt and identifies **A. H. Post** as an Azusa participant and former missionary to India (source: https://biblicalstudies.org.uk/pdf/cjpcc/02-1_001.pdf). Those findings make the paper's “SGS. Brelsford” string especially important to verify against the original image, but they do not prove the exact signature, spouse's identity, death dates, or rights status.
4. A South African church-history study places **H. M. Turney** on the Apostolic Faith Mission's early executive council as treasurer (source URL returned through University of Johannesburg/Ex Libris: https://s3.eu-central-1.amazonaws.com/eu-st01.ext.exlibrisgroup.com/27UOJ_INST/storage/alma/D0/B6/7D/01/12/6C/76/00/FE/66/B4/52/BD/41/3B/52/uj_10008%2BCONTENT6%2BCONTENT6.1.pdf). That corroborates a South African H. M. Turney connection but does not establish authorship of the R5 Johannesburg prose or the Turneys' death dates.
5. No sufficiently reliable evidence was found in this audit to identify the Griffins, the anonymous Johannesburg correspondent, Mrs. McIntosh, the eleven Indianapolis missionaries, or the editor of the five bridge passages.

## Consequences for the proposed reading

- Do not publish R5 as a single-author reading.
- Do not apply William J. Seymour's death date, Florence Crawford's death date, or a periodical-wide pre-1931 rule to all of its letters and quoted voices.
- If R5 is retained, treat each of the five segments as a separate source unit and create paragraph-level attribution records after facsimile collation.
- The Johannesburg segment is the least suitable for straightforward reproduction because it combines unnamed travelers, the Turneys, an anonymous letter, and editorial framing.
- The Ireland segment requires two contributor records, not one; the phrase “Brother and Sister Thos. Griffin” does not supply the wife's personal name.
- A safer fallback is an original CTS historical digest that links to the facsimile and paraphrases only verified facts, without reproducing unverified contributors' prose.

## Required next evidence

1. Open the original issue-13 facsimile and record printed page/column coordinates, exact signature typography, and all differences from the reproduction for `[59071,62807)`.
2. Resolve whether the Egypt signature reads G. S. Brelsford or another form; retain the staged “SGS.” string as unverified until the image is read.
3. Build separate identity/death/permission records for A. H. Post; both Griffins; both Turneys; both McIntoshes; and any named Johannesburg/Indianapolis contributors.
4. Record “anonymous/collective editorial” for each unresolved bridge and the Johannesburg letter; do not infer authorship from later institutional history.
5. Obtain Wayne's academic and rights decision on whether a six-voice composite window can count as one substantive reading.
6. Only after exact source, rights, and academic approval, regenerate EN/ES/FR materials and validate the private 40-question bank against the approved version. No production merge or deployment.
