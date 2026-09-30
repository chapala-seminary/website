import { defineConfig } from 'astro/config';
import langIntegration from './tools/inject-lang.mjs';

export default defineConfig({
  site: 'https://chapalaseminary.org',
  // "file" keeps /CTS1PeterUnit1.html exactly as it is today rather than
  // turning it into a directory with an index.html
  build: { format: 'file' },
  outDir: './dist',
  publicDir: './public',
  // every page restores the reader's chosen language (tools/inject-lang.mjs)
  integrations: [langIntegration()],
});
