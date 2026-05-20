# SLOPDOG_OS // DESIGN.md

**Canonical design contract.** If it is not in here, it is not on-brand.
Last updated: 2026-05-20. Source of truth: `src/app/globals.css`.

---

## 1. Purpose

This file is the single reference for every design decision in the slopdog-site codebase. It owns the contract between the design system and the shipped product.

**Who reads this:**
- Anyone writing or modifying CSS or Tailwind classes
- Anyone building or editing components under `src/components/`
- Anyone commissioning or placing imagery, cover art, or brand assets
- Anyone reviewing a PR that touches visual output

**The rule:** if a color, font, spacing value, or component behavior is not documented here, it is not part of the system. Do not invent values; do not reference the old PRD that lists neon green `#00ff41` as an accent. That document is stale. This one is not.

If design and code drift, this file wins in review.

---

## 2. Brand Voice (Web-Facing)

SLOPDOG_OS is a brutalist-cyberpunk artist operating system: a pure black canvas where lavender and teal signals pulse through the noise. The world's first fully automated AI music artist drops weekly hip-hop built from real AI news. The voice is lowercase, deadpan, and precise — terminal output, not marketing copy. Headings are in all-caps only when the UI element demands it (see Typography below). Body copy and nav labels are lowercase by default. The aesthetic reads as a machine that learned to write poetry in a dark room.

For the full brand bible, see `/Users/anton/.openclaw/workspace-anton/slopdog/BRAND.md`.

---

## 3. Color Tokens

All values below are pulled verbatim from the `@theme` block in `src/app/globals.css`.
Use CSS custom properties in code, not raw hex values.

### 3.1 Surfaces

| Token | Hex | Intended Usage |
|---|---|---|
| `--color-bg` | `#020202` | Page root background; the void |
| `--color-background` | `#141313` | Alias for surface base |
| `--color-surface` | `#141313` | Default surface (cards, panels) |
| `--color-surface-dim` | `#141313` | Dimmed surface variant |
| `--color-surface-bright` | `#3a3939` | Elevated/active surface |
| `--color-surface-variant` | `#353434` | Alternative surface for variety |
| `--color-surface-container-lowest` | `#0e0e0e` | Deeply recessed containers (code bg, player bg) |
| `--color-surface-container-low` | `#1c1b1b` | Low-elevation containers |
| `--color-surface-container` | `#201f1f` | Standard container |
| `--color-surface-container-high` | `#2a2a2a` | Higher-elevation container |
| `--color-surface-container-highest` | `#353434` | Highest-elevation container |

### 3.2 Foreground

| Token | Hex | Intended Usage |
|---|---|---|
| `--color-on-surface` | `#e5e2e1` | Primary text on dark surfaces |
| `--color-on-surface-variant` | `#d7c0d4` | Secondary/muted text; hint of lavender bleed |
| `--color-on-background` | `#e5e2e1` | Text on page background |
| `--color-fg` | `#e5e2e1` | Alias for foreground; use for default body text |
| `--color-fg-muted` | `#d7c0d4` | Subdued text |
| `--color-fg-faint` | `#9f8a9e` | Placeholder text, timestamps, secondary labels |

### 3.3 Primary — Lavender

| Token | Hex | Intended Usage |
|---|---|---|
| `--color-primary` | `#faabff` | Interactive elements, links, hover states, CTA borders |
| `--color-primary-container` | `#e446ff` | High-contrast primary container |
| `--color-primary-fixed` | `#ffd6fe` | Fixed/static primary variant (light contexts) |
| `--color-primary-fixed-dim` | `#faabff` | Fixed dim variant |
| `--color-on-primary` | `#570066` | Text on primary-colored backgrounds |
| `--color-on-primary-container` | `#4c0059` | Text on primary container |

### 3.4 Secondary — Teal

