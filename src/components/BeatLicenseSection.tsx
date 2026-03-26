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
      "Personal & non-commercial use",
      "Unlimited streaming on personal channels",
      "Credit required",
      "No sync licensing",
    ],
  },
  {
    id: "beat-license-commercial",
    tier: "COMMERCIAL",
    price: "$49.99",
    features: [
      "Full commercial use",
      "Unlimited sales & streams",
      "Sync for film, TV, ads",
      "Credit optional",
    ],
    featured: true,
  },
];

export default function BeatLicenseSection({ trackSlug, trackTitle }: BeatLicenseSectionProps) {
  return (
    <div className="mt-8">
      <div className="mb-1 text-xs font-semibold tracking-wide text-primary">LICENSE THIS BEAT</div>
      <p className="mt-1 text-sm text-zinc-400">
        Use{" "}
        <span className="font-bold text-white">{trackTitle}</span> in your own projects. Choose a license:
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {LICENSES.map((lic) => (
          <div
            key={lic.id}
            className={`rounded-xl border p-5 ${
              lic.featured
                ? "border-primary/40 bg-primary/5"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div
              className={`text-xs font-bold tracking-wide ${lic.featured ? "text-primary" : "text-zinc-400"}`}
            >
              {lic.tier}
            </div>
            <div className="mt-2 text-2xl font-bold text-white">{lic.price}</div>
            <ul className="mt-3 space-y-1.5">
              {lic.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                  <span className={`mt-0.5 ${lic.featured ? "text-primary" : "text-zinc-500"}`}>›</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <BuyButton
                product={lic.id}
                trackSlug={trackSlug}
                label={`BUY ${lic.tier} — ${lic.price}`}
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
