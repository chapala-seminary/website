# French drafts of the single-page courses

Narrative Preaching (`CTS_Narrative_Preaching.html`), Biblical Counseling
(`CTSCounseling.html`) and Pastoral & Christian Ethics (`ethics_unit01–10.html`)
are hand-written pages with no collection files. Their French is a build-time
augmentation of the `/fr/` page only, like WiseSpeak (`tools/french-wisespeak.mjs`).

- Packets: `_review/french/<NarrativePreaching|Counseling|Ethics>/`.
  `*-source.json` is extracted from the page (`node tools/french-static-courses.mjs --extract`);
  `*-fr.json` is the French draft, `tr.status: "machine"` with `tr.from` = sha256 of its
  source packet. Edit the French there; after an English change re-extract, update the
  French, then `--finalize <course>` (no-break spaces, new hash). `--check` reports stale packets;
  the build refuses a draft whose source changed.
- Build: `tools/language-pages.mjs` calls `frenchStaticCourse()` for each `/fr/` page. Each
  English block gets a French sibling (paired by the language-page builder), the page script
  gets French questions, explanations, model answers, fill-ins and interface text
  (`tools/data/french-static-ui.json`). The pages show the draft notice and are noindex.
- Unchanged: English and Spanish pages (byte-for-byte), MC option order and answer indexes,
  storage keys, pass rules and keyword matching. Each French keyword is a concept group that
  also contains the English keyword, so English answers still pass and a concept counts once.
- Checks: `tools/verify-french-static-packets.mjs` (packet structure, HTML tags, counts,
  one blank per fill-in, French models meet ≥3 French concepts) and
  `tools/verify-french-static.mjs` (browser: notice, French MC/fill/models, French interface).
