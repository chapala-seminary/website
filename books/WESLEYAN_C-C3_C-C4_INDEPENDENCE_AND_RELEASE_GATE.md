# C-C3 / C-C4 — Wesleyan historical-source independence and release gate
**26 October 2026 | research-only; nonproduction `handoff/book-sources` | not academic or legal approval**

## Decision-quality finding
Both courses have five *different, mostly nonoverlapping passages*, but **none of the ten staged readings is a separate companion work**. C-C3's five readings are 97.64%–99.30% exact 12-word-sequence contained in its Wesley textbook; C-C4's five are **100% exact byte-for-byte substrings** of its 1798 Coke–Asbury OCR textbook. Low reading-to-reading overlap does **not** prove reading independence. Do not describe the ten readings as five independent authors, and do not generate a second nominally independent 40-question bank from the same words. This does not establish anything about the live site or invalidate existing completions.

### Reproducible method
Fetched the exact six staged blobs for each course via GitHub `chapalatheological-ai` on `handoff/book-sources`. For C-C3, normalize Unicode NFKC, lowercase, strip HTML tags, reduce Markdown links to their labels, and tokenize Unicode letters/numbers with optional apostrophes; build sets of unique consecutive 12-token strings. Containment = reading unique 12-grams also found in textbook / all reading unique 12-grams. Longest exact contiguous token runs were verified by extending matched 12-token positions against textbook positions, not inferred from shingle membership alone. C-C4 was additionally tested with raw `textbook.indexOf(reading)`, so literal containment is stronger than normalized matching. This is a *staged-file* test, not a scan/facsimile collation, semantic originality assessment, or release approval. The tokenization here differs slightly from older ASCII-only counts; compare percentages rather than assuming identical word totals.

## C-C3 — Wesleyan Holiness and Sanctification
Textbook: John Wesley, *A Plain Account of Christian Perfection*, 1777 revision as transcribed from Thomas Jackson's 1872 Works vol. 11, pp. 366–446. Staged textbook SHA `0e3de646d69bad971678c69496ac64d5f09b9bec`; **33,953** normalized words. CCEL source: https://www.ccel.org/ccel/wesley/perfection/files/perfection.html ; another institutional public-domain copy: https://www.whdl.org/en/browse/resources/6794 . The original **1872 printed pages have NOT been compared** to the staged text.

| Reading | SHA | Words | Matched / unique 12-grams | Textbook containment | Longest exact run |
|---|---|---:|---:|---:|---:|
| R1, sections 1–6 | `6aac87a45d94490e22f390957ed48c500b7be2d5` | 1,367 | 1,324 / 1,356 | **97.640%** | 1,331 |
| R2, sections 10–12 | `bd87a1f43dc650dac4a77e18172ff119f1ef6e51` | 3,551 | 3,488 / 3,529 | **98.838%** | 3,506 |
| R3, sections 16–18 | `43636dfd71adde2ba05e3deb2ae916c84b6ec973` | 3,108 | 3,054 / 3,094 | **98.707%** | 3,064 |
| R4, section 19 | `44e63e98cfdc430a208b7570649cae9980a28826` | 5,432 | 5,383 / 5,421 | **99.299%** | 5,390 |
| R5, sections 26–28 | `ed2c0c337355a072ccea83e304d79378cc7b19e0` | 1,871 | 1,819 / 1,857 | **97.954%** | 1,829 |

Total assigned reading words: **15,329**, roughly 45% of the full textbook, but these are already inside that textbook. Reading-pair common 12-grams range 25–41, generally repeated provenance/front matter or recurrent text, not large overlapping passages. R1 and R5 are below a suggested 3,000-word minimum for substantial separate historical readings. Exact reading boundaries in `C-C3/SOURCE.md`. Wesley's claims should be presented as his historical position, not as every Methodist or Nazarene body's current doctrine.

**Preliminary rights**: Wesley died 1791 and Jackson died 1874; the 1777/1872 source is old enough for the usual U.S. publication-date and Mexico life+100 screens. This does *not* license modern translations, critical annotations, platform wrappers, or other contributors. WHDL labels its source public domain; verify the specific scan/edition and provider conditions before distribution.

