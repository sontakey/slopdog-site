import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import MerchCard from "@/components/MerchCard";
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
        url: url,
        priceCurrency: p.frontmatter.currency,
        price: p.frontmatter.price,
        availability: p.frontmatter.available
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    };
  });

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SLOPDOG Merch",
    itemListElement: productSchemas.map((schema: Record<string, unknown>, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: schema.url,
      item: schema,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <JsonLd schema={catalogSchema} />
      <SectionHeading kicker="/" title="MERCH" right={<span className="text-zinc-500 text-sm font-mono">STRIPE_CHECKOUT</span>} />

      {/* Digital product promo banner */}
      <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-mono text-xs text-primary mb-1">DIGITAL_PRODUCT</div>
          <div className="font-bold text-white">Slopdog Stem Pack Vol. 1</div>
          <p className="mt-1 text-sm text-zinc-400">
            All 3 tracks as stems — vocals, instrumentals, acapella. Remix, sample, go wild.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-4">
          <span className="font-mono text-xl font-bold text-white">$9.99</span>
          <Link
            href="/products/stem-pack"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:opacity-90 transition whitespace-nowrap"
          >
            GET STEMS
          </Link>
        </div>
      </div>

      {/* Product grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <div key={p.slug} id={p.slug} className={i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}>
            <MerchCard
              slug={p.frontmatter.slug}
              title={p.frontmatter.title}
              price={p.frontmatter.price}
              currency={p.frontmatter.currency}
              image={p.frontmatter.image}
              sizes={p.frontmatter.sizes}
              trackTag={p.frontmatter.trackTag}
              available={p.frontmatter.available}
              featured={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-zinc-300">
        <div className="font-mono text-primary text-xs mb-2">NOTE</div>
        <p>All merch is print-on-demand. Orders ship within 5–7 business days.</p>
        <p className="mt-2">
          Questions? Email{" "}
          <a href="mailto:slopdog@sontakey.com" className="text-primary hover:underline">
            slopdog@sontakey.com
          </a>
        </p>
      </div>
    </div>
  );
}