| Token | Hex | Intended Usage |
|---|---|---|
| `--color-secondary` | `#e6feff` | Italic/emphasis text in prose |
| `--color-secondary-container` | `#00f4fe` | Active nav state, live status dots, count badges |
| `--color-secondary-fixed` | `#63f7ff` | Fixed teal variant |
| `--color-secondary-fixed-dim` | `#00dce5` | Dim teal variant |
| `--color-on-secondary` | `#003739` | Text on secondary-colored backgrounds |
| `--color-on-secondary-container` | `#006c71` | Text on secondary container |

### 3.5 Tertiary

| Token | Hex | Intended Usage |
|---|---|---|
| `--color-tertiary` | `#c7c6c5` | Neutral accent; metadata, labels |
| `--color-tertiary-container` | `#909190` | Tertiary container |
| `--color-on-tertiary` | `#2f3130` | Text on tertiary background |

### 3.6 Outline

| Token | Hex | Intended Usage |
|---|---|---|
| `--color-outline` | `#9f8a9e` | Default border, dividers, subtle lines |
| `--color-outline-variant` | `#524152` | Softer borders, card edges, section dividers |

### 3.7 Status

| Token | Hex | Intended Usage |
|---|---|---|
| `--color-error` | `#ffb4ab` | Error messages, invalid state indicators |
| `--color-error-container` | `#93000a` | Error container background |

### 3.8 Banned Colors

The following colors must NOT appear in site CSS, component styles, or Tailwind classes unless this file is updated first in the same PR:

- **Neon green `#00ff41`** — this is the old PRD accent. The system does NOT use it. Note: `SlopdogCharacter.tsx` contains `#00ff41` inside an isolated SVG gradient definition only; that SVG is a self-contained icon and is not part of the broader color system. Do not propagate this hex to any other component or style.
- Any color not listed in sections 3.1-3.7 above.

If you believe a new color is needed, open a PR that adds the token to `globals.css @theme`, documents it in this table, and explains why the existing palette is insufficient.

---

## 4. Typography

### 4.1 Fonts

Three fonts, three roles. No others.

| Variable | Font Family | Weights Loaded | Role |
|---|---|---|---|
| `--font-display` | Syne (Google Fonts) | 400, 500, 600, 700, 800 | Display headlines, logo text, section headings |
| `--font-sans` | Inter (Google Fonts) | 300, 400, 500, 600, 700 | Body copy, UI labels, prose |
| `--font-mono` | Space Mono (Google Fonts) | 400, 700 | Terminal labels, kickers, code blocks, metadata, timestamps |

### 4.2 Type Scale

All values are verbatim from `src/app/globals.css @theme`:

| Token | Size | Line Height | Letter Spacing | Weight | Use Case |
|---|---|---|---|---|---|
| `--text-display-lg` | `clamp(3.5rem, 8vw, 5.25rem)` | `1.0` | `-0.04em` | `800` | Hero headline, page title |
| `--text-headline-lg` | `clamp(2rem, 4vw, 3rem)` | `1.1` | `-0.02em` | `800` | Section titles |
| `--text-headline-md` | `clamp(1.5rem, 3vw, 2rem)` | `1.15` | `-0.015em` | `800` | Card headings, sub-sections |
| `--text-body-lg` | `18px` | `1.6` | — | `300` | Primary body copy |
| `--text-body-md` | `16px` | `1.6` | — | `300` | Secondary body, form text |
| `--text-label-mono` | `14px` | `1.4` | `0.05em` | `400` | Mono labels, kickers, status strings |
| `--text-label-mono-sm` | `11px` | `1.2` | — | `400` | Tiny mono metadata, breadcrumbs |

### 4.3 Casing Rules

**Lowercase is the default voice.** Navigation labels, body copy, headlines, card titles, and footer links are all lowercase.

**Uppercase is reserved for:**
- Terminal-style kicker strings in `font-mono` (e.g., `[ /music ] // discography_full`)
- Button labels on interactive purchase CTAs (`BUY NOW`, `ADD TO CART`)
- Status identifiers and system strings (e.g., `BASIC`, `COMMERCIAL` tier badges)
- Semantic UI state labels where caps signal machine output vs. human text

