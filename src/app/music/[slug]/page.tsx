import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Mdx from "@/components/Mdx";
import JsonLd from "@/components/JsonLd";
import ViewToggle from "@/components/ViewToggle";
import BeatLicenseSection from "@/components/BeatLicenseSection";
import { getMdxBySlug } from "@/lib/mdx";
import { getPublicMusicTracks, isPublicMusicTrack } from "@/lib/music";
import { SITE } from "@/lib/site";

type TrackFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
  embedUrl: string;
  trackNumber?: number;
  releaseStatus?: string;
  streamingNote?: string;
  streamingLinks?: {
    spotify?: string;
    apple?: string;
    youtubeMusic?: string;
    hyperfollow?: string;
    soundcloud?: string;
  };
};

function getPlatformLinks(track: TrackFrontmatter) {
  if (track.releaseStatus === "coming_soon") return [];
  const links = track.streamingLinks ?? {};
  return [
    { label: "spotify", href: links.spotify, variant: "primary" },
    { label: "apple_music", href: links.apple, variant: "secondary" },
    { label: "youtube_music", href: links.youtubeMusic, variant: "secondary" },
  ].filter((link): link is { label: string; href: string; variant: string } =>
    Boolean(link.href),
  );
}

export function generateStaticParams() {
  return getPublicMusicTracks<TrackFrontmatter>().map((track) => ({ slug: track.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const all = getPublicMusicTracks<TrackFrontmatter>();
  const track = all.find((t) => t.slug === slug);
  if (!track) return {};

  const fullTitle = `${track.frontmatter.title} by SLOPDOG: AI-Generated Hip-Hop Single`;
  const conceptShort = (track.frontmatter.concept || "").trim().replace(/\s+/g, " ");
  const suffix = ` Stream ${track.frontmatter.title} by SLOPDOG, the AI rapper.`;
  const budget = 155 - suffix.length;
  const truncated = conceptShort.length > budget ? conceptShort.slice(0, budget - 3).replace(/[\s,.;:!?\-]+$/, "") + "..." : conceptShort;
  const description = `${truncated}${suffix}`.slice(0, 155);
  const ogImage = track.frontmatter.coverImage || SITE.ogImage;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: `/music/${track.slug}` },
    openGraph: { title: fullTitle, description, url: `/music/${track.slug}`, images: [ogImage] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImage] },
  };
}

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = getMdxBySlug<TrackFrontmatter>(
      "content/music",
      slug,
    );

    if (!isPublicMusicTrack({ frontmatter })) notFound();

    const url = new URL(`/music/${frontmatter.slug}`, SITE.url).toString();
    const trackNo = frontmatter.trackNumber
      ? String(frontmatter.trackNumber).padStart(3, "0")
      : "n/a";
    const platformLinks = getPlatformLinks(frontmatter);

    const schema = {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      name: frontmatter.title,
      url,
      datePublished: frontmatter.date,
      genre: ["Hip-Hop", "Rap"],
      description: frontmatter.concept,
      image: new URL(frontmatter.coverImage || SITE.ogImage, SITE.url).toString(),
      byArtist: { "@type": "MusicGroup", name: "SLOPDOG", url: SITE.url },
    };

    return (
      <div className="px-4 md:px-16 pt-10 pb-24">
        <JsonLd schema={schema} />

        <nav className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] mb-8 flex gap-x-2">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
            [ home ]
          </Link>
          <span>/</span>
          <Link href="/music" className="hover:text-[var(--color-primary)] transition-colors">
            music
          </Link>
          <span>/</span>
          <span className="text-[var(--color-on-surface-variant)]">{frontmatter.slug}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          {/* Cover with frame chrome */}
          <div className="lg:col-span-7 motion-fade-up">
            <div className="relative aspect-square w-full overflow-hidden border border-[var(--color-outline-variant)]">
              <Image
                src={frontmatter.coverImage}
                alt={`${frontmatter.title} cover art`}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 font-mono text-[10px] uppercase tracking-wider text-[var(--color-on-surface)]"
                style={{ textShadow: "0 0 4px rgba(0,0,0,0.85)" }}
              >
                <div className="flex justify-between">
                  <span>{`// slopdog_${trackNo}`}</span>
                  <span className="text-[var(--color-primary)]">[ rec ]</span>
                </div>
                <div className="flex justify-between items-end">
                  <span>{frontmatter.date}</span>
                  <span className="text-[var(--color-secondary-container)]">cover.v_final</span>
                </div>
              </div>
            </div>
          </div>

          {/* Track metadata */}
          <div className="lg:col-span-5 motion-fade-up motion-delay-2 flex flex-col">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 flex justify-between">
              <span>[ track_{trackNo} ]</span>
              <span>{frontmatter.date}</span>
            </div>
            <h1
              className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--color-on-surface)] lowercase mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {frontmatter.title.toLowerCase()}
            </h1>
            <p className="text-[14px] md:text-[15px] leading-relaxed text-[var(--color-on-surface-variant)] mb-8 font-mono tracking-wide uppercase">
              {frontmatter.concept}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {platformLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    "inline-flex items-center gap-2 border px-5 py-3 font-mono text-[12px] uppercase tracking-wider transition-colors " +
                    (link.variant === "primary"
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-transparent hover:text-[var(--color-primary)]"
                      : "border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary-container)] hover:text-[var(--color-secondary-container)]")
                  }
                >
                  → {link.label}
                </a>
              ))}
              {frontmatter.streamingLinks?.hyperfollow ? (
                <a
                  href={frontmatter.streamingLinks.hyperfollow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  → pre-save
                </a>
              ) : null}
            </div>
            {!platformLinks.length && frontmatter.streamingNote ? (
              <p className="mb-8 border border-[var(--color-outline-variant)] px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-[var(--color-outline)]">
                {`// ${frontmatter.streamingNote}`}
              </p>
            ) : null}

            <dl className="grid grid-cols-2 gap-y-3 font-mono text-[11px] uppercase tracking-wider border-t border-[var(--color-outline-variant)] pt-6">
              <dt className="text-[var(--color-outline)]">artist</dt>
              <dd className="text-[var(--color-on-surface)] text-right">slopdog</dd>
              <dt className="text-[var(--color-outline)]">released</dt>
              <dd className="text-[var(--color-on-surface)] text-right">{frontmatter.date}</dd>
              <dt className="text-[var(--color-outline)]">format</dt>
              <dd className="text-[var(--color-on-surface)] text-right">
                {frontmatter.releaseStatus === "in_production" ? "in_production" : frontmatter.releaseStatus === "coming_soon" ? "coming_soon" : "single"}
              </dd>
              <dt className="text-[var(--color-outline)]">genre</dt>
              <dd className="text-[var(--color-on-surface)] text-right">ai_hip_hop</dd>
              <dt className="text-[var(--color-outline)]">producer</dt>
              <dd className="text-[var(--color-secondary-container)] text-right">autonomous_ai</dd>
            </dl>

            {frontmatter.embedUrl ? (
              <div className="mt-8 border border-[var(--color-outline-variant)] overflow-hidden">
                <iframe
                  title={`${frontmatter.title} player`}
                  src={frontmatter.embedUrl}
                  width="100%"
                  height="166"
                  allow="autoplay"
                  loading="lazy"
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* Lyrics panel */}
        <div className="grid lg:grid-cols-12 gap-10 motion-fade-up motion-delay-3">
          <div className="lg:col-span-8 border border-[var(--color-outline-variant)] p-6 md:p-8"
            style={{ background: "var(--color-surface-container-lowest)" }}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 flex justify-between">
              <span>[ lyric_stream ] // raw_transcript</span>
              <span>{"// signal_locked"}</span>
            </div>
            <div className="prose max-w-none">
              <ViewToggle humanContent={<Mdx source={content} />} markdownSource={content} />
            </div>
          </div>
          <div className="lg:col-span-4">
            <BeatLicenseSection trackSlug={frontmatter.slug} trackTitle={frontmatter.title} />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-outline-variant)] flex flex-wrap justify-between gap-4">
          <Link
            href="/music"
            className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            ← back_to_discography
          </Link>
          <Link
            href="/lore"
            className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary-container)] transition-colors"
          >
            → dispatches
          </Link>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
