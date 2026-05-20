import type { ReactNode } from "react";

export default function SectionHeading({
  kicker,
  title,
  right,
  as = "h2",
}: {
  kicker?: string;
  title: string;
  right?: ReactNode;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className="flex items-end justify-between gap-6 border-b border-fg/10 pb-4">
      <div className="flex items-baseline gap-3">
        {kicker ? <span className="text-label text-primary">{kicker}</span> : null}
        <Heading className="font-display text-display-md">{title}</Heading>
      </div>
      <div className="text-body-sm font-semibold text-fg-muted">{right}</div>
    </div>
  );
}