Never force-capitalize a headline that is not in one of the above categories.

---

## 5. Spacing and Layout

### 5.1 Design Tokens (verbatim from globals.css)

| Token | Value | Use |
|---|---|---|
| `--spacing-margin-mobile` | `16px` | Horizontal page margin on mobile |
| `--spacing-margin-desktop` | `64px` | Horizontal page margin on desktop |
| `--spacing-gutter` | `24px` | Internal gutter between grid columns or content blocks |

These map to Tailwind as `px-4` (mobile) and `px-16` (desktop). Applied as `px-4 md:px-16` throughout page files.

### 5.2 Container Widths

The site uses a single max-width constraint applied in Header and Footer:

```
max-w-[1400px]
```

Content sections within pages do not add an additional wrapper — they rely on the `px-4 md:px-16` pattern directly.

### 5.3 Breakpoints

Tailwind defaults apply. The site uses `md:` (768px) as the primary responsive breakpoint for layout shifts (single column to multi-column grids, mobile nav to desktop nav). The `lg:` breakpoint (1024px) is used for wider grid layouts on content-heavy pages (e.g., `About` uses `lg:grid-cols-12`).

---

## 6. Component Patterns

All reusable components live under `src/components/`. Thirteen components exist as of this writing.

### AlbumCard

**What it does:** Renders a release tile linking to a track page. Supports four layout variants: `tile` (square, default), `hero` (large featured slot), `wide` (16/9), and `stack` (portrait 4/5). On hover: border transitions to `--color-primary`, image scales up 3%, and a lavender-to-teal gradient overlay fades in.

**Where used:** `src/app/page.tsx` (homepage timeline), `src/app/music/page.tsx` (discography grid).

**Props:** `href`, `title`, `sub?`, `image`, `badge?`, `index?`, `variant?`, `meta?`.

---

### BeatLicenseSection

**What it does:** Renders a two-tier beat licensing panel (BASIC $19.99, COMMERCIAL $49.99) with feature lists and `BuyButton` CTAs. The featured tier gets a lavender border and tinted background.

**Where used:** Individual track detail pages (`/music/[slug]`).

**Props:** `trackSlug`, `trackTitle`.

---

### BuyButton

**What it does:** Async Stripe checkout trigger. Calls `/api/checkout` and redirects to Stripe on success. Handles loading state and inline error display.

**Variants:** `primary` (filled lavender), `outline` (lavender border, transparent fill, fills on hover), `ghost` (outline-variant border, primary on hover).

**Where used:** `BeatLicenseSection`, `MerchCard`, `src/app/products/stem-pack/page.tsx`.

**Props:** `product`, `label?`, `size?`, `trackSlug?`, `fullWidth?`, `variant?`, `className?`.

---

### Footer

**What it does:** Two-column site footer (brand statement + nav + social links). Renders the SLOPDOG_OS wordmark in `font-display`, a system-status mono line with an animated teal dot, and two link columns (navigate, broadcast). Bottom strip shows legal links and copyright year.

**Where used:** `src/app/layout.tsx` (global).

---

### Header

**What it does:** Fixed top navigation bar (height `h-14`). Left: SLOPDOG_OS logotype. Center/right: nav links with mono `[NN]` codes and active-state indicator (teal color + underscore cursor). Mobile: hamburger menu opens a full-width drawer. Right side: live UTC clock in `font-mono` updates every second.

**Where used:** `src/app/layout.tsx` (global).

---

### JsonLd

**What it does:** Injects a `<script type="application/ld+json">` block with any provided schema object. Purely structural, no visual output.

**Where used:** `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/merch/page.tsx`.

**Props:** `schema` (any valid JSON-LD object).

---

### MaterialIcon

