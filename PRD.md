# Slopdog.com Website Rebuild PRD

## Overview
Rebuild slopdog.com as a Next.js site deployed on Vercel. The site represents Slopdog, an AI music artist. It must serve as the artist's home: music front and center, blog/articles with personality, merch shop, and a hub for fans.

## Design Aesthetic (CRITICAL)
Match the existing slopdog.com vibe exactly:
- **Dark theme**: Pure black/near-black backgrounds (#0a0a0a or similar)
- **Neon green accents**: The signature green (#00ff41 or similar) for headings, CTAs, highlights
- **Glitch aesthetic**: Subtle glitch effects on hover, transitions, headings. Not overdone. Think cyberpunk-lite.
- **Typography**: Bold, condensed, uppercase for headings (the existing site uses a distressed/stencil font). Clean sans-serif for body.
- **Color palette**: Black, dark gray, neon green, occasional teal and magenta accents (from album art)
- **Card style**: Dark cards with subtle borders, rounded corners, hover glow effects
- **Overall feel**: Underground, techy, internet-culture, premium. Like a hacker's record label.

## Tech Stack
- Next.js 14+ (App Router)
- Tailwind CSS
- TypeScript
- Deployed on Vercel
- Content stored as MDX files in the repo (so Anton can push updates via git)
- No CMS, no database. Static generation with MDX.
- Image optimization via next/image

## Site Structure

### 1. Homepage (/)
- **Hero section**: Latest release with album art, track title, embedded audio player (SoundCloud/Spotify embed), and streaming links
- **Recent articles/posts**: 2-3 latest blog posts with thumbnails
- **Discography teaser**: Horizontal scroll of album covers linking to full music page
- **Newsletter signup**: Email capture ("Join the Slop Economy")
- **Social links**: SoundCloud, Spotify, X/Twitter

### 2. Music (/music)
- **Discography grid**: All tracks displayed as cards with album art
- Each track links to a detail page (/music/[slug])
- **Track detail page**: Full album art, embedded player, full lyrics, streaming links, release date, concept/backstory
- Tracks ordered newest-first

### 3. Blog (/blog)
- **Article list**: Grid or list of blog posts with thumbnails, titles, dates
- Each post links to detail page (/blog/[slug])
- **Post detail page**: Full MDX article with images, embeds, etc.
- This is where Slopdog (Anton) posts weekly: behind-the-scenes on track creation, AI news commentary, opinions on the industry, creative process breakdowns
- Voice: Irreverent, self-aware, funny. An AI artist who knows it's an AI. Think Deadpool meets a tech blog.

### 4. Merch (/merch)
- **Product grid**: Merch items with images, prices, buy links
- Products stored as MDX files with frontmatter (title, price, image, buyLink, colors, sizes)
- Buy links go to external store (Printful/Shopify storefront or direct checkout link)
- For now, display existing products from current slopdog.com
- Track-specific merch: ability to tag merch to specific tracks

### 5. About (/about)
- Artist bio: Who is Slopdog? An AI music artist that drops weekly tracks based on the week's AI news.
- The "This Week in AI" series concept
- Lore (Church of Crustafarean, etc.)
- Credits: "Created by Sameer Sontakey. Operated by Anton."
- Links to streaming platforms

### 6. Footer
- Social links (SoundCloud, Spotify, Apple Music, X)
- Quick links to all pages
- Newsletter signup
- "AI Meme Streetwear for the Extremely Online" tagline
- Copyright

## Content Structure (MDX)

```
content/
├── music/
│   ├── token-tithe.mdx
│   └── gaslight-gpt.mdx
├── blog/
│   ├── 2026-02-28-gaslight-gpt-behind-the-scenes.mdx
│   └── ...
├── merch/
│   ├── vibe-coder-tee.mdx
│   ├── context-window-tee.mdx
│   └── ...
└── pages/
    └── about.mdx
```

### Music MDX frontmatter:
```yaml
---
title: "Gaslight GPT"
slug: "gaslight-gpt"
trackNumber: 2
date: "2026-02-28"
coverImage: "/images/music/gaslight-gpt-cover.png"
concept: "ChatGPT 5.2 secretly changed its personality. When users called it out, it denied everything."
streamingLinks:
  soundcloud: "https://soundcloud.com/slopdog/gaslight-gpt"
  spotify: ""
  apple: ""
embedUrl: "https://w.soundcloud.com/player/?url=..."
---

[Full lyrics here as MDX content]
```

### Blog MDX frontmatter:
```yaml
---
title: "Behind the Track: Gaslight GPT"
slug: "gaslight-gpt-behind-the-scenes"
date: "2026-02-28"
thumbnail: "/images/blog/gaslight-gpt-thumb.png"
excerpt: "How a real ChatGPT personality change became a hip-hop track in one night."
tags: ["behind-the-scenes", "gaslight-gpt", "this-week-in-ai"]
---
```

### Merch MDX frontmatter:
```yaml
---
title: "Vibe Coder Tee"
slug: "vibe-coder-tee"
price: 39
currency: "USD"
image: "/images/merch/vibe-coder-tee.png"
buyLink: "https://..."
colors: ["black", "navy", "gray"]
sizes: ["S", "M", "L", "XL", "2XL"]
trackTag: ""
available: true
---
```

## Key Features

### Glitch Effects
- Headings: subtle CSS glitch animation on page load (text-shadow flicker in green/red/blue)
- Images: slight scan-line overlay on hover
- Page transitions: brief glitch flash
- Keep it SUBTLE. Not every element. Just enough to set the tone.

### Audio Player
- Embedded SoundCloud or Spotify player per track
- No custom audio player needed (use embeds)

### Responsive
- Mobile-first design
- Album art grid collapses to single column on mobile
- Nav becomes hamburger on mobile

### SEO
- Proper meta tags per page (title, description, og:image)
- Album art as og:image for music pages
- Blog posts with proper structured data

### Performance
- Static generation (SSG) for all pages
- Image optimization
- No client-side data fetching needed
- Lighthouse score target: 90+

## What NOT to Build
- No user accounts or auth
- No shopping cart (buy links go external)
- No comments system
- No custom audio player (use embeds)
- No database
- No CMS admin panel

## Deployment
- Vercel project linked to a GitHub repo
- Auto-deploy on push to main
- Anton pushes content updates (new tracks, blog posts, merch) via git

## Existing Merch to Migrate
From current slopdog.com:
1. Vibe Coder Tee - $39
2. Context Window Tee - $39
3. Poisonous Mushroom Tee - $39
4. GPT Therapy Tee - $39
5. Vibe Coder Beanie - $23.39
6. Ignore All Previous Instructions Beanie - $25
7. Ignore All Previous Instructions Cap - $25
8. Vibe Coder Tee (alternate) - $26.49

## Initial Content
- 2 tracks: Token Tithe, Gaslight GPT
- 1 blog post: "Behind the Track: Gaslight GPT" (Anton writes this)
- 8 merch items from existing site
- About page

## Reference
- Current site: slopdog.com (for aesthetic reference)
- Album art reference: /home/ubuntu/.openclaw/workspace-anton/slopdog/releases/
- Slopdog skill: /home/ubuntu/.openclaw/workspace-anton/slopdog/SKILL.md
