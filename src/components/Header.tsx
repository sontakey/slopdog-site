"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/music", label: "music", code: "01" },
  { href: "/lore", label: "lore", code: "02" },
  { href: "/about", label: "about", code: "04" },
] as const;

function NavLink({
  href,
  label,
  code,
  onNavigate,
  mobile = false,
}: {
  href: string;
  label: string;
  code: string;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const pathname = usePathname() ?? "/";
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={
        "group inline-flex items-center gap-2 font-mono text-[13px] tracking-wider transition-colors " +
        (mobile ? "py-3 border-b border-[var(--color-outline-variant)] " : "px-1 ") +
        (active
          ? "text-[var(--color-secondary-container)]"
          : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]")
      }
    >
      <span className="text-[var(--color-outline)] group-hover:text-[var(--color-primary)] transition-colors">
        [{code}]
      </span>
      <span className="lowercase">{label}</span>
      {active ? <span className="text-[var(--color-primary)]">_</span> : null}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}Z`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-outline-variant)] backdrop-blur-md"
      style={{ background: "color-mix(in oklch, var(--color-bg) 88%, transparent)" }}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-6 px-4 md:px-16">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-display text-xl font-extrabold tracking-tight text-[var(--color-on-surface)]">
            SLOPDOG_OS
          </span>
          <span className="font-mono text-[11px] text-[var(--color-outline)] hidden sm:inline">
            v2.4.1
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((n) => (
            <NavLink key={n.href} {...n} />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 font-mono text-[11px] text-[var(--color-outline)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-secondary-container)] animate-pulse" />
            online
          </span>
          <span suppressHydrationWarning>{time}</span>
        </div>

        <button
          className="md:hidden inline-flex items-center gap-2 border border-[var(--color-outline-variant)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? "[ close ]" : "[ menu ]"}
        </button>
      </div>

      {open ? (
        <div className="md:hidden border-t border-[var(--color-outline-variant)]"
          style={{ background: "var(--color-surface-container-lowest)" }}
        >
          <div className="px-4 py-2 flex flex-col">
            {NAV.map((n) => (
              <NavLink key={n.href} {...n} mobile onNavigate={() => setOpen(false)} />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
