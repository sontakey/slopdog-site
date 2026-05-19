"use client";

import BuyButton from "./BuyButton";

interface BeatLicenseSectionProps {
  trackSlug: string;
  trackTitle: string;
}

const LICENSES = [
  {
    id: "beat-license-basic",
    tier: "BASIC",
    price: "$19.99",
    features: [
      "personal & non-commercial use",
      "unlimited streaming on personal channels",
      "credit required",
      "no sync licensing",
    ],
  },
  {
    id: "beat-license-commercial",
    tier: "COMMERCIAL",
    price: "$49.99",
    features: [
      "full commercial use",
      "unlimited sales & streams",
      "sync for film, tv, ads",
      "credit optional",
    ],
    featured: true,
  },
];

export default function BeatLicenseSection({ trackSlug, trackTitle }: BeatLicenseSectionProps) {
  return (
    <div className="mt-10 border border-[var(--color-outline-variant)] p-5"
      style={{ background: "var(--color-surface-container-lowest)" }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-2">
        [ license_protocol ] // beat_for_sale
      </div>
      <p className="text-[13px] text-[var(--color-on-surface-variant)] mb-5">
        use <span className="text-[var(--color-on-surface)] font-semibold">{trackTitle.toLowerCase()}</span> in your own projects. pick a tier:
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {LICENSES.map((lic) => (
          <div
            key={lic.id}
            className={`border p-4 ${
              lic.featured
                ? "border-[var(--color-primary)]"
                : "border-[var(--color-outline-variant)]"
            }`}
            style={{
              background: lic.featured
                ? "color-mix(in oklch, var(--color-primary) 8%, transparent)"
                : "var(--color-bg)",
            }}
          >
            <div className={`font-mono text-[11px] uppercase tracking-[0.2em] ${lic.featured ? "text-[var(--color-primary)]" : "text-[var(--color-outline)]"}`}>
              [ tier_{lic.tier.toLowerCase()} ]
            </div>
            <div className="mt-2 font-display text-2xl font-extrabold text-[var(--color-on-surface)] tabular-nums">
              {lic.price}
            </div>
            <ul className="mt-3 space-y-1.5">
              {lic.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-[12px] text-[var(--color-on-surface-variant)]"
                >
                  <span
                    className={`mt-0.5 font-mono ${lic.featured ? "text-[var(--color-primary)]" : "text-[var(--color-outline)]"}`}
                  >
                    →
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <BuyButton
                product={lic.id}
                trackSlug={trackSlug}
                label={`buy_${lic.tier.toLowerCase()} → ${lic.price}`}
                fullWidth
                variant={lic.featured ? "primary" : "outline"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
