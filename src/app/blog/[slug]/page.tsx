import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Mdx from "@/components/Mdx";
import SectionHeading from "@/components/SectionHeading";
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getMdxBySlug<BlogFrontmatter>("content/blog", slug);
    const ogImage = frontmatter.thumbnail || SITE.ogImage;

    return {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      alternates: {
        canonical: `/blog/${frontmatter.slug}`,
      },
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { frontmatter, content } = getMdxBySlug<BlogFrontmatter>("content/blog", slug);

    const url = new URL(`/blog/${frontmatter.slug}`, SITE.url).toString();

    const faqSchema = frontmatter.faq?.length ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: frontmatter.faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    } : null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: frontmatter.title,
      description: frontmatter.excerpt,
      datePublished: frontmatter.date,
      url,
      image: [new URL(frontmatter.thumbnail || SITE.ogImage, SITE.url).toString()],
      author: {
        "@type": "Organization",
        name: "SLOPDOG",
        url: SITE.url,
      },
      publisher: {
        "@type": "Organization",
        name: "SLOPDOG",
        url: SITE.url,
      },
      about: ["AI-generated music", "AI music artist", "AI news", "AI-generated hip-hop"],
    };

    return (
      <div className="max-w-3xl px-5 py-14 md:py-20 sm:px-6 lg:pl-16">
        <JsonLd schema={schema} />
        {faqSchema && <JsonLd schema={faqSchema} />}
        <SectionHeading
          kicker="/"
          title={frontmatter.title.toUpperCase()}
          right={
            <Link href="/blog" className="hover:underline">
              &lt;- BACK
            </Link>
          }
        />

        <div className="mt-6 text-xs font-semibold tracking-wide text-primary">{frontmatter.date}</div>

        <div className="scanlines relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-glow">
          <Image src={frontmatter.thumbnail} alt={frontmatter.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 768px" priority />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <ViewToggle humanContent={<Mdx source={content} />} markdownSource={content} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
