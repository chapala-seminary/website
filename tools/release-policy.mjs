// Run only from the trusted base branch. Unknown paths and JSON control fields
// are technical; a .json suffix alone does not make a change content.
// Wayne, 18 Oct 2026: Claude and ChatGPT own technical work. A technical or
// mixed PR needs two separate AI reviews of the exact head commit plus Wayne's
// own GitHub approval; Robert is an occasional resource, not a required
// approver (his approval is still accepted in place of the AI reviews).
export const ROBERT = 'satoshisound';
export const WAYNE = 'ChapalaTheological1';
export const BOT = 'chapalatheological-ai';
export function contentRule(path) {
  if (/^src\/content\/units\/[^/]+\/\d+\.json$/.test(path)) return ['title', 'mc', 'sa', 'fill'];
  if (/^src\/content\/lessons\/[^/]+\/\d+\.json$/.test(path)) return ['langs', 'blocks'];
  if (/^src\/data\/readings\/(?:staged\/)?[^/]+\.bank\.json$/.test(path)) return ['questions'];
  if (/^src\/data\/readings\/(?:staged\/)?[^/]+\.accept\.json$/.test(path)) return 'answers';
  if (/^src\/data\/french-readings\/(?:[^/]+\/)*[^/]+\.json$/.test(path)) return ['entries'];
  if (/^public\/CTS_[^/]+_digest\.html$/.test(path) || /^public\/CTS[^/]*(?:Lectura[^/]*|Readings)\.html$/.test(path)) return 'reading-html';
  if (/^docs\/readers\/.+\.md$/.test(path) || path === 'docs/content-changes.md') return 'prose';
  if (/^_review\/(?:[^/]+\/)*[^/]+\.(?:json|md|pdf|html)$/.test(path)) return 'review';
  // Wayne, 18 Oct 2026: routine wording and translation on the site's pages
  // is content. Pages that grade, certify, verify or hold records stay
  // technical, and so does any change to a page's markup (text-only edits).
  if (RECORD_PAGES.test(path)) return null;
  if (/^src\/body\/(?:[^/]+\/)*[^/]+\.html$/.test(path) || /^public\/[^/]+\.html$/.test(path)) return 'page-text';
  if (path === 'src/data/french-landing.json' || /^src\/data\/french-pages\/[^/]+\.json$/.test(path)) return 'dictionary';
  return null;
}
// Grading, certificates, verification, student records and tools: never
// content, whatever the edit (Wayne's list of what keeps independent review).
const RECORD_PAGES = /(?:certificate|verify|test|exam|grad|staff|admin|record|link-manager|tracker)[^/]*$/i;
// Legacy readers mix prose with scripts. Only text-node edits can pass:
// every tag/attribute, comment, and script/style body stays byte-identical.
export function readingStructure(html) {
  const protectedBlocks = [];
  const remaining = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, block => {
    protectedBlocks.push(block); return `<cts-protected-block data-index="${protectedBlocks.length - 1}"></cts-protected-block>`;
  });
  const tags = remaining.match(/<!--[\s\S]*?-->|<![^>]*>|<\/?[a-zA-Z](?:"[^"]*"|'[^']*'|[^'">])*>/g) || [];
  return JSON.stringify([protectedBlocks, tags]);
}
const unsafeMarkup = /<\s*\/?\s*(?:script|style|iframe|object|embed|base|meta|link|form|input|button|svg|math)\b|\bon[a-z]+\s*=|(?:javascript|vbscript)\s*:|data\s*:\s*(?:text\/html|image\/svg)/i;
export function isContentChange(file) {
  const rule = contentRule(file.filename);
  if (!rule || ['removed', 'renamed'].includes(file.status)) return false;
  if (rule === 'reading-html') return Boolean(file.before && file.after && readingStructure(file.before) === readingStructure(file.after));
  if (rule === 'page-text') {
    // Wording and plain markup (a new paragraph, card or link) may change;
    // every script and style block stays byte-identical, and nothing
    // executable, no form control and no event handler may be added.
    if (!file.before || !file.after) return false;
    // Search-engine data (<script type="application/ld+json">) is text, not
    // code: it may change if it still parses as JSON; every other script and
    // style block stays byte-identical.
    const ld = /^<script\s+type="application\/ld\+json">([\s\S]*)<\/script\s*>$/i;
    const blocks = (html) => (html.match(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi) || []).map((block) => {
      const data = block.match(ld);
      if (!data) return block;
      try { JSON.parse(data[1]); return 'ld+json'; } catch { return block + ' (invalid JSON)'; }
    });
    const before = blocks(file.before), after = blocks(file.after);
    if (JSON.stringify(before) !== JSON.stringify(after) || after.some((block) => block.endsWith(' (invalid JSON)'))) return false;
    const outside = (html) => html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
    const controls = (html) => (outside(html).match(/<!--[\s\S]*?-->|<![^>]*>|<\/?[a-zA-Z](?:"[^"]*"|'[^']*'|[^'">])*>/g) || []).filter((tag) => unsafeMarkup.test(tag)).join('\n');
    // The page's existing controls (a registration form, say) may stay; the
    // list of them must not change.
    return controls(file.after) === controls(file.before);
  }
  if (rule === 'dictionary') {
    // A translation table: the same flat object of strings, so no setting,
    // list or nested control can ride along. Markup is checked below.
    try {
      const after = JSON.parse(file.after);
      if (!file.before || unsafeMarkup.test(file.after)) return false;
      return Boolean(after && typeof after === 'object' && !Array.isArray(after)
        && Object.values(after).every((value) => typeof value === 'string'));
    } catch { return false; }
  }
  if (rule === 'review') return true; // Offline faculty packets, not imported or served.
  if (unsafeMarkup.test(file.after || '')) return false;
  if (rule === 'prose') return true;
  if (rule === 'answers') {
    try {
      const answers = JSON.parse(file.after);
      return Boolean(answers && typeof answers === 'object' && !Array.isArray(answers) && Object.entries(answers).every(([id, langs]) => /^\d+$/.test(id)
        && langs && !Array.isArray(langs) && typeof langs === 'object'
        && Object.entries(langs).every(([lang, values]) => /^[a-z]{2}$/.test(lang)
          && Array.isArray(values) && values.every(value => typeof value === 'string'))));
    } catch { return false; }
  }
  // A new unit, template or course needs technical wiring. New questions in an
  // existing bank are content; adding an unknown JSON field is technical.
  if (!file.before) return false;
  try {
    const before = JSON.parse(file.before), after = JSON.parse(file.after);
    if (Array.isArray(before) || Array.isArray(after) || !before || !after || typeof before !== 'object' || typeof after !== 'object') return false;
    const controls = object => Object.fromEntries(Object.entries(object).filter(([key]) => !rule.includes(key)).sort(([a], [b]) => a.localeCompare(b)));
    return JSON.stringify(controls(before)) === JSON.stringify(controls(after));
  } catch { return false; }
}
export function reviewEvidence(body, sha) {
  const lines = String(body || '').split(/\r?\n/);
  return lines.some(line => line.trim() === `Review commit: ${sha}`)
    && ['ChatGPT review:', 'Claude review:'].every(label => lines.some(line => {
      if (!line.trim().startsWith(label)) return false;
      try { const url = new URL(line.trim().slice(label.length).trim()); return url.protocol === 'https:' && url.hostname.includes('.') && !/(?:example\.(?:com|org)|placeholder|replace|\.invalid$|localhost)/i.test(url.hostname); }
      catch { return false; }
    }));
}
export function approvedBy(reviews, login, sha) {
  const latest = reviews.filter(review => review.user?.login?.toLowerCase() === login.toLowerCase() && ['APPROVED', 'CHANGES_REQUESTED', 'DISMISSED'].includes(review.state)).sort((a, b) => a.id - b.id).at(-1);
  return latest?.state === 'APPROVED' && latest.commit_id === sha;
}