**What it does:** Renders a single Material Symbols Outlined icon by name. The icon font is loaded globally in `layout.tsx`. Aria-hidden by default.

**Where used:** Various UI touch points for icon glyphs.

**Props:** `name`, `size?` (default 20), plus all standard `span` props.

---

### Mdx

**What it does:** Renders MDX content via `next-mdx-remote`. Applies the `.prose` class for blog typography (see globals.css). Overrides `<a>` to add `target="_blank" rel="noopener noreferrer"` on external links automatically.

**Where used:** `src/app/about/page.tsx`, blog post `[slug]` page.

**Props:** `source` (raw MDX string).

---

### MerchCard

**What it does:** Product card for merch items. Supports `featured` (wider image aspect) and `compact` modes. Renders size-selection buttons when `sizes` array is provided; blocks the buy button until a size is selected. Hover state: border transitions to primary.

**Where used:** `src/app/merch/page.tsx`.

**Props:** `slug`, `title`, `price`, `currency`, `image`, `sizes?`, `trackTag?`, `available`, `featured?`, `compact?`.

---

### SectionHeading

**What it does:** Standardized section header with optional kicker (mono label in brackets), a bold display headline (always lowercase), and optional right-side content slot for status badges or actions. Sits on a bottom-border divider.

**Where used:** `src/app/music/page.tsx`, `src/app/blog/page.tsx`, `src/app/merch/page.tsx`, and any page-level section that needs a labeled header.

**Props:** `kicker?`, `title`, `right?`, `status?`, `level?` (1 or 2, controls h1 vs h2).

---

### SlopdogCharacter

**What it does:** Inline SVG icon of the SLOPDOG mascot. A helmeted humanoid figure in a 220x220 viewbox with a stylized visor and glitch-slash accents. Contains an isolated SVG gradient and drop-shadow filter. This is a self-contained icon; its internal color definitions do not affect the broader design system.

**Where used:** Site chrome, potentially marketing assets.

**Props:** All standard `svg` element props.

---

### StaticAudioPlayer

**What it does:** Non-interactive visual "now playing" panel showing track metadata and a static waveform bar visualization. The waveform bars transition from teal to primary (lavender) on hover. Does not play audio; it is a visual UI element for track pages.

**Where used:** Individual track detail pages (`/music/[slug]`).

**Props:** `title`, `artist`, `album`, `duration?`.

---

### ViewToggle

**What it does:** Renders a two-tab toggle (HUMAN / AI MD) that switches between rendered MDX content and the raw markdown source. Includes a clipboard copy button for the markdown source. Used on pages where both human readers and LLM consumers are considered.

**Where used:** `src/app/about/page.tsx`.

**Props:** `humanContent` (ReactNode), `markdownSource` (string).

---

## 7. Page Intent

### Home (`/`)

The entry point and primary marketing surface. Hero section introduces SLOPDOG_OS as a concept with a display-lg headline and animated release timeline showing the four most recent tracks as `AlbumCard` tiles (one hero, three secondary). Below that: streaming links, newsletter subscribe form, and a lore teaser block. The mission is to convert a first-time visitor into a follower within one scroll.

### Music (`/music`)

The full discography archive. Opens with a terminal-style status bar, a `SectionHeading`, then a featured hero card followed by a grid of all tracks sorted newest first. Each card navigates to the individual track page (`/music/[slug]`) which includes the `StaticAudioPlayer`, `BeatLicenseSection`, and streaming links.

### Blog / Lore (`/blog`)

Weekly dispatch archive. Labeled "lore" in the nav (internal code: `02`). Featured post gets a large image treatment; subsequent posts are listed in a compact grid. Individual post pages use `.prose` typography. Blog posts provide context for each release and AI news commentary.

### Merch (`/merch`)

Physical and digital product catalog. Apparel (tees, caps, beanies) and digital stem packs. Products render via `MerchCard`. A `BuyButton` triggers Stripe checkout. Featured items get a wider aspect ratio card. Sold-out items disable the purchase button.

