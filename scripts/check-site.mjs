// Checks the built site in dist/. Exits 1 on any failure. Run after `astro build`.
//  - every page shows the licensee name and the licence number
//  - every <img> has non-empty alt text
//  - banned wording (CLAUDE.md wording rules) is absent
//  - draft case studies and hidden gallery photos are not in the output
//  - lists every [MITCH: ...] placeholder by page
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename, extname } from 'node:path';
import { heldBack } from './held-back.mjs';

const DIST = 'dist';
const REQUIRED = ['Sunshine Built', 'M.J. Croft Pty Ltd ATF The Croft Trust', 'QBCC Licence 15205110'];
const BANNED = [/twenty years/i, /two decades/i, /20\+/, /\bestablished\b/i, /fully insured/i, /Sunshine Coast since/i, /Brisbane Spa Centre/i];

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
if (!existsSync(DIST)) { console.error('dist/ not found: run astro build first'); process.exit(1); }
const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html') && !f.startsWith(join(DIST, 'admin')));
const errors = [];
const todos = [];

const text = (s) => s.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|’/g, "'").replace(/\s+/g, ' ');

for (const f of html) {
  const src = readFileSync(f, 'utf8');
  const page = '/' + relative(DIST, f).replace(/index\.html$/, '');
  const t = text(src);
  for (const r of REQUIRED) if (!t.includes(r)) errors.push(`${page}: missing "${r}"`);
  for (const b of BANNED) if (b.test(t)) errors.push(`${page}: banned wording ${b}`);
  for (const img of src.match(/<img\b[^>]*>/g) ?? []) {
    const alt = img.match(/\balt="([^"]*)"/);
    if (!alt || !alt[1].trim()) errors.push(`${page}: <img> without alt text: ${img.slice(0, 120)}`);
  }
  for (const m of t.matchAll(/\[MITCH: ([^\]]+)\]/g)) todos.push(`${page}  [MITCH: ${m[1].trim()}]`);
}

// Front matter helpers (simple key: value lines are enough here)
const fm = (file) => {
  const m = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : '';
};
const field = (block, key) => (block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm')) ?? [])[1]?.trim();
const all = files.map((f) => relative(DIST, f)).join('\n');
const allHtml = html.map((f) => readFileSync(f, 'utf8')).join('\n');

let drafts = 0;
for (const f of walk('src/content/work').filter((f) => f.endsWith('.md'))) {
  const b = fm(f);
  const isDraft = field(b, 'draft') !== 'false'; // default is draft
  if (!isDraft) continue;
  drafts++;
  const slug = basename(f, '.md');
  const title = field(b, 'title')?.replace(/^["']|["']$/g, '');
  if (existsSync(join(DIST, 'our-work', slug))) errors.push(`draft case study built: /our-work/${slug}/`);
  if (allHtml.includes(`/our-work/${slug}`)) errors.push(`draft case study linked: ${slug}`);
  if (title && text(allHtml).includes(title)) errors.push(`draft case study title appears in output: ${title}`);
}

const held = heldBack();
for (const stem of held) {
  if (all.includes(stem + '.') || allHtml.includes(stem + '.')) errors.push(`held-back photo in output: ${stem}`);
}
const hidden = held.length;
console.log(`Checked ${html.length} pages. Drafts kept out: ${drafts}. Held-back photos (hidden or draft-only) kept out: ${hidden}.`);
console.log(`\n[MITCH:] placeholders (${todos.length}):`);
for (const t of todos) console.log('  ' + t);
if (errors.length) {
  console.error(`\nFAILED (${errors.length}):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log('\nAll checks passed.');
