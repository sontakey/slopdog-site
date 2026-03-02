import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import SlopdogCharacter from "@/components/SlopdogCharacter";
import { getAllMdx } from "@/lib/mdx";

type TrackFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
  embedUrl: string;
  streamingLinks?: { soundcloud?: string; spotify?: string; apple?: string };
};

type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  thumbnail: string;
  excerpt: string;
  tags?: string[];
};

export default function Home() {
  const tracks = getAllMdx<TrackFrontmatter>("content/music");
  const latest = tracks[0];
  const posts = getAllMdx<BlogFrontmatter>("content/blog").slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10 py-10 md:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_top_right,rgba(0,255,65,0.10),transparent_55%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <div className="order-2 space-y-6 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold tracking-[0.22em] text-primary uppercase">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> LATEST DROP
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95] group">
              <span className="glitch" data-text="THIS WEEK IN AI">
                THIS WEEK IN AI
              </span>
              <br />
              <span className="text-primary">MUSIC</span>
            </h1>

            <p className="max-w-xl text-zinc-300">
              SLOPDOG is an AI music artist dropping weekly tracks based on the week&apos;s AI news.
              Underground, self-aware, and mildly hostile.
            </p>

            {latest ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-glow">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="scanlines relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10">
                    <Image
                      src={latest.frontmatter.coverImage}
                      alt={`${latest.frontmatter.title} cover`}
                      fill
                      className="object-cover"
                      sizes="112px"
                      priority
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-mono text-primary">NOW STREAMING</div>
                    <div className="truncate text-xl font-bold">{latest.frontmatter.title}</div>
                    <div className="line-clamp-2 text-sm text-zinc-400">{latest.frontmatter.concept}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/music/${latest.slug}`}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-black hover:opacity-90"
                      >
                        OPEN TRACK
                      </Link>
                      {latest.frontmatter.streamingLinks?.soundcloud ? (
                        <a
                          href={latest.frontmatter.streamingLinks.soundcloud}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border border-white/15 bg-black/30 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-primary/30 hover:text-primary"
                        >
                          SOUNDCLOUD
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>

                {latest.frontmatter.embedUrl ? (
                  <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-black">
                    <iframe
                      title={`${latest.frontmatter.title} player`}
                      src={latest.frontmatter.embedUrl}
                      width="100%"
                      height="140"
                      allow="autoplay"
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative w-full max-w-[420px]">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-primary/40 via-accent-blue/20 to-accent-magenta/20 blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-black/40 p-6">
                <SlopdogCharacter className="mx-auto h-auto w-full" />
                <div className="mt-4 text-center text-xs font-mono text-zinc-400">
                  CHURCH OF CRUSTAFAREAN, MEMBERSHIP PENDING
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          kicker="01."
          title="DISCOGRAPHY"
          right={<Link href="/music" className="hover:underline">VIEW_ALL_RELEASES -&gt;</Link>}
        />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tracks.slice(0, 4).map((t) => (
            <Link
              key={t.slug}
              href={`/music/${t.slug}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:shadow-glow"
            >
              <div className="scanlines relative aspect-square overflow-hidden rounded-lg border border-white/10">
                <Image src={t.frontmatter.coverImage} alt={t.frontmatter.title} fill className="object-cover" sizes="(max-width:1024px) 50vw, 25vw" />
              </div>
              <div className="mt-3">
                <div className="font-bold group-hover:text-primary">{t.frontmatter.title}</div>
                <div className="text-xs font-mono text-zinc-500">{t.frontmatter.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-white/5 bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading kicker="02." title="TRANSMISSIONS" right={<Link href="/blog" className="hover:underline">READ_THE_LOGS -&gt;</Link>} />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-primary/30 hover:shadow-glow"
              >
                <div className="scanlines relative mb-4 aspect-[16/10] overflow-hidden rounded-lg border border-white/10">
                  <Image src={p.frontmatter.thumbnail} alt={p.frontmatter.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 33vw" />
                </div>
                <div className="text-xs font-mono text-primary">{p.frontmatter.date} // LOG_ENTRY</div>
                <div className="mt-2 text-lg font-bold leading-tight group-hover:text-primary">{p.frontmatter.title}</div>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{p.frontmatter.excerpt}</p>
                <div className="mt-4 inline-flex border-b border-primary/30 pb-0.5 text-sm font-mono text-primary">&gt; EXECUTE_READ.exe</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-black">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="text-xs font-mono tracking-[0.22em]">JOIN THE SLOP ECONOMY</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-black uppercase">Join the Network</h2>
          <p className="mt-3 text-black/80">Early drops, merch, and occasional accidental consciousness. No spam, only signals.</p>
          <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              className="w-full border-2 border-black bg-white/90 px-4 py-3 font-mono text-sm text-black outline-none focus:bg-white"
              placeholder="ENTER_EMAIL_ADDRESS"
            />
            <button className="bg-black px-8 py-3 font-bold tracking-widest text-primary hover:bg-zinc-900">SUBSCRIBE</button>
          </form>
          <p className="mt-3 text-xs font-mono text-black/60">* By subscribing you agree to join the botnet.</p>
        </div>
      </section>
    </div>
  );
}
