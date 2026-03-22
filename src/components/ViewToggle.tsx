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
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5">
        <span className="mr-auto text-xs font-mono text-zinc-500">VIEW_MODE:</span>
        <button
          onClick={() => setMode("human")}
          className={`rounded px-3 py-1 text-xs font-mono transition-colors ${
            mode === "human" ? "bg-primary font-bold text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          👤 HUMAN
        </button>
        <button
          onClick={() => setMode("ai")}
          className={`rounded px-3 py-1 text-xs font-mono transition-colors ${
            mode === "ai" ? "bg-primary font-bold text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          🤖 AI / MD
        </button>
      </div>

      {mode === "human" ? (
        humanContent
      ) : (
        <div className="rounded-xl border border-white/10 bg-black/50 p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-mono text-primary">MARKDOWN_SOURCE</span>
            <button
              onClick={() => navigator.clipboard.writeText(markdownSource)}
              className="text-xs font-mono text-zinc-500 transition-colors hover:text-primary"
            >
              📋 COPY
            </button>
          </div>
          <pre className="max-h-[80vh] overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-300">
            {markdownSource}
          </pre>
        </div>
      )}
    </div>
  );
}
