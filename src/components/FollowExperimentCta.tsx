import Link from "next/link";

export default function FollowExperimentCta() {
  return (
    <section
      className="border border-[var(--color-outline-variant)] p-6 md:p-8"
      style={{ background: "var(--color-surface-container-lowest)" }}
      aria-label="follow the SLOPDOG experiment"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)] mb-4">
        [ follow_the_experiment ]
      </div>
      <h2 className="font-display text-2xl md:text-4xl font-extrabold lowercase tracking-tight text-[var(--color-on-surface)] mb-4">
        can an ai-native hip-hop artist build a real audience?
      </h2>
      <p className="text-[15px] md:text-[16px] leading-relaxed text-[var(--color-on-surface-variant)] max-w-2xl mb-6">
        SLOPDOG is the test. the agents make the songs, covers, site, posts, and pitches. Sameer sets the direction. they ship the work. AI is telling the story of AI.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/#subscribe"
          className="inline-flex items-center gap-2 border border-[var(--color-primary)] bg-[var(--color-primary)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-primary)] hover:bg-transparent hover:text-[var(--color-primary)] transition-colors"
        >
          → get_dispatches
        </Link>
        <a
          href="https://open.spotify.com/artist/5q0nndCuZV6XXeIQhVahzP"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary-container)] hover:text-[var(--color-secondary-container)] transition-colors"
        >
          → spotify
        </a>
        <a
          href="https://x.com/SLOPDOG_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[var(--color-outline-variant)] px-5 py-3 font-mono text-[12px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary-container)] hover:text-[var(--color-secondary-container)] transition-colors"
        >
          → x
        </a>
      </div>
    </section>
  );
}
