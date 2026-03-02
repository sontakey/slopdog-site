import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();

export function getMdxSlugs(dir: string) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/i, ""));
}

export function getMdxBySlug<TFrontmatter extends Record<string, unknown>>(
  dir: string,
  slug: string,
): { slug: string; frontmatter: TFrontmatter; content: string } {
  const full = path.join(ROOT, dir, `${slug}.mdx`);
  const raw = fs.readFileSync(full, "utf8");
  const parsed = matter(raw);
  return {
    slug,
    frontmatter: parsed.data as TFrontmatter,
    content: parsed.content,
  };
}

export function getAllMdx<TFrontmatter extends Record<string, any>>(
  dir: string,
): Array<{ slug: string; frontmatter: TFrontmatter }> {
  const slugs = getMdxSlugs(dir);
  return slugs
    .map((slug) => {
      const { frontmatter } = getMdxBySlug<TFrontmatter>(dir, slug);
      return { slug, frontmatter };
    })
    .sort((a, b) => {
      const da = new Date(a.frontmatter.date ?? 0).getTime();
      const db = new Date(b.frontmatter.date ?? 0).getTime();
      return db - da;
    });
}
