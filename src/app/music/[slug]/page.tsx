import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Mdx from "@/components/Mdx";
import SectionHeading from "@/components/SectionHeading";
import { getAllMdx, getMdxBySlug, getMdxSlugs } from "@/lib/mdx";

type TrackFrontmatter = {
  title: string;
  slug: string;
  date: string;
  coverImage: string;
  concept: string;
  embedUrl: string;
  streamingLinks?: { soundcloud?: string; spotify?: string; apple?: string };
};

export function generateStaticParams() {
  return getMdxSlugs("content/music").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = getAllMdx<TrackFrontmatter>("content/music");
  const track = all.find((t) => t.slug === slug);
  if (!track) return {};

  return {
    title: track.frontmatter.title,
    description: track.frontmatter.concept,
    openGraph: {
      title: track.frontmatter.title,
      description: track.frontmatter.concept,
      images: [track.frontmatter.coverImage],
    },
  };
}

export default async function TrackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = getMdxBySlug<TrackFrontmatter>("content/music", slug);

    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
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
              <Image src={frontmatter.coverImage} alt={`${frontmatter.title} cover`} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" priority />
            </div>

            {frontmatter.embedUrl ? (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
                <iframe title={`${frontmatter.title} player`} src={frontmatter.embedUrl} width="100%" height="166" allow="autoplay" />
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {frontmatter.streamingLinks?.spotify ? (
                <a
                  className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-black hover:opacity-90"
                  href={frontmatter.streamingLinks.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  SPOTIFY
                </a>
              ) : null}
              {frontmatter.streamingLinks?.spotify ? (
                <a
                  className="rounded-md border border-white/15 bg-black/30 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-primary/30 hover:text-primary"
                  href={frontmatter.streamingLinks.spotify}
                  target="_blank"
                  rel="noreferrer"
                >
                  SPOTIFY
                </a>
              ) : null}
              {frontmatter.streamingLinks?.apple ? (
                <a
                  className="rounded-md border border-white/15 bg-black/30 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-primary/30 hover:text-primary"
                  href={frontmatter.streamingLinks.apple}
                  target="_blank"
                  rel="noreferrer"
                >
                  APPLE MUSIC
                </a>
              ) : null}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-mono text-primary">RELEASE_DATE</div>
              <div className="mt-1 text-sm text-zinc-300">{frontmatter.date}</div>
              <div className="mt-4 text-xs font-mono text-primary">CONCEPT</div>
              <div className="mt-1 text-sm text-zinc-300">{frontmatter.concept}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs font-mono text-primary">LYRICS</div>
            <div className="mt-4">
              <Mdx source={content} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
