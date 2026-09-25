// Validates the skill: frontmatter, cross-references, and that every JS snippet parses.
// Run: node scripts/check.mjs (no dependencies)
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const skill = readFileSync(new URL('../SKILL.md', import.meta.url), 'utf8');
const mechanics = readFileSync(new URL('../reference/mechanics.md', import.meta.url), 'utf8');

// Frontmatter (agentskills.io spec)
const fm = skill.match(/^---\n([\s\S]*?)\n---\n/)?.[1];
assert.ok(fm, 'SKILL.md needs YAML frontmatter');
const field = (k) => fm.match(new RegExp(`^${k}: (.+)$`, 'm'))?.[1];
assert.match(field('name') ?? '', /^[a-z0-9-]+$/, 'name: lowercase letters, numbers, hyphens');
assert.ok(field('description')?.startsWith('Use when'), 'description starts with "Use when"');
assert.ok(fm.length <= 1024, `frontmatter is ${fm.length} chars (max 1024)`);

// Every mechanic named in the quick-reference table has a section in mechanics.md
const headings = [...mechanics.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
const rows = [...skill.matchAll(/^\| [^|]+ \| (.+?) \|$/gm)].map((m) => m[1]).filter((c) => !c.startsWith('Mechanic') && !/^-+$/.test(c));
assert.ok(rows.length, 'quick-reference table found');
for (const name of rows) assert.ok(headings.includes(name), `mechanics.md is missing "## ${name}"`);

// Every JS snippet (```js blocks and <script> inside ```html blocks) must parse
const blocks = [...mechanics.matchAll(/```(js|html)\n([\s\S]*?)```/g)];
let parsed = 0;
for (const [, lang, code] of blocks) {
  const scripts = lang === 'js' ? [code] : [...code.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  for (const s of scripts) {
    try { new Function(s); parsed++; } catch (e) { assert.fail(`snippet does not parse: ${e.message}\n${s.slice(0, 200)}`); }
  }
}
console.log(`ok: frontmatter, ${rows.length} mechanics linked, ${parsed} snippets parse`);
