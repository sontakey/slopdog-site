import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Slopdog order is confirmed.",
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ product?: string; digital?: string; track?: string; session_id?: string }>;
}

const DIGITAL_PRODUCTS: Record<string, { title: string; description: string; downloads: { label: string; url: string }[] }> = {
  "stem-pack-vol-1": {
    title: "Slopdog Stem Pack Vol. 1",
    description: "Your stems are ready. Download below. License included — remix, sample, go wild.",
    downloads: [
      { label: "Gaslight GPT — Stems (ZIP)", url: "#placeholder-gaslight-stems" },
      { label: "Brain Fry — Stems (ZIP)", url: "#placeholder-brainfry-stems" },
      { label: "Token Tithe — Stems (ZIP)", url: "#placeholder-tokenTithe-stems" },
      { label: "License Agreement (PDF)", url: "#placeholder-license" },
    ],
  },
  "beat-license-basic": {
    title: "Beat License (Basic)",
    description: "Your basic license is confirmed. You may use Slopdog beats in personal, non-commercial projects.",
    downloads: [
      { label: "License Agreement — Basic (PDF)", url: "#placeholder-basic-license" },
    ],
  },
  "beat-license-commercial": {
    title: "Beat License (Commercial)",
    description: "Your commercial license is confirmed. You may use Slopdog beats in monetized and commercial projects.",
    downloads: [
      { label: "License Agreement — Commercial (PDF)", url: "#placeholder-commercial-license" },
    ],
  },
};

const LICENSE_TERMS: Record<string, { basic?: string[]; commercial?: string[] }> = {
  "beat-license-basic": {
    basic: [
      "Valid for personal, non-commercial projects only",
      "Credit required: 'Beat by SLOPDOG (slopdog.com)'",
      "No resale or sublicensing",
      "Unlimited streaming plays on personal/fan channels",
      "No sync licensing without separate agreement",
    ],
  },
  "beat-license-commercial": {
    commercial: [
      "Valid for monetized, commercial, and broadcast use",
      "Credit preferred but not required: 'Beat by SLOPDOG'",
      "Unlimited sales / streams / downloads",
      "Sync licensing for film, TV, ads — contact us for broadcast",
      "No resale or sublicensing of the beat itself",
      "One artist / one project per license",
    ],
  },
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sp = await searchParams;
  const product = sp.product ?? "";
  const isDigital = sp.digital === "1" || product in DIGITAL_PRODUCTS;
  const trackSlug = sp.track ?? "";

  const digitalProduct = DIGITAL_PRODUCTS[product];
  const licenseTerms = LICENSE_TERMS[product];

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
          <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 font-mono text-3xl font-bold tracking-tight text-white">
          ORDER_CONFIRMED
        </h1>
        <p className="mt-3 text-zinc-400">
          {isDigital
            ? "Payment received. Your digital goods are below."
            : "Thanks for your order! We'll email you shipping details once it ships."}
        </p>
      </div>

      {/* Digital download section */}
      {isDigital && digitalProduct && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <div className="mb-1 font-mono text-xs text-primary">DIGITAL_DOWNLOAD</div>
          <h2 className="text-lg font-bold text-white">{digitalProduct.title}</h2>
          <p className="mt-2 text-sm text-zinc-400">{digitalProduct.description}</p>
          <div className="mt-5 space-y-2">
            {digitalProduct.downloads.map((d) => (
              <a
                key={d.url}
                href={d.url}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-200 transition hover:border-primary/40 hover:text-primary"
              >
                <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {d.label}
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Download links expire in 48 hours. Having trouble?{" "}
            <a href="mailto:slopdog@sontakey.com" className="text-primary hover:underline">Email us</a>.
          </p>
        </div>
      )}

      {/* License terms */}
      {licenseTerms && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-1 font-mono text-xs text-primary">LICENSE_TERMS</div>
          <ul className="mt-3 space-y-2">
            {(licenseTerms.basic ?? licenseTerms.commercial ?? []).map((term) => (
              <li key={term} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="mt-0.5 text-primary">›</span>
                {term}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            Questions about licensing?{" "}
            <a href="mailto:slopdog@sontakey.com" className="text-primary hover:underline">Contact us</a>.
          </p>
        </div>
      )}

      {/* Merch order message */}
      {!isDigital && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-1 font-mono text-xs text-primary">WHAT_HAPPENS_NEXT</div>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">›</span>
              We'll email you a confirmation with your order details.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">›</span>
              Your item is print-on-demand and will ship within 5–7 business days.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">›</span>
              Tracking will be sent once your order ships.
            </li>
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            Issues with your order?{" "}
            <a href="mailto:slopdog@sontakey.com" className="text-primary hover:underline">Email us</a>.
          </p>
        </div>
      )}

      {/* Nav links */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {trackSlug ? (
          <Link
            href={`/music/${trackSlug}`}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-primary/40 hover:text-primary"
          >
            ← BACK TO TRACK
          </Link>
        ) : (
          <Link
            href="/merch"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-primary/40 hover:text-primary"
          >
            ← BACK TO MERCH
          </Link>
        )}
        <Link
          href="/music"
          className="flex-1 rounded-lg border border-primary/30 bg-primary/10 px-5 py-3 text-center text-sm font-bold text-primary transition hover:bg-primary/20"
        >
          LISTEN TO THE MUSIC
        </Link>
      </div>
    </div>
  );
}
