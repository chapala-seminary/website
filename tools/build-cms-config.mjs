/* The CMS configuration, generated from the content it edits.
 *
 * WHY THIS IS GENERATED AND NOT WRITTEN BY HAND
 *
 * Sveltia -- like Decap before it -- writes back only the fields its config
 * declares. A field the config does not mention is DROPPED from the file when
 * a teacher presses save. So a hand-written config is a standing invitation to
 * lose data: add a field to the schema, forget to add it to the config, and the
 * next person who fixes a typo silently deletes it from that unit. Generating
 * the config from the data closes that gap, and tools/verify-cms-config.mjs
 * fails the build if the two ever drift apart.
 *
 * It also means adding a language is still adding a key. The per-language
 * fields below come from each lesson's own `langs`, so converting a course to
 * French regenerates a French field in the editor with no config edit.
 *
 *   node tools/build-cms-config.mjs          # writes public/admin/config.yml
 *   node tools/build-cms-config.mjs --check  # prints it, writes nothing
 */
import fs from 'node:fs';
import path from 'node:path';

const LESSONS = 'src/content/lessons';
const UNITS = 'src/content/units';
const COURSES = 'src/content/courses';
const OUT = 'public/admin/config.yml';

const REPO = 'chapala-seminary/website';
const BRANCH = 'main';

/* A language's English name, for the editor's field labels. Unknown codes fall
   back to the code itself rather than guessing. */
const LANG_NAME = { en: 'English', es: 'Spanish', fr: 'French', pt: 'Portuguese' };
const langLabel = (l) => LANG_NAME[l] ?? l;

const yaml = (v, indent = 0) => {
  const pad = ' '.repeat(indent);
  if (Array.isArray(v))
    return v.map((x) => `${pad}- ` + yaml(x, indent + 2).replace(/^\s+/, '')).join('\n');
  if (v && typeof v === 'object')
    return Object.entries(v).map(([k, val]) => {
      if (val === undefined) return null;
      if (Array.isArray(val) || (val && typeof val === 'object'))
        return `${pad}${k}:\n${yaml(val, indent + 2)}`;
      return `${pad}${k}: ${yaml(val)}`;
    }).filter(Boolean).join('\n');
  if (typeof v === 'string')
    return /^[\w./ -]+$/.test(v) && !/^(true|false|null|yes|no|on|off|\d)/i.test(v)
      ? v : JSON.stringify(v);
  return String(v);
};

/* Every block type the lesson model has, as the editor sees it. The `name` of
   each type matches the block's own `type`, which is how a variable-type list
   knows which form to show. */
const blockTypes = (langs) => {
  const text = (label) => ({
    label, name: 'text', widget: 'object',
    fields: langs.map((l) => ({
      label: langLabel(l), name: l, widget: 'text', required: l === langs[0],
    })),
  });

  /* Provenance. `from` is a hash and no person should ever type one, so it is
     hidden and carried through untouched. `status` is a small dropdown,
     because the one thing a person can usefully say about a translation is who
     wrote it -- and marking a fixed machine translation as corrected is what
     stops the next automatic pass from treating it as disposable. */
  const tr = (hint) => ({
    label: 'Translation status', name: 'tr', widget: 'object', required: false,
    collapsed: true, hint,
    fields: langs.slice(1).flatMap((l) => [{
      label: langLabel(l), name: l, widget: 'object', required: false,
      fields: [
        { label: 'Written by', name: 'status', widget: 'select', required: false,
          options: [
            { label: 'A person', value: 'human' },
            { label: 'Translated automatically', value: 'machine' },
            { label: 'Automatic, then corrected', value: 'machine-edited' },
          ] },
        { label: 'Source hash', name: 'from', widget: 'hidden' },
      ],
    }]),
  });

  const common = (label, hint) => [
    { label: 'Block id', name: 'id', widget: 'hidden' },
    text(label),
    tr(hint),
  ];

  const HINT = 'Edit the English and every translation of this block is marked out of date automatically.';

  return [
    { name: 'masthead', label: 'Page heading', widget: 'object',
      fields: common('Heading', HINT) },
    { name: 'title', label: 'Unit title', widget: 'object',
      fields: common('Title', HINT) },
    { name: 'subtitle', label: 'Unit subtitle', widget: 'object',
      fields: common('Subtitle', HINT) },
    { name: 'heading', label: 'Section heading', widget: 'object',
      fields: [...common('Heading', HINT),
               { label: 'Link anchor', name: 'anchor', widget: 'string', required: false }] },
    { name: 'prose', label: 'Paragraph', widget: 'object',
      fields: [...common('Paragraph', HINT),
               { label: 'Link anchor', name: 'anchor', widget: 'string', required: false }] },
    { name: 'scripture', label: 'Scripture quotation', widget: 'object',
      fields: [...common('Quotation', HINT),
               { label: 'Link anchor', name: 'anchor', widget: 'string', required: false }] },
    { name: 'figure', label: 'Illustration', widget: 'object',
      fields: [
        { label: 'Block id', name: 'id', widget: 'hidden' },
        { label: 'Drawing (SVG)', name: 'svg', widget: 'hidden' },
        { label: 'Figure attributes', name: 'attrs', widget: 'hidden' },
        { label: 'Caption', name: 'caption', widget: 'object', required: false,
          fields: [text('Caption'), tr(HINT)] },
      ] },
  ];
};

