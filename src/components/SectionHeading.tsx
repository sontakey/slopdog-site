import type { ReactNode } from "react";

export default function SectionHeading({
  kicker,
  title,
  right,
}: {
  kicker?: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-fg/10 pb-4">
      <div className="flex items-baseline gap-3">
        {kicker ? <span className="text-label text-primary">{kicker}</span> : null}
        <h2 className="font-display text-display-md">{title}</h2>
      </div>
      <div className="text-body-sm font-semibold text-fg-muted">{right}</div>
    </div>
  );
}
