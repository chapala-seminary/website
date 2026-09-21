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
const text = z.record(z.string(), z.string());

const tr = z.record(z.string(), z.object({
  status: z.enum(['human', 'machine', 'machine-edited']),
  from: z.string().length(12),        // hash of the source text it was made from
}));

const block = z.object({
  id: z.string().min(1),
  type: z.enum(['masthead', 'title', 'subtitle', 'heading', 'prose', 'scripture', 'figure']),
  text: text.optional(),
  tr: tr.optional(),
  anchor: z.string().optional(),
  svg: z.string().optional(),
  attrs: z.string().optional(),
  caption: z.object({ text, tr: tr.optional() }).optional(),
}).refine((b) => b.type === 'figure' ? b.svg != null : b.text != null, {
  message: 'a figure needs an svg; every other block needs text',
});

const lessons = defineCollection({
  loader: glob({
    pattern: '**/[0-9]*.json',        // _chrome.json is furniture, not a lesson
    base: './src/content/lessons',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: z.object({
    course: z.string().min(1),
    unit: z.number().int().positive(),
    sourceLang: z.string().min(2),
    langs: z.array(z.string().min(2)).min(1),
    blocks: z.array(block).min(1),
  })
    .refine((l) => l.langs.includes(l.sourceLang), {
      message: 'the source language is not in the lesson\'s language list',
    })
    .refine((l) => new Set(l.blocks.map((b) => b.id)).size === l.blocks.length, {
      message: 'two blocks share an id, so an edit to one would land on the other',
    })
    .superRefine((l, ctx) => {
      for (const b of l.blocks) {
        const t = b.type === 'figure' ? b.caption?.text : b.text;
        if (!t || t[l.sourceLang] == null) continue;
        for (const lang of l.langs) {
          if (lang === l.sourceLang) continue;
          if (t[lang] == null) ctx.addIssue({ code: 'custom',
            message: `block ${b.id} has no ${lang} text, so that reader gets the page half in ${l.sourceLang}` });
        }
      }
    }),
});

export const collections = { units, courses, lessons };