// Both review links, separately: one review cannot stand in for the other.
export function separateReviews(body) {
  const link = (label) => String(body || '').split(/\r?\n/).map((line) => line.trim())
    .find((line) => line.startsWith(label))?.slice(label.length).trim().replace(/[#?].*$/, '').replace(/\/+$/, '');
  const chatgpt = link('ChatGPT review:'), claude = link('Claude review:');
  return Boolean(chatgpt && claude && chatgpt !== claude);
}

/* The merge decision for one PR, from facts the checker has already read:
   pr (GitHub PR JSON), technical (paths that are not content), reviews (all
   GitHub reviews). AI review evidence is text in the PR body; only a GitHub
   review by Wayne's own account counts as human approval, and only for the
   exact head commit (a new push makes every earlier approval and evidence
   line stale). Returns { ok, kind, reason }. */
export function decide({ pr, technical, reviews }) {
  const sha = pr.head.sha;
  if (pr.draft) return { ok: false, reason: 'Mark the pull request ready for review first.' };
  if (!reviewEvidence(pr.body, sha)) return { ok: false, reason: `PR body must record Review commit: ${sha}, ChatGPT review: https://..., and Claude review: https://... . These are review evidence, not proof of AI identity.` };
  const robert = approvedBy(reviews, ROBERT, sha);
  if (technical.length && !robert && !separateReviews(pr.body))
    return { ok: false, reason: `Technical changes need two separate reviews of this exact commit (different ChatGPT and Claude review links): ${technical.join(', ')}` };
  if (!approvedBy(reviews, WAYNE, sha)) return { ok: false, reason: 'Wayne must approve this exact commit in GitHub before it is merged. AI review evidence never replaces his approval.' };
  return { ok: true, kind: technical.length ? (robert ? 'technical (Robert approved)' : 'technical (Claude and ChatGPT reviewed)') : 'content-only' };
}
