import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import StaticAudioPlayer from "@/components/StaticAudioPlayer";
import AlbumCard from "@/components/AlbumCard";
import MaterialIcon from "@/components/MaterialIcon";
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
  streamingLinks?: { spotify?: string; apple?: string };
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
  alternates: {
    canonical: "/",
  },
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

  return (
    <div>
      <JsonLd schema={websiteSchema} />
      <JsonLd schema={musicGroupSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-fg/10 py-16 md:py-28">
        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="motion-fade-up flex flex-col lg:flex-row gap-12 items-start lg:gap-16">
            {/* Album Art */}
            <div className="w-full lg:w-7/12 flex justify-start">
              {latest ? (
                <Link href={`/music/${latest.slug}`} className="group relative w-full max-w-[540px] aspect-square">
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-fg/10 bg-surface shadow-2xl">
                    <Image
                      src={latest.frontmatter.coverImage}
                      alt={`${latest.frontmatter.title} cover`}
                      fill
                      className="object-cover transition-transform duration-slow ease-out-quint group-hover:scale-105"
                      sizes="(max-width:1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </Link>
              ) : null}
            </div>

            {/* Content */}
            <div className="w-full lg:w-5/12 space-y-8 motion-fade-up motion-delay-1">
              <div>
                <div className="mb-4 text-label uppercase text-primary">New Release</div>
                <h1 className="font-display text-display-xl text-fg mb-3">
                  {latest ? latest.frontmatter.title : "SLOPDOG"}
                </h1>
                <p className="max-w-lg text-body-lg font-light text-fg-muted">
                  {latest
                    ? latest.slug === "brain-fry"
                      ? "Information overload, neural meltdown, doom scrolling, and the exact second your internal processor taps out."
                      : latest.frontmatter.concept
                    : "The world's first fully automated AI music artist."}
                </p>
              </div>

              {/* Audio Player */}
              {latest ? (
                <StaticAudioPlayer
                  title={latest.frontmatter.title}
                  artist="SLOPDOG"
                  album={latest.frontmatter.title}
                />
              ) : null}

              {/* Platform Links */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={latest ? `/music/${latest.slug}` : "/music"}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display font-bold text-neutral-950 transition-opacity duration-normal ease-out-quart hover:opacity-90"
                >
                  <MaterialIcon name="play_circle" />
                  Listen Now
                </Link>
                {latest?.frontmatter.streamingLinks?.spotify ? (
                  <a
                    href={latest.frontmatter.streamingLinks.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-fg/20 bg-transparent px-6 py-3 font-display font-bold text-fg transition-colors duration-normal ease-out-quart hover:border-primary hover:text-primary"
                  >
                    <MaterialIcon name="graphic_eq" />
                    Spotify
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discography Section */}
      <section className="bg-bg py-16 md:py-28">
        <div className="px-4 sm:px-6 lg:pl-16 lg:pr-8">
          <div className="motion-fade-up">
            <SectionHeading kicker="01." title="DISCOGRAPHY" right={<Link href="/music" className="hover:underline">View All</Link>} />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.slice(0, 4).map((t, i) => {
              // 4-item rhythm: hero (2×2), compact sidebar, wide banner (2×1), tall accent
              const spanClass =
                i === 0 ? "sm:col-span-2 sm:row-span-2" :
                i === 2 ? "sm:col-span-2" :
                i === 3 ? "lg:row-span-2" : "";
              return (
                <div key={t.slug} className={`motion-fade-up motion-delay-${i + 1} ${spanClass}`}>
                  <AlbumCard
                    href={`/music/${t.slug}`}
                    title={t.frontmatter.title}
                    sub={i === 1 ? t.frontmatter.date : `${t.frontmatter.date} • Single`}
                    image={t.frontmatter.coverImage}
                    badge={i === 0 ? "NEW" : undefined}
                    featured={i === 0}
                    compact={i === 1}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="border-t border-fg/5 bg-neutral-950 py-14 md:py-24">
        <div className="px-4 sm:px-6 lg:pl-8 lg:pr-16">
          <div className="motion-fade-up">
            <SectionHeading kicker="02." title="FROM THE BLOG" right={<Link href="/blog" className="hover:underline">Read All</Link>} />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => {
              // 3-item rhythm: wide headline (2col), tall sidebar (1col+2row), compact teaser
              const spanClass =
                i === 0 ? "md:col-span-2" :
                i === 1 ? "md:row-span-2" : "";
              const textSize =
                i === 0 ? "text-display-sm" :
                i === 1 ? "text-display-sm" : "text-body-sm";
              const padClass =
                i === 0 ? "p-6" :
                i === 1 ? "p-5" : "p-4";

              return (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className={`group motion-fade-up motion-delay-${i + 1} rounded-xl border border-fg/10 bg-surface transition-all duration-normal ease-out-quart hover:border-primary/30 ${padClass} ${spanClass}`}
                >
                  <div className="mb-3 text-label uppercase text-fg-faint">{p.frontmatter.date}</div>
                  <div className={`mb-4 font-display font-bold leading-tight text-fg transition-colors duration-normal ease-out-quart group-hover:text-primary ${textSize}`}>
                    {p.frontmatter.title}
                  </div>
                  <p className={`mb-6 text-body-sm text-fg-muted ${i === 0 ? "line-clamp-4" : i === 1 ? "line-clamp-5" : "line-clamp-2"}`}>{p.frontmatter.excerpt}</p>
                  <span className="inline-flex text-body-sm font-semibold text-primary">Read more &rarr;</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-fg/10 bg-surface py-20 md:py-28">
        <div className="motion-fade-up px-4 sm:px-6 lg:px-16">
          <div className="max-w-2xl">
            <h2 className="font-display mb-4 text-display-md text-fg">Stay in the loop</h2>
            <p className="mb-8 text-body-lg text-fg-muted">Early access to drops, merch, and hidden tracks. No spam.</p>
            <form className="flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                className="w-full rounded-lg border border-fg/10 bg-fg/5 px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-primary/40 transition-colors duration-normal ease-out-quart"
                placeholder="Your email address"
              />
              <button type="button" className="rounded-lg bg-primary px-8 py-3 font-display font-bold text-body-sm text-neutral-950 transition-opacity duration-normal ease-out-quart hover:opacity-90 whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-label text-fg-faint">Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
