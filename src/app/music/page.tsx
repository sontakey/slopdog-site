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
      <SectionHeading kicker="/" title="MUSIC" right={<span className="text-zinc-500">NEWEST FIRST</span>} />

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tracks.map((t, i) => {
          const pos = i % 6;
          // Repeating pattern: hero (2x2), standard, standard, wide (2x1), standard, tall (1x2)
          const spanClass =
            pos === 0 ? "sm:col-span-2 sm:row-span-2" :
            pos === 3 ? "sm:col-span-2" :
            pos === 5 ? "lg:row-span-2" : "";
          const isFeatured = pos === 0;
          const isWide = pos === 3;
          const aspectClass =
            isFeatured ? "aspect-[4/3]" :
            isWide ? "aspect-[2/1]" : "aspect-square";
          const textSize = isFeatured ? "text-display-sm" : isWide ? "text-display-sm" : "text-body-lg";
          const clampClass = isFeatured ? "line-clamp-4" : isWide ? "line-clamp-3" : "line-clamp-2";

          return (
            <Link
              key={t.slug}
              href={`/music/${t.slug}`}
              className={`group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:shadow-glow ${spanClass}`}
            >
              <div className={`scanlines relative overflow-hidden rounded-lg border border-white/10 ${aspectClass}`}>
                <Image src={t.frontmatter.coverImage} alt={t.frontmatter.title} fill className="object-cover" sizes={isFeatured || isWide ? "(max-width:1024px) 100vw, 66vw" : "(max-width:1024px) 100vw, 33vw"} />
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className={`truncate font-display font-bold group-hover:text-primary ${textSize}`}>{t.frontmatter.title}</div>
                  <div className="text-label text-zinc-500">{t.frontmatter.date}</div>
                </div>
                <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-label uppercase text-zinc-400">{isFeatured ? "LATEST" : "OPEN"}</span>
              </div>
              <p className={`mt-2 text-body-sm text-zinc-400 ${clampClass}`}>{t.frontmatter.concept}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
