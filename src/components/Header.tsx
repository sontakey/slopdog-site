"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const NAV = [
  { href: "/music", label: "MUSIC" },
  { href: "/blog", label: "BLOG" },
  { href: "/merch", label: "MERCH" },
  { href: "/about", label: "ABOUT" },
] as const;

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = useMemo(() => pathname === href || pathname?.startsWith(href + "/"), [pathname, href]);

  return (
    <Link
      href={href}
      className={
        "group inline-flex items-center rounded-md px-3 py-2 text-label font-semibold uppercase transition " +
        (active
          ? "text-primary bg-primary/10 border border-primary/25 shadow-glow"
          : "text-zinc-300 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20")
      }
    >
      <span className="glitch" data-text={`/${label}`}>
        /{label}
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary shadow-glow">
            <span className="text-sm font-bold">&gt;_</span>
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            <span className="glitch" data-text="SLOPDOG">
              SLOPDOG
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {NAV.map((n) => (
            <NavLink key={n.href} href={n.href} label={n.label} />
          ))}
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 py-2 font-display text-label text-zinc-200 hover:border-primary/20 hover:text-primary"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          MENU
        </button>
      </div>

      {open ? (
        <div className="md:hidden border-t border-white/10 bg-bg/95">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-3 text-label uppercase text-zinc-200 hover:border-primary/20 hover:text-primary"
              >
                /{n.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
