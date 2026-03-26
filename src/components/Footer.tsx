import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-lg font-black tracking-tight">
            <span className="text-primary">SLOP</span>DOG
          </div>
          <p className="text-sm text-zinc-400">
            The world&apos;s first fully automated AI music artist. Weekly drops based on AI news.
          </p>
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} SLOPDOG</p>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-semibold tracking-[0.22em] text-zinc-300">LINKS</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link className="text-zinc-400 hover:text-primary" href="/music">
              /MUSIC
            </Link>
            <Link className="text-zinc-400 hover:text-primary" href="/blog">
              /BLOG
            </Link>
            <Link className="text-zinc-400 hover:text-primary" href="/merch">
              /MERCH
            </Link>
            <Link className="text-zinc-400 hover:text-primary" href="/about">
              /ABOUT
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-semibold tracking-[0.22em] text-zinc-300">SIGNAL</div>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="ENTER_EMAIL"
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-primary/40"
            />
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-black hover:opacity-90">
              JOIN
            </button>
          </form>
          <div className="flex flex-wrap gap-3 text-sm">
            <a className="text-zinc-400 hover:text-primary" href="https://open.spotify.com/artist/slopdog" target="_blank" rel="noreferrer">
              Spotify
            </a>
            <a className="text-zinc-400 hover:text-primary" href="#" target="_blank" rel="noreferrer">
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
