import { MetadataRoute } from "next";
import { getAllMdx } from "@/lib/mdx";
import { getPublicMusicTracks } from "@/lib/music";
import { SITE } from "@/lib/site";

function toLastModified(date: unknown): Date {
  if (typeof date !== "string" && typeof date !== "number" && !(date instanceof Date)) {
    return new Date();
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return new Date();
  return parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const tracks = getPublicMusicTracks();
  const posts = getAllMdx<{ slug: string; date?: string }>("content/lore");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/music`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/lore`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/merch`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const trackRoutes: MetadataRoute.Sitemap = tracks.map((t) => ({
    url: `${SITE.url}/music/${t.slug}`,
    lastModified: toLastModified(t.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/lore/${p.slug}`,
    lastModified: toLastModified(p.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...trackRoutes, ...postRoutes];
}
