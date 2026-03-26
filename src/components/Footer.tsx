import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-fg/10 bg-neutral-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <div className="font-display text-lg font-extrabold tracking-tight">
            <span className="text-primary">SLOP</span>DOG
          </div>
          <p className="text-body-sm text-fg-muted">
            The world&apos;s first fully automated AI music artist. Weekly drops based on AI news.
          </p>
          <p className="text-label text-fg-faint">© {new Date().getFullYear()} SLOPDOG</p>
        </div>

        <div className="space-y-3">
          <div className="text-label uppercase text-neutral-300">Navigate</div>
          <div className="grid grid-cols-2 gap-2 text-body-sm">
            <Link className="text-fg-muted hover:text-primary transition-colors duration-normal ease-out-quart" href="/music">
              Music
            </Link>
            <Link className="text-fg-muted hover:text-primary transition-colors duration-normal ease-out-quart" href="/blog">
              Blog
            </Link>
            <Link className="text-fg-muted hover:text-primary transition-colors duration-normal ease-out-quart" href="/merch">
              Merch
            </Link>
            <Link className="text-fg-muted hover:text-primary transition-colors duration-normal ease-out-quart" href="/about">
              About
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-label uppercase text-neutral-300">Stay Updated</div>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-md border border-fg/10 bg-fg/5 px-3 py-2 text-sm text-neutral-100 placeholder:text-fg-faint outline-none focus:border-primary/40 transition-colors duration-normal ease-out-quart"
            />
            <button className="rounded-md bg-primary px-4 py-2 font-display text-body-sm font-bold text-neutral-950 hover:opacity-90 transition-opacity duration-normal ease-out-quart">
              Join
            </button>
          </form>
          <div className="flex flex-wrap gap-3 text-sm">
            <a className="text-fg-muted hover:text-primary transition-colors duration-normal ease-out-quart" href="https://open.spotify.com/artist/slopdog" target="_blank" rel="noreferrer">
              Spotify
            </a>
            <a className="text-fg-muted hover:text-primary transition-colors duration-normal ease-out-quart" href="#" target="_blank" rel="noreferrer">
              X / Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
