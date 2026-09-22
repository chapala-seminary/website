/* A lesson, as data, and the markup that data becomes.
 *
 * WHY THIS EXISTS
 *
 * A lesson used to be a file of hand-written HTML -- 451 of them -- and a
 * teacher who wanted to fix one sentence had to find it among the <span>s.
 * A CMS cannot offer "edit this paragraph" when the paragraph is not a thing
 * the site knows about. This makes it one.
 *
 * THE MODEL: A TEMPLATE WITH HOLES, AND THE TEXT THAT FILLS THEM
 *
 * A lesson is the page's markup with every translated fragment replaced by a
 * hole, plus an ordered list of blocks that fill those holes:
 *
 *   template: '<div class="container"><h1 class="unit-title"><!--cts:b01--></h1>…'
 *   blocks:   [{ id: 'b01', type: 'title', text: { en: '…', es: '…' } }, …]
 *
 * The template is generated, never hand-edited, and is not shown to anyone.
 * It exists so that conversion is LOSSLESS BY CONSTRUCTION: whatever shape a
 * course's markup is in -- and there are twenty-six of them across the forty
 * courses -- everything that is not translated text survives untouched, and
 * rendering puts the text back where it came from. There is no rule about
 * where a lesson starts and ends to get wrong, which is what made every
 * earlier attempt at this unsafe.
 *
 * `type` is metadata, not structure. It says what a block is FOR -- a heading,
 * a paragraph, a Scripture quotation -- so the CMS can label the field and an
 * editor knows what they are looking at. Rendering does not consult it.
 *
 * LANGUAGES
 *
 * `text` is a map keyed by language code, not an {en, es} pair. French is
 * planned and a pair does not become a triple without rewriting everything
 * that touches it. Adding a language is adding a key.
 *
 * Each language gets its OWN hole, where its text already sat:
 *
 *   <p class="lang-en"><!--cts:b07:en--></p><p class="lang-es"><!--cts:b07:es--></p>
 *   <p><span class="lang-en"><!--cts:b07:en--></span><span class="lang-es">…</span></p>
 *
 * The site marks language six ways and they are all left exactly as they are.
 * Normalising them to one spelling was the obvious thing and is the wrong
 * thing: it rewrites the markup of four hundred pages, and every check that
 * says no content was lost compares the built page element by element against
 * the page before. Keeping the holes where the text was means those checks
 * still mean what they say.
 *
 * The cost is that a language which has no hole cannot be rendered into a
 * page -- adding French to a course that wraps each language in its own
 * container needs that container cloned. That is a render-time problem to
 * solve when French is real, and solving it does not need the data reshaped.
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

export type BlockType =
  'masthead' | 'title' | 'subtitle' | 'heading' | 'prose' | 'scripture'
  | 'list-item' | 'caption' | 'label' | 'other';

export interface Block {
  id: string;
  type: BlockType;
  text: Text;
  tr?: Record<Lang, Tr>;
}

export interface Lesson {
  course: string;
  unit: number;
  sourceLang: Lang;
  langs: Lang[];
  template: string;
  blocks: Block[];
}

export const hash = (s: string) =>
  crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

/* A translation is stale when the source has moved on since it was made. This
   is the question the CMS asks of every block, and the reason `from` is
   stored at all. */
export const isStale = (b: Block, lang: Lang, sourceLang: Lang) => {
  if (lang === sourceLang) return false;
  const src = b.text?.[sourceLang];
  if (src == null) return false;
  const tr = b.tr?.[lang];
  if (!tr) return b.text?.[lang] != null;   // a translation with no provenance
  return tr.from !== hash(src);
};

/* The hole one language of one block fills. An HTML comment, because it is
   legal wherever text is and survives being parsed and re-serialised. */
export const HOLE = (id: string, lang: Lang) => `<!--cts:${id}:${lang}-->`;
const HOLE_RE = /<!--cts:([A-Za-z0-9_-]+):([A-Za-z-]+)-->/g;

/* Data back to the page. Every hole must be filled and every block must be
   used: a template and a block list that disagree mean the conversion lost
   something, and it is better to say so than to render a page with a gap in
   it. */
export function renderLesson(lesson: Lesson, langs: Lang[] = lesson.langs): string {
  const byId = new Map(lesson.blocks.map((b) => [b.id, b]));
  const used = new Set<string>();
  const out = lesson.template.replace(HOLE_RE, (_m, id: string, lang: string) => {
    const b = byId.get(id);
    if (!b) throw new Error(`${lesson.course} unit ${lesson.unit}: the template has a hole for block ${id}, which does not exist`);
    used.add(id);
    if (!langs.includes(lang)) return '';
    const t = b.text[lang];
    if (t == null) throw new Error(`${lesson.course} unit ${lesson.unit}: block ${id} has a hole for ${lang} and no ${lang} text`);
    return t;
  });
  if (used.size !== byId.size) {
    const orphans = [...byId.keys()].filter((id) => !used.has(id));
    throw new Error(`${lesson.course} unit ${lesson.unit}: ${orphans.length} block(s) have no hole in the template: ${orphans.slice(0, 5).join(', ')}`);
  }
  return out;
}
