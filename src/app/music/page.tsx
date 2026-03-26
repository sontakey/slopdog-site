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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading kicker="/" title="MUSIC" right={<span className="text-zinc-500">NEWEST FIRST</span>} />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((t, i) => (
          <Link
            key={t.slug}
            href={`/music/${t.slug}`}
            className={`group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:shadow-glow ${
              i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
            }`}
          >
            <div className={`scanlines relative overflow-hidden rounded-lg border border-white/10 ${
              i === 0 ? "aspect-[4/3]" : "aspect-square"
            }`}>
              <Image src={t.frontmatter.coverImage} alt={t.frontmatter.title} fill className="object-cover" sizes={i === 0 ? "(max-width:1024px) 100vw, 66vw" : "(max-width:1024px) 100vw, 33vw"} />
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className={`truncate font-bold group-hover:text-primary ${i === 0 ? "text-2xl" : "text-lg"}`}>{t.frontmatter.title}</div>
                <div className="text-xs text-zinc-500">{t.frontmatter.date}</div>
              </div>
              <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-semibold tracking-wide text-zinc-400">{i === 0 ? "LATEST" : "OPEN"}</span>
            </div>
            <p className={`mt-2 text-sm text-zinc-400 ${i === 0 ? "line-clamp-4" : "line-clamp-2"}`}>{t.frontmatter.concept}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
