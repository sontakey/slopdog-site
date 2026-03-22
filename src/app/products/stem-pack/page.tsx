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
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-2 font-mono text-xs text-primary">DIGITAL_PRODUCT</div>
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        SLOPDOG STEM PACK VOL. 1
      </h1>
      <p className="mt-4 max-w-xl text-zinc-400">
        All 3 Slopdog tracks as stems — vocals, instrumentals, acapella. Remix, sample, go wild. License included.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        {/* Left: product details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Track list */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 font-mono text-xs text-primary">INCLUDED_TRACKS</div>
            <div className="space-y-3">
              {TRACKS.map((t) => (
                <div key={t.slug} className="flex items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.cover} alt={t.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.title}</div>
                    <Link href={`/music/${t.slug}`} className="text-xs text-zinc-500 hover:text-primary">
                      Listen →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stem types */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 font-mono text-xs text-primary">STEM_TYPES_PER_TRACK</div>
            <ul className="space-y-2">
              {STEM_TYPES.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="text-primary">›</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* License */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 font-mono text-xs text-primary">LICENSE</div>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-start gap-2"><span className="mt-0.5 text-primary">›</span>Personal and commercial use permitted</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-primary">›</span>Credit preferred: "Stems by SLOPDOG (slopdog.com)"</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-primary">›</span>No resale of the stems themselves</li>
              <li className="flex items-start gap-2"><span className="mt-0.5 text-primary">›</span>Full license PDF included in download</li>
            </ul>
          </div>
        </div>

        {/* Right: purchase card */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 rounded-2xl border border-primary/20 bg-black/60 p-6 shadow-glow">
            <div className="font-mono text-xs text-primary">STEM_PACK_VOL_1</div>
            <div className="mt-3 text-4xl font-bold text-white">$9.99</div>
            <div className="mt-1 text-xs text-zinc-500">One-time payment · Instant download</div>

            <div className="mt-5 space-y-2 text-xs text-zinc-400">
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

            <p className="mt-4 text-center text-xs text-zinc-600">
              Secure checkout via Stripe. No account needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
