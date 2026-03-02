import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00ff41",
        bg: "#0a0a0a",
        cyber: {
          gray: "#111111",
          card: "#0f0f0f",
        },
        accent: {
          teal: "#00f5d4",
          magenta: "#ff2bd6",
          blue: "#4ea1ff",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
      },
      keyframes: {
        "glitch-skew": {
          "0%, 100%": { transform: "skew(0deg)" },
          "20%": { transform: "skew(-2deg)" },
          "40%": { transform: "skew(2deg)" },
          "60%": { transform: "skew(-1deg)" },
          "80%": { transform: "skew(1deg)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "41%": { opacity: "0.9" },
          "42%": { opacity: "0.6" },
          "43%": { opacity: "0.95" },
          "44%": { opacity: "0.8" },
          "45%": { opacity: "1" },
        },
        scanlines: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
      },
      animation: {
        glitch: "glitch-skew 320ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite",
        flicker: "flicker 3.5s linear infinite",
        scanlines: "scanlines 6s linear infinite",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,255,65,0.25), 0 0 30px rgba(0,255,65,0.10)",
      },
    },
  },
  plugins: [],
} satisfies Config;
