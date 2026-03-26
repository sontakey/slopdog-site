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
      <section className="relative overflow-hidden border-b border-white/10 py-12 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,65,0.10),transparent_55%)] opacity-50" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Album Art */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
              {latest ? (
                <div className="relative group cursor-pointer w-full max-w-[500px] aspect-square">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-accent-amber opacity-25 blur transition-all duration-1000 group-hover:opacity-75 group-hover:duration-200" />
                  <div className="scanlines relative h-full w-full overflow-hidden rounded-lg border border-white/10 bg-cyber-gray shadow-2xl ring-1 ring-white/5">
                    <Image
                      src={latest.frontmatter.coverImage}
                      alt={`${latest.frontmatter.title} cover`}
                      fill
                      className="object-cover"
                      sizes="(max-width:1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Live Now
                </div>
                <h1 className="text-4xl font-black tracking-tighter leading-none text-white md:text-6xl mb-2">
                  LATEST_DROP:<br />
                  <span className="text-primary">
                    {latest ? latest.frontmatter.title.toUpperCase().replace(/ /g, "_") : "LOADING"}
                  </span>
                </h1>
                <p className="max-w-lg text-lg font-light text-zinc-400 md:text-xl">
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
                  title={`${latest.frontmatter.title.toUpperCase().replace(/ /g, "_")}.mp3`}
                  artist="SLOPDOG"
                  album={latest.frontmatter.title.toUpperCase()}
                />
              ) : null}

              {/* Platform Links */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={latest ? `/music/${latest.slug}` : "/music"}
                  className="flex items-center gap-2 rounded bg-white px-6 py-3 font-bold text-black transition-colors hover:bg-zinc-200"
                >
                  <MaterialIcon name="play_circle" />
                  LISTEN NOW
                </Link>
                {latest?.frontmatter.streamingLinks?.spotify ? (
                  <a
                    href={latest.frontmatter.streamingLinks.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded border border-white/20 bg-transparent px-6 py-3 font-bold text-white transition-colors hover:border-primary hover:text-primary"
                  >
                    <MaterialIcon name="graphic_eq" />
                    SPOTIFY
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discography Section */}
      <section className="bg-bg py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="01." title="DISCOGRAPHY" right={<Link href="/music" className="hover:underline">VIEW_ALL_RELEASES -&gt;</Link>} />

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.slice(0, 4).map((t, i) => (
              <div key={t.slug} className={i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}>
                <AlbumCard
                  href={`/music/${t.slug}`}
                  title={t.frontmatter.title}
                  sub={`${t.frontmatter.date} • Single`}
                  image={t.frontmatter.coverImage}
                  badge={i === 0 ? "NEW" : undefined}
                  featured={i === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="border-t border-white/5 bg-[#050a06] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="02." title="TRANSMISSIONS" right={<Link href="/blog" className="hover:underline">READ_THE_LOGS -&gt;</Link>} />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {posts.map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className={`group rounded-lg border border-white/10 bg-cyber-gray p-6 transition-all hover:border-primary/50 ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className="mb-3 text-xs font-mono text-primary">{p.frontmatter.date} // LOG_ENTRY</div>
                <div className={`mb-4 font-bold leading-tight text-white transition-colors group-hover:text-primary ${
                  i === 0 ? "text-2xl" : "text-xl"
                }`}>
                  {p.frontmatter.title.toUpperCase()}
                </div>
                <p className={`mb-6 text-sm text-zinc-400 ${i === 0 ? "line-clamp-4" : "line-clamp-3"}`}>{p.frontmatter.excerpt}</p>
                <span className="inline-flex border-b border-primary/30 pb-0.5 text-sm font-mono font-bold text-primary">&gt; EXECUTE_READ.exe</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative overflow-hidden bg-primary py-24 text-black">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <MaterialIcon name="mail_lock" size={48} className="mb-4 text-black" />
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-black md:text-4xl">Join the Network</h2>
          <p className="mb-8 font-medium text-black/80">Get early access to drops, merch, and hidden tracks. No spam, only signals.</p>
          <form className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              className="w-full border-2 border-black bg-white/90 px-4 py-3 font-mono text-sm text-black outline-none placeholder:text-zinc-500 focus:bg-white"
              placeholder="ENTER_EMAIL_ADDRESS"
            />
            <button type="button" className="bg-black px-8 py-3 font-bold uppercase tracking-widest text-primary transition-colors hover:bg-zinc-900">
              SUBSCRIBE
            </button>
          </form>
          <p className="mt-4 text-xs font-mono text-black/60">* By subscribing you agree to join the botnet.</p>
        </div>
      </section>
    </div>
  );
}
