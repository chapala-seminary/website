import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://chapalaseminary.org',
  // "file" keeps /CTS1PeterUnit1.html exactly as it is today rather than
  // turning it into a directory with an index.html
  build: { format: 'file' },
  outDir: './dist',
  publicDir: './public',
});
