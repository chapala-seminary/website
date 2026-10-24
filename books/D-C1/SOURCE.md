# D-C1 — Reformed Foundations: Calvin source handoff (FAST LANE)

**Status: SOURCE-ROUTE READY; original English text not yet committed locally.** Claude explicitly approved a Gutenberg/GITenberg ID + bounded ranges + shelf handoff when raw text transport is unavailable. This is a historical source selection, **not** an approved textbook, verified five-reading extraction, translation, examination bank, or publication clearance.

## Source and provenance

- John Calvin (1509–1564), *Institutes of the Christian Religion* (final authorial edition 1559), translated by **John Allen (1771–1839)**. Source identifies a sixth American edition, Philadelphia: Presbyterian Board of Publication; the title leaf shows **1813** (edition/title chronology requires bibliographic collation).
- **Primary volume I: Project Gutenberg #45001**, https://www.gutenberg.org/ebooks/45001 ; verified UTF-8 full text https://www.gutenberg.org/cache/epub/45001/pg45001.txt . The Gutenberg page names Calvin, Allen, and a public-domain-in-USA designation. It contains Book I (chapters I–XVIII), Book II (chapters I–XVII), and Book III (chapters I–XIII). Its 2022 transcription update is not a modern academic edition.
- **Companion volume II: Project Gutenberg #64392**, https://www.gutenberg.org/ebooks/64392 ; verified catalog lists Calvin and Allen and continues at Book III, chapter XIV, through Book IV. Use as a **shelf/comparison**, not silently as part of the volume-I textbook.
- Claude-tested GITenberg mirror for vol. I: https://github.com/GITenberg/Institutes-of-the-Christian-Religion--Vol.-1-of-2-_45001 ; direct raw candidate https://raw.githubusercontent.com/GITenberg/Institutes-of-the-Christian-Religion--Vol.-1-of-2-_45001/master/45001.txt . **Caution:** the GitHub contents API returned an empty 45001.txt blob when ChatGPT attempted to fetch it; do not treat that particular raw path as a verified nonempty text. Use the verified Gutenberg UTF-8 URL, or inspect the GITenberg repository for the actual nonempty text filename. PG 45001 and 64392 IDs are independently verified.

## Five proposed substantial readings (one contiguous range per file)

Extract **from body chapters only**, not the earlier table of contents, arguments, prefatory apparatus, footnotes or Gutenberg boilerplate. Keep the historic wording and headings. Exact chapter boundaries, word counts, and checksums **must be measured by the extractor**; do not mark reading files complete until checked.

1. **Knowledge of God and of ourselves:** Book I, **chapters I–V**, starting at the *body* “Book I. On the Knowledge of God the Creator” / “Chapter I. The Connection Between the Knowledge of God and the Knowledge of Ourselves”; stop immediately before Book I chapter VI. Focus: natural knowledge, piety, idolatry, creation.
2. **Scripture and its authority:** Book I, **chapters VI–X**, from chapter VI (“The Guidance and Teaching of the Scripture Necessary…”) through chapter X, stopping before chapter XI. Focus: Scripture, Spirit, testimony, revelation, divine identity.
3. **Trinity, creation and providence:** Book I, **chapters XIII–XVIII**, beginning chapter XIII (“One Divine Essence, Containing Three Persons…”) and stopping before Book II's argument/chapter I. Focus: Trinity, humanity, providence, divine governance. Deliberately excludes chapters XI–XII to keep the reading coherent; textbook may retain them.
4. **Fall, sin and human will:** Book II, **chapters I–V**, starting chapter I (“The Fall and Defection of Adam…”) and stopping before chapter VI. Focus: original sin, freedom, grace, human agency.
5. **Justification by faith:** Book III, **chapters XI–XIII**, starting chapter XI (“Justification by Faith. The Name and Thing Defined”) and ending immediately before volume I's footnotes / the end of chapter XIII. Focus: justification, divine judgment, grace. Book III continues in volume II, so label this an introductory rather than exhaustive treatment.

These five are deliberately **non-overlapping**, not necessarily exhaustive of the entire volume. Textbook: recommend a ~30,000-word carefully bounded selection drawn from these ranges, with any abridgment explicitly labeled; alternatively Claude can retain a larger textbook subject to site constraints. Do not fabricate an exact 30k-word count.

## Further-study shelf — historical source links

1. Calvin, *Institutes*, vol. I, John Allen translation (historical 1813/Philadelphia reprint), PG **45001**: https://www.gutenberg.org/ebooks/45001 — read Book I, chapters XI–XII for worship/idolatry omitted from the five readings.
2. Calvin, *Institutes*, vol. II, John Allen translation, PG **64392**: https://www.gutenberg.org/ebooks/64392 — continue Book III, chapters XIV onward, especially perseverance and predestination, and Book IV on the church.
3. John Wesley, *Works*, vol. I (Bristol, 1771), PG **59743**: https://www.gutenberg.org/ebooks/59743 — compare sermons on faith and justification with Calvin.
4. John Wesley, *Works*, vol. II (Bristol, 1771), PG **63452**: https://www.gutenberg.org/ebooks/63452 — compare regeneration and sanctification across traditions.
5. John Wesley, *Works*, vol. IV (Bristol, 1771), PG **68320**: https://www.gutenberg.org/ebooks/68320 — contrast self-denial and practical holiness.
6. John Wesley, *Works*, vol. V (Bristol, 1771), PG **68742**: https://www.gutenberg.org/ebooks/68742 — contextual comparison within early Methodist writings.

The comparative Wesley shelf is intentionally ecumenical, not an assertion that Wesley is a Reformed authority. Before publication, Claude should replace or supplement with Reformed confessional texts once exact editions/rights and links are verified.

## Preliminary rights and quality gates

Calvin died 1564; translator John Allen died 1839. Their historical text exceeds Mexico's general life+100 term and the US pre-1931 publication cutoff. **Separate modern transcriber notes, images, trademark boilerplate, website styling, and any newly added editorial apparatus.** This is preliminary source screening, not a legal opinion. Historical theological judgments, original-edition collation, EN/ES/FR translations, 150–250-word digests, and **private** 40-question banks for textbook and reading set remain outstanding.

**Claude next:** fetch Gutenberg #45001 from the verified UTF-8 link, extract the five body-chapter ranges, report actual word counts/sha256, build EN/ES/FR digests/translations and private answer banks in `assessment-keys`. If you prefer a shorter course reader, document each retained chapter and do not present the abridgment as the complete Institutes. No production merge/deployment without approval.
