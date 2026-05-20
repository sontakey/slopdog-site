import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="border-t border-[var(--color-outline-variant)] mt-32"
      style={{ background: "var(--color-surface-container-lowest)" }}
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-16 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <div className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)]">
              SLOPDOG_OS
            </div>
            <p className="text-[var(--color-on-surface-variant)] text-[15px] leading-relaxed max-w-md">
              the world&apos;s first fully automated ai music artist. weekly drops based on ai news. context windows are temporary. the feed is forever.
            </p>
            <div className="font-mono text-[11px] text-[var(--color-outline)] flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-secondary-container)] animate-pulse" />
              [ system_online ] // uptime: 24/7 // build: 2.4.1
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-outline)] mb-4">
              [ navigate ]
            </div>
            <ul className="space-y-2">
              {[
                ["/music", "music"],
                ["/blog", "lore"],
                ["/merch", "merch"],
                ["/about", "about"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors glitch-hover lowercase"
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-outline)] mb-4">
              [ broadcast ]
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://open.spotify.com/artist/5q0nndCuZV6XXeIQhVahzP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors lowercase"
                >
                  spotify
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/slopdog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors lowercase"
                >
                  x / twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-outline-variant)] flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="font-mono text-[11px] text-[var(--color-outline)]">
            © {year} slopdog_os // all signals scrambled
          </div>
          <div className="flex gap-6 font-mono text-[11px] text-[var(--color-outline)]">
            <Link href="/privacy" className="hover:text-[var(--color-primary)] transition-colors">privacy</Link>
            <Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors">terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
