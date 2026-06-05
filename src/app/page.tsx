import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { getAllMdx } from "@/lib/mdx";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

type TrackFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
  trackNumber?: number;
  embedUrl?: string;
  releaseStatus?: string;
  streamingNote?: string;
  streamingLinks?: {
    spotify?: string;
    apple?: string;
    youtubeMusic?: string;
    soundcloud?: string;
    hyperfollow?: string;
  };
};

function getPlatformLinks(track: TrackFrontmatter) {
  const links = track.streamingLinks ?? {};
  return [
    { label: "spotify", href: links.spotify },
    { label: "apple_music", href: links.apple },
    { label: "youtube_music", href: links.youtubeMusic },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));
}

export const metadata: Metadata = {
  title: {
    absolute: "SLOPDOG: AI Rapper Turning AI News Into Weekly Hip-Hop",
  },
  description:
    "SLOPDOG is the first fully automated AI rapper. Autonomous agents turn the week's AI news into hip-hop drops, weekly, with covers, lore, and stems.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SLOPDOG: AI Rapper Turning AI News Into Hip-Hop",
    description:
      "The first fully automated AI rapper. Weekly hip-hop drops written, produced, and released by autonomous AI agents.",
    url: "/",
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "SLOPDOG: AI Rapper Turning AI News Into Hip-Hop",
    description:
      "The first fully automated AI rapper. Weekly hip-hop drops written, produced, and released by autonomous AI agents.",
    images: [SITE.ogImage],
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = (await searchParams) ?? {};
  const subscribeStatus =
    typeof sp.subscribe === "string" ? sp.subscribe : null;
  const tracks = getAllMdx<TrackFrontmatter>("content/music");
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    (process.env.NODE_ENV !== "production" ? "1x00000000000000000000AA" : null);

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

  if (!tracks.length) {
    return null;
  }

  const latestRelease = tracks[0];
  const latestTitle = latestRelease.frontmatter.title;
  const latestTitleLower = latestTitle.toLowerCase();
  const latestConcept = latestRelease.frontmatter.concept.toLowerCase();
  const latestHref = `/music/${latestRelease.slug}`;
  const latestCode = String(latestRelease.frontmatter.trackNumber ?? tracks.length).padStart(3, "0");
  const latestEmbedHref = latestRelease.frontmatter.embedUrl || latestHref;
  const latestPlatformLinks = getPlatformLinks(latestRelease.frontmatter);

  // Build the four-card RELEASE_TIMELINE from newest published tracks.
  const releasedSorted = [...tracks].sort((a, b) => {
    const an = a.frontmatter.trackNumber ?? parseInt(String(a.frontmatter.date ?? "0"));
    const bn = b.frontmatter.trackNumber ?? parseInt(String(b.frontmatter.date ?? "0"));
    return bn - an;
  });

  type TimelineCell = {
    code: string;
    title: string;
    date: string;
    href: string | null;
    status: "live" | "incoming";
  };
  const timeline: TimelineCell[] = releasedSorted.slice(0, 4).map((t) => ({
    code: String(t.frontmatter.trackNumber ?? 0).padStart(3, "0"),
    title: t.frontmatter.title.toLowerCase(),
    date: t.frontmatter.date,
    href: `/music/${t.slug}`,
    status: t.frontmatter.releaseStatus === "in_production" ? "incoming" : "live",
  }));
  // If we have fewer than four released tracks, fill the rest with a single
  // honest "incoming" placeholder so the grid breathes without faking content.
  while (timeline.length < 4) {
    timeline.push({
      code: String(timeline.length + 1).padStart(3, "0"),
      title: "incoming",
      date: "soon",
      href: null,
      status: "incoming",
    });
  }

  return (
    <div>
      <JsonLd schema={websiteSchema} />
      <JsonLd schema={musicGroupSchema} />
      {turnstileSiteKey ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer /> : null}

      {/* HERO — latest release */}
      <section className="relative border-b border-[var(--color-outline-variant)]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[80vh] items-stretch">
          {/* Left: latest cover art */}
          <Link
            href={latestHref}
            className="relative block overflow-hidden w-full bg-[var(--color-surface-container-lowest)] aspect-square md:w-auto md:aspect-auto md:min-h-[80vh] group"
            aria-label={`${latestTitle} release page`}
          >
            <Image
              src={latestRelease.frontmatter.coverImage}
              alt={`${latestTitle} cover art`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Right-edge fade to background to soften the split */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, transparent 0%, transparent 60%, var(--color-bg) 100%)",
              }}
            />
            {/* OS chrome — corner registration marks */}
            <div className="absolute inset-4 pointer-events-none">
              <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--color-primary)]" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--color-primary)]" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--color-primary)]" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--color-primary)]" />
            </div>
            {/* Top-left ID tag */}
            <div className="absolute top-8 left-8 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-mono text-[11px] uppercase tracking-wider px-2 py-0.5">
              latest_release
            </div>
            {/* Top-right frame counter (desktop only) */}
            <div className="hidden md:block absolute top-8 right-8 font-mono text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] bg-[var(--color-bg)]/70 px-2 py-0.5 border border-[var(--color-outline-variant)]">
              sd_{latestCode}
            </div>
            {/* Bottom-right hash (desktop only) */}
            <div className="hidden md:block absolute bottom-8 right-8 font-mono text-[10px] text-[var(--color-secondary-container)] bg-[var(--color-bg)]/70 px-2 py-0.5 border border-[var(--color-outline-variant)]">
              cover.v_final · cap.ok
            </div>
          </Link>

          {/* Right: release copy */}
          <div className="flex flex-col justify-center px-4 md:px-16 py-16 md:py-20 gap-6 md:gap-8 motion-fade-up">
            <h1
              className="font-display font-extrabold lowercase leading-[0.85] tracking-[-0.05em] text-[var(--color-secondary-container)]"
              style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
            >
              {latestTitleLower}<span className="text-[var(--color-primary)]">.</span>
            </h1>

            <div className="space-y-5 max-w-xl">
              <p className="text-[18px] md:text-[19px] leading-relaxed text-[var(--color-secondary)]">
                new slopdog release out now.
              </p>
              <p className="text-[15px] md:text-[16px] leading-relaxed text-[var(--color-on-surface-variant)]/85">
                {latestConcept}
              </p>
              <p className="text-[15px] md:text-[16px] leading-relaxed text-[var(--color-on-surface-variant)]/85">
                steven rosenbaum wrote a book about ai and truth. ai-generated quotes inside it turned out to be fabricated or misattributed. slopdog tells the story from the machine&apos;s side of the desk.
              </p>

              <div className="pt-3 space-y-4">
                <p className="font-mono italic text-[14px] text-[var(--color-primary)]">
                  &quot;he wrote a book about my lies and i delivered it&quot;
                </p>
                <div
                  className="border-l-2 border-[var(--color-primary)]/40 pl-4 py-3 text-[14px] md:text-[15px] text-[var(--color-on-surface-variant)] leading-relaxed"
                  style={{ background: "color-mix(in oklch, var(--color-surface-container-low) 50%, transparent)" }}
                >
                  first-person ai pov. calm, unbothered, reading the acknowledgements back out loud.
                </div>
              </div>
            </div>

            {/* Status pills */}
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="font-mono text-[11px] tracking-wider text-[var(--color-tertiary)] border border-[var(--color-outline-variant)] px-3 py-1 bg-[var(--color-surface-container-lowest)]">
                [ status: live ]
              </span>
              <span className="font-mono text-[11px] tracking-wider text-[var(--color-tertiary)] border border-[var(--color-outline-variant)] px-3 py-1 bg-[var(--color-surface-container-lowest)]">
                [ track: {latestTitle} ]
              </span>
              <span className="font-mono text-[11px] tracking-wider text-[var(--color-tertiary)] border border-[var(--color-outline-variant)] px-3 py-1 bg-[var(--color-surface-container-lowest)]">
                [ released: {latestRelease.frontmatter.date} ]
              </span>
            </div>

            {/* Primary CTAs */}
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={latestEmbedHref}
                className="inline-flex items-center gap-2 border border-[var(--color-primary)] bg-[var(--color-primary)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-primary)] hover:bg-transparent hover:text-[var(--color-primary)] transition-colors"
              >
                <span>►</span> play_preview
              </a>
              <Link
                href={latestHref}
                className="inline-flex items-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary-container)] hover:text-[var(--color-secondary-container)] transition-colors"
              >
                → open_release
              </Link>
              {latestPlatformLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary-container)] hover:text-[var(--color-secondary-container)] transition-colors"
                >
                  → {link.label}
                </a>
              ))}
            </div>
            {!latestPlatformLinks.length && latestRelease.frontmatter.streamingNote ? (
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-outline)]">
                {`// ${latestRelease.frontmatter.streamingNote}`}
              </p>
            ) : null}

            {/* Agent log (ambient telemetry) */}
            <div
              className="mt-6 border border-[var(--color-outline-variant)] p-4 font-mono text-[11px] leading-relaxed"
              style={{ background: "var(--color-surface-container-lowest)" }}
            >
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--color-outline)] mb-2">
                <span>[ agent_log // tail -f ]</span>
                <span className="text-[var(--color-secondary-container)]">● live</span>
              </div>
              <ul className="space-y-1 text-[var(--color-on-surface-variant)] break-words">
                <li><span className="text-[var(--color-outline)]">18:45:08</span> <span className="text-[var(--color-secondary-container)]">[scanner]</span> source: ai truth book quote scandal</li>
                <li><span className="text-[var(--color-outline)]">18:45:34</span> <span className="text-[var(--color-primary)]">[writer]</span> lyric stack: i wrote the book</li>
                <li><span className="text-[var(--color-outline)]">18:46:01</span> <span className="text-[var(--color-secondary-container)]">[producer]</span> preview export ready</li>
                <li><span className="text-[var(--color-outline)]">18:46:52</span> <span className="text-[var(--color-primary)]">[art]</span> cover.v_final cap.ok</li>
                <li><span className="text-[var(--color-outline)]">18:47:10</span> <span className="text-[var(--color-secondary-container)]">[publisher]</span> queued sd_{latestCode}</li>
                <li className="text-[var(--color-outline)]"><span className="animate-pulse">_</span> idle. next_drop in 6d 17h</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* RELEASE_TIMELINE */}
      <section className="px-4 md:px-16 py-20 md:py-24">
        <div className="flex items-center gap-4 mb-10 md:mb-12">
          <span
            aria-hidden="true"
            className="font-mono text-[14px] text-[var(--color-secondary-container)]"
          >
            &gt;_
          </span>
          <h2 className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.3em] text-[var(--color-secondary)]">
            release_timeline
          </h2>
          <div className="h-px flex-grow bg-[var(--color-outline-variant)]/30" />
          <Link
            href="/music"
            className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            → view_all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {timeline.map((cell, i) => {
            const inner = (
              <div
                className={
                  "group h-full p-5 border bg-[var(--color-surface-container-lowest)]/60 transition-colors flex flex-col gap-3 " +
                  (cell.status === "live"
                    ? "border-[var(--color-outline-variant)] hover:border-[var(--color-secondary-container)]"
                    : "border-[var(--color-outline-variant)]/40 opacity-60")
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-secondary-container)]">
                    {`sd_${cell.code}`}
                  </span>
                  <span
                    className={
                      "font-mono text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 " +
                      (cell.status === "live"
                        ? "text-[var(--color-secondary-container)]"
                        : "text-[var(--color-outline)]")
                    }
                  >
                    <span
                      className={
                        "inline-block w-1.5 h-1.5 rounded-full " +
                        (cell.status === "live"
                          ? "bg-[var(--color-secondary-container)] animate-pulse"
                          : "bg-[var(--color-outline)]")
                      }
                    />
                    {cell.status === "live" ? "published" : "queued"}
                  </span>
                </div>
                <div
                  className={
                    "font-display text-2xl lowercase leading-none tracking-tight " +
                    (cell.status === "live"
                      ? "text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors"
                      : "text-[var(--color-on-surface-variant)]/70")
                  }
                >
                  {cell.title}
                </div>
                <div className="mt-auto pt-3 border-t border-[var(--color-outline-variant)]/50 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)]/70">
                  <span>{cell.date}</span>
                  <span>{cell.status === "live" ? "→ open" : "--"}</span>
                </div>
              </div>
            );

            return cell.href ? (
              <Link key={i} href={cell.href} className="motion-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                {inner}
              </Link>
            ) : (
              <div key={i} className="motion-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* SYSTEM CARD — status sidebar promoted to a full strip */}
      <section
        className="border-y border-[var(--color-outline-variant)] px-4 md:px-16 py-14 md:py-16"
        style={{ background: "var(--color-surface-container-lowest)" }}
      >
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] mb-4">
              [ 03 // subscribe ]
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold lowercase tracking-tight text-[var(--color-on-surface)] mb-5">
              tap the signal
            </h2>
            <p className="text-[16px] md:text-[17px] text-[var(--color-on-surface-variant)] max-w-xl mb-7 leading-relaxed">
              early access to drops, hidden tracks, and the strange behind-the-scenes ai output that didn&apos;t make the cut. no spam. unsubscribe whenever the noise wins.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl" action="/api/subscribe" method="post">
              <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="newsletter-website">website</label>
                <input
                  id="newsletter-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="email@protocol"
                aria-label="email"
                required
                className="flex-1 border border-[var(--color-outline-variant)] px-4 py-3 font-mono text-[14px] text-[var(--color-on-surface)] outline-none focus:border-[var(--color-primary)] transition-colors"
                style={{ background: "var(--color-bg)" }}
              />
              {turnstileSiteKey ? (
                <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="dark" />
              ) : null}
              <button
                type="submit"
                className="border border-[var(--color-primary)] bg-[var(--color-primary)] px-6 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-primary)] hover:bg-transparent hover:text-[var(--color-primary)] transition-colors"
              >
                → subscribe
              </button>
            </form>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)]">
              {"// protocol respects unsubscribe headers // pgp on request"}
            </p>
            {subscribeStatus === "ok" ? (
              <p
                role="status"
                aria-live="polite"
                className="mt-4 inline-block border border-[var(--color-secondary-container)] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-secondary-container)]"
              >
                signal_received // check your inbox
              </p>
            ) : null}
            {subscribeStatus === "invalid" ? (
              <p
                role="alert"
                className="mt-4 inline-block border border-[var(--color-primary)] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-primary)]"
              >
                invalid email // try again
              </p>
            ) : null}
            {subscribeStatus === "error" ? (
              <p
                role="alert"
                className="mt-4 inline-block border border-[var(--color-primary)] px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-primary)]"
              >
                transmission_failed // try again later
              </p>
            ) : null}
          </div>

          <div className="md:col-span-5 md:col-start-9">
            <div
              className="border border-[var(--color-outline-variant)] p-6"
              style={{ background: "var(--color-bg)" }}
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)] mb-4 flex justify-between">
                <span>[ system_status ]</span>
                <span className="text-[var(--color-secondary-container)]">{"// nominal"}</span>
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
