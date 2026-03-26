import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "../..");

/**
 * Pages must not all share the same vertical padding (py-*) values.
 * Identical spacing everywhere creates monotonous visual rhythm —
 * a hallmark of AI-generated design.
 */

const PAGES = [
  "src/app/page.tsx",
  "src/app/music/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/merch/page.tsx",
  "src/app/about/page.tsx",
  "src/app/music/[slug]/page.tsx",
  "src/app/blog/[slug]/page.tsx",
];

function extractPyValues(content: string): string[] {
  const matches = content.match(/\bpy-(\d+)\b/g) ?? [];
  return [...new Set(matches)];
}

describe("No identical spacing everywhere", () => {
  it("listing pages use at least 3 distinct py-* values across all pages", () => {
    const allValues = new Set<string>();
    for (const file of PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      for (const v of extractPyValues(content)) {
        allValues.add(v);
      }
    }
    expect(
      allValues.size,
      `Only found ${allValues.size} distinct py-* value(s) across pages: ${[...allValues].join(", ")}. Use varied spacing for visual rhythm.`,
    ).toBeGreaterThanOrEqual(3);
  });

  it("homepage sections do not all share the same py-* value", () => {
    const content = readFileSync(join(ROOT, "src/app/page.tsx"), "utf-8");
    const pyValues = extractPyValues(content);
    expect(
      pyValues.length,
      `Homepage uses only one py-* value (${pyValues[0]}). Vary section padding for rhythm.`,
    ).toBeGreaterThanOrEqual(2);
  });

  it("no single py-* value is used by more than half the pages", () => {
    const valueCounts = new Map<string, number>();
    for (const file of PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      const values = extractPyValues(content);
      for (const v of values) {
        valueCounts.set(v, (valueCounts.get(v) ?? 0) + 1);
      }
    }
    const threshold = Math.ceil(PAGES.length / 2);
    for (const [value, count] of valueCounts) {
      expect(
        count,
        `${value} appears in ${count}/${PAGES.length} pages. No single spacing value should dominate.`,
      ).toBeLessThanOrEqual(threshold);
    }
  });
});