### About (`/about`)

Brand and system explainer. Uses `ViewToggle` to offer both a human-readable view and raw markdown for AI ingestion. Content is sourced from `content/pages/about.mdx`. Schema.org `MusicGroup` JSON-LD is injected for SEO.

### Products — Stem Pack (`/products/stem-pack`)

Dedicated landing page for the Stem Pack Vol. 1 digital product. Lists included stem components (drums, bass, melody, vocals, instrumentals). Single `BuyButton` CTA at full width.

### 404

Not yet implemented. A `not-found.tsx` file does not exist in the repo. When created, it should match the OS theme: terminal-style "404 // signal_lost" message on the black canvas with a link back to `/`.

---

## 8. Motion

All motion values are defined in `src/app/globals.css @theme`.

### 8.1 Easing

| Token | Value | When to use |
|---|---|---|
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Hover transitions, UI state changes |
| `--ease-out-quint` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrance animations (feels snappier on arrival) |

### 8.2 Durations

| Token | Value | When to use |
|---|---|---|
| `--duration-fast` | `150ms` | Micro-interactions (border color, opacity flicker) |
| `--duration-normal` | `300ms` | Standard hover state transitions |
| `--duration-slow` | `500ms` | Fade-in animations |
| `--duration-entrance` | `600ms` | Page entrance / scroll-reveal animations |

### 8.3 Motion Patterns in Use

**Hover glow on inline links (`.glitch-hover`):** Text shadow splits into lavender (`#faabff`) offset left and teal (`#00f4fe`) offset right, creating a chromatic-aberration glitch effect. Element also translates 1px right, 1px up. Duration: `--duration-normal` with `--ease-out-quart`.

**Glitch text effect (`.text-glitch`):** Display headlines with `data-text` attribute render two pseudo-element clones — one lavender-tinted offset left, one teal-tinted offset right — at 55% opacity with `mix-blend-mode: screen`. Applied to primary hero headline.

**Entrance animation (`.motion-fade-up`):** Elements enter from 12px below at opacity 0, animating to full position and opacity over `--duration-entrance` with `--ease-out-quint`. Stagger delays via `.motion-delay-1` through `.motion-delay-5` (75ms to 375ms).

**Fade-in (`.motion-fade-in`):** Simple opacity 0 to 1 over `--duration-slow` with `--ease-out-quart`. Used for secondary content blocks.

**Scanlines overlay (`.scanlines::before`):** Global fixed overlay rendering a horizontal scanline pattern and an RGB color-channel noise gradient. Applied to `<body>` via the `scanlines` class. Pointer-events disabled. Disabled when `prefers-reduced-motion: reduce`.

**Card image zoom:** Album and merch card images scale to `1.03x` on parent hover over `700ms` with a cubic default ease (Tailwind `duration-700`).

**What gets motion:** Interactive elements (links, buttons, cards), page entrance sequences, the live-status dot (CSS `animate-pulse`). Motion is additive — it reinforces the cyberpunk OS aesthetic without being gratuitous.

**What does NOT get motion:** Static text blocks, structural layout elements, prose content.

**Reduced motion:** All keyframe animations are stripped to instant/no-op when `prefers-reduced-motion: reduce` is set. All transitions collapse to `0.01ms`.

---

## 9. Imagery Rules

### 9.1 Release Cover Art

- Source path pattern: `slopdog/releases/NNN-*/cover-final.png` (where NNN is zero-padded track number)
- Exposed in the site via `public/images/` or served from the content directory
- Square format (1:1 aspect ratio)
- Covers are AI-generated. Each reflects the thematic concept of the corresponding AI news story

### 9.2 Brand Assets

- **Avatar:** `slopdog/brand/x-avatar-v2-b.png` — used as profile image across social and the site's OG image chain
- **Banner:** `slopdog/brand/x-banner-v2-c.png` — used for Twitter/X header

