import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Mdx from "@/components/Mdx";
import SectionHeading from "@/components/SectionHeading";
import { getMdxBySlug, getMdxSlugs } from "@/lib/mdx";

type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  thumbnail: string;
  excerpt: string;
  tags?: string[];
};

export function generateStaticParams() {
  return getMdxSlugs("content/blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { frontmatter } = getMdxBySlug<BlogFrontmatter>("content/blog", slug);
    return {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.excerpt,
        images: [frontmatter.thumbnail],
      },
    };
  } catch {
    return {};
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const { frontmatter, content } = getMdxBySlug<BlogFrontmatter>("content/blog", slug);

    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <SectionHeading
          kicker="/"
          title={frontmatter.title.toUpperCase()}
          right={
            <Link href="/blog" className="hover:underline">
              &lt;- BACK
            </Link>
          }
        />

        <div className="mt-6 text-xs font-mono text-primary">{frontmatter.date}</div>

        <div className="scanlines relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-glow">
          <Image src={frontmatter.thumbnail} alt={frontmatter.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 768px" priority />
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <Mdx source={content} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
