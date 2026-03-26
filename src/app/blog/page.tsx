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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading kicker="/" title="BLOG" right={<span className="text-zinc-500">TRANSMISSIONS</span>} />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className={`group rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-primary/30 hover:shadow-glow ${
              i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
            }`}
          >
            <div className={`scanlines relative mb-4 overflow-hidden rounded-lg border border-white/10 ${
              i === 0 ? "aspect-[2/1]" : "aspect-[16/10]"
            }`}>
              <Image src={p.frontmatter.thumbnail} alt={p.frontmatter.title} fill className="object-cover" sizes={i === 0 ? "(max-width:1024px) 100vw, 66vw" : "(max-width:1024px) 100vw, 33vw"} />
            </div>
            <div className="text-xs font-mono text-primary">{p.frontmatter.date} // LOG_ENTRY</div>
            <div className={`mt-2 font-bold leading-tight group-hover:text-primary ${
              i === 0 ? "text-2xl" : "text-lg"
            }`}>{p.frontmatter.title}</div>
            <p className={`mt-2 text-sm text-zinc-400 ${i === 0 ? "line-clamp-5" : "line-clamp-3"}`}>{p.frontmatter.excerpt}</p>
            {p.frontmatter.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.frontmatter.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-mono text-zinc-400">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
