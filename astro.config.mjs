import { defineConfig } from 'astro/config';
import langIntegration from './tools/inject-lang.mjs';
import versionIntegration from './tools/write-version.mjs';
import iconIntegration from './tools/inject-icon.mjs';
import languagePagesIntegration from './tools/language-pages.mjs';

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
  integrations: [langIntegration(), versionIntegration(), iconIntegration(), languagePagesIntegration()],
});
