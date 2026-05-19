import type { AnchorHTMLAttributes } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

function MdxAnchor(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href = "", children, ...rest } = props;
  const isExternal = /^https?:\/\//i.test(href);
  const isMail = /^mailto:/i.test(href);
  if (isExternal) {
    return (
      <a
        {...rest}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  if (isMail) {
    return (
      <a {...rest} href={href}>
        {children}
      </a>
    );
  }
  return (
    <a {...rest} href={href}>
      {children}
    </a>
  );
}

const mdxComponents = {
  a: MdxAnchor,
};

export default function Mdx({ source }: { source: string }) {
  return (
    <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-primary prose-strong:text-white prose-code:text-primary prose-p:mb-6 prose-p:leading-relaxed prose-headings:mt-10 prose-headings:mb-4 prose-blockquote:border-l-primary prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg prose-blockquote:px-5 prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-zinc-300 prose-hr:my-10 prose-hr:border-white/10 prose-li:mb-2">
      <MDXRemote source={source} components={mdxComponents} />
    </article>
  );
}
