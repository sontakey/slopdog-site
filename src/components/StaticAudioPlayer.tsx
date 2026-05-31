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
  const bars = [4, 7, 3, 9, 5, 11, 4, 8, 3, 6, 9, 4, 7, 2, 5, 10, 3];

  return (
    <div
      className="relative border border-[var(--color-outline-variant)] p-5 group"
      style={{ background: "var(--color-surface-container-lowest)" }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-primary)]" />

      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)]">
          [ now_playing ] // signal_locked
        </div>
        <div className="font-mono text-[10px] tabular-nums text-[var(--color-on-surface-variant)]">
          {duration ?? "03:42"}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          aria-label="Play"
          className="h-11 w-11 flex items-center justify-center border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-base font-extrabold text-[var(--color-on-surface)] lowercase">
            {title}
          </div>
          <div className="truncate font-mono text-[11px] text-[var(--color-on-surface-variant)] uppercase tracking-wider">
            {`${artist.toLowerCase()} // ${album.toLowerCase()}`}
          </div>
        </div>
      </div>

      <div className="flex h-10 items-end gap-[3px] mb-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-[3px] flex-1 transition-all duration-300 group-hover:bg-[var(--color-primary)]"
            style={{
              height: `${h * 9}%`,
              background:
                i < 8
                  ? "var(--color-secondary-container)"
                  : "var(--color-outline-variant)",
            }}
          />
        ))}
      </div>

      <div className="flex justify-between font-mono text-[9px] text-[var(--color-outline)] uppercase tracking-wider">
        <span>00:00</span>
        <span>{duration ?? "03:42"}</span>
      </div>
    </div>
  );
}
