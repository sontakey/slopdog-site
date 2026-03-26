import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "../..");

/**
 * Pages that render card grids must use varied sizing (col-span / row-span)
 * instead of uniform equal-width columns for every card.
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
  }

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
});
