import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import BuyButton from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "Slopdog Stem Pack Vol. 1",
  description:
    "All 3 Slopdog tracks as stems — vocals, instrumentals, acapella. Remix, sample, go wild. License included. $9.99.",
  alternates: { canonical: "/products/stem-pack" },
  openGraph: {
    title: "Slopdog Stem Pack Vol. 1 | SLOPDOG",
    description: "All 3 Slopdog tracks as stems. $9.99. Remix, sample, go wild.",
    url: "/products/stem-pack",
    images: [SITE.ogImage],
  },
};

const TRACKS = [
  { slug: "gaslight-gpt", title: "Gaslight GPT", cover: "/images/music/gaslight-gpt-cover.png" },
  { slug: "brain-fry", title: "Brain Fry", cover: "/images/music/brain-fry-cover.png" },
  { slug: "token-tithe", title: "Token Tithe", cover: "/images/music/token-tithe-cover.png" },
];

const STEM_TYPES = [
  "vocals (clean)",
  "vocals (ad-libs)",
  "instrumental (full)",
  "instrumental (no bass)",
  "acapella",
  "beat stems (per layer)",
];

const LICENSE = [
  "personal and commercial use permitted",
  "credit preferred: \"stems by slopdog (slopdog.com)\"",
  "no resale of the stems themselves",
  "full license pdf included in download",
];

const FEATURES = [
  "3 tracks × 6 stem types = 18 files",
  "wav + mp3 formats",
  "license pdf included",
  "instant download after payment",
];

export default function StemPackPage() {
  return (
    <div className="px-4 md:px-16 pt-10 pb-24">
      <nav className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] mb-8 flex gap-x-2">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
          [ home ]
        </Link>
        <span>/</span>
        <Link href="/merch" className="hover:text-[var(--color-primary)] transition-colors">
          merch
        </Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface-variant)]">stem_pack_v1</span>
      </nav>

      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
        [ digital_drop ] // stem_pack_volume_01
      </div>
      <h1
        className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--color-on-surface)] lowercase mb-6"
        style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
      >
        slopdog stem pack vol. 1
      </h1>
      <p className="text-[18px] leading-relaxed text-[var(--color-on-surface-variant)] max-w-2xl mb-12">
        all 3 slopdog tracks as stems. vocals, instrumentals, acapella. remix, sample, go wild. license included.
      </p>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: product details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Track list */}
          <section
            className="border border-[var(--color-outline-variant)] p-6"
            style={{ background: "var(--color-surface-container-lowest)" }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
              [ included_tracks ] // 003
            </div>
            <ul className="divide-y divide-[var(--color-outline-variant)]">
              {TRACKS.map((t, i) => (
                <li key={t.slug} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="font-mono text-[11px] text-[var(--color-outline)] w-6 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-[var(--color-outline-variant)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.cover} alt={t.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm font-extrabold lowercase text-[var(--color-on-surface)] truncate">
                      {t.title.toLowerCase()}
                    </div>
                    <Link
                      href={`/music/${t.slug}`}
                      className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      → listen
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Stem types */}
          <section
            className="border border-[var(--color-outline-variant)] p-6"
            style={{ background: "var(--color-surface-container-lowest)" }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
              [ stem_types ] // per_track
            </div>
            <ul className="space-y-2">
              {STEM_TYPES.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-[14px] text-[var(--color-on-surface-variant)]"
                >
                  <span className="font-mono text-[var(--color-primary)]">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* License */}
          <section
            className="border border-[var(--color-outline-variant)] p-6"
            style={{ background: "var(--color-surface-container-lowest)" }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
              [ license_protocol ]
            </div>
            <ul className="space-y-2">
              {LICENSE.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-[14px] text-[var(--color-on-surface-variant)]"
                >
                  <span className="font-mono text-[var(--color-primary)] mt-0.5">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right: purchase card */}
        <aside className="lg:col-span-2">
          <div
            className="lg:sticky lg:top-6 border border-[var(--color-primary)] p-6"
            style={{ background: "var(--color-surface-container-lowest)" }}
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-2">
              [ stem_pack_vol_1 ]
            </div>
            <div className="font-display text-5xl font-extrabold text-[var(--color-on-surface)] tabular-nums">
              $9.99
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-outline)]">
              one-time // instant_download
            </div>

            <ul className="mt-5 space-y-2">
              {FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-[13px] text-[var(--color-on-surface-variant)]"
                >
                  <span className="font-mono text-[var(--color-secondary-container)] mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <BuyButton
                product="stem-pack-vol-1"
                label="buy_stems → $9.99"
                fullWidth
              />
            </div>

            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)]">
              secure_checkout // stripe // no_account
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
