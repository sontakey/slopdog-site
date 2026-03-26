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
    <div className="flex items-end justify-between gap-6 border-b border-primary/20 pb-4">
      <div className="flex items-center gap-3">
        {kicker ? <span className="text-sm font-semibold text-primary">{kicker}</span> : null}
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">
          <span className="glitch" data-text={title}>
            {title}
          </span>
        </h2>
      </div>
      <div className="text-sm font-semibold text-primary">{right}</div>
    </div>
  );
}
