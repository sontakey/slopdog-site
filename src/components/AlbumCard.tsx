import Image from "next/image";
import Link from "next/link";

type Variant = "hero" | "tile" | "wide" | "stack";

export default function AlbumCard({
  href,
  title,
  sub,
  image,
  badge,
  index,
  variant = "tile",
  meta,
}: {
  href: string;
  title: string;
  sub?: string;
  image: string;
  badge?: string;
  index?: string;
  variant?: Variant;
  meta?: { label: string; value: string }[];
}) {
  const aspectClass =
    variant === "wide" ? "aspect-[16/9]" : variant === "stack" ? "aspect-[4/5]" : "aspect-square";
  const titleSize =
    variant === "hero"
      ? "text-2xl md:text-3xl"
      : variant === "wide"
      ? "text-xl md:text-2xl"
      : "text-lg md:text-xl";

  return (
    <Link href={href} className="group block h-full">
      <div
        className={`relative overflow-hidden border border-[var(--color-outline-variant)] transition-all duration-300 group-hover:border-[var(--color-primary)] ${aspectClass}`}
        style={{ background: "var(--color-surface-container-lowest)" }}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes={
            variant === "hero"
              ? "(max-width:1024px) 100vw, 60vw"
              : variant === "wide"
              ? "(max-width:1024px) 100vw, 50vw"
              : "(max-width:768px) 100vw, 33vw"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-90" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklch, var(--color-primary) 18%, transparent), transparent 50%, color-mix(in oklch, var(--color-secondary-container) 12%, transparent))",
          }}
        />

        {index ? (
          <div className="absolute left-3 top-3 font-mono text-[11px] tracking-wider text-[var(--color-on-surface-variant)]">
            [ {index} ]
          </div>
        ) : null}
        {badge ? (
          <div className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-wider px-2 py-1 border border-[var(--color-primary)] text-[var(--color-primary)]"
            style={{ background: "color-mix(in oklch, var(--color-bg) 70%, transparent)" }}
          >
            {badge}
          </div>
        ) : null}

        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1">
          <h3 className={`font-display font-extrabold leading-tight text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors ${titleSize}`}>
            {title.toLowerCase()}
          </h3>
          {sub ? (
            <p className="font-mono text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider">
              {sub}
            </p>
          ) : null}
        </div>
      </div>

      {meta && meta.length ? (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-outline)]">
          {meta.map((m) => (
            <div key={m.label} className="contents">
              <dt>{m.label}</dt>
              <dd className="text-[var(--color-on-surface-variant)] text-right">{m.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Link>
  );
}
