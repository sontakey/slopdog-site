import type { ComponentPropsWithoutRef } from "react";

export default function SlopdogCharacter(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="slop_glow" x1="0" y1="0" x2="220" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ff41" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f5a623" stopOpacity="0.35" />
        </linearGradient>
        <filter id="slop_shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00ff41" floodOpacity="0.25" />
        </filter>
      </defs>

      <rect x="18" y="18" width="184" height="184" rx="22" stroke="url(#slop_glow)" strokeWidth="2" opacity="0.9" />
      <rect x="34" y="34" width="152" height="152" rx="18" stroke="#f5ede4" strokeOpacity="0.08" strokeWidth="2" />

      {/* head */}
      <path
        d="M70 96c0-24 18-44 40-44s40 20 40 44v22c0 24-18 44-40 44s-40-20-40-44V96Z"
        fill="#1a1714"
        stroke="url(#slop_glow)"
        strokeWidth="2"
        filter="url(#slop_shadow)"
      />

      {/* visor */}
      <path
        d="M78 102c10-10 24-16 32-16s22 6 32 16v12c-10 10-24 16-32 16s-22-6-32-16v-12Z"
        fill="#110f0d"
        stroke="#00ff41"
        strokeOpacity="0.65"
        strokeWidth="2"
      />

      {/* eyes */}
      <circle cx="97" cy="112" r="4" fill="#00ff41" />
      <circle cx="123" cy="112" r="4" fill="#00ff41" />

      {/* mouth */}
      <path d="M97 140h26" stroke="#f5ede4" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />

      {/* ears/antennas */}
      <path d="M64 92l-10-8" stroke="#00ff41" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
      <path d="M156 92l10-8" stroke="#00ff41" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />

      {/* collar */}
      <path
        d="M78 160c10 10 20 14 32 14s22-4 32-14"
        stroke="#00ff41"
        strokeOpacity="0.55"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* glitch slashes */}
      <path d="M44 62h26" stroke="#ff2bd6" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M150 168h26" stroke="#4ea1ff" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M56 178h18" stroke="#00ff41" strokeOpacity="0.35" strokeWidth="2" />
    </svg>
  );
}
