"use client";

import { useState } from "react";

interface BuyButtonProps {
  product: string;
  label?: string;
  size?: string;
  trackSlug?: string;
  fullWidth?: boolean;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}

export default function BuyButton({
  product,
  label = "BUY NOW",
  size,
  trackSlug,
  fullWidth = false,
  variant = "primary",
  className = "",
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, size, trackSlug }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const baseClass = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-display text-body-sm font-bold transition-all duration-normal ease-out-quart focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? "w-full" : ""}`;

  const variantClass =
    variant === "primary"
      ? "bg-primary text-neutral-950 hover:opacity-90 active:scale-[0.98]"
      : variant === "outline"
        ? "border border-primary/40 text-primary hover:bg-primary/10"
        : "border border-fg/10 text-neutral-300 hover:border-primary/30 hover:text-primary";

  return (
    <div className={fullWidth ? "w-full" : "inline-block"}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${baseClass} ${variantClass} ${className}`}
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            REDIRECTING...
          </>
        ) : (
          label
        )}
      </button>
      {error && (
        <p className="mt-2 text-label text-red-400">{error}</p>
      )}
    </div>
  );
}
