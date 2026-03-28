import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "../..");

/**
 * Card grids must use genuinely varied sizing — not just "first item big,
 * rest uniform". Multiple items should get different col-span / row-span
 * classes, varied aspect ratios, and differentiated padding/text sizes
 * to create visual rhythm instead of a lazy featured-first grid.
 */

const GRID_PAGES = [
  { file: "src/app/page.tsx", label: "Home page" },
  { file: "src/app/music/page.tsx", label: "Music page" },
  { file: "src/app/blog/page.tsx", label: "Blog page" },
  { file: "src/app/merch/page.tsx", label: "Merch page" },
];

describe("No uniform card grids", () => {
  for (const { file, label } of GRID_PAGES) {
    it(`${label} (${file}) uses varied card sizes via col-span or row-span`, () => {
      const content = readFileSync(join(ROOT, file), "utf-8");
      const hasColSpan = /col-span-\d/.test(content);
      const hasRowSpan = /row-span-\d/.test(content);
      expect(
        hasColSpan || hasRowSpan,
        `${label} should use col-span or row-span to vary card sizes`,
      ).toBe(true);
    });

    it(`${label} (${file}) has multiple distinct span variants, not just featured-first`, () => {
      const content = readFileSync(join(ROOT, file), "utf-8");

      // Count how many distinct span classes are used (col-span-N, row-span-N)
      const colSpanMatches = content.match(/(?:sm:|md:|lg:)?col-span-\d/g) || [];
      const rowSpanMatches = content.match(/(?:sm:|md:|lg:)?row-span-\d/g) || [];
      const allSpans = [...new Set([...colSpanMatches, ...rowSpanMatches])];

      expect(
        allSpans.length,
        `${label} should use at least 2 distinct span classes for layout variety (found: ${allSpans.join(", ")})`,
      ).toBeGreaterThanOrEqual(2);
    });
  }

  it("grid pages do not apply spans only to index 0 (reject featured-first-only pattern)", () => {
    for (const { file, label } of GRID_PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");

      // Look for span assignments that reference indices beyond 0
      // e.g. i === 2, pos === 3, i === 1, etc.
      const hasNonZeroSpanLogic =
        /(?:i|pos|idx|index)\s*===\s*[1-9]/.test(content) ||
        // or modulo-based patterns like pos % 5
        /%\s*\d/.test(content);

      expect(
        hasNonZeroSpanLogic,
        `${label} should assign varied spans to items beyond just index 0`,
      ).toBe(true);
    }
  });

  it("AlbumCard supports a featured prop for size variation", () => {
    const content = readFileSync(
      join(ROOT, "src/components/AlbumCard.tsx"),
      "utf-8",
    );
    expect(content).toContain("featured");
  });

  it("MerchCard supports a featured prop for size variation", () => {
    const content = readFileSync(
      join(ROOT, "src/components/MerchCard.tsx"),
      "utf-8",
    );
    expect(content).toContain("featured");
  });

  it("grid pages use at least 2 different aspect ratios for visual variety", () => {
    // Pages with image grids should vary aspect ratios
    const IMAGE_GRID_PAGES = [
      { file: "src/app/music/page.tsx", label: "Music page" },
      { file: "src/app/blog/page.tsx", label: "Blog page" },
    ];

    for (const { file, label } of IMAGE_GRID_PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      const aspects = content.match(/aspect-\[[\d/]+\]|aspect-square|aspect-video/g) || [];
      const uniqueAspects = [...new Set(aspects)];

      expect(
        uniqueAspects.length,
        `${label} should use at least 2 different aspect ratios (found: ${uniqueAspects.join(", ")})`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("music page uses at least 3 distinct aspect ratios across its cycle", () => {
    const content = readFileSync(join(ROOT, "src/app/music/page.tsx"), "utf-8");
    const aspects = content.match(/aspect-\[[\d/]+\]|aspect-square|aspect-video/g) || [];
    const uniqueAspects = [...new Set(aspects)];

    expect(
      uniqueAspects.length,
      `Music page should use at least 3 different aspect ratios for rich visual rhythm (found: ${uniqueAspects.join(", ")})`,
    ).toBeGreaterThanOrEqual(3);
  });

  it("blog page uses at least 3 distinct aspect ratios across its cycle", () => {
    const content = readFileSync(join(ROOT, "src/app/blog/page.tsx"), "utf-8");
    const aspects = content.match(/aspect-\[[\d/]+\]|aspect-square|aspect-video/g) || [];
    const uniqueAspects = [...new Set(aspects)];

    expect(
      uniqueAspects.length,
      `Blog page should use at least 3 different aspect ratios (found: ${uniqueAspects.join(", ")})`,
    ).toBeGreaterThanOrEqual(3);
  });

  it("card grids vary padding across items, not one-size-fits-all", () => {
    // Pages should use different padding for different card positions
    const VARIED_PAD_PAGES = [
      { file: "src/app/music/page.tsx", label: "Music page" },
      { file: "src/app/blog/page.tsx", label: "Blog page" },
    ];

    for (const { file, label } of VARIED_PAD_PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      const padMatches = content.match(/\bp-\d/g) || [];
      const uniquePads = [...new Set(padMatches)];

      expect(
        uniquePads.length,
        `${label} should use at least 2 different padding values to differentiate card density (found: ${uniquePads.join(", ")})`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("card grids vary text sizing across items, not uniform typography", () => {
    // Grids should use multiple text scale levels for hierarchy
    const VARIED_TEXT_PAGES = [
      { file: "src/app/music/page.tsx", label: "Music page" },
      { file: "src/app/blog/page.tsx", label: "Blog page" },
    ];

    for (const { file, label } of VARIED_TEXT_PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      const textMatches = content.match(/text-(?:display-(?:xl|lg|md|sm)|body-(?:lg|base|sm)|label)/g) || [];
      const uniqueSizes = [...new Set(textMatches)];

      expect(
        uniqueSizes.length,
        `${label} should use at least 3 distinct text sizes for typographic variety (found: ${uniqueSizes.join(", ")})`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("card components support a compact prop for density variation", () => {
    const albumCard = readFileSync(join(ROOT, "src/components/AlbumCard.tsx"), "utf-8");
    const merchCard = readFileSync(join(ROOT, "src/components/MerchCard.tsx"), "utf-8");

    expect(albumCard).toContain("compact");
    expect(merchCard).toContain("compact");
  });

  it("music page cycle assigns unique roles to at least 4 positions", () => {
    const content = readFileSync(join(ROOT, "src/app/music/page.tsx"), "utf-8");
    // Count position-specific boolean assignments (isFeatured, isWide, isTall, isCompact, etc.)
    const roleAssignments = content.match(/\bconst\s+is[A-Z]\w+\s*=\s*pos\s*===\s*\d/g) || [];

    expect(
      roleAssignments.length,
      `Music page should assign unique layout roles to at least 4 positions in the cycle (found ${roleAssignments.length})`,
    ).toBeGreaterThanOrEqual(4);
  });

  it("merch page uses both col-span and row-span for two-axis variation", () => {
    const content = readFileSync(join(ROOT, "src/app/merch/page.tsx"), "utf-8");
    const hasColSpan = /col-span-\d/.test(content);
    const hasRowSpan = /row-span-\d/.test(content);

    expect(
      hasColSpan && hasRowSpan,
      "Merch page should use both col-span and row-span for two-axis layout variation",
    ).toBe(true);
  });
});
