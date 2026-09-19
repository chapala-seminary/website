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

export const collections = { units, courses };
