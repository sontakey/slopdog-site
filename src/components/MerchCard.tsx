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
}: MerchCardProps) {
  const hasSizes = sizes && sizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<string>(hasSizes ? "" : "ONE_SIZE");

  const canBuy = available && (!hasSizes || selectedSize !== "");

  return (
    <div className="group rounded-xl border border-fg/10 bg-fg/5 p-4 transition-all duration-normal ease-out-quart hover:border-primary/20 flex flex-col h-full">
      {/* Image */}
      <div className={`relative overflow-hidden rounded-lg border border-fg/10 bg-neutral-950 ${featured ? "aspect-[4/3]" : "aspect-square"}`}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-slow ease-out-quint group-hover:scale-105"
          sizes={featured ? "(max-width:1024px) 100vw, 66vw" : "(max-width:1024px) 100vw, 25vw"}
        />
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/70">
            <span className="text-label uppercase text-fg-faint">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex-1 flex flex-col">
        <div className={`font-display font-bold leading-tight text-fg group-hover:text-primary transition-colors duration-normal ease-out-quart ${featured ? "text-body-lg" : "text-body-sm"}`}>
          {title}
        </div>
        <div className={`mt-1 text-fg-muted ${featured ? "text-body-sm" : "text-label"}`}>
          {currency} {price.toFixed(2)}
        </div>
        {trackTag && (
          <div className="mt-1.5 text-label uppercase text-primary">TAG: {trackTag}</div>
        )}

        {/* Size selector */}
        {hasSizes && available && (
          <div className="mt-3">
            <div className="mb-1.5 text-label uppercase text-fg-faint">SELECT SIZE</div>
            <div className="flex flex-wrap gap-1.5">
              {sizes!.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`rounded-md border px-2.5 py-1 text-label font-bold transition-colors duration-fast ease-out-quart ${
                    selectedSize === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-fg/10 text-fg-muted hover:border-fg/30 hover:text-neutral-200"
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
                  ? "SELECT SIZE"
                  : `BUY — $${price.toFixed(2)}`
              }
              fullWidth
              variant={canBuy ? "primary" : "outline"}
              className={!canBuy ? "pointer-events-none opacity-60" : ""}
            />
          ) : (
            <button
              disabled
              className="w-full rounded-lg border border-fg/10 bg-neutral-950/40 px-5 py-3 font-display text-body-sm font-bold text-neutral-600 cursor-not-allowed"
            >
              SOLD OUT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
