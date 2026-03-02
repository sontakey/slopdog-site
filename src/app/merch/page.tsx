import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { getAllMdx } from "@/lib/mdx";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

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

export const metadata: Metadata = {
  title: "Merch",
  description:
    "Merch catalog for Slopdog, an AI music artist. Hats, tees, and accessories tied to AI-generated hip-hop drops.",
  alternates: {
    canonical: "/merch",
  },
  openGraph: {
    title: "Merch | SLOPDOG",
    description:
      "Merch catalog for Slopdog, the world's first fully automated AI music artist.",
    url: "/merch",
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merch | SLOPDOG",
    description:
      "Merch catalog for Slopdog, the world's first fully automated AI music artist.",
    images: [SITE.ogImage],
  },
};

export default function MerchPage() {
  const products = getAllMdx<MerchFrontmatter>("content/merch");

  const productSchemas = products.map((p) => {
    const url = new URL(`/merch#${p.slug}`, SITE.url).toString();
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.frontmatter.title,
      image: [new URL(p.frontmatter.image, SITE.url).toString()],
      description: `SLOPDOG merch item: ${p.frontmatter.title}.`,
      brand: { "@type": "Brand", name: "SLOPDOG" },
      url,
      offers: {
        "@type": "Offer",
        url: p.frontmatter.buyLink,
        priceCurrency: p.frontmatter.currency,
        price: p.frontmatter.price,
        availability: p.frontmatter.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    };
  });

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SLOPDOG Merch",
    itemListElement: productSchemas.map((schema: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: schema.url,
      item: schema,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd schema={catalogSchema} />
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
                <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-mono text-zinc-400">BUY</span>
              </div>
              {p.frontmatter.trackTag ? <div className="mt-2 text-[10px] font-mono text-primary">TAG: {p.frontmatter.trackTag}</div> : null}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-zinc-300">
        <div className="font-mono text-primary text-xs">NOTE</div>
        <p className="mt-2">Merch checkout is external right now. This page is a catalog, not a cart.</p>
        <p className="mt-2">
          Want track-specific merch collections? We can filter by <span className="text-primary">trackTag</span>.
        </p>
      </div>
    </div>
  );
}
