import Image from "next/image";
import Link from "next/link";

export default function AlbumCard({
  href,
  title,
  sub,
  image,
  badge,
  featured,
}: {
  href: string;
  title: string;
  sub?: string;
  image: string;
  badge?: string;
  featured?: boolean;
}) {
  return (
    <Link href={href} className="group block h-full">
      <div className="relative mb-4 aspect-square overflow-hidden rounded border border-white/10 transition-colors group-hover:border-primary">
        <div className="absolute inset-0 z-10 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes={featured ? "(max-width:1024px) 100vw, 66vw" : "(max-width:1024px) 50vw, 25vw"}
        />
        {badge ? (
          <div className="absolute right-2 top-2 z-20 border border-primary/30 bg-black/80 px-2 py-1 text-[10px] font-mono text-primary">
            {badge}
          </div>
        ) : null}
      </div>
      <h3 className={`font-bold text-white transition-colors group-hover:text-primary ${featured ? "text-2xl" : "text-lg"}`}>{title}</h3>
      {sub ? <p className="text-sm font-mono text-zinc-500">{sub}</p> : null}
    </Link>
  );
}
