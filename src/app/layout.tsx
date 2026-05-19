import type { Metadata } from "next";
import Script from "next/script";
import { Syne, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SITE } from "@/lib/site";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: "%s | SLOPDOG",
  },
  description: SITE.description,
  keywords: SITE.keywords as unknown as string[],
  metadataBase: new URL(SITE.url),
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    images: [
      { url: SITE.ogImage, width: 1200, height: 1200, alt: "SLOPDOG album art" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-F9XN2CW6K9" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-F9XN2CW6K9');`}
        </Script>
      </head>
      <body
        className={`${syne.variable} ${inter.variable} ${spaceMono.variable} antialiased min-h-dvh flex flex-col scanlines`}
        style={{ background: "var(--color-bg)", color: "var(--color-fg)" }}
      >
        <Header />
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="EPsCfTpxNk01hmvRT2xvUw"
          strategy="afterInteractive"
        />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
