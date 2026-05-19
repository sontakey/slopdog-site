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
  title: "Slopdog Blog: AI News Turned Into Hip-Hop, Weekly",
  description:
    "Weekly dispatches from Slopdog, the AI rapper. Release notes, AI news breakdowns, and the lore behind each automated hip-hop drop.",
  alternates: { canonical: "/blog" },
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
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="px-4 md:px-16 pt-10 pb-24">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] mb-8 flex flex-wrap justify-between gap-2">
        <span>[ /lore ] // dispatch_archive // sort=newest_first</span>
        <span>
          entries: <span className="text-[var(--color-secondary-container)]">{String(posts.length).padStart(3, "0")}</span>
        </span>
      </div>

      <SectionHeading
        level={1}
        kicker="lore // 02"
        title="slopdog dispatches"
        status="archive_live"
      />

      {featured ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid lg:grid-cols-12 gap-6 mb-16 border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] transition-colors p-4 md:p-6 motion-fade-up"
          style={{ background: "var(--color-surface-container-lowest)" }}
        >
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/9] overflow-hidden border border-[var(--color-outline-variant)]">
              <Image
                src={featured.frontmatter.thumbnail}
                alt={featured.frontmatter.title}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3 flex justify-between">
              <span>[ latest_dispatch ]</span>
              <span>{featured.frontmatter.date}</span>
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-extrabold lowercase leading-tight text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-4" data-featured-h2="true">
              {featured.frontmatter.title.toLowerCase()}
            </h2>
            <p className="text-[15px] leading-relaxed text-[var(--color-on-surface-variant)] mb-6 line-clamp-6">
              {featured.frontmatter.excerpt.toLowerCase()}
            </p>
            <div className="mt-auto font-mono text-[11px] uppercase tracking-wider text-[var(--color-secondary-container)]">
              → read_full_dispatch
            </div>
          </div>
        </Link>
      ) : null}

      <ul className="divide-y divide-[var(--color-outline-variant)] border-y border-[var(--color-outline-variant)]">
        {rest.map((p, i) => {
          const num = String(rest.length - i).padStart(3, "0");
          return (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group grid grid-cols-12 gap-3 md:gap-6 items-start py-6 px-2 -mx-2 hover:bg-[var(--color-surface-container-lowest)] transition-colors"
              >
                <div className="col-span-2 md:col-span-1 font-mono text-[11px] text-[var(--color-outline)] group-hover:text-[var(--color-primary)] pt-2">
                  {num}
                </div>
                <div className="col-span-10 md:col-span-3">
                  <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-outline-variant)] group-hover:border-[var(--color-primary)] transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.frontmatter.thumbnail}
                      alt={p.frontmatter.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)] mb-2">
                    {p.frontmatter.date}
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-extrabold lowercase leading-tight text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-2">
                    {p.frontmatter.title.toLowerCase()}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[var(--color-on-surface-variant)] line-clamp-2 mb-3">
                    {p.frontmatter.excerpt.toLowerCase()}
                  </p>
                  {p.frontmatter.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {p.frontmatter.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)] px-2 py-0.5"
                        >
                          {t.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