/* The lesson itself. `create: false` and `delete: false` are deliberate: a unit
   comes into existence when a course is converted, and a teacher who can delete
   one from a web form will eventually delete one. */
const lessonCollection = (course, langs) => ({
  name: `lessons_${course}`,
  label: course.replace(/^CTS/, ''),
  label_singular: 'Unit',
  folder: `${LESSONS}/${course}`,
  extension: 'json',
  format: 'json',
  create: false,
  delete: false,
  identifier_field: 'unit',
  summary: 'Unit {{fields.unit}}',
  sortable_fields: ['unit'],
  filter: { field: 'course', value: course },
  fields: [
    { label: 'Course', name: 'course', widget: 'hidden' },
    { label: 'Unit number', name: 'unit', widget: 'number', value_type: 'int' },
    { label: 'Written in', name: 'sourceLang', widget: 'hidden' },
    { label: 'Languages', name: 'langs', widget: 'hidden' },
    { label: 'Lesson', name: 'blocks', widget: 'list',
      label_singular: 'Block',
      summary: '{{fields.text.' + langs[0] + '}}',
      types: blockTypes(langs) },
  ],
});

/* The questions. Most of these fields are plumbing -- which page follows which,
   what the body class is -- and a teacher must neither see them nor lose them.
   Hidden carries them through untouched. */
const bilingual = (label, widget = 'string') => ({
  label, name: undefined, widget: 'object',
  fields: [
    { label: 'English', name: 'en', widget },
    { label: 'Spanish', name: 'es', widget },
  ],
});
const named = (name, label, widget) => ({ ...bilingual(label, widget), name });

