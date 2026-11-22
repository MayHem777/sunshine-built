// Works out which image files belong only to hidden gallery items or draft case studies.
// Astro copies the original of every image a content entry points at into dist/_astro,
// even when the page filters that entry out, so these must be removed after the build.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const front = (f) => (readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/) ?? [, ''])[1];
const val = (b, k) => (b.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) ?? [])[1]?.trim().replace(/^["']|["']$/g, '');
const images = (b) => [...b.matchAll(/^\s*-?\s*(?:image|cover):\s*(.+)$/gm)].map((m) => m[1].trim().replace(/^["']|["']$/g, ''));
const stem = (p) => basename(p, extname(p));
const mdIn = (d) => (existsSync(d) ? readdirSync(d).filter((f) => f.endsWith('.md')).map((f) => join(d, f)) : []);

export function heldBack(root = '.') {
  const held = new Set();
  const shown = new Set();
  for (const f of mdIn(join(root, 'src/content/gallery'))) {
    const b = front(f);
    for (const i of images(b)) (val(b, 'hidden') === 'true' ? held : shown).add(stem(i));
  }
  for (const f of mdIn(join(root, 'src/content/work'))) {
    const b = front(f);
    for (const i of images(b)) (val(b, 'draft') !== 'false' ? held : shown).add(stem(i));
  }
  for (const s of shown) held.delete(s); // a photo also used somewhere visible stays
  return [...held];
}
