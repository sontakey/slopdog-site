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
        bg: "#050a06",
        cyber: {
          gray: "#111111",
          card: "#0f0f0f",
        },
        accent: {
          amber: "#f5a623",
          magenta: "#ff2bd6",
          blue: "#4ea1ff",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-lg": ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.0", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["clamp(1.25rem, 2.5vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" }],
        "body-lg": ["clamp(1.05rem, 1.2vw, 1.2rem)", { lineHeight: "1.7" }],
        "body-base": ["clamp(0.925rem, 1vw, 1rem)", { lineHeight: "1.7" }],
        "body-sm": ["clamp(0.8rem, 0.9vw, 0.875rem)", { lineHeight: "1.6" }],
        "label": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" }],
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
