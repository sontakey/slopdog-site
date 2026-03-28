import MaterialIcon from "@/components/MaterialIcon";

export default function StaticAudioPlayer({
  title,
  artist,
  album,
  duration,
}: {
  title: string;
  artist: string;
  album: string;
  duration?: string;
}) {
  const bars = [3, 5, 2, 6, 4, 8, 3, 5, 2];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-fg/10 bg-surface p-6">
      <div className="absolute left-0 top-0 h-full w-1 bg-primary/60" />

      <div className="mb-4 flex items-center gap-4">
        <button
          type="button"
          aria-label="Play"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-neutral-950 transition-transform duration-normal ease-out-quart hover:scale-105"
        >
          <MaterialIcon name="play_arrow" size={28} />
        </button>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display font-bold text-fg">{title}</h3>
          <p className="truncate text-body-sm text-primary/70">{artist} • {album}</p>
        </div>

        <span className="text-label tabular-nums text-fg-faint">{duration ?? "03:42"}</span>
      </div>

      <div className="mb-1 flex h-8 items-end gap-1 opacity-60 transition-opacity duration-normal ease-out-quart group-hover:opacity-100">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-t bg-primary"
            style={{ height: `${h * 4}px`, animationDelay: `${i * 75}ms` }}
          />
        ))}
        <div className="ml-2 h-1 flex-1 self-center rounded-full bg-primary/30" />
      </div>

    </div>
  );
}
