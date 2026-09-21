/* A lesson, as data, and the markup that data becomes.
 *
 * WHY THIS EXISTS
 *
 * Until now a lesson was a file of hand-written HTML -- 451 of them -- and a
 * teacher who wanted to fix one sentence had to find it among the <span>s.
 * A CMS cannot offer "edit this paragraph" when the paragraph is not a thing
 * the site knows about. This module makes it one.
 *
 * THE MODEL
 *
 * A lesson is an ordered list of blocks. Each block has a TYPE describing what
 * it is for -- a heading, a paragraph, a Scripture quotation -- rather than the
 * tag it happens to be rendered as. An editor picks "Scripture quotation"; the
 * renderer knows that means <div class="scripture">. Change the markup once
 * here and 451 pages follow, which is the whole point of holding content as
 * data.
 *
 * LANGUAGES
 *
 * `text` is a map keyed by language code, not an {en, es} pair. French is
 * planned and a pair does not become a triple without rewriting everything
 * that touches it; adding a language is adding a key.
 *
 * TRANSLATION STATE -- `tr`
 *
 * For every language that is not the source, a block records:
 *
 *   status  human           a person wrote or corrected this
 *           machine         translated automatically, not yet reviewed
 *           machine-edited  translated automatically, then corrected
 *   from    a hash of the SOURCE text this translation was made from
 *
 * That `from` hash is what makes automatic translation safe to switch on.
 * When the author edits the English, its hash changes and no longer matches
 * what each translation was made from, so every translation of that block is
 * provably stale -- per paragraph, not per lesson. Re-translating refreshes
 * it; a hand correction refreshes it and sets `human`, so a careful fix is
 * never silently overwritten by the next automatic pass. Without this, a
 * re-translation either clobbers a person's work or leaves the wrong text in
 * place, and nothing can tell you which happened.
 */
import crypto from 'node:crypto';

export type Lang = string;
export type Text = Record<Lang, string>;

export type TrStatus = 'human' | 'machine' | 'machine-edited';
export interface Tr { status: TrStatus; from: string }

export interface Block {
  id: string;
  type: 'masthead' | 'title' | 'subtitle' | 'heading' | 'prose' | 'scripture' | 'figure';
  text?: Text;
  tr?: Record<Lang, Tr>;
  anchor?: string;
  svg?: string;                       // figure only: the illustration, verbatim
  attrs?: string;                     // figure only: its own attributes, verbatim
  caption?: { text: Text; tr?: Record<Lang, Tr> };
}

export interface Lesson {
  course: string;
  unit: number;
  sourceLang: Lang;
  langs: Lang[];
  blocks: Block[];
}

export const hash = (s: string) =>
  crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

/* A translation is stale when the source has moved on since it was made. This
   is the question the CMS asks of every block, and the reason `from` is
   stored at all. */
export const isStale = (b: Block, lang: Lang, sourceLang: Lang) => {
  if (lang === sourceLang) return false;
  /* An illustration's words are its caption, and the caption carries its own
     provenance. Reading b.text here instead would call every caption
     untracked -- which is what it did until a status report said so. */
  const { text, tr: prov } = b.type === 'figure' ? (b.caption ?? {} as never) : b;
  const src = text?.[sourceLang];
  if (src == null) return false;
  const tr = prov?.[lang];
  if (!tr) return text?.[lang] != null;   // a translation with no provenance
  return tr.from !== hash(src);
};

/* One place that knows a block type's markup. */
const WRAP: Record<string, [string, string]> = {
  masthead:  ['h1', ''],
  title:     ['h1', 'unit-title'],
  subtitle:  ['h2', 'unit-sub'],
  heading:   ['h3', ''],
  prose:     ['p', ''],
  scripture: ['div', 'scripture'],
};

const spans = (text: Text, langs: Lang[]) =>
  langs.filter((l) => text[l] != null)
       .map((l) => `<span class="lang-${l}">${text[l]}</span>`)
       .join('\n      ');

export function renderBlock(b: Block, langs: Lang[]): string {
  if (b.type === 'figure') {
    const cap = b.caption ? `\n  <figcaption>\n      ${spans(b.caption.text, langs)}\n  </figcaption>` : '';
    return `<figure ${b.attrs ?? 'class="cts-figure"'}>\n${b.svg ?? ''}${cap}\n</figure>`;
  }
  const [tag, cls] = WRAP[b.type] ?? ['p', ''];
  const attrs = (cls ? ` class="${cls}"` : '') + (b.anchor ? ` id="${b.anchor}"` : '');
  return `<${tag}${attrs}>\n      ${spans(b.text ?? {}, langs)}\n    </${tag}>`;
}

const LESSON_BODY = new Set(['heading', 'prose', 'scripture']);

/* The parts of a unit page that are the same in every unit of the course: the
   engine furniture (track picker, lockout notice, exam section) and the
   course's own footer and honours-readings notice. Byte-identical across the
   course's units, so stored once rather than copied into all eleven. Three
   pieces, because the lesson sits among them. */
export interface Shared { before: string; after: string; tail: string }

/* The inverse of extraction: data back to the body the page had. */
export function renderLesson(lesson: Lesson, shared: Shared): string {
  const { blocks, langs } = lesson;
  const one = (t: string) => blocks.find((b) => b.type === t);
  const masthead = one('masthead'), title = one('title'), subtitle = one('subtitle');
  const body = blocks.filter((b) => LESSON_BODY.has(b.type));
  const after = blocks.filter((b) => b.type === 'figure');

  return [
    '<header>',
    '  <div class="hwrap">',
    '    ' + (masthead ? renderBlock(masthead, langs) : ''),
    '    <button class="toggle" onclick="toggleLang()">',
    '      <span class="lang-en">Español</span>',
    '      <span class="lang-es">English</span>',
    '    </button>',
    '  </div>',
    '  <div class="progress-grid" id="progress-grid"></div>',
    '</header>',
    '',
    '<div class="container">',
    '  ' + (title ? renderBlock(title, langs) : ''),
    '  ' + (subtitle ? renderBlock(subtitle, langs) : ''),
    shared.before.trim(),
    '  <article class="teaching">',
    ...body.map((b) => '    ' + renderBlock(b, langs)),
    '  </article>',
    ...after.map((b) => renderBlock(b, langs)),
    shared.after.trim(),
    '</div>',
    shared.tail.trim(),
  ].join('\n');
}
