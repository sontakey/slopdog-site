import type { Config } from "tailwindcss";

// Tailwind v4 — most config lives in @theme in globals.css.
// This file exists for tooling/lint compatibility and content scanning.
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
} satisfies Config;
