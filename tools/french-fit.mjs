/* Fitting a French passage to its English markup, for the elective generators
 * (tools/build-elective-readings.mjs, tools/build-elective-textbook.mjs).
 *
 * Stored French must carry exactly the English tags (french-readings-lib.mjs
 * tagProblem), so the page can fit it onto the English markup and the French
 * checks accept it. Translators sometimes italicize more than the English:
 * a word the French cites from the English or another language
 * (« dispositions » (<em>tempers</em>), <em>homo unius libri</em>), or both
 * halves of « ne … pas » where the English stresses one "not". Those extra
 * italics are dropped, and each drop is reported:
 *   1. first from words the English text itself contains;
 *   2. then the shortest extra italics (12 characters or fewer: emphasis, never a title).
 * Any other difference is returned as a problem for the caller to refuse.
 */
import { tagProblem } from './french-readings-lib.mjs';

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** { fr, dropped: [description], problem: string|null } */
export function fitFrench(en, fr) {
  const dropped = [];
  const plainEn = ` ${String(en).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase()} `;
  for (const tag of ['em', 'i']) {
    const count = (s) => (s.match(new RegExp(`<${tag}>`, 'g')) || []).length;
    while (count(fr) > count(en)) {
      let done = false;
      fr = fr.replace(new RegExp(`<${tag}>([^<]+)</${tag}>`, 'g'), (m, inner) => {
        if (done || !new RegExp(`(^|[^\\p{L}])${escape(inner.toLowerCase().trim())}([^\\p{L}]|$)`, 'u').test(plainEn)) return m;
        done = true; dropped.push(`<${tag}>${inner}</${tag}> (a word the English text has, not italicized)`); return inner;
      });
      if (!done) break;
    }
    while (count(fr) > count(en)) {
      const all = [...fr.matchAll(new RegExp(`<${tag}>([^<]+)</${tag}>`, 'g'))];
      if (!all.length) break;
      const short = all.reduce((a, b) => (b[1].length < a[1].length ? b : a));
      if (short[1].length > 12) break;
      fr = fr.slice(0, short.index) + short[1] + fr.slice(short.index + short[0].length);
      dropped.push(`emphasis on "${short[1]}" (the French stresses more words than the English)`);
    }
  }
  return { fr, dropped, problem: tagProblem(en, fr) };
}
