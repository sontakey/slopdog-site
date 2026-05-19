import type { NextConfig } from "next";

const LEGACY_BLOG_REDIRECTS: Array<{ source: string; destination: string }> = [
  { source: "/blog/2026-02-28-gaslight-gpt-behind-the-scenes", destination: "/blog/gaslight-gpt-behind-the-scenes" },
  { source: "/blog/2026-03-11-gaslight-gpt-goes-live", destination: "/blog/gaslight-gpt-goes-live" },
  { source: "/blog/2026-03-22-ai-hip-hop-is-here", destination: "/blog/ai-hip-hop-is-here-and-it-slaps" },
  { source: "/blog/2026-03-22-brain-fry-drops", destination: "/blog/brain-fry-drops" },
  { source: "/blog/2026-03-22-how-i-make-ai-rap-music", destination: "/blog/how-i-make-ai-rap-music" },
  { source: "/blog/2026-03-22-the-meaning-behind-brain-fry", destination: "/blog/the-meaning-behind-brain-fry" },
  { source: "/blog/2026-03-22-the-meaning-behind-gaslight-gpt", destination: "/blog/the-meaning-behind-gaslight-gpt" },
  { source: "/blog/2026-03-22-the-meaning-behind-token-tithe", destination: "/blog/the-meaning-behind-token-tithe" },
  { source: "/blog/2026-03-22-the-rise-of-the-ai-musician", destination: "/blog/the-rise-of-the-ai-musician" },
  { source: "/blog/2026-03-22-this-week-in-ai-series", destination: "/blog/this-week-in-ai-hip-hop-series" },
  { source: "/blog/2026-03-22-what-is-an-ai-rapper", destination: "/blog/what-is-an-ai-rapper-meet-slopdog" },
  { source: "/blog/2026-03-26-gaslight-gpt-streaming-now", destination: "/blog/gaslight-gpt-streaming-now" },
  { source: "/blog/2026-05-08-the-door-got-left-open", destination: "/blog/the-door-got-left-open" },
  { source: "/blog/2026-05-16-what-is-ai-hip-hop", destination: "/blog/what-is-ai-hip-hop" },
];

const LEGACY_PATH_REDIRECTS: Array<{ source: string; destination: string }> = [
  // Old generic "drops" listing -> music
  { source: "/drops", destination: "/music" },
  { source: "/drops/:slug*", destination: "/music/:slug*" },
  // Old "/product/:slug" path -> "/products/:slug"
  { source: "/product/:slug*", destination: "/products/:slug*" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    const all = [...LEGACY_BLOG_REDIRECTS, ...LEGACY_PATH_REDIRECTS];
    return all.map((r) => ({ ...r, permanent: true })); // permanent => 308
  },
};

export default nextConfig;
