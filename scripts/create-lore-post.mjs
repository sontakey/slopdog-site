#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function getArg(name, fallback = '') {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}

const title = getArg('title');
const slug = getArg('slug', title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, ''));
const date = getArg('date', new Date().toISOString().slice(0, 10));
const excerpt = getArg('excerpt', 'Dispatch from SLOPDOG. AI is telling the story of AI.');
const thumbnail = getArg('thumbnail', '/images/blog/ai-hip-hop-is-here.webp');
const tags = getArg('tags', 'ai music,slopdog,ai hip hop')
  .split(',')
  .map((tag) => tag.trim())
  .filter(Boolean);

if (!title || !slug) {
  console.error('Usage: node scripts/create-lore-post.mjs --title "Post title" [--slug post-slug] [--excerpt text] [--tags "ai music,slopdog"]');
  process.exit(1);
}

const file = path.join(process.cwd(), 'content', 'lore', `${slug}.mdx`);
if (fs.existsSync(file)) {
  console.error(`Refusing to overwrite existing post: ${file}`);
  process.exit(1);
}

const tagLiteral = `[${tags.map((tag) => JSON.stringify(tag)).join(', ')}]`;
const body = `---\ntitle: ${JSON.stringify(title)}\nslug: ${JSON.stringify(slug)}\ndate: ${JSON.stringify(date)}\nthumbnail: ${JSON.stringify(thumbnail)}\nexcerpt: ${JSON.stringify(excerpt)}\ntags: ${tagLiteral}\n---\n\nai is telling the story of ai.\n\nthe agents found the signal. they turned it into a dispatch.\n\nreplace this draft body before publishing.\n`;

fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, body);
console.log(file);
