import { defineConfig } from 'astro/config';
import langIntegration from './tools/inject-lang.mjs';
import versionIntegration from './tools/write-version.mjs';
import iconIntegration from './tools/inject-icon.mjs';
import languagePagesIntegration from './tools/language-pages.mjs';
import singlePagesIntegration from './tools/single-pages.mjs';
import { frenchReadingsIntegrations } from './tools/french-readings-pages.mjs';

const [frenchReadings, frenchReadingDrafts] = frenchReadingsIntegrations();

export default defineConfig({
  site: 'https://chapalaseminary.org',
  // "file" keeps /CTS1PeterUnit1.html exactly as it is today rather than
  // turning it into a directory with an index.html
  build: { format: 'file' },
  outDir: './dist',
  publicDir: './public',
  // every page restores the reader's chosen language (tools/inject-lang.mjs)
  // and /version.txt names the release (tools/write-version.mjs); every page
  // names the seal-based site icon (tools/inject-icon.mjs)
  // French reading content goes in beside the English before the language
  // pages are made, and its French pages are marked drafts after them
  // (tools/french-readings-pages.mjs)
  integrations: [langIntegration(), versionIntegration(), iconIntegration(), frenchReadings, languagePagesIntegration(), singlePagesIntegration(), frenchReadingDrafts],
});
