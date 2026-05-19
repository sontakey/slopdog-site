import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import AlbumCard from "@/components/AlbumCard";
import { getAllMdx } from "@/lib/mdx";
import { SITE } from "@/lib/site";

type TrackFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
  trackNumber?: number;
};

export const metadata: Metadata = {
  title: "Slopdog Music: AI-Generated Hip-Hop Drops, Weekly",
  description:
    "Stream Slopdog's full discography of AI-generated hip-hop. Weekly tracks made by autonomous AI agents, ripped from real AI news headlines.",
  alternates: { canonical: "/music" },
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
  const featured = tracks[0];
  const rest = tracks.slice(1);

  return (
    <div className="px-4 md:px-16 pt-10 pb-24">
      {/* Status header */}
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] mb-8 flex flex-wrap justify-between gap-2">
        <span>[ /music ] // discography_full // sort=newest_first</span>
        <span>
          archive_count: <span className="text-[var(--color-secondary-container)]">{String(tracks.length).padStart(3, "0")}</span>
        </span>
      </div>

      <SectionHeading
        level={1}
        kicker="catalog // 01"
        title="slopdog discography"
        status="archive_live"
      />

      {/* Featured row + table-style list */}
      {featured ? (
        <div className="grid lg:grid-cols-12 gap-8 mb-20 motion-fade-up">
          <div className="lg:col-span-7">
            <AlbumCard
              href={`/music/${featured.slug}`}
              title={featured.frontmatter.title}
              sub={`${featured.frontmatter.date} // single`}
              image={featured.frontmatter.coverImage}
              badge="latest"
              index={String(tracks.length).padStart(3, "0")}
              variant="hero"
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end pb-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">
              [ latest_release ]
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold lowercase text-[var(--color-on-surface)] mb-4">
              {featured.frontmatter.title.toLowerCase()}
            </h2>
            <p className="text-[14px] md:text-[15px] leading-relaxed text-[var(--color-on-surface-variant)] mb-6 font-mono tracking-wide uppercase">
              {featured.frontmatter.concept}
            </p>
            <Link
              href={`/music/${featured.slug}`}
              className="self-start border border-[var(--color-primary)] px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors"
            >
              → open_release
            </Link>
          </div>
        </div>
      ) : null}

      {rest.length ? (
        <>
          <div className="border-b border-[var(--color-outline-variant)] pb-3 mb-4 grid grid-cols-12 gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)]">
            <div className="col-span-1">#</div>
            <div className="col-span-2 md:col-span-2">cover</div>
            <div className="col-span-5 md:col-span-4">title</div>
            <div className="col-span-3 md:col-span-3 hidden md:block">concept</div>
            <div className="col-span-4 md:col-span-2 text-right">released</div>
          </div>

          <ul className="divide-y divide-[var(--color-outline-variant)]">
            {rest.map((t, i) => {
              const num = String(rest.length - i).padStart(3, "0");
              return (
                <li key={t.slug}>
                  <Link
                    href={`/music/${t.slug}`}
                    className="group grid grid-cols-12 gap-4 items-center py-4 hover:bg-[var(--color-surface-container-lowest)] transition-colors px-2 -mx-2"
                  >
                    <div className="col-span-1 font-mono text-[12px] text-[var(--color-outline)] group-hover:text-[var(--color-primary)]">
                      {num}
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <div className="relative aspect-square w-14 md:w-16 border border-[var(--color-outline-variant)] group-hover:border-[var(--color-primary)] transition-colors overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t.frontmatter.coverImage}
                          alt={t.frontmatter.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="col-span-5 md:col-span-4">
                      <div className="font-display text-lg md:text-xl font-extrabold lowercase text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors leading-tight">
                        {t.frontmatter.title.toLowerCase()}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)] md:hidden mt-1">
                        {t.frontmatter.date}
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-3 hidden md:block text-[11px] text-[var(--color-on-surface-variant)] line-clamp-2 leading-snug font-mono tracking-wide uppercase">
                      {t.frontmatter.concept}
                    </div>
                    <div className="col-span-4 md:col-span-2 text-right font-mono text-[11px] uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                      {t.frontmatter.date}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
    </div>
  );
}
