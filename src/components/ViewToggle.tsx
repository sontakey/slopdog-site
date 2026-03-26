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
      <div className="mb-6 flex items-center gap-3 border-b border-fg/10 pb-3">
        <span className="mr-auto text-xs font-semibold tracking-wide text-fg-faint">VIEW MODE:</span>
        <button
          onClick={() => setMode("human")}
          className={`rounded px-3 py-1 text-xs font-semibold tracking-wide transition-colors ${
            mode === "human" ? "bg-primary text-neutral-950" : "text-fg-muted hover:text-fg"
          }`}
        >
          👤 HUMAN
        </button>
        <button
          onClick={() => setMode("ai")}
          className={`rounded px-3 py-1 text-xs font-semibold tracking-wide transition-colors ${
            mode === "ai" ? "bg-primary text-neutral-950" : "text-fg-muted hover:text-fg"
          }`}
        >
          🤖 AI / MD
        </button>
      </div>

      {mode === "human" ? (
        humanContent
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-primary">MARKDOWN SOURCE</span>
            <button
              onClick={() => navigator.clipboard.writeText(markdownSource)}
              className="text-xs font-semibold text-fg-faint transition-colors hover:text-primary"
            >
              📋 COPY
            </button>
          </div>
          <pre className="max-h-[80vh] overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-neutral-300">
            {markdownSource}
          </pre>
        </div>
      )}
    </div>
  );
}
