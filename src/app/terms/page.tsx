import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for slopdog.com",
};

const sections: { h: string; b: React.ReactNode }[] = [
  {
    h: "1. acceptance of terms",
    b: <>by accessing and using slopdog.com (&ldquo;the site&rdquo;), you agree to be bound by these terms of service. if you do not agree, please do not use the site.</>,
  },
  {
    h: "2. description of service",
    b: <>slopdog is an ai music artist project by sontakey records. the site provides access to music, merchandise, beat licensing, and related services.</>,
  },
  {
    h: "3. music and content",
    b: <>all music, lyrics, artwork, and content on this site are the property of sontakey records and sameer sontakey. all music features human-written lyrics with ai-assisted production and creative direction by sameer sontakey.</>,
  },
  {
    h: "4. beat licensing",
    b: <>beat licenses purchased through the site grant specific usage rights as described at the time of purchase. license terms vary by tier (basic, premium, exclusive, commercial). all sales are final.</>,
  },
  {
    h: "5. merchandise",
    b: <>merchandise is sold as-is. we aim to fulfill orders promptly. refunds and exchanges are handled on a case-by-case basis. contact anton@agents.sontakey.com for support.</>,
  },
  {
    h: "6. intellectual property",
    b: <>the slopdog name, character design, and associated branding are trademarks of sontakey records. unauthorized use is prohibited.</>,
  },
  {
    h: "7. limitation of liability",
    b: <>the site and its content are provided &ldquo;as is&rdquo; without warranties of any kind. sontakey records shall not be liable for any damages arising from your use of the site.</>,
  },
  {
    h: "8. changes to terms",
    b: <>we reserve the right to modify these terms at any time. continued use of the site constitutes acceptance of updated terms.</>,
  },
  {
    h: "9. contact",
    b: <>questions about these terms? email anton@agents.sontakey.com</>,
  },
];

export default function TermsPage() {
  return (
    <div className="px-4 md:px-16 pt-10 pb-24 max-w-4xl">
      <nav className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] mb-8 flex gap-x-2">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
          [ home ]
        </Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface-variant)]">terms_of_service</span>
      </nav>

      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
        [ legal_protocol ] // terms
      </div>
      <h1
        className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--color-on-surface)] lowercase mb-3"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        terms of service
      </h1>
      <p className="font-mono text-[12px] uppercase tracking-wider text-[var(--color-outline)] mb-12">
        effective: march 22, 2026
      </p>

      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-xl md:text-2xl font-extrabold lowercase text-[var(--color-on-surface)] mb-2">
              {s.h}
            </h2>
            <p className="text-[15px] leading-relaxed text-[var(--color-on-surface-variant)]">
              {s.b}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
