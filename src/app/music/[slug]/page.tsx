import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Mdx from "@/components/Mdx";
import SectionHeading from "@/components/SectionHeading";
import JsonLd from "@/components/JsonLd";
import ViewToggle from "@/components/ViewToggle";
import BeatLicenseSection from "@/components/BeatLicenseSection";
import { getAllMdx, getMdxBySlug, getMdxSlugs } from "@/lib/mdx";
import { SITE } from "@/lib/site";

type TrackFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
  embedUrl: string;
  streamingLinks?: { spotify?: string; apple?: string; hyperfollow?: string };
};

export function generateStaticParams() {
  return getMdxSlugs("content/music").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const all = getAllMdx<TrackFrontmatter>("content/music");
  const track = all.find((t) => t.slug === slug);
  if (!track) return {};

  const title = `${track.frontmatter.title} (AI-generated hip-hop single)`;
  const description = `${track.frontmatter.concept} Listen to ${track.frontmatter.title} by Slopdog, an AI music artist. Weekly AI-generated hip-hop drops based on AI news.`;
  const ogImage = track.frontmatter.coverImage || SITE.ogImage;

  return {
    title: track.frontmatter.title,
    description,
    alternates: {
      canonical: `/music/${track.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/music/${track.slug}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = getMdxBySlug<TrackFrontmatter>("content/music", slug);

    const url = new URL(`/music/${frontmatter.slug}`, SITE.url).toString();

    const schema = {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      name: frontmatter.title,
      url,
      datePublished: frontmatter.date,
      genre: ["Hip-Hop", "Rap"],
      description: frontmatter.concept,
      image: new URL(frontmatter.coverImage || SITE.ogImage, SITE.url).toString(),
      byArtist: {
        "@type": "MusicGroup",
        name: "SLOPDOG",
        url: SITE.url,
      },
    };

    return (
      <div className="px-5 py-10 md:py-16 sm:px-6 lg:pl-16 lg:pr-12">
        <JsonLd schema={schema} />
        <SectionHeading
          kicker="/"
          title={frontmatter.title.toUpperCase()}
          right={
            <Link href="/music" className="hover:underline">
              &lt;- BACK
            </Link>
          }
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="scanlines relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black shadow-glow">
              <Image
                src={frontmatter.coverImage}
                alt={`${frontmatter.title} cover`}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
            </div>

            {frontmatter.embedUrl ? (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                <iframe title={`${frontmatter.title} player`} src={frontmatter.embedUrl} width="100%" height="166" allow="autoplay" loading="lazy" />
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {frontmatter.streamingLinks?.spotify ? (
                <a
                  className="rounded-md bg-primary px-4 py-2 font-display text-body-sm font-bold text-black hover:opacity-90"
                  href={frontmatter.streamingLinks.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  SPOTIFY
                </a>
              ) : null}
              {frontmatter.streamingLinks?.hyperfollow ? (
                <a
                  className="rounded-md border border-white/10 bg-white/5 px-4 py-2 font-display text-body-sm font-bold text-white hover:border-primary/30 hover:text-primary transition"
                  href={frontmatter.streamingLinks.hyperfollow}
                  target="_blank"
                  rel="noreferrer"
                >
                  PRE-SAVE
                </a>
              ) : null}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-label uppercase text-primary">RELEASE DATE</div>
              <div className="mt-1 text-body-sm text-zinc-300">{frontmatter.date}</div>
              <div className="mt-4 text-label uppercase text-primary">CONCEPT</div>
              <div className="mt-1 text-body-sm text-zinc-300">{frontmatter.concept}</div>
            </div>

            {/* Beat License */}
            <BeatLicenseSection trackSlug={frontmatter.slug} trackTitle={frontmatter.title} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="text-label uppercase text-primary">LYRICS</div>
            <div className="mt-4">
              <ViewToggle humanContent={<Mdx source={content} />} markdownSource={content} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
