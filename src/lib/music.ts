import { getAllMdx } from "@/lib/mdx";

export type MusicFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
  trackNumber?: number;
  releaseStatus?: string;
};

const HIDDEN_RELEASE_STATUSES = new Set([
  "draft",
  "hidden",
  "in_production",
  "private",
]);

export function isPublicMusicTrack<T extends MusicFrontmatter>(track: {
  frontmatter: T;
}) {
  const status = track.frontmatter.releaseStatus?.toLowerCase().trim();
  return !status || !HIDDEN_RELEASE_STATUSES.has(status);
}

export function getPublicMusicTracks<T extends MusicFrontmatter = MusicFrontmatter>() {
  return getAllMdx<T>("content/music")
    .filter(isPublicMusicTrack)
    .sort((a, b) => {
      const an = a.frontmatter.trackNumber ?? 0;
      const bn = b.frontmatter.trackNumber ?? 0;
      if (an !== bn) return bn - an;
      const ad = new Date(a.frontmatter.date ?? 0).getTime();
      const bd = new Date(b.frontmatter.date ?? 0).getTime();
      return bd - ad;
    });
}