## C-C4 — Methodist/Nazarene Polity
Textbook is an uncorrected OCR of the **1798 tenth edition** of *The Doctrines and Discipline of the Methodist Episcopal Church in America, with explanatory notes* by Thomas Coke and Francis Asbury. Staged `textbook-ocr-1798.txt` SHA `86ef5bcacf4b508fd8ed09aedac8e829f47574bf`, 421,830 characters / **75,129** Unicode-tokenized words. Independent catalog witness: https://wellcomecollection.org/works/j7ym4wgp ; 1798 bibliographic preview: https://books.google.com/books?id=9lZgAAAAcAAJ . This is **not** a current Nazarene manual. The Church of the Nazarene dates its formation to 1908: https://nazarene.org/our-history/ .

| Reading | SHA | Words | Matched / unique 12-grams | Raw byte-for-byte offset in textbook |
|---|---|---:|---:|---:|
| R1 conferences | `8f7cca8c2c3d985da2bf0ff9afded30cba56a200` | 3,164 | 3,153 / 3,153 = **100%** | 61,430 |
| R2 ordained leadership | `947219daae7d522cfc1a3de9878fd3b632c2936b` | 9,099 | 9,088 / 9,088 = **100%** | 80,026 |
| R3 circuit duty | `ff6a7010e28837c77e4216fe45050eec9890f54c` | 11,736 | 11,725 / 11,725 = **100%** | 132,205 |
| R4 ministerial accountability | `e70177c7a357334474e91e67e42e4506d2fb7000` | 11,341 | 11,330 / 11,330 = **100%** | 197,628 |
| R5 membership discipline | `96d7c6267169b37136a1122cc127e715e28a4bda` | 14,153 | 14,141 / 14,141 = **100%** | 305,705 |

Combined assigned reading words: **49,493** (about 66% of textbook). Reading-to-reading 12-gram overlap is zero for most pairs; R3/R5 and R4/R5 share just ten 12-grams each. That apparent independence is a **false positive**: every reading is a literal textbook substring. The OCR remains uncorrected (long-s, page noise, garbling); original printed pages and exact source checksums require collation before student use. The staged reading selection excludes the historical slavery section while the full textbook retains it; the historical context, slavery and race must not be erased or misrepresented. Do not substitute the 1798 polity for contemporary Nazarene polity.

**Preliminary rights**: 1798 original published well before 1931; Coke died 1814 and Asbury died 1816. Underlying historic work appears eligible for U.S./Mexico public-domain screening; modern editorial and repository license/provider restrictions and source-image reproduction still need review. The upstream OCR's rights marker is not a substitute for independent approval.

## EN / ES / FR original editorial digests — not primary-source translations

### C-C3: Sanctification and Christian perfection
**EN:** Wesley traces Christian perfection as wholehearted love of God and neighbor, not absolute knowledge, infallibility, or freedom from human limitations. Students should distinguish gradual growth from Wesley's account of a decisive change, and compare his definitions with later holiness traditions rather than treating all traditions as interchangeable.  
**ES:** Wesley presenta la perfección cristiana como amor íntegro a Dios y al prójimo, no como conocimiento absoluto, infalibilidad ni ausencia de limitaciones humanas. Conviene distinguir el crecimiento gradual del cambio decisivo que él describe y comparar sus definiciones con las tradiciones posteriores de santidad sin confundirlas.  
**FR:** Wesley présente la perfection chrétienne comme un amour entier pour Dieu et le prochain, non comme une connaissance absolue, l'infaillibilité ou l'absence de limites humaines. Il faut distinguer la croissance progressive du changement décisif qu'il décrit et comparer ses définitions avec les traditions ultérieures de sainteté sans les confondre.

**Study prompts EN / ES / FR:**
1. EN: Which imperfections does Wesley explicitly retain? ES: ¿Qué imperfecciones reconoce Wesley que permanecen? FR: Quelles imperfections Wesley reconnaît-il comme persistantes ?
2. EN: How does he relate growth to instantaneous change? ES: ¿Cómo relaciona el crecimiento con el cambio instantáneo? FR: Comment relie-t-il la croissance au changement instantané ?
3. EN: Where does his appeal rest on testimony versus biblical exegesis? ES: ¿Dónde se apoya en testimonios y dónde en exégesis bíblica? FR: Où s'appuie-t-il sur des témoignages et où sur l'exégèse biblique ?
4. EN: How does his definition differ from later holiness formulations? ES: ¿En qué difiere su definición de las formulaciones posteriores de santidad? FR: En quoi sa définition diffère-t-elle des formulations ultérieures de la sainteté ?
5. EN: Which claims require contextualization for modern pastoral practice? ES: ¿Qué afirmaciones requieren contexto para la práctica pastoral actual? FR: Quelles affirmations demandent un contexte pour la pratique pastorale actuelle ?

