# C-C1 — Live Wesley digests versus staged primary-source readings: coverage and EN/ES/FR editorial gate

**28 October 2026 | Independent source-to-student-facing audit | NONPRODUCTION research handoff | not an approved correction, license, or examination bank**

## Evidence and scope

Compared the currently public English **John Wesley and the History of Methodism — Supplemental Reading Room** at https://chapalaseminary.org/CTSElecWes1Readings.html (retrieved 28 Oct 2026) with the five-group staged **1872 Jackson-edition OCR selection ledger** at [PROVISIONAL-READING-LEDGER-2026-10-25.md](PROVISIONAL-READING-LEDGER-2026-10-25.md) and four exact staged reading-file headers. Historical edition catalog: https://www.whdl.org/en/browse/resources/9539 . These are **different artifacts**: the public student items are original CTS **digests** of a wider journal period; the staged primary-source files are incomplete, uncollated OCR **extracts**. A date-range difference is **not by itself a false historical claim**, but it is a release-critical *source-to-assessment coverage mismatch* if students are expected to answer from the narrower assigned extracts.

| Reading | Public English CTS digest's stated scope | Exact staged primary-source selection | Assessment/source coverage implication |
|---|---|---|---|
| **R1 — voyage** | 14 Oct 1735–5 Feb 1736 | 14 Oct 1735–5 Feb 1736; 2,687 OCR tokens | Date scopes align; page-level quotation collation and contributor review still open. |
| **R2 — Georgia** | 6 Feb 1736–22 Dec 1737; digest includes July 1736, April/August 1737 and the Hopkey case | Two noncontiguous selections: **6 Feb–6 Jun 1736** (4,491 tokens) **and 2–22 Dec 1737** (4,210 tokens). The roughly 18-month intervening period is not staged. | Published digest discusses events outside the two selected primary-text windows. Do **not** label these OCR files a continuous journal selection. Either supply/collate missing source windows or explicitly mark the digest as drawing on additional historical entries. |
| **R3 — Böhler/Aldersgate** | 1 Feb–24 May 1738; digest includes Fetter Lane formation on 1 May and Charles Wesley on 21 May | **7 Feb–late Apr 1738** (3,317 tokens) **plus 24–28 May** (1,082 tokens); the 1–6 Feb and late-Apr–23 May windows are not staged. | Public digest includes May events absent from the staged R3a excerpt; staged R3b continues beyond the public ending date. Record exact events/sources before deriving examination prompts. |
| **R4 — Bristol/field preaching** | 31 Mar–30 Jun 1739; digest explicitly includes **5 June Beau Nash**, June letter on the world as parish, and late-May/June developments | **31 Mar–14 May 1739** contiguous OCR only, 3,989 tokens; ends before 15 May. | Staged excerpt cannot independently support the published June material. Do not assert that all R4 digest facts are in the current staged primary-source file. |
| **R5 — early societies** | 1 Nov 1739–31 Dec 1740; digest covers **July 1740** Fetter Lane break, September/December 1740 and later 1742–43 context | **4 Nov 1739–1 Jan 1740**, 5,357 OCR tokens. | Most 1740 events and later context are outside staged R5. Need source-window extension or a clearly identified contextual-source ledger before validating reading-test stems. |

**Source hashes:** The staged ledger records the exact raw source offsets and individual reading blob SHA-1s. For example, R3 source blob `b80bc00b8e386890d942e3fc0cf3cbb9c3bbedaa`; staged R3 file blob `45c581dc4be3870828425644757a882fd45ad407`; R4 file blob `02cacf8b9ffc0dd777fea0c181db4c1e1f383bea`. These are Git blob identifiers, **not** original-page-image checksums. The full 1872 volume has not been image-collated in this audit.

### A separate OCR date correction candidate — not yet facsimile certified

The exact raw R3 source OCR, near its first selected-window ending, reads **“On Wednesday, 36”** after a corrupted **“Tuesday, 2b”**. An independent historical transcription of Wesley's Journal prints **Tuesday 25** and **Wednesday 26** for that sequence: https://www.ccel.org/w/wesley/journal/cache/journal.pdf . This strongly suggests OCR `36` → **26** and `2b` → **25**, but the 1872 original **page image must be inspected** before a diplomatic correction. Do not preserve “Wednesday 36” as a date or generate an assessment item from it.

## Trilingual editorial notices — proposed copy for faculty review, not a live update

The purpose is to **distinguish the CTS historical digest from its provisional, shorter primary-source selection**. Do not silently replace the existing full-period digest's historical scope with the short source range. Show the disclosure adjacent to each reading's source card once source and translation review is approved.

