import Image from "next/image";
import Link from "next/link";

export default function AlbumCard({
  href,
  title,
  sub,
  image,
  badge,
  featured,
  compact,
}: {
  href: string;
  title: string;
  sub?: string;
  image: string;
  badge?: string;
  featured?: boolean;
  compact?: boolean;
}) {
  const aspectClass = featured ? "aspect-square" : compact ? "aspect-[5/4]" : "aspect-square";
  return (
    <Link href={href} className="group block h-full">
      <div className={`relative ${compact ? "mb-3" : "mb-4"} ${aspectClass} overflow-hidden rounded border border-fg/10 transition-colors duration-normal ease-out-quart group-hover:border-primary`}>
        <div className="absolute inset-0 z-10 bg-primary/10 opacity-0 transition-opacity duration-normal ease-out-quart group-hover:opacity-100" />
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-slow ease-out-quint group-hover:scale-110"
          sizes={featured ? "(max-width:1024px) 100vw, 66vw" : "(max-width:1024px) 50vw, 25vw"}
        />
        {badge ? (
          <div className="absolute right-2 top-2 z-20 border border-primary/30 bg-neutral-950/80 px-2 py-1 text-label uppercase text-primary">
            {badge}
          </div>
        ) : null}
      </div>
      <h3 className={`font-display font-bold text-fg transition-colors duration-normal ease-out-quart group-hover:text-primary ${featured ? "text-display-sm" : compact ? "text-body-sm" : "text-body-lg"}`}>{title}</h3>
      {sub ? <p className={`${compact ? "text-label" : "text-body-sm"} text-fg-faint`}>{sub}</p> : null}
    </Link>
  );
}
