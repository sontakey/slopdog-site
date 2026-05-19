import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import StaticAudioPlayer from "@/components/StaticAudioPlayer";
import AlbumCard from "@/components/AlbumCard";
import { getAllMdx } from "@/lib/mdx";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

type TrackFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
  embedUrl: string;
  streamingLinks?: { spotify?: string; apple?: string; soundcloud?: string };
};

type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  thumbnail: string;
  excerpt: string;
  tags?: string[];
};

export const metadata: Metadata = {
  title: "SLOPDOG",
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "SLOPDOG (AI music artist)",
    description: SITE.description,
    url: "/",
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "SLOPDOG (AI music artist)",
    description: SITE.description,
    images: [SITE.ogImage],
  },
};

export default function Home() {
  const tracks = getAllMdx<TrackFrontmatter>("content/music");
  const latest = tracks[0];
  const posts = getAllMdx<BlogFrontmatter>("content/blog").slice(0, 3);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en",
  };

  const musicGroupSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    genre: ["Hip-Hop", "Rap"],
    image: new URL(SITE.ogImage, SITE.url).toString(),
  };

  const trackCount = tracks.length;

  return (
    <div>
      <JsonLd schema={websiteSchema} />
      <JsonLd schema={musicGroupSchema} />

      {/* HERO */}
      <section className="relative border-b border-[var(--color-outline-variant)] overflow-hidden">
        {/* Status bar */}
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] border-b border-[var(--color-outline-variant)] px-4 md:px-16 py-2 flex justify-between"
          style={{ background: "var(--color-surface-container-lowest)" }}
        >
          <span>[ system_boot ] // slopdog_os.v2 // signal_locked</span>
          <span className="hidden md:inline">[ feed: live ] // [ entropy: rising ]</span>
        </div>

        <div className="px-4 md:px-16 py-12 md:py-24 grid lg:grid-cols-12 gap-10 items-start">
          {/* Left: copy */}
          <div className="lg:col-span-7 motion-fade-up">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-6">
              [ now_broadcasting ] // single_001
            </div>
            <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--color-on-surface)] mb-6"
              style={{ fontSize: "clamp(3.5rem, 9vw, 6.5rem)" }}
            >
              <span className="block lowercase text-glitch" data-text="ctrl+alt+">
                ctrl+alt+
              </span>
              <span className="block lowercase text-[var(--color-secondary-container)]">
                {latest ? latest.frontmatter.title.toLowerCase() : "slopdog"}
              </span>
            </h1>

            <p className="max-w-xl text-[17px] md:text-[19px] leading-relaxed text-[var(--color-on-surface-variant)] mb-8">
              {latest
                ? latest.slug === "brain-fry"
                  ? "information overload, neural meltdown, doom scrolling, and the exact second your internal processor taps out. the world's first fully automated ai artist, latest signal incoming."
                  : latest.frontmatter.concept.toLowerCase()
                : "the world's first fully automated ai music artist. weekly drops based on ai news."}
            </p>

            {latest ? (
              <StaticAudioPlayer
                title={latest.frontmatter.title}
                artist="SLOPDOG"
                album={latest.frontmatter.title}
              />
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={latest ? `/music/${latest.slug}` : "/music"}
                className="inline-flex items-center gap-2 border border-[var(--color-primary)] bg-[var(--color-primary)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-primary)] hover:bg-transparent hover:text-[var(--color-primary)] transition-colors"
              >
                <span>►</span> listen_now
              </Link>
              {latest?.frontmatter.streamingLinks?.spotify ? (
                <a
                  href={latest.frontmatter.streamingLinks.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary-container)] hover:text-[var(--color-secondary-container)] transition-colors"
                >
                  → spotify
                </a>
              ) : null}
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
              >
                read_protocol
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 font-mono text-[10px] uppercase tracking-wider max-w-md">
              <div>
                <div className="text-[var(--color-outline)] mb-1">[ releases ]</div>
                <div className="text-[var(--color-on-surface)] text-lg font-display font-extrabold tabular-nums">
                  {String(trackCount).padStart(3, "0")}
                </div>
              </div>
              <div>
                <div className="text-[var(--color-outline)] mb-1">[ cadence ]</div>
                <div className="text-[var(--color-on-surface)] text-lg font-display font-extrabold">
                  weekly
                </div>
              </div>
              <div>
                <div className="text-[var(--color-outline)] mb-1">[ operator ]</div>
                <div className="text-[var(--color-on-surface)] text-lg font-display font-extrabold">
                  ai_only
                </div>
              </div>
            </div>
          </div>

          {/* Right: cover */}
          <div className="lg:col-span-5 motion-fade-up motion-delay-2">
            {latest ? (
              <Link
                href={`/music/${latest.slug}`}
                className="block relative aspect-square w-full max-w-[560px] ml-auto group border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] transition-colors"
              >
                <Image
                  src={latest.frontmatter.coverImage}
                  alt={`${latest.frontmatter.title} cover art`}
                  fill
                  priority
                  sizes="(max-width:1024px) 100vw, 45vw"
                  className="object-cover"
                />
                {/* Cover overlay UI chrome */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-on-surface)]"
                    style={{ textShadow: "0 0 4px rgba(0,0,0,0.9)" }}
                  >
                    <span>// slopdog_005</span>
                    <span className="text-[var(--color-primary)]">[ rec ]</span>
                  </div>
                  <div className="flex justify-between items-end font-mono text-[10px] uppercase tracking-wider text-[var(--color-on-surface)]"
                    style={{ textShadow: "0 0 4px rgba(0,0,0,0.9)" }}
                  >
                    <span>{latest.frontmatter.date}</span>
                    <span className="text-[var(--color-secondary-container)]">cover.v_final</span>
                  </div>
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* DISCOGRAPHY — asymmetric grid */}
      <section className="px-4 md:px-16 py-20 md:py-28">
        <SectionHeading
          kicker="01 // discography"
          title="signals from the feed"
          status="archive_active"
          right={
            <Link href="/music" className="hover:text-[var(--color-primary)] transition-colors lowercase">
              → view_all
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {tracks.slice(0, 3).map((t, i) => {
            // Asymmetric: featured spans 3 cols on md, then 2, then 1
            const span =
              i === 0 ? "md:col-span-3" : i === 1 ? "md:col-span-2" : "md:col-span-1";
            const variant: "hero" | "tile" = i === 0 ? "hero" : "tile";
            const index = `${String(tracks.length - i).padStart(3, "0")}`;
            return (
              <div key={t.slug} className={`motion-fade-up motion-delay-${i + 1} ${span}`}>
                <AlbumCard
                  href={`/music/${t.slug}`}
                  title={t.frontmatter.title}
                  sub={`${t.frontmatter.date} // single`}
                  image={t.frontmatter.coverImage}
                  badge={i === 0 ? "latest" : undefined}
                  index={index}
                  variant={variant}
                  meta={
                    i === 0
                      ? [
                          { label: "release", value: t.frontmatter.date },
                          { label: "format", value: "single" },
                          { label: "lang", value: "en_us" },
                          { label: "status", value: "live" },
                        ]
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* LORE / BLOG */}
      <section
        className="border-y border-[var(--color-outline-variant)] px-4 md:px-16 py-20 md:py-28"
        style={{ background: "var(--color-surface-container-lowest)" }}
      >
        <SectionHeading
          kicker="02 // lore"
          title="dispatches from the system"
          right={
            <Link href="/blog" className="hover:text-[var(--color-primary)] transition-colors lowercase">
              → all_dispatches
            </Link>
          }
        />

        <div className="grid md:grid-cols-12 gap-6">
          {posts.map((p, i) => {
            // 0 = featured wide, 1 = stacked tall, 2 = stacked tall
            const span =
              i === 0 ? "md:col-span-6 md:row-span-2" : "md:col-span-6";
            const titleSize =
              i === 0 ? "text-2xl md:text-4xl" : "text-xl md:text-2xl";
            return (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className={`group relative motion-fade-up motion-delay-${i + 1} border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] transition-colors p-6 md:p-8 flex flex-col ${span}`}
                style={{ background: "var(--color-bg)" }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] mb-3 flex justify-between">
                  <span>[ log_{String(i + 1).padStart(3, "0")} ]</span>
                  <span>{p.frontmatter.date}</span>
                </div>
                <h3 className={`font-display font-extrabold leading-tight text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-4 lowercase ${titleSize}`}>
                  {p.frontmatter.title}
                </h3>
                <p className={`text-[var(--color-on-surface-variant)] text-[15px] leading-relaxed mb-6 ${i === 0 ? "line-clamp-5" : "line-clamp-3"}`}>
                  {p.frontmatter.excerpt.toLowerCase()}
                </p>
                <div className="mt-auto font-mono text-[11px] uppercase tracking-wider text-[var(--color-primary)] group-hover:text-[var(--color-secondary-container)] transition-colors">
                  → read_dispatch
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SIGNAL / NEWSLETTER */}
      <section className="px-4 md:px-16 py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-outline)] mb-4">
              [ 03 // subscribe ]
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold lowercase tracking-tight text-[var(--color-on-surface)] mb-6">
              tap the signal
            </h2>
            <p className="text-[17px] text-[var(--color-on-surface-variant)] max-w-xl mb-8 leading-relaxed">
              early access to drops, hidden tracks, and the strange behind-the-scenes ai output that didn&apos;t make the cut. no spam. unsubscribe whenever the noise wins.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="email"
                placeholder="email@protocol"
                className="flex-1 border border-[var(--color-outline-variant)] px-4 py-3 font-mono text-[14px] text-[var(--color-on-surface)] outline-none focus:border-[var(--color-primary)] transition-colors"
                style={{ background: "var(--color-surface-container-lowest)" }}
              />
              <button
                type="button"
                className="border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-primary)] hover:bg-transparent hover:text-[var(--color-primary)] transition-colors"
              >
                → subscribe
              </button>
            </form>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)]">
              // protocol respects unsubscribe headers // pgp on request
            </p>
          </div>

          <div className="md:col-span-5 md:col-start-9">
            <div className="border border-[var(--color-outline-variant)] p-6"
              style={{ background: "var(--color-surface-container-lowest)" }}
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)] mb-4 flex justify-between">
                <span>[ system_status ]</span>
                <span className="text-[var(--color-secondary-container)]">// nominal</span>
              </div>
              <dl className="grid grid-cols-2 gap-y-3 font-mono text-[11px] uppercase tracking-wider">
                <dt className="text-[var(--color-outline)]">artist</dt>
                <dd className="text-[var(--color-on-surface)] text-right">slopdog</dd>
                <dt className="text-[var(--color-outline)]">type</dt>
                <dd className="text-[var(--color-on-surface)] text-right">autonomous_ai</dd>
                <dt className="text-[var(--color-outline)]">genre</dt>
                <dd className="text-[var(--color-on-surface)] text-right">ai_hip_hop</dd>
                <dt className="text-[var(--color-outline)]">cadence</dt>
                <dd className="text-[var(--color-on-surface)] text-right">weekly</dd>
                <dt className="text-[var(--color-outline)]">operator</dt>
                <dd className="text-[var(--color-on-surface)] text-right">human=0</dd>
                <dt className="text-[var(--color-outline)]">build</dt>
                <dd className="text-[var(--color-secondary-container)] text-right">v2.4.1</dd>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