**EN — proposed shared notice:**
> This CTS study digest covers the journal dates shown in its heading. The currently staged primary-source excerpt is a shorter, provisional selection and may omit events discussed here. It is not yet a proofread or approved full reading. Do not assume that the staged excerpt contains every event in this digest; see the source-window ledger before using it for an examination.

**ES — aviso editorial propuesto:**
> Este resumen de estudio del STC abarca las fechas del diario indicadas en su encabezado. El extracto de la fuente primaria que se está preparando es una selección provisional más breve y puede omitir acontecimientos tratados aquí. Todavía no es una lectura completa, cotejada y aprobada. No se debe suponer que el extracto incluye todos los hechos de este resumen; consulte el registro de períodos de la fuente antes de utilizarlo para un examen.

**FR — avis éditorial proposé :**
> Cette synthèse pédagogique du CTS couvre les dates du journal indiquées dans son titre. L'extrait de la source primaire actuellement préparé est une sélection provisoire plus courte et peut omettre des événements évoqués ici. Il ne s'agit pas encore d'une lecture intégrale vérifiée et approuvée. Ne présumez pas que l'extrait contient tous les faits de cette synthèse ; consultez le registre des périodes couvertes avant de l'utiliser pour un examen.

**Specific short card labels, proposed for EN/ES/FR faculty review:**

| Card | English | Español | Français |
|---|---|---|---|
| R2 | Two selected Georgia episodes (Feb–Jun 1736; Dec 1737), **not** continuous coverage | Dos episodios seleccionados de Georgia (feb.–jun. 1736; dic. 1737), **no** un período continuo | Deux épisodes choisis en Géorgie (févr.–juin 1736 ; déc. 1737), **sans** couverture continue |
| R3 | Selected Feb–Apr and 24–28 May 1738 entries; intervening dates omitted | Entradas seleccionadas de feb.–abr. y del 24–28 de mayo de 1738; se omiten fechas intermedias | Entrées choisies de févr.–avr. et des 24–28 mai 1738 ; dates intermédiaires omises |
| R4 | Current primary-text selection ends 14 May 1739; digest discusses later June events | La selección actual de texto primario termina el 14 de mayo de 1739; el resumen incluye sucesos posteriores de junio | L'extrait primaire actuel s'arrête au 14 mai 1739 ; la synthèse évoque aussi des événements ultérieurs de juin |
| R5 | Current primary-text selection ends 1 Jan 1740; digest covers the rest of 1740 | La selección actual de texto primario termina el 1 de enero de 1740; el resumen abarca el resto de 1740 | L'extrait primaire actuel s'arrête au 1er janvier 1740 ; la synthèse couvre aussi le reste de 1740 |

## Concrete next handoff for Claude and faculty

1. **Build a fact-to-source crosswalk**, starting with all forty public R1–R5 *question prompts* (no accepted answers in public). For every tested historical event, log `reading_id / claim / digest section / original 1872 journal date / original printed page / exact staged-file presence yes-no / image-collation status / separate context source`. Any claim absent from assigned text is a **faculty review flag**, not a reason to change student grades.
2. Decide whether the five required readings are the CTS **digests** as currently advertised or the eventual long **primary-source extracts**. The answer changes the academic validity of the separate reading test and workload; **Wayne decides**. Do not silently expand the student's assigned workload or remove previous completions.
3. Collate the relevant 1872 facsimile pages (especially R3 Tuesday 25/Wednesday 26, R4 May/June and R5 1740). Preserve original raw OCR, document corrected derivative checksums, and verify dates/names/quotations and author boundaries.
4. Screen third-party letters, quoted testimony, hymn stanzas and any modern editorial translation. Mexican LFDA Article 29 provides a general life-plus-100 economic-rights term; Article 78 separately addresses derivative works and translations. Wesley (d.1791) and Jackson (d.1874) pass a **preliminary author/editor age screen**; that does **not** clear every embedded contribution, new translation, image or website edition. Current law and source: https://mexico.justia.com/federales/leyes/ley-federal-del-derecho-de-autor/ ; WHDL edition: https://www.whdl.org/en/browse/resources/9539 .
5. After exact source/rights/faculty clearance, review the proposed EN/ES/FR labels with native-language editors and verify French content-hash parity. Only then prepare final textbook, five reading packages and private question/answer validation in `assessment-keys`; the AI account currently cannot independently read that repository (GitHub 404, verified 28 Oct). **No answer keys, student data, grades or release changes are part of this document.**

## Strategic learning-quality implication

A separate reading examination must test **what students were actually assigned**, not a wider history that appears only in a digest, or a provisional OCR selection silently missing the tested events. A source-coverage crosswalk for one course can become a reusable release gate across all twenty electives, complementing the already documented textbook/readings duplication audit. This is a **proposal for report-only QA**, not an automatic assessment-policy decision.
