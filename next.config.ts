import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Auto-generated date-prefixed blog redirects.
 *
 * Every MDX file under content/blog/ becomes a 308 from
 *   /blog/<YYYY-MM-DD>-<filename-without-extension>
 * to
 *   /blog/<filename-without-extension>
 *
 * This means any future blog post automatically gets its date-prefixed alias
 * redirecting to the clean short slug — no manual config edits required.
 *
 * Source of truth for the destination is the MDX filename (= the canonical slug
 * used by getMdxBySlug). The YYYY-MM-DD prefix is read from frontmatter.date.
 */
function buildAutoBlogRedirects(): Array<{ source: string; destination: string }> {
  const blogDir = path.join(__dirname, "content", "blog");
  if (!fs.existsSync(blogDir)) return [];

  const out: Array<{ source: string; destination: string }> = [];
  const seen = new Set<string>();

  for (const file of fs.readdirSync(blogDir)) {
    if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
    const shortSlug = file.replace(/\.(mdx|md)$/i, "");

    let frontDate = "";
    try {
      const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
      const fm = matter(raw).data as { date?: string };
      frontDate = (fm.date ?? "").slice(0, 10); // YYYY-MM-DD
    } catch {
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(frontDate)) continue;

    const source = `/blog/${frontDate}-${shortSlug}`;
    const destination = `/blog/${shortSlug}`;
    if (source === destination) continue;
    if (seen.has(source)) continue;
    seen.add(source);
    out.push({ source, destination });
  }
  return out;
}

/**
 * Manual aliases for legacy URLs whose short slug was *renamed* (not just
 * un-prefixed). These can't be derived from frontmatter because the legacy
 * short slug doesn't match the current filename. Add an entry here when you
 * rename a published post.
 */
const LEGACY_BLOG_ALIASES: Array<{ source: string; destination: string }> = [
  // 2026-03-22 batch renames
  { source: "/blog/2026-03-22-ai-hip-hop-is-here", destination: "/blog/ai-hip-hop-is-here-and-it-slaps" },
  { source: "/blog/ai-hip-hop-is-here", destination: "/blog/ai-hip-hop-is-here-and-it-slaps" },
  { source: "/blog/2026-03-22-this-week-in-ai-series", destination: "/blog/this-week-in-ai-hip-hop-series" },
  { source: "/blog/this-week-in-ai-series", destination: "/blog/this-week-in-ai-hip-hop-series" },
  { source: "/blog/2026-03-22-what-is-an-ai-rapper", destination: "/blog/what-is-an-ai-rapper-meet-slopdog" },
  { source: "/blog/what-is-an-ai-rapper", destination: "/blog/what-is-an-ai-rapper-meet-slopdog" },
];

const LEGACY_PATH_REDIRECTS: Array<{ source: string; destination: string }> = [
  // Old generic "drops" listing -> music
  { source: "/drops", destination: "/music" },
  { source: "/drops/:slug*", destination: "/music/:slug*" },
  // Old "/product/:slug" path -> "/products/:slug"
  { source: "/product/:slug*", destination: "/products/:slug*" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    const auto = buildAutoBlogRedirects();
    const all = [...auto, ...LEGACY_BLOG_ALIASES, ...LEGACY_PATH_REDIRECTS];
    // De-duplicate by source; first occurrence wins.
    const dedup = new Map<string, { source: string; destination: string }>();
    for (const r of all) if (!dedup.has(r.source)) dedup.set(r.source, r);
    return Array.from(dedup.values()).map((r) => ({ ...r, permanent: true })); // permanent => 308
  },
};

export default nextConfig;
