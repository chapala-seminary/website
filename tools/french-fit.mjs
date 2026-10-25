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
 * French ordinal superscripts the English lacks (XIX<sup>e</sup>) are first
 * written on the line (XIXe), and reported.
 * Any other difference is returned as a problem for the caller to refuse.
 */
import { tagProblem } from './french-readings-lib.mjs';

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** { fr, dropped: [description], problem: string|null } */
export function fitFrench(en, fr) {
  const dropped = [];
  const plainEn = ` ${String(en).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase()} `;
  // 0. French ordinals set as superscripts (XIX<sup>e</sup> siècle, 1<sup>er</sup>)
  //    where the English has fewer <sup>: written on the line (XIXe, 1er).
  {
    const sups = (s) => (s.match(/<sup>/g) || []).length;
    const ORD = /([0-9IVXLCDM])<sup>(e|er|re|ers|res|es|ème|èmes|nd|nde|nds|ndes)<\/sup>/;
    while (sups(fr) > sups(en)) {
      const m = fr.match(ORD);
      if (!m) break;
      fr = fr.slice(0, m.index) + m[1] + m[2] + fr.slice(m.index + m[0].length);
      dropped.push(`<sup>${m[2]}</sup> after "${m[1]}" (a French ordinal, written on the line)`);
    }
  }
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
    // 3. French word order often joins two phrases the English italicizes
    //    apart. Split the longest French span at the space nearest its middle:
    //    <em>a b</em> becomes <em>a</em> <em>b</em>, which looks the same on the page.
    while (count(fr) < count(en)) {
      const all = [...fr.matchAll(new RegExp(`<${tag}>([^<]+)</${tag}>`, 'g'))].filter((m) => /\S\s+\S/.test(m[1]));
      if (!all.length) break;
      const long = all.reduce((a, b) => (b[1].length > a[1].length ? b : a));
      const inner = long[1], mid = inner.length / 2;
      const spaces = [...inner.matchAll(/\s+/g)].filter((s) => s.index > 0 && s.index + s[0].length < inner.length);
      const at = spaces.reduce((a, b) => (Math.abs(b.index - mid) < Math.abs(a.index - mid) ? b : a));
      const split = `<${tag}>${inner.slice(0, at.index)}</${tag}>${at[0]}<${tag}>${inner.slice(at.index + at[0].length)}</${tag}>`;
      fr = fr.slice(0, long.index) + split + fr.slice(long.index + long[0].length);
      dropped.push(`<${tag}>${inner.length > 60 ? inner.slice(0, 60) + '…' : inner}</${tag}> split in two at a space (the English italicizes two phrases; the page looks the same)`);
    }
    // 4. Still more French italics: drop those inside a parenthetical aside
    //    the translator added, e.g. (ou : par <em>la rémission des</em>).
    while (count(fr) > count(en)) {
      const m = fr.match(new RegExp(`\\(([^()<]*)<${tag}>([^<]+)</${tag}>([^()<]*)\\)`));
      if (!m || plainEn.includes(m[2].toLowerCase().trim())) break;
      fr = fr.slice(0, m.index) + `(${m[1]}${m[2]}${m[3]})` + fr.slice(m.index + m[0].length);
      dropped.push(`<${tag}>${m[2]}</${tag}> (in a parenthetical aside the French adds)`);
    }
  }
  return { fr, dropped, problem: tagProblem(en, fr) };
}
