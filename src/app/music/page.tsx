import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getAllMdx } from "@/lib/mdx";
import { SITE } from "@/lib/site";

type TrackFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
};

export const metadata: Metadata = {
  title: "Music",
  description:
    "Listen to Slopdog's AI-generated hip-hop releases. Weekly drops powered by autonomous AI agents and the latest AI news.",
  alternates: {
    canonical: "/music",
  },
  openGraph: {
    title: "Music | SLOPDOG",
    description:
      "Discography of Slopdog, the world's first fully automated AI music artist.",
    url: "/music",
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music | SLOPDOG",
    description:
      "Discography of Slopdog, the world's first fully automated AI music artist.",
    images: [SITE.ogImage],
  },
};

export default function MusicPage() {
  const tracks = getAllMdx<TrackFrontmatter>("content/music");

  return (
    <div className="px-4 py-14 md:py-20 sm:px-6 lg:pl-16 lg:pr-8">
      <div className="motion-fade-up">
        <SectionHeading title="MUSIC" right={<span className="text-fg-faint">Newest first</span>} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tracks.map((t, i) => {
          const pos = i % 6;
          // Repeating 6-item rhythm: hero (2×2), compact, landscape, wide (2×1), minimal, tall (1×2)
          const spanClass =
            pos === 0 ? "sm:col-span-2 sm:row-span-2" :
            pos === 3 ? "sm:col-span-2" :
            pos === 5 ? "lg:row-span-2" : "";
          const isFeatured = pos === 0;
          const isWide = pos === 3;
          const isTall = pos === 5;
          const isCompact = pos === 1;
          const isLandscape = pos === 2;
          const isMinimal = pos === 4;
          const aspectClass =
            isFeatured ? "aspect-[4/3]" :
            isWide ? "aspect-[2/1]" :
            isLandscape ? "aspect-[3/2]" :
            isTall ? "aspect-[3/4]" :
            isMinimal ? "aspect-[5/4]" : "aspect-square";
          const textSize =
            isFeatured ? "text-display-sm" :
            isWide ? "text-display-sm" :
            isCompact ? "text-body-sm" : "text-body-lg";
          const padClass =
            isFeatured ? "p-5" :
            isCompact ? "p-3" :
            isMinimal ? "p-3" : "p-4";
          const clampClass = isFeatured ? "line-clamp-4" : isWide ? "line-clamp-3" : "line-clamp-2";

          return (
            <Link
              key={t.slug}
              href={`/music/${t.slug}`}
              className={`group motion-fade-up rounded-xl border border-fg/10 bg-fg/5 transition-all duration-normal ease-out-quart hover:border-primary/30 ${padClass} ${spanClass}`}
              style={{ animationDelay: `${Math.min(i, 5) * 75}ms` }}
            >
              <div className={`relative overflow-hidden rounded-lg border border-fg/10 ${aspectClass}`}>
                <Image src={t.frontmatter.coverImage} alt={t.frontmatter.title} fill className="object-cover transition-transform duration-slow ease-out-quint group-hover:scale-105" sizes={isFeatured || isWide ? "(max-width:1024px) 100vw, 66vw" : "(max-width:1024px) 100vw, 33vw"} />
              </div>
              <div className={`${isCompact ? "mt-2" : "mt-3"} flex items-start justify-between gap-3`}>
                <div className="min-w-0">
                  <div className={`truncate font-display font-bold group-hover:text-primary transition-colors duration-normal ease-out-quart ${textSize}`}>{t.frontmatter.title}</div>
                  <div className="text-label text-fg-faint">{t.frontmatter.date}</div>
                </div>
                {isFeatured ? <span className="rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-label uppercase text-primary">Latest</span> : null}
              </div>
              {isMinimal ? null : <p className={`mt-2 text-body-sm text-fg-muted ${clampClass}`}>{t.frontmatter.concept}</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
