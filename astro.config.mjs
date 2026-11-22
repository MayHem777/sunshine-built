// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { heldBack } from './scripts/held-back.mjs';

// Remove originals of hidden gallery photos and draft case-study photos from the build.
const dropHeldBack = {
  name: 'drop-held-back-photos',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      const stems = heldBack();
      if (!stems.length) return;
      const assets = join(fileURLToPath(dir), '_astro');
      for (const f of readdirSync(assets)) {
        if (stems.some((s) => f.startsWith(s + '.'))) { rmSync(join(assets, f)); logger.info(`removed held-back photo ${f}`); }
      }
    },
  },
};

// Pages that exist but must not be in the sitemap (and carry noindex).
const NOT_IN_SITEMAP = ['/admin/', '/contact/thank-you/', '/404', '/services/new-homes/'];

export default defineConfig({
  site: 'https://www.sunshinebuilt.com.au',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    dropHeldBack,
    sitemap({ filter: (page) => !NOT_IN_SITEMAP.some((p) => page.includes(p)) }),
  ],
});
