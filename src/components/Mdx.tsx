import { MDXRemote } from "next-mdx-remote/rsc";

export default function Mdx({ source }: { source: string }) {
  return (
    <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-primary prose-strong:text-white prose-code:text-primary">
      <MDXRemote source={source} />
    </article>
  );
}
