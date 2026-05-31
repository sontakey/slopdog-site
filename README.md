# slopdog.com

SLOPDOG is the AI-native hip-hop artist site. The site is built with Next.js, MDX content, GitHub, and Vercel.

## Source of truth

- Repository: `sontakey/slopdog-site`
- Production: `https://slopdog.com`
- Vercel project: `slopdog-site`
- Local canonical checkout: `/Users/anton/.ocplatform/shared/projects/slopdog-site`

## Content model

- Blog and lore posts: `content/lore/*.mdx`
- Music release pages: `content/music/*.mdx`
- Merch pages: `content/merch/*.mdx`
- Static pages: `content/pages/*.mdx`
- Blog images: `public/images/blog/`
- Music images: `public/images/music/`
- Audio: `public/audio/music/`

Each MDX post uses frontmatter like:

```yaml
---
title: "Post Title"
slug: "post-slug"
date: "2026-05-31"
thumbnail: "/images/blog/example.webp"
excerpt: "Short description for cards, SEO, and feeds."
tags: ["ai music", "slopdog"]
---
```

The file name should match the slug: `content/lore/post-slug.mdx`.

## Local verification

Run before pushing:

```bash
npm install
npm run lint
npm run build
```

Current known lint behavior: `npm run lint` may report one warning about custom fonts in `src/app/layout.tsx`. That warning is non-blocking. Lint errors are blocking.

`npm test` is currently not a useful gate because the repo has no `src/**/*.test.{ts,tsx}` files, so Vitest exits with code 1 for no tests found.

## Publishing flow

1. Pull latest main.
2. Add or edit MDX content.
3. Run `npm run lint` and `npm run build`.
4. Commit to `main` or open a PR, depending on risk.
5. Push to GitHub.
6. Vercel deploys production from GitHub.
7. Verify the production URL on `https://slopdog.com`.

## Vercel CLI

The Vercel token is stored in 1Password vault `Clawdbot`, item `Vercel Service Token`.

Use without printing the token:

```bash
export VERCEL_TOKEN=$(op item get "Vercel Service Token" --vault Clawdbot --fields label=credential --reveal)
vercel project ls
vercel inspect slopdog-site --token "$VERCEL_TOKEN"
```

Do not paste Vercel or GitHub tokens into chat or commit them.
