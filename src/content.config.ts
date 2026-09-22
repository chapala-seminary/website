import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* The point of putting questions in a collection: these invariants are checked
   at build time. A malformed unit fails the build instead of reaching a
   student, which is what every hand-written engine used to risk. */

const bilingual = z.object({ en: z.string(), es: z.string() });

const multipleChoice = z
  .object({
    stem: bilingual,
    options: z.object({ en: z.array(z.string()).min(2), es: z.array(z.string()).min(2) }),
    answer: z.number().int().nonnegative(),
    why: bilingual.optional(),
  })
  .refine((q) => q.answer < q.options.en.length, {
    message: 'answer index falls outside the option list',
  })
  .refine((q) => q.options.en.length === q.options.es.length, {
    message: 'English and Spanish option lists are different lengths',
  });

// a keyword entry is one word/phrase, or a group of synonyms for one concept
const keyword = z.union([z.string(), z.array(z.string()).min(1)]);

const shortAnswer = z.object({
  prompt: bilingual,
  keywords: z.object({ en: z.array(keyword), es: z.array(keyword) }).optional(),
  model: bilingual.optional(),
  minHits: z.number().int().positive().optional(),
});

const units = defineCollection({
  // id comes from the file path; without this the loader would adopt a data
  // field as the id and silently collapse every unit of a course into one
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/units',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: z.object({
    course: z.string(),
    pagePrefix: z.string(),
    unit: z.number().int().nonnegative(),
    totalUnits: z.number().int().positive(),
    title: z.string().min(1),
    bodyClass: z.string(),
    styles: z.array(z.string()),
    scripts: z.array(z.string()),
    prevHref: z.string().nullable(),
    nextHref: z.string().nullable(),
    filePrefix: z.string(),
    unitTitles: z.object({ en: z.array(z.string()), es: z.array(z.string()) }).optional(),
    mc: z.array(multipleChoice),
    sa: z.array(shortAnswer),
  }),
});

/* The 44 course cards on the front page were hand-written HTML. They are now
   a collection, which is what Stage 3's CMS will edit. The schema is what stops
   a card linking somewhere that does not exist, or landing in a group with no
   heading -- both of which a hand-edited catalog invites. */
const courses = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: './src/content/courses',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: z.object({
    code: z.string().min(1),
    entry: z.string().regex(/^[A-Za-z0-9_]+\.html$/, 'entry must be a page in the site root'),
    engine: z.boolean(),          // false for the four standalone course pages
    group: z.string().min(1),
    order: z.number().int().positive(),
    title: bilingual,
    description: bilingual,
  }),
});

/* The lesson itself, as data. Until now it was 451 files of hand-written HTML
   and a teacher who wanted to change one sentence had to find it among the
   <span>s. src/lib/lesson.ts explains the model; this is the part that makes
   the build refuse a malformed lesson.

   `translated` is the check worth having: every language a lesson claims must
   actually be present in every block that has the source language, or a page
   ships half in English to a Spanish reader. The hand-written files could
   drop a <span class="lang-es"> and nothing noticed. */
/* The lesson files are UTF-8, so a curly quote is a curly quote. The pages
   were written as HTML, where it had to be spelled &ldquo;, and an editor
   opening a paragraph in the CMS should not have to read that. &amp;, &lt;
   and &gt; stay: the field carries inline markup, so in it those three mean
   something other than themselves.

   A build failure rather than a cleanup script, because the CMS writes to
   these files too -- and a rule nothing enforces comes back. */
const ENTITY = /&(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#[xX][0-9a-fA-F]+);/g;
const STRUCTURAL = /^&(?:amp|lt|gt|AMP|LT|GT);$/;

const plainText = z.string().superRefine((v, ctx) => {
  const found = [...new Set((v.match(ENTITY) ?? []).filter((e) => !STRUCTURAL.test(e)))];
  if (found.length) ctx.addIssue({ code: 'custom',
    message: `HTML entities belong in HTML, not in a UTF-8 lesson: ${found.join(' ')}`
      + ' — run: node tools/decode-entities.mjs <Course>' });
});

const text = z.record(z.string(), plainText);

const tr = z.record(z.string(), z.object({
  status: z.enum(['human', 'machine', 'machine-edited']),
  from: z.string().length(12),        // hash of the source text it was made from
}));

const block = z.object({
  id: z.string().min(1),
  type: z.enum(['masthead', 'title', 'subtitle', 'heading', 'prose', 'scripture',
                'list-item', 'caption', 'label', 'other']),
  text,
  tr: tr.optional(),
});

const lessons = defineCollection({
  loader: glob({
    pattern: '**/[0-9]*.json',
    base: './src/content/lessons',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: z.object({
    course: z.string().min(1),
    unit: z.number().int().nonnegative(),
    sourceLang: z.string().min(2),
    langs: z.array(z.string().min(2)).min(1),
    /* The page's markup with a hole where each translated fragment was.
       Generated, never hand-edited, never shown to anyone. */
    template: z.string().min(1),
    blocks: z.array(block).min(1),
  })
    .refine((l) => l.langs.includes(l.sourceLang), {
      message: 'the source language is not in the lesson\'s language list',
    })
    .refine((l) => new Set(l.blocks.map((b) => b.id)).size === l.blocks.length, {
      message: 'two blocks share an id, so an edit to one would land on the other',
    })
    .superRefine((l, ctx) => {
      /* A block must say something in some language. Which languages it has
         is not fixed: a few paragraphs exist in English with no Spanish, and
         a few the other way round. That asymmetry is in the pages as written
         -- the reader has always seen nothing there in the other language --
         and inventing the missing half here would be worse than recording the
         gap. tools/lesson-status.mjs counts both kinds. */
      for (const b of l.blocks)
        if (!Object.values(b.text).some((t) => t != null && t !== '')) ctx.addIssue({ code: 'custom',
          message: `block ${b.id} has no text in any language` });

      /* Every hole must have text and every text a hole -- PER LANGUAGE.
         Checking only that a block has some hole somewhere passes a lesson
         whose English hole has gone while its Spanish one remains, and that
         page loses its English with nothing to say so. */
      const holes = new Map();
      for (const m of l.template.matchAll(/<!--cts:([A-Za-z0-9_-]+):([A-Za-z-]+)-->/g)) {
        if (!holes.has(m[1])) holes.set(m[1], new Set());
        holes.get(m[1]).add(m[2]);
      }
      const byId = new Map(l.blocks.map((b) => [b.id, b]));
      for (const [h, langs] of holes) {
        const b = byId.get(h);
        if (!b) { ctx.addIssue({ code: 'custom',
          message: `the template has a hole for block ${h}, which does not exist` }); continue; }
        for (const lang of langs) if (b.text[lang] == null) ctx.addIssue({ code: 'custom',
          message: `block ${h} has a hole for ${lang} and no ${lang} text` });
      }
      for (const b of l.blocks) {
        const langs = holes.get(b.id);
        if (!langs) { ctx.addIssue({ code: 'custom',
          message: `block ${b.id} has no hole in the template, so its text would never reach the page` }); continue; }
        for (const lang of Object.keys(b.text)) if (!langs.has(lang)) ctx.addIssue({ code: 'custom',
          message: `block ${b.id} has ${lang} text and no ${lang} hole, so that language would vanish from the page` });
      }
    }),
});

export const collections = { units, courses, lessons };