const unitsCollection = () => ({
  name: 'units',
  label: 'Exam questions',
  label_singular: 'Unit',
  folder: UNITS,
  extension: 'json',
  format: 'json',
  create: false,
  delete: false,
  nested: { depth: 2 },
  identifier_field: 'title',
  summary: '{{title}}',
  fields: [
    { label: 'Course key', name: 'course', widget: 'hidden' },
    { label: 'Page prefix', name: 'pagePrefix', widget: 'hidden' },
    { label: 'Unit number', name: 'unit', widget: 'hidden' },
    { label: 'Units in this course', name: 'totalUnits', widget: 'hidden' },
    { label: 'Page title', name: 'title', widget: 'string' },
    { label: 'Body class', name: 'bodyClass', widget: 'hidden' },
    { label: 'Stylesheets', name: 'styles', widget: 'hidden' },
    { label: 'Scripts', name: 'scripts', widget: 'hidden' },
    { label: 'Previous page', name: 'prevHref', widget: 'hidden' },
    { label: 'Next page', name: 'nextHref', widget: 'hidden' },
    { label: 'File prefix', name: 'filePrefix', widget: 'hidden' },
    { label: 'Unit titles', name: 'unitTitles', widget: 'hidden' },
    { label: 'Multiple choice', name: 'mc', widget: 'list', label_singular: 'Question',
      summary: '{{fields.stem.en}}',
      fields: [
        named('stem', 'Question', 'text'),
        { label: 'Options', name: 'options', widget: 'object', fields: [
          { label: 'English', name: 'en', widget: 'list', field: { label: 'Option', name: 'option', widget: 'string' } },
          { label: 'Spanish', name: 'es', widget: 'list', field: { label: 'Option', name: 'option', widget: 'string' } },
        ] },
        { label: 'Correct option (0 = the first)', name: 'answer', widget: 'number', value_type: 'int', min: 0 },
        { ...named('why', 'Explanation', 'text'), required: false },
      ] },
    { label: 'Short answer', name: 'sa', widget: 'list', label_singular: 'Question',
      summary: '{{fields.prompt.en}}',
      fields: [
        named('prompt', 'Question', 'text'),
        { label: 'Keywords', name: 'keywords', widget: 'hidden', required: false },
        { ...named('model', 'Model answer', 'text'), required: false },
        { label: 'Keywords needed to pass', name: 'minHits', widget: 'number', value_type: 'int', min: 1, required: false },
      ] },
  ],
});

const coursesCollection = () => ({
  name: 'courses',
  label: 'Course catalog',
  label_singular: 'Course',
  folder: COURSES,
  extension: 'json',
  format: 'json',
  create: true,
  identifier_field: 'code',
  summary: '{{fields.title.en}}',
  fields: [
    { label: 'Course code', name: 'code', widget: 'string' },
    { label: 'Entry page', name: 'entry', widget: 'string',
      pattern: ['^[A-Za-z0-9_]+\\.html$', 'must be a page in the site root, e.g. CTSActsUnit1.html'] },
    { label: 'Runs on the exam engine', name: 'engine', widget: 'boolean' },
    { label: 'Group', name: 'group', widget: 'string' },
    { label: 'Order within the group', name: 'order', widget: 'number', value_type: 'int', min: 1 },
    named('title', 'Title'),
    named('description', 'Description', 'text'),
  ],
});

const converted = fs.existsSync(LESSONS)
  ? fs.readdirSync(LESSONS).filter((d) => fs.statSync(path.join(LESSONS, d)).isDirectory())
  : [];

/* A course's languages come from its own lessons, not from a list here. */
const langsOf = (course) => {
  const f = fs.readdirSync(path.join(LESSONS, course)).find((f) => /^\d+\.json$/.test(f));
  return JSON.parse(fs.readFileSync(path.join(LESSONS, course, f), 'utf8')).langs;
};

const config = {
  backend: {
    name: 'github',
    repo: REPO,
    branch: BRANCH,
    /* Sign-in goes through a sveltia-cms-auth Worker of our own, so no third
       party ever holds a token for this repository. On localhost the CMS
       offers "Work with Local Repository" instead and none of this is used. */
    base_url: 'https://auth.chapalaseminary.org',
  },
  site_url: 'https://chapalaseminary.org',
  display_url: 'https://chapalaseminary.org',
  media_folder: 'public/assets/img',
  public_folder: '/assets/img',
  publish_mode: 'editorial_workflow',
  collections: [
    ...converted.map((c) => lessonCollection(c, langsOf(c))),
    unitsCollection(),
    coursesCollection(),
  ],
};

const header = `# GENERATED by tools/build-cms-config.mjs -- do not edit by hand.
#
# Sveltia writes back only the fields this file declares; anything it does not
# mention is dropped when a teacher presses save. So this is generated from the
# content itself and checked by tools/verify-cms-config.mjs, which fails if a
# field exists in the data and not here.
#
# ${converted.length ? `Lesson collections: ${converted.join(', ')}` : 'No course has been converted yet.'}
# Regenerate with: node tools/build-cms-config.mjs
`;

const out = header + '\n' + yaml(config) + '\n';
if (process.argv.includes('--check')) { process.stdout.write(out); process.exit(0); }
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log(`wrote ${OUT}: ${config.collections.length} collections (${converted.length} converted course(s))`);
