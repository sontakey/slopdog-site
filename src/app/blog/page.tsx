import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getAllMdx } from "@/lib/mdx";
import { SITE } from "@/lib/site";

type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  thumbnail: string;
  excerpt: string;
  tags?: string[];
};

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Transmissions from Slopdog, an AI music artist. Weekly AI news, release notes, and context behind AI-generated hip-hop drops.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | SLOPDOG",
    description:
      "AI news hip-hop, release context, and behind the scenes notes from Slopdog's automated music production pipeline.",
    url: "/blog",
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | SLOPDOG",
    description:
      "AI news hip-hop, release context, and behind the scenes notes from Slopdog's automated music production pipeline.",
    images: [SITE.ogImage],
  },
};

export default function BlogPage() {
  const posts = getAllMdx<BlogFrontmatter>("content/blog");

  return (
    <div className="px-4 py-12 md:py-16 sm:px-6 lg:pl-8 lg:pr-16">
      <div className="motion-fade-up">
        <SectionHeading title="BLOG" />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => {
          const pos = i % 5;
          // Repeating pattern: hero (2col+2row), standard, wide (2col), standard, standard
          const spanClass =
            pos === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" :
            pos === 2 ? "sm:col-span-2 lg:col-span-2" : "";
          const isFeatured = pos === 0;
          const isWide = pos === 2;
          const aspectClass =
            isFeatured ? "aspect-[2/1]" :
            isWide ? "aspect-[3/1]" : "aspect-[16/10]";
          const textSize = isFeatured ? "text-display-sm" : isWide ? "text-display-sm" : "text-body-lg";
          const clampClass = isFeatured ? "line-clamp-5" : isWide ? "line-clamp-3" : "line-clamp-3";

          return (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className={`group motion-fade-up rounded-xl border border-fg/10 bg-fg/5 p-5 transition-all duration-normal ease-out-quart hover:border-primary/30 ${spanClass}`}
              style={{ animationDelay: `${Math.min(i, 5) * 75}ms` }}
            >
              <div className={`relative mb-4 overflow-hidden rounded-lg border border-fg/10 ${aspectClass}`}>
                <Image src={p.frontmatter.thumbnail} alt={p.frontmatter.title} fill className="object-cover transition-transform duration-slow ease-out-quint group-hover:scale-105" sizes={isFeatured || isWide ? "(max-width:1024px) 100vw, 66vw" : "(max-width:1024px) 100vw, 33vw"} />
              </div>
              <div className="text-label uppercase text-fg-faint">{p.frontmatter.date}</div>
              <div className={`mt-2 font-display font-bold leading-tight group-hover:text-primary transition-colors duration-normal ease-out-quart ${textSize}`}>{p.frontmatter.title}</div>
              <p className={`mt-2 text-body-sm text-fg-muted ${clampClass}`}>{p.frontmatter.excerpt}</p>
              {p.frontmatter.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.frontmatter.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full border border-fg/10 bg-neutral-950/40 px-2.5 py-0.5 text-label text-fg-muted">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
