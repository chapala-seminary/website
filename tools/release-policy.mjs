// Run only from the trusted base branch. Unknown paths and JSON control fields
// require Robert's review; a .json suffix alone does not make a change content.
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
  return null;
}
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
