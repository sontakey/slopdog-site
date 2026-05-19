import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Mdx from "@/components/Mdx";
import JsonLd from "@/components/JsonLd";
import ViewToggle from "@/components/ViewToggle";
import { getMdxBySlug, getMdxSlugs } from "@/lib/mdx";
import { SITE } from "@/lib/site";

type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  thumbnail: string;
  excerpt: string;
  tags?: string[];
  faq?: { q: string; a: string }[];
};

export function generateStaticParams() {
  return getMdxSlugs("content/blog").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getMdxBySlug<BlogFrontmatter>("content/blog", slug);
    const ogImage = frontmatter.thumbnail || SITE.ogImage;

    return {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      alternates: { canonical: `/blog/${frontmatter.slug}` },
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.excerpt,
        url: `/blog/${frontmatter.slug}`,
        images: [ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title: frontmatter.title,
        description: frontmatter.excerpt,
        images: [ogImage],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = getMdxBySlug<BlogFrontmatter>(
      "content/blog",
      slug,
    );

    const url = new URL(`/blog/${frontmatter.slug}`, SITE.url).toString();

    const faqSchema = frontmatter.faq?.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: frontmatter.faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }
      : null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: frontmatter.title,
      description: frontmatter.excerpt,
      datePublished: frontmatter.date,
      url,
      image: [new URL(frontmatter.thumbnail || SITE.ogImage, SITE.url).toString()],
      author: { "@type": "Organization", name: "SLOPDOG", url: SITE.url },
      publisher: { "@type": "Organization", name: "SLOPDOG", url: SITE.url },
      about: ["AI-generated music", "AI music artist", "AI news", "AI-generated hip-hop"],
    };

    return (
      <article className="px-4 md:px-16 pt-10 pb-24">
        <JsonLd schema={schema} />
        {faqSchema && <JsonLd schema={faqSchema} />}

        <nav className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] mb-8 flex flex-wrap gap-x-2">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
            [ home ]
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--color-primary)] transition-colors">
            lore
          </Link>
          <span>/</span>
          <span className="text-[var(--color-on-surface-variant)] truncate max-w-[60vw]">
            {frontmatter.slug}
          </span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <header className="lg:col-span-8 motion-fade-up">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 flex flex-wrap gap-3">
              <span>[ dispatch ]</span>
              <span>{frontmatter.date}</span>
              {frontmatter.tags?.slice(0, 3).map((t) => (
                <span key={t} className="text-[var(--color-outline)]">// {t.toLowerCase()}</span>
              ))}
            </div>
            <h1
              className="font-display font-extrabold leading-[1.02] tracking-tight text-[var(--color-on-surface)] lowercase mb-6"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
            >
              {frontmatter.title.toLowerCase()}
            </h1>
            <p className="text-[18px] leading-relaxed text-[var(--color-on-surface-variant)] max-w-2xl">
              {frontmatter.excerpt.toLowerCase()}
            </p>
          </header>

          <aside className="lg:col-span-4 motion-fade-up motion-delay-2">
            <div className="relative aspect-square overflow-hidden border border-[var(--color-outline-variant)]">
              <Image
                src={frontmatter.thumbnail}
                alt={frontmatter.title}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 font-mono text-[10px] uppercase tracking-wider text-[var(--color-on-surface)]"
                style={{ textShadow: "0 0 4px rgba(0,0,0,0.85)" }}
              >
                <span>// dispatch_cover</span>
                <span className="text-[var(--color-primary)] self-end">[ live ]</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 lg:col-start-3 motion-fade-up motion-delay-3 prose">
            <ViewToggle humanContent={<Mdx source={content} />} markdownSource={content} />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-outline-variant)] flex flex-wrap justify-between gap-4">
          <Link
            href="/blog"
            className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            ← back_to_dispatches
          </Link>
          <Link
            href="/music"
            className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary-container)] transition-colors"
          >
            → discography
          </Link>
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
