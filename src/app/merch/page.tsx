import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { getAllMdx } from "@/lib/mdx";

type MerchFrontmatter = {
  title: string;
  slug: string;
  price: number;
  currency: string;
  image: string;
  buyLink: string;
  colors?: string[];
  sizes?: string[];
  trackTag?: string;
  available: boolean;
};

export const metadata = {
  title: "Merch",
};

export default function MerchPage() {
  const products = getAllMdx<MerchFrontmatter>("content/merch");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading kicker="/" title="MERCH" right={<span className="text-zinc-500">EXTERNAL CHECKOUT</span>} />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <a
            key={p.slug}
            href={p.frontmatter.buyLink}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:shadow-glow"
          >
            <div className="scanlines relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black">
              <Image src={p.frontmatter.image} alt={p.frontmatter.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 25vw" />
            </div>
            <div className="mt-3">
              <div className="text-sm font-bold leading-tight group-hover:text-primary">{p.frontmatter.title}</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-xs font-mono text-zinc-400">
                  {p.frontmatter.currency} {p.frontmatter.price}
                </div>
                <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-mono text-zinc-400">
                  BUY
                </span>
              </div>
              {p.frontmatter.trackTag ? (
                <div className="mt-2 text-[10px] font-mono text-primary">TAG: {p.frontmatter.trackTag}</div>
              ) : null}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-zinc-300">
        <div className="font-mono text-primary text-xs">NOTE</div>
        <p className="mt-2">
          Merch checkout is external right now. This page is a catalog, not a cart.
        </p>
        <p className="mt-2">
          Want track-specific merch collections? We can filter by <span className="text-primary">trackTag</span>.
        </p>
      </div>
    </div>
  );
}
