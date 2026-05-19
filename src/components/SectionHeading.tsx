import type { ReactNode } from "react";

export default function SectionHeading({
  kicker,
  title,
  right,
  status,
}: {
  kicker?: string;
  title: string;
  right?: ReactNode;
  status?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-outline-variant)] pb-4 mb-10">
      <div>
        {kicker ? (
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-outline)] mb-2">
            [ {kicker} ]
          </div>
        ) : null}
        <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--color-on-surface)] lowercase">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4 font-mono text-[11px] text-[var(--color-outline)]">
        {status ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-secondary-container)] animate-pulse" />
            {status}
          </span>
        ) : null}
        {right}
      </div>
    </div>
  );
}
