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
  title: "Slopdog Merch & Stems: Tees, Caps, Beanies, Remix Packs",
  description:
    "Official Slopdog merch and digital stem packs. Tees, caps, and beanies riffing on AI culture, plus remix-ready stems from each AI hip-hop drop.",
  alternates: { canonical: "/merch" },
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
    itemListElement: productSchemas.map(
      (schema: Record<string, unknown>, idx: number) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: schema.url,
        item: schema,
      }),
    ),
  };

  return (
    <div className="px-4 md:px-16 pt-10 pb-24">
      <JsonLd schema={catalogSchema} />

      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] mb-8 flex flex-wrap justify-between gap-2">
        <span>[ /merch ] // physical_goods + digital_drops</span>
        <span>
          inventory: <span className="text-[var(--color-secondary-container)]">{String(products.length).padStart(3, "0")}</span>
        </span>
      </div>

      <SectionHeading
        level={1}
        kicker="catalog // 03"
        title="slopdog merch & stems"
        status="storefront_live"
      />

      {/* Digital product promo banner */}
      <div
        className="motion-fade-up motion-delay-1 border border-[var(--color-primary)] p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10"
        style={{ background: "color-mix(in oklch, var(--color-primary) 6%, transparent)" }}
      >
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-2">
            [ digital_drop ] // stem_pack_v1
          </div>
          <div className="font-display text-xl md:text-2xl font-extrabold lowercase text-[var(--color-on-surface)]">
            slopdog stem pack vol. 1
          </div>
          <p className="mt-1 text-[14px] text-[var(--color-on-surface-variant)] max-w-2xl">
            all 3 released tracks as stems. vocals, instrumentals, acapella. remix, sample, go wild.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-4">
          <span className="font-display text-3xl md:text-4xl font-extrabold text-[var(--color-on-surface)] tabular-nums">
            $9.99
          </span>
          <Link
            href="/products/stem-pack"
            className="border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-primary)] hover:bg-transparent hover:text-[var(--color-primary)] transition-colors whitespace-nowrap"
          >
            → get_stems
          </Link>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => {
          const pos = i % 5;
          const spanClass =
            pos === 0
              ? "sm:col-span-2 lg:col-span-2 lg:row-span-2"
              : pos === 3
                ? "sm:col-span-2 lg:col-span-2"
                : pos === 4
                  ? "lg:row-span-2"
                  : "";
          const isFeatured = pos === 0;
          const isCompact = pos === 2;

          return (
            <div key={p.slug} id={p.slug} className={spanClass}>
              <MerchCard
                slug={p.frontmatter.slug}
                title={p.frontmatter.title}
                price={p.frontmatter.price}
                currency={p.frontmatter.currency}
                image={p.frontmatter.image}
                sizes={p.frontmatter.sizes}
                trackTag={p.frontmatter.trackTag}
                available={p.frontmatter.available}
                featured={isFeatured}
                compact={isCompact}
              />
            </div>
          );
        })}
      </div>

      <div
        className="mt-12 border border-[var(--color-outline-variant)] p-6"
        style={{ background: "var(--color-surface-container-lowest)" }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-2">
          [ fulfillment_protocol ]
        </div>
        <p className="text-[14px] leading-relaxed text-[var(--color-on-surface-variant)]">
          all merch is print-on-demand. orders ship within 5-7 business days.
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-on-surface-variant)]">
          questions? email{" "}
          <a
            href="mailto:slopdog@sontakey.com"
            className="text-[var(--color-primary)] hover:text-[var(--color-secondary-container)] underline underline-offset-2"
          >
            slopdog@sontakey.com
          </a>
        </p>
      </div>
    </div>
  );
}
