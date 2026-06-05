"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface ViewToggleProps {
  humanContent: ReactNode;
  markdownSource: string;
}

export default function ViewToggle({ humanContent, markdownSource }: ViewToggleProps) {
  const [mode, setMode] = useState<"human" | "ai">("human");

  return (
    <div>
      <div className="mb-6 flex items-center gap-0 border-b border-[var(--color-outline-variant)] pb-3">
        <span className="mr-auto font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)]">view_mode:</span>
        <button
          onClick={() => setMode("human")}
          className={`font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border-t border-b border-l transition-colors ${
            mode === "human"
              ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[color-mix(in_oklch,var(--color-primary)_8%,transparent)]"
              : "border-[var(--color-outline-variant)] text-[var(--color-outline)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]"
          }`}
        >
          [ human ]
        </button>
        <button
          onClick={() => setMode("ai")}
          className={`font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border transition-colors ${
            mode === "ai"
              ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[color-mix(in_oklch,var(--color-primary)_8%,transparent)]"
              : "border-[var(--color-outline-variant)] text-[var(--color-outline)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]"
          }`}
        >
          [ ai/md ]
        </button>
      </div>

      {mode === "human" ? (
        humanContent
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">{"// markdown_source"}</span>
            <button
              onClick={() => navigator.clipboard.writeText(markdownSource)}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors"
            >
              [ copy ]
            </button>
          </div>
          <pre className="max-h-[80vh] overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            {markdownSource}
          </pre>
        </div>
      )}
    </div>
  );
}
