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
}: MerchCardProps) {
  const hasSizes = sizes && sizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<string>(hasSizes ? "" : "ONE_SIZE");

  const canBuy = available && (!hasSizes || selectedSize !== "");

  return (
    <div className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/20 hover:shadow-glow flex flex-col">
      {/* Image */}
      <div className="scanlines relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width:1024px) 100vw, 25vw"
        />
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="font-mono text-xs text-zinc-500">SOLD_OUT</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex-1 flex flex-col">
        <div className="text-sm font-bold leading-tight text-white group-hover:text-primary transition-colors">
          {title}
        </div>
        <div className="mt-1 font-mono text-xs text-zinc-400">
          {currency} {price.toFixed(2)}
        </div>
        {trackTag && (
          <div className="mt-1.5 font-mono text-[10px] text-primary">TAG: {trackTag}</div>
        )}

        {/* Size selector */}
        {hasSizes && available && (
          <div className="mt-3">
            <div className="mb-1.5 font-mono text-[10px] text-zinc-500">SELECT SIZE</div>
            <div className="flex flex-wrap gap-1.5">
              {sizes!.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`rounded-md border px-2.5 py-1 text-[10px] font-mono font-bold transition ${
                    selectedSize === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-zinc-200"
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
              className="w-full rounded-lg border border-white/10 bg-black/40 px-5 py-3 text-sm font-bold text-zinc-600 cursor-not-allowed"
            >
              SOLD OUT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
