import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "../..");

/**
 * Content pages must not all use the same "mx-auto max-w-*" centered-column
 * layout. Uniform centering is the hallmark of template-generated sites.
 * Pages should vary their container approach — asymmetric padding, full-bleed
 * sections, left-aligned content columns, or offset grids.
 */

const CONTENT_PAGES = [
  "src/app/page.tsx",
  "src/app/music/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/merch/page.tsx",
  "src/app/about/page.tsx",
  "src/app/music/[slug]/page.tsx",
  "src/app/blog/[slug]/page.tsx",
];

function countCenteredContainers(content: string): number {
  const matches = content.match(/\bmx-auto\b/g);
  return matches ? matches.length : 0;
}

function hasAsymmetricPadding(content: string): boolean {
  // Check for lg:pl-* without matching lg:pr-* (or vice versa), indicating offset layout
  const hasLgPl = /\blg:pl-\d+\b/.test(content);
  const hasLgPr = /\blg:pr-\d+\b/.test(content);
  // Asymmetric if they have different padding values or only one side specified
  if (hasLgPl && hasLgPr) {
    const plValues = content.match(/\blg:pl-(\d+)\b/g) ?? [];
    const prValues = content.match(/\blg:pr-(\d+)\b/g) ?? [];
    // If values differ, it's asymmetric
    return plValues.join(",") !== prValues.join(",");
  }
  return hasLgPl || hasLgPr;
}

describe("No centered-everything layout", () => {
  it("majority of content pages avoid mx-auto on their outer container", () => {
    let pagesWithoutMxAuto = 0;
    for (const file of CONTENT_PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      if (countCenteredContainers(content) === 0) {
        pagesWithoutMxAuto++;
      }
    }
    expect(
      pagesWithoutMxAuto,
      `Only ${pagesWithoutMxAuto}/${CONTENT_PAGES.length} content pages avoid mx-auto. Most pages should use asymmetric or full-width layouts instead of centered containers.`,
    ).toBeGreaterThanOrEqual(Math.ceil(CONTENT_PAGES.length / 2));
  });

  it("at least 3 content pages use asymmetric padding (lg:pl-* or lg:pr-*)", () => {
    let asymmetricCount = 0;
    for (const file of CONTENT_PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      if (hasAsymmetricPadding(content)) {
        asymmetricCount++;
      }
    }
    expect(
      asymmetricCount,
      `Only ${asymmetricCount} pages use asymmetric padding. Use varied lg:pl-*/lg:pr-* to break the centered-column monotony.`,
    ).toBeGreaterThanOrEqual(3);
  });

  it("homepage hero section is not wrapped in mx-auto max-w-*", () => {
    const content = readFileSync(join(ROOT, "src/app/page.tsx"), "utf-8");
    // Find the hero section and check its container
    const heroMatch = content.match(/\{\/\*\s*Hero\s*Section\s*\*\/\}[\s\S]*?<\/section>/);
    expect(heroMatch, "Could not find Hero Section in homepage").toBeTruthy();
    if (heroMatch) {
      const heroContent = heroMatch[0];
      const hasCenteredContainer = /mx-auto\s+max-w-/.test(heroContent);
      expect(
        hasCenteredContainer,
        "Homepage hero should not be constrained in a centered max-width container. Let it breathe.",
      ).toBe(false);
    }
  });
});