### C-C4: Historical polity, not contemporary denominational policy
**EN:** The 1798 Coke–Asbury discipline documents early Methodist Episcopal structures for conferences, ordination, circuit ministry and membership. Its governance rules belong to a specific historical church and era; they cannot be presented as current Nazarene requirements. Students should examine the text's social setting and slavery-related context, compare later developments, and distinguish descriptive history from normative policy.  
**ES:** La disciplina de Coke y Asbury de 1798 documenta las primeras estructuras episcopales metodistas para conferencias, ordenación, ministerio itinerante y membresía. Sus reglas pertenecen a una iglesia y época concretas; no deben presentarse como requisitos nazarenos actuales. El estudio debe abordar su contexto social y la esclavitud, comparar desarrollos posteriores y distinguir historia descriptiva de normativa vigente.  
**FR:** La Discipline de Coke et Asbury de 1798 témoigne des premières structures épiscopales méthodistes concernant les conférences, l'ordination, le ministère itinérant et l'appartenance à l'Église. Ses règles relèvent d'une Église et d'une époque précises; elles ne sont pas les exigences actuelles de l'Église du Nazaréen. Il faut examiner le contexte social et l'esclavage, comparer les évolutions ultérieures et distinguer histoire descriptive et normes en vigueur.

**Study prompts EN / ES / FR:**
1. EN: What authority belonged to conferences? ES: ¿Qué autoridad tenían las conferencias? FR: Quelle autorité revenait aux conférences ?
2. EN: How were ministers selected and supervised? ES: ¿Cómo se elegía y supervisaba a los ministros? FR: Comment les ministres étaient-ils choisis et supervisés ?
3. EN: How did circuit ministry affect accountability? ES: ¿Cómo influía el ministerio itinerante en la rendición de cuentas? FR: Comment le ministère itinérant influençait-il la responsabilité ?
4. EN: What historical social assumptions must be identified? ES: ¿Qué supuestos sociales históricos deben señalarse? FR: Quels présupposés sociaux historiques faut-il identifier ?
5. EN: Which claims cannot be transferred to present Nazarene polity? ES: ¿Qué afirmaciones no pueden trasladarse al gobierno nazareno actual? FR: Quelles affirmations ne peuvent être transposées à l'organisation nazaréenne actuelle ?

## Required academic choice and safe handoff
- **Wayne** must choose for each course between **SAME-TEXT CLOSE READING** (one historical work, separately targeted learning outcomes, explicit disclosure and nonduplicative assessment policy) and **INDEPENDENT COMPANION SOURCES** (five genuinely separate works). No silent change to current Master's textbook-plus-reading examination requirements.
- **Claude**: C-C3 obtain the 1872 printed page facsimile and collate, then propose five independent voices if requested (existing optional Fletcher/Watson/Palmer/Clarke leads in `C-C3/SOURCE.md` are *candidates*, not cleared excerpts). C-C4 first correct OCR against 1798 page images and determine whether course is early Methodist history, modern Nazarene polity, or an explicitly comparative course; propose five other sources only after this decision. Record edition, printed pages, 3k–6k coherent excerpt target, checksum, author/translator/provider rights and independent reviewer for each.
- **Robert**: report-only four-axis gate: textbook↔reading containment, reading↔reading overlap, manifest↔file consistency, and **independent witness↔transcription fidelity**. Include the source-era/current-denomination labeling check; never silently rewrite existing grades or valid completions.
- **Private assessments**: only after page-collated EN source, approved ES/FR translations, five independent learning outcomes and Wayne academic/rights approval; put all answer keys and 40-question banks in private `assessment-keys`, not this public research branch or coordination tracker. Secure encrypted handoff to Claude still outstanding. No production deployment, policy change, student correspondence, or source-file overwrite is authorized by this audit.

**Evidence status:** exact staged-blob metrics verified; independent 1798 edition catalog verified; Wesley 1872 source attribution corroborated by CCEL. No page-image collation, final Mexico legal clearance, full EN/ES/FR primary texts, private banks, academic approval, or live-site assertion is claimed.
