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

const STEM_TYPES = ["Vocals (clean)", "Vocals (ad-libs)", "Instrumental (full)", "Instrumental (no bass)", "Acapella", "Beat stems (per layer)"];

export default function StemPackPage() {
  return (
    <div className="max-w-5xl px-5 py-12 sm:px-6 lg:pl-16">
      {/* Header */}
      <div className="mb-2 text-label uppercase text-primary">DIGITAL PRODUCT</div>
      <h1 className="font-display text-display-lg text-fg">
        SLOPDOG STEM PACK VOL. 1
      </h1>
      <p className="mt-4 max-w-xl text-fg-muted">
        All 3 Slopdog tracks as stems — vocals, instrumentals, acapella. Remix, sample, go wild. License included.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        {/* Left: product details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Track list */}
          <div className="rounded-2xl border border-fg/10 bg-fg/5 p-6">
            <div className="mb-4 text-label uppercase text-primary">INCLUDED TRACKS</div>
            <div className="space-y-3">
              {TRACKS.map((t) => (
                <div key={t.slug} className="flex items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-fg/10 bg-neutral-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.cover} alt={t.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-fg">{t.title}</div>
                    <Link href={`/music/${t.slug}`} className="text-xs text-fg-faint hover:text-primary">
                      Listen →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stem types */}
          <div className="rounded-2xl border border-fg/10 bg-fg/5 p-6">
            <div className="mb-4 text-label uppercase text-primary">STEM TYPES PER TRACK</div>
            <ul className="space-y-2">
              {STEM_TYPES.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-neutral-300">
                  <span className="text-primary">›</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* License */}
          <div className="rounded-2xl border border-fg/10 bg-fg/5 p-6">
            <div className="mb-4 text-label uppercase text-primary">LICENSE</div>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-primary">›</span>Personal and commercial use permitted</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-primary">›</span>Credit preferred: &quot;Stems by SLOPDOG (slopdog.com)&quot;</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-primary">›</span>No resale of the stems themselves</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-primary">›</span>Full license PDF included in download</li>
            </ul>
          </div>
        </div>

        {/* Right: purchase card */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 rounded-2xl border border-primary/20 bg-neutral-950/60 p-6 shadow-glow">
            <div className="text-label uppercase text-primary">STEM PACK VOL. 1</div>
            <div className="mt-3 font-display text-display-lg text-fg">$9.99</div>
            <div className="mt-1 text-xs text-fg-faint">One-time payment · Instant download</div>

            <div className="mt-5 space-y-2 text-xs text-fg-muted">
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> 3 tracks × 6 stem types = 18 files
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> WAV + MP3 formats
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> License PDF included
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">✓</span> Instant download after payment
              </div>
            </div>

            <div className="mt-6">
              <BuyButton product="stem-pack-vol-1" label="BUY STEM PACK — $9.99" fullWidth />
            </div>

            <p className="mt-4 text-center text-xs text-neutral-600">
              Secure checkout via Stripe. No account needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
