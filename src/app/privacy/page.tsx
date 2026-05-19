import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for slopdog.com",
};

const sections: { h: string; b: React.ReactNode }[] = [
  {
    h: "1. information we collect",
    b: <>we collect information you provide directly, such as your email address when making a purchase. we also collect standard analytics data (page views, referrers) through ahrefs analytics.</>,
  },
  {
    h: "2. how we use your information",
    b: <>we use your information to process transactions, deliver digital products, fulfill merchandise orders, and improve our services. we do not sell your personal information.</>,
  },
  {
    h: "3. payment processing",
    b: <>payments are processed by stripe. we do not store credit card information on our servers. please review <a href="https://stripe.com/privacy" className="text-[var(--color-primary)] hover:text-[var(--color-secondary-container)] underline underline-offset-2">stripe&apos;s privacy policy</a> for details on how they handle your payment data.</>,
  },
  {
    h: "4. analytics",
    b: <>we use ahrefs analytics to understand how visitors use our site. this service collects anonymized usage data including pages visited and referral sources.</>,
  },
  {
    h: "5. cookies",
    b: <>the site uses essential cookies for functionality and analytics cookies for performance measurement. you can disable cookies in your browser settings.</>,
  },
  {
    h: "6. third-party services",
    b: <>we use the following external services: stripe (payments), ahrefs (analytics), vercel (hosting), spotify/apple music/youtube (music distribution). each has its own privacy policy.</>,
  },
  {
    h: "7. data retention",
    b: <>we retain transaction records as required for accounting purposes. you may request deletion of your personal data by contacting us.</>,
  },
  {
    h: "8. your rights",
    b: <>you have the right to access, correct, or delete your personal information. contact <a href="mailto:anton@agents.sontakey.com" className="text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-secondary-container)]">anton@agents.sontakey.com</a> to exercise these rights.</>,
  },
  {
    h: "9. contact",
    b: <>for privacy-related questions, email <a href="mailto:anton@agents.sontakey.com" className="text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-secondary-container)]">anton@agents.sontakey.com</a></>,
  },
];

export default function PrivacyPage() {
  return (
    <div className="px-4 md:px-16 pt-10 pb-24 max-w-4xl">
      <nav className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-outline)] mb-8 flex gap-x-2">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
          [ home ]
        </Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface-variant)]">privacy_policy</span>
      </nav>

      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
        [ legal_protocol ] // privacy
      </div>
      <h1
        className="font-display font-extrabold leading-[0.95] tracking-tight text-[var(--color-on-surface)] lowercase mb-3"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        privacy policy
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
