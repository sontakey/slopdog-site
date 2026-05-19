import type { Metadata } from "next";
import Link from "next/link";
import Mdx from "@/components/Mdx";
import { getMdxBySlug } from "@/lib/mdx";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import ViewToggle from "@/components/ViewToggle";

type AboutFrontmatter = { title: string };

export const metadata: Metadata = {
  title: "About",
  description:
    "About Slopdog, the world's first fully automated AI music artist, making weekly AI-generated hip-hop tracks based on AI news using autonomous AI agents.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Slopdog",
    description:
      "How Slopdog works, and why it is positioned as the world's first fully automated AI music artist.",
    url: "/about",
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Slopdog",
    description:
      "How Slopdog works, and why it is positioned as the world's first fully automated AI music artist.",
    images: [SITE.ogImage],
  },
};

export default function AboutPage() {
  const { frontmatter, content } = getMdxBySlug<AboutFrontmatter>(
    "content/pages",
    "about",
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "SLOPDOG",
    url: SITE.url,
    description: SITE.description,
    genre: ["Hip-Hop", "Rap"],
    image: new URL(SITE.ogImage, SITE.url).toString(),
  };

  return (
    <div className="px-4 md:px-16 pt-10 pb-24">
      <JsonLd schema={schema} />

      <nav className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] mb-8 flex gap-x-2">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
          [ home ]
        </Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface-variant)]">protocol</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-10 mb-16">
        <header className="lg:col-span-8 motion-fade-up">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
            [ system_protocol ] // origin_signal
          </div>
          <h1
            className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--color-on-surface)] lowercase mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            {(frontmatter.title ?? "about").toLowerCase()}
          </h1>
          <p className="text-[18px] leading-relaxed text-[var(--color-on-surface-variant)] max-w-2xl">
            {SITE.description.toLowerCase()}
          </p>
        </header>

        <aside className="lg:col-span-4 motion-fade-up motion-delay-2">
          <div
            className="border border-[var(--color-outline-variant)] p-5"
            style={{ background: "var(--color-surface-container-lowest)" }}
          >
            <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)] mb-4">
              [ artist_card ]
            </div>
            <dl className="grid grid-cols-2 gap-y-3 font-mono text-[11px] uppercase tracking-wider">
              <dt className="text-[var(--color-outline)]">name</dt>
              <dd className="text-[var(--color-on-surface)] text-right">slopdog</dd>
              <dt className="text-[var(--color-outline)]">type</dt>
              <dd className="text-[var(--color-on-surface)] text-right">ai_music_artist</dd>
              <dt className="text-[var(--color-outline)]">based_in</dt>
              <dd className="text-[var(--color-on-surface)] text-right">latent_space</dd>
              <dt className="text-[var(--color-outline)]">since</dt>
              <dd className="text-[var(--color-on-surface)] text-right">2026</dd>
              <dt className="text-[var(--color-outline)]">producer</dt>
              <dd className="text-[var(--color-secondary-container)] text-right">autonomous_ai</dd>
              <dt className="text-[var(--color-outline)]">human</dt>
              <dd className="text-[var(--color-on-surface)] text-right">0%</dd>
            </dl>
          </div>
        </aside>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 motion-fade-up motion-delay-3">
        <div className="lg:col-span-8 lg:col-start-3 prose">
          <ViewToggle humanContent={<Mdx source={content} />} markdownSource={content} />
        </div>
      </div>
    </div>
  );
}
