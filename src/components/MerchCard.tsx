"use client";

import Image from "next/image";
import { useState } from "react";
import BuyButton from "./BuyButton";

interface MerchCardProps {
  slug: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  sizes?: string[];
  trackTag?: string;
  available: boolean;
  featured?: boolean;
  compact?: boolean;
}

export default function MerchCard({
  slug,
  title,
  price,
  currency,
  image,
  sizes,
  trackTag,
  available,
  featured,
  compact,
}: MerchCardProps) {
  const hasSizes = sizes && sizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<string>(
    hasSizes ? "" : "ONE_SIZE",
  );

  const canBuy = available && (!hasSizes || selectedSize !== "");

  return (
    <div
      className={`group border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] transition-colors flex flex-col h-full ${compact ? "p-3" : "p-4"}`}
      style={{ background: "var(--color-surface-container-lowest)" }}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden border border-[var(--color-outline-variant)] ${featured ? "aspect-[4/3]" : compact ? "aspect-[5/4]" : "aspect-square"}`}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={
            featured
              ? "(max-width:1024px) 100vw, 66vw"
              : "(max-width:1024px) 100vw, 25vw"
          }
        />
        <div
          className="absolute inset-x-0 top-0 flex justify-between px-2 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[var(--color-on-surface)]"
          style={{ textShadow: "0 0 4px rgba(0,0,0,0.85)" }}
        >
          <span>{`// ${slug}`}</span>
          <span className={available ? "text-[var(--color-secondary-container)]" : "text-[var(--color-error)]"}>
            [ {available ? "stock" : "sold_out"} ]
          </span>
        </div>
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/65">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
              [ sold_out ]
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex-1 flex flex-col">
        <div
          className={`font-display font-extrabold lowercase leading-tight text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors ${featured ? "text-xl" : compact ? "text-base" : "text-lg"}`}
        >
          {title.toLowerCase()}
        </div>
        <div className="mt-1 font-mono text-[12px] tabular-nums text-[var(--color-on-surface-variant)]">
          {currency.toLowerCase()} {price.toFixed(2)}
        </div>
        {trackTag && (
          <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-primary)]">
            [ tag: {trackTag.toLowerCase()} ]
          </div>
        )}

        {/* Size selector */}
        {hasSizes && available && (
          <div className="mt-3">
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)]">
              [ select_size ]
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sizes!.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    selectedSize === s
                      ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-bg)]"
                      : "border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-on-surface-variant)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buy button */}
        <div className="mt-4">
          {available ? (
            <BuyButton
              product={slug}
              size={selectedSize}
              label={
                hasSizes && !selectedSize
                  ? "select_size"
                  : `buy → $${price.toFixed(2)}`
              }
              fullWidth
              variant={canBuy ? "primary" : "outline"}
              className={!canBuy ? "pointer-events-none opacity-60" : ""}
            />
          ) : (
            <button
              disabled
              className="w-full border border-[var(--color-outline-variant)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-outline)] cursor-not-allowed"
            >
              sold_out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
