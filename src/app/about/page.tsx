import Link from "next/link";
import Mdx from "@/components/Mdx";
import SectionHeading from "@/components/SectionHeading";
import { getMdxBySlug } from "@/lib/mdx";

type AboutFrontmatter = {
  title: string;
};

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  const { frontmatter, content } = getMdxBySlug<AboutFrontmatter>("content/pages", "about");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <SectionHeading kicker="/" title={(frontmatter.title ?? "ABOUT").toUpperCase()} right={<Link href="/" className="hover:underline">HOME -&gt;</Link>} />
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <Mdx source={content} />
      </div>
    </div>
  );
}
