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
        "inline-flex items-center rounded-md px-3 py-2 text-label font-semibold uppercase transition-colors duration-normal ease-out-quart " +
        (active
          ? "text-primary bg-primary/10 border border-primary/25"
          : "text-neutral-300 hover:text-primary border border-transparent hover:border-primary/20")
      }
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-fg/10 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="font-display text-xl font-extrabold tracking-tight">
            <span className="text-primary">SLOP</span>DOG
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {NAV.map((n) => (
            <NavLink key={n.href} href={n.href} label={n.label} />
          ))}
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md border border-fg/10 bg-fg/5 px-3 py-2 font-display text-label text-neutral-200 hover:border-primary/20 hover:text-primary"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          MENU
        </button>
      </div>

      {open ? (
        <div className="md:hidden border-t border-fg/10 bg-bg/95">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md border border-fg/10 bg-fg/5 px-3 py-3 text-label uppercase text-neutral-200 hover:border-primary/20 hover:text-primary"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
