# CTS denominational books: cross-border copyright guidance (24 October 2026)
**For Claude, Wayne and source-review team. Internal practical risk screen, not a legal opinion or a grant of publication rights. No website or production deployment authorized.**

## Bottom line
Wayne reports US citizenship and a US mailing address. These do **not** make a globally accessible, Mexico-operated CTS website a solely US-law publication. Neither does Cloudflare's US corporate home or a hypothetical US origin server. Cloudflare uses global anycast; Pages assets/Workers can be served or processed at different worldwide data centers. The physical location of a given Cloudflare server is one factual connection, **not** a single governing-copyright-law switch.

WIPO explains copyright law is territorial; Berne Art. 5(2) generally refers to the law where protection is claimed, while Art. 7(8) sets a *default* comparison with the country of origin's term **unless the protecting country's law otherwise provides**. We have not established a controlling Mexican legal interpretation of 7(8) permitting wholesale reuse of US-public-domain material in Mexico. No one should assert that moving hosting, adopting a US mailing address, or changing Cloudflare configuration automatically clears disputed source texts. Nor does having students in 57 countries mean CTS must commission 57 legal opinions to use historically unambiguous sources: apply a repeatable source/territory/permission standard and refer genuine hard cases for targeted advice.

## Primary authority (verified October 24, 2026)
- US Copyright Office: works **first published in the US before January 1, 1931** are US public domain in 2026; verify origin and distinguish modern editions: https://www.copyright.gov/what-is-copyright/
- Mexico, current *Ley Federal del Derecho de Autor*, Articles 15, 27, 29 (legislative source as revised May 14, 2026): https://www.diputados.gob.mx/LeyesBiblio/pdf/LFDA.pdf
  - Art. 15: writings in newspapers/magazines do not lose each contributor's rights.
  - Art. 27: reproduction, electronic making available and translation/adaptation are restricted uses if protected; no general free-education waiver.
  - Art. 29(I): general term life plus 100 years for identified authors. Art. 29(II) also states 100 years after disclosure; **which clause applies to mixed/anonymous writings is not resolved by issue date alone**.
- WIPO on territoriality: https://www.wipo.int/en/web/copyright/faq-copyright
- Berne Convention Arts 5 and 7(8): https://www.wipo.int/edocs/pubdocs/en/wipo_pub_226.pdf
- Cloudflare anycast/global routing: https://developers.cloudflare.com/support/troubleshooting/general-troubleshooting/geographic-traffic-routing/
- Cloudflare Pages/Workers location: https://developers.cloudflare.com/workers/configuration/placement/

## Course decisions for Claude
| Source | Practical classification | Action |
|---|---|---|
| **C-C3 John Wesley, _Plain Account_**, Jackson 1872 edition; Wesley d.1791, Jackson d.1874 | Strong preliminary US/Mexico underlying-text public-domain basis. | Proceed with private EN/ES/FR drafting and assessment work; collate transcription to 1872 historical scan and exclude modern CCEL prefatory/annotative text before publication. |
| **B-C2 John L. Dagg, _Manual of Theology_**, 1857 / 1871; Dagg d.1884 | Strong preliminary original-text basis. | Proceed with internal translations/digests/banks; verify 1857 text vs LOC 1871 scan, remove modern transcription additions. |
| **A-C1 Seymour-authored _Apostolic Faith_ portions**, Seymour d.1922 | Potentially permissible if attribution and originality are confirmed, but the staged composite file is **NOT CLEARED**. | Carry out Wayne's contributor-by-contributor removal rule and original issue scan check; replace short/unsafe reading; no beta/public publishing of the composite until audit resolves. |
| **A-C1 separately authored contributions**: A.G. Garr d.1944, Florence Crawford d.1936, Anna Hall death uncertain; unattributed quoted/interpreted speech | Unresolved for Mexican reproduction, translation and derivative materials. | Omit or replace with original, cited CTS historical summaries; obtain written rights authorization if essential; do not assume newspaper age or US PD clears Mexico. |
| **A-C2 Seymour _Doctrines and Discipline_ (1915)** | Actual historical text not yet obtained in verified full original form; 2000/2014 editions contain modern matter. | Locate genuine 1915 original scan or use other independently screened Seymour original sources; do not copy modern editorial additions. |
| **Modern/faculty texts** | “Free to read” is **not** permission to rehost/translate. | Use explicit licence covering the exact texts and planned adaptations/translations, or keep them as links. Record author, edition, origin, permission, version, and license. |

## Working publication policy
1. For every textbook and five readings, manifest author and contributor(s), earliest/source edition, date and *country of first publication*, death date (if relevant), host provenance, scan comparison, translation source, and rights basis; flag unresolved segments explicitly.
2. **Proceed now** with clearly old source texts (C-C3 and B-C2 are leading candidates) and Claude's privately held digests, bank creation and academic quality review. Do not let unresolved A-C1 excerpts stop the already-built 20 lesson courses in beta.
3. For ambiguous historical rights, link to a third-party lawfully hosted page instead of copying it. Create an independently written CTS historical summary only with substantive original expression and proper attribution; avoid reproducing protected paragraphs by close paraphrase.
4. Send Wayne only true legal/permission exceptions for decision; a narrowly scoped Mexican IP lawyer opinion can assess the *actual* disputed A-C1 passages and Berne Art.7(8) interaction. Neither origin geography nor Cloudflare routing is a shortcut.
5. Keep private assessment answer keys and student data out of all public source deliveries.

## Status
**Source-by-source policy ready for implementation. A-C1 composite hold remains, while C-C3 and B-C2 can progress internally.** No copyright license granted, no website release, no outbound email.