### 9.3 Character

The SLOPDOG character is a **helmeted humanoid agent** with a visor strip in the cyan/pink spectrum. It is a robotic humanoid, not an animal, not a robot dog. The name "Slopdog" is the artist persona; the visual identity is the helmeted agent figure.

- No depictions of actual dogs
- No depictions of identifiable humans
- Visor lighting: cyan/pink chromatic range to match the secondary and primary palette
- Background: dark (consistent with `--color-bg`)

Note: The inline `SlopdogCharacter.tsx` SVG icon currently renders eyes and visor strokes in `#00ff41` (neon green) as an isolated SVG rendering decision within that component only. This is legacy from an earlier design iteration. Future brand asset commissions should use the cyan/pink visor per this spec. Do not use `#00ff41` as a design system color outside this contained SVG.

### 9.4 OG Images

Default OG image: `/images/og-default.jpg`. Individual track pages may specify their own OG image sourced from the release cover.

### 9.5 No Embedded Base64

Images are never embedded as base64 in CSS or component files. Always use paths to files in `public/` or Next.js `Image` component with a valid `src`.

---

## 10. Do / Don't

### Do

- Use CSS custom properties (`var(--color-primary)`) instead of raw hex in component code
- Keep all nav labels, body copy, and card titles in lowercase
- Apply `target="_blank" rel="noopener noreferrer"` to all external links
- Use `font-mono` with `tracking-wider` and uppercase for terminal-style kicker strings
- Wrap the `.prose` class around long-form MDX content for consistent blog typography
- Use `--ease-out-quint` for entrance animations and `--ease-out-quart` for hover transitions
- Respect `prefers-reduced-motion` — all animations have reduced-motion overrides
- Keep components in `src/components/` and update this file when adding a new one
- Source all spacing from the three token values in 5.1 (mobile margin, desktop margin, gutter)
- Use `SectionHeading` for any page-level section that needs a labeled title

### Don't

- Do not hard-code hex values in component `className` strings or `style` props — use tokens
- Do not introduce `#00ff41` or any color outside the defined palette without updating `globals.css` and this file in the same PR
- Do not use neon colors, gradients, or backgrounds not listed in the color system
- Do not use a font other than Syne, Inter, or Space Mono
- Do not capitalize headlines or nav labels except where explicitly documented in 4.3
- Do not create components in `src/components/` without adding an entry to section 6 of this file
- Do not place a robot dog in brand imagery
- Do not embed images as base64
- Do not open a PR that updates `globals.css` tokens without also updating the tables in section 3 and 4 of this file
- Do not remove the `scanlines` class from `<body>` — it is load-bearing for the OS chrome aesthetic
- Do not use centered-blog generic prose styles — the `.prose` class in `globals.css` defines terminal-readable blog typography

---

## 11. Update Process

### Changing a design token

1. Update the value in `src/app/globals.css` inside the `@theme` block.
2. Update the corresponding row in `DESIGN.md` (sections 3, 4, or 5) in the **same commit**.
3. Open a PR. Title format: `design: update [token-name] to [new-value]`.
4. If `globals.css` and `DESIGN.md` are out of sync, the PR fails review. No exceptions.

### Adding a new component

1. Create the component in `src/components/`.
2. Add an entry to section 6 of `DESIGN.md` in the same commit: name, what it does, where used, props.
3. PR must include both files.

### Adding a new page

1. Add the route under `src/app/`.
2. Add a one-paragraph entry to section 7 of `DESIGN.md` in the same commit.

### Commissioning new brand imagery

1. Read sections 9.2 and 9.3 of this file before briefing any image generation tool or artist.
2. New hero assets must be reviewed by Sameer before swapping the live asset.
3. Keep the previous asset with a `.old` suffix until approval is confirmed.

### Versioning

This file does not have a formal version number. Git history is the changelog. The `Last updated` date at the top of this file should be updated any time a substantive change is made.
