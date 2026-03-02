import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getAllMdx } from "@/lib/mdx";

type TrackFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
};

export const metadata = {
  title: "Music",
};

export default function MusicPage() {
  const tracks = getAllMdx<TrackFrontmatter>("content/music");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading kicker="/" title="MUSIC" right={<span className="text-zinc-500">NEWEST FIRST</span>} />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((t) => (
          <Link
            key={t.slug}
            href={`/music/${t.slug}`}
            className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:shadow-glow"
          >
            <div className="scanlines relative aspect-square overflow-hidden rounded-lg border border-white/10">
              <Image src={t.frontmatter.coverImage} alt={t.frontmatter.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 33vw" />
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-lg font-bold group-hover:text-primary">{t.frontmatter.title}</div>
                <div className="text-xs font-mono text-zinc-500">{t.frontmatter.date}</div>
              </div>
              <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-mono text-zinc-400">
                OPEN
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{t.frontmatter.concept}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
