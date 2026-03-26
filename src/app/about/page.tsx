import type { Metadata } from "next";
import Link from "next/link";
import Mdx from "@/components/Mdx";
import SectionHeading from "@/components/SectionHeading";
import { getMdxBySlug } from "@/lib/mdx";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import ViewToggle from "@/components/ViewToggle";

type AboutFrontmatter = {
  title: string;
};

export const metadata: Metadata = {
  title: "About",
  description:
    "About Slopdog, the world's first fully automated AI music artist, making weekly AI-generated hip-hop tracks based on AI news using autonomous AI agents.",
  alternates: {
    canonical: "/about",
  },
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
  const { frontmatter, content } = getMdxBySlug<AboutFrontmatter>("content/pages", "about");

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
    <div className="max-w-3xl px-5 py-16 md:py-24 sm:px-6 lg:pl-16">
      <JsonLd schema={schema} />
      <SectionHeading kicker="/" title={(frontmatter.title ?? "ABOUT").toUpperCase()} right={<Link href="/" className="hover:underline">HOME -&gt;</Link>} />
      <div className="mt-10 rounded-2xl border border-fg/10 bg-fg/5 p-5 sm:p-6">
        <ViewToggle humanContent={<Mdx source={content} />} markdownSource={content} />
      </div>
    </div>
  );
}
