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

// Date-gated publishing: hide blog posts whose date is in the future.
// Music tracks are always shown (the detail page can advertise an upcoming drop).
function shouldGateByDate(dir: string) {
  return dir.includes("blog");
}

function isPublished(dir: string, frontmatter: Record<string, unknown>): boolean {
  if (!shouldGateByDate(dir)) return true;
  const d = frontmatter?.date;
  if (!d || typeof d !== "string") return true;
  const postDate = new Date(d).getTime();
  if (Number.isNaN(postDate)) return true;
  return postDate <= Date.now();
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
    .filter(({ frontmatter }) => isPublished(dir, frontmatter as Record<string, unknown>))
    .sort((a, b) => {
      const da = new Date(a.frontmatter.date ?? 0).getTime();
      const db = new Date(b.frontmatter.date ?? 0).getTime();
      return db - da;
    });
}

export function getPublishedSlugs(dir: string): string[] {
  return getAllMdx<Record<string, any>>(dir).map((e) => e.slug);
}
