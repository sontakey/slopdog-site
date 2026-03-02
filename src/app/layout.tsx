import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SLOPDOG",
    template: "%s | SLOPDOG",
  },
  description: "SLOPDOG is an AI music artist dropping weekly tracks based on the week's AI news.",
  metadataBase: new URL("https://slopdog.com"),
  openGraph: {
    title: "SLOPDOG",
    description: "Underground AI music. Weekly drops. Glitch aesthetics.",
    url: "https://slopdog.com",
    siteName: "SLOPDOG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} antialiased bg-bg text-white min-h-dvh flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
