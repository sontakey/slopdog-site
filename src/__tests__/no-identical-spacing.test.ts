import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "../..");

/**
 * Pages must not all share the same vertical padding (py-*), gap, or
 * section-margin values.  Identical spacing everywhere creates monotonous
 * visual rhythm — a hallmark of AI-generated design.
 */

/**
 * Collect all source files under a directory, excluding node_modules.
 */
function collectSourceFiles(dir: string, exts: string[]): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectSourceFiles(full, exts));
    } else if (exts.some((ext) => full.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

const PAGES = [
  "src/app/page.tsx",
  "src/app/music/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/merch/page.tsx",
  "src/app/about/page.tsx",
  "src/app/music/[slug]/page.tsx",
  "src/app/blog/[slug]/page.tsx",
];

/** Extract unique py-* values from content */
function extractPyValues(content: string): string[] {
  const matches = content.match(/\bpy-(\d+)\b/g) ?? [];
  return [...new Set(matches)];
}

/** Extract unique gap-* values (grid/flex gaps) from content */
function extractGapValues(content: string): string[] {
  const matches = content.match(/\bgap-(\d+)\b/g) ?? [];
  return [...new Set(matches)];
}

/** Extract unique section-level top margin values (mt-6 and above) */
function extractSectionMargins(content: string): string[] {
  const matches = content.match(/\bmt-(\d+)\b/g) ?? [];
  return [...new Set(matches.filter((m) => {
    const num = parseInt(m.replace("mt-", ""), 10);
    return num >= 6; // only section-level margins, not component-level
  }))];
}

/**
 * Extract py-* values from HTML class="" attributes.
 */
function extractPyValuesFromHtml(content: string): string[] {
  const classMatches = content.match(/class="[^"]*"/g) ?? [];
  const pySet = new Set<string>();
  for (const cls of classMatches) {
    const pyMatches = cls.match(/\bpy-(\d+)\b/g) ?? [];
    for (const m of pyMatches) pySet.add(m);
  }
  return [...pySet];
}

/**
 * Extract gap-* values from HTML class="" attributes.
 */
function extractGapValuesFromHtml(content: string): string[] {
  const classMatches = content.match(/class="[^"]*"/g) ?? [];
  const gapSet = new Set<string>();
  for (const cls of classMatches) {
    const gapMatches = cls.match(/\bgap-(\d+)\b/g) ?? [];
    for (const m of gapMatches) gapSet.add(m);
  }
  return [...gapSet];
}

describe("No identical spacing everywhere", () => {
  // ── py-* vertical padding checks ──────────────────────────────────

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

  // ── gap-* variety checks ──────────────────────────────────────────

  it("pages use at least 3 distinct gap-* values across all pages", () => {
    const allGaps = new Set<string>();
    for (const file of PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      for (const v of extractGapValues(content)) {
        allGaps.add(v);
      }
    }
    expect(
      allGaps.size,
      `Only found ${allGaps.size} distinct gap-* value(s): ${[...allGaps].join(", ")}. Vary grid/flex gaps for visual rhythm.`,
    ).toBeGreaterThanOrEqual(3);
  });

  it("homepage uses more than one gap-* value", () => {
    const content = readFileSync(join(ROOT, "src/app/page.tsx"), "utf-8");
    const gapValues = extractGapValues(content);
    expect(
      gapValues.length,
      `Homepage uses only one gap-* value (${gapValues[0]}). Vary gaps between sections.`,
    ).toBeGreaterThanOrEqual(2);
  });

  // ── section margin (mt-*) variety checks ──────────────────────────

  it("pages use at least 2 distinct section-level mt-* values (mt-6+)", () => {
    const allMargins = new Set<string>();
    for (const file of PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      for (const v of extractSectionMargins(content)) {
        allMargins.add(v);
      }
    }
    expect(
      allMargins.size,
      `Only found ${allMargins.size} section-level mt-* value(s): ${[...allMargins].join(", ")}. Vary vertical spacing between sections.`,
    ).toBeGreaterThanOrEqual(2);
  });

  // ── no single gap-* dominates ─────────────────────────────────────

  it("no single gap-* value is used by more than half the pages", () => {
    const valueCounts = new Map<string, number>();
    for (const file of PAGES) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      const values = extractGapValues(content);
      for (const v of values) {
        valueCounts.set(v, (valueCounts.get(v) ?? 0) + 1);
      }
    }
    const threshold = Math.ceil(PAGES.length / 2);
    for (const [value, count] of valueCounts) {
      expect(
        count,
        `${value} appears in ${count}/${PAGES.length} pages. No single gap value should dominate.`,
      ).toBeLessThanOrEqual(threshold);
    }
  });

  // ── stitch-design HTML checks ─────────────────────────────────────

  it("stitch-design HTML files use varied py-* values", () => {
    const stitchDir = join(ROOT, "stitch-designs");
    if (!existsSync(stitchDir)) return;

    const htmlFiles = collectSourceFiles(stitchDir, [".html"]);
    if (htmlFiles.length === 0) return;

    const allPy = new Set<string>();
    for (const file of htmlFiles) {
      const content = readFileSync(file, "utf-8");
      for (const v of extractPyValuesFromHtml(content)) {
        allPy.add(v);
      }
    }
    expect(
      allPy.size,
      `Stitch designs use only ${allPy.size} distinct py-* value(s): ${[...allPy].join(", ")}. Design mockups should demonstrate spacing variety.`,
    ).toBeGreaterThanOrEqual(2);
  });

  it("stitch-design HTML files use varied gap-* values", () => {
    const stitchDir = join(ROOT, "stitch-designs");
    if (!existsSync(stitchDir)) return;

    const htmlFiles = collectSourceFiles(stitchDir, [".html"]);
    if (htmlFiles.length === 0) return;

    const allGaps = new Set<string>();
    for (const file of htmlFiles) {
      const content = readFileSync(file, "utf-8");
      for (const v of extractGapValuesFromHtml(content)) {
        allGaps.add(v);
      }
    }
    expect(
      allGaps.size,
      `Stitch designs use only ${allGaps.size} distinct gap-* value(s): ${[...allGaps].join(", ")}. Design mockups should demonstrate gap variety.`,
    ).toBeGreaterThanOrEqual(2);
  });

  // ── CSS spacing uniformity checks ─────────────────────────────────

  it("globals.css does not define a single repeating padding/margin custom property for all sections", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8",
    );
    // Flag if a --section-spacing or --page-padding variable is used to force
    // uniform spacing (a telltale of AI-generated "consistency")
    expect(content).not.toMatch(/--section-spacing\s*:/);
    expect(content).not.toMatch(/--page-padding\s*:/);
    expect(content).not.toMatch(/--uniform-spacing\s*:/);
  });

  // ── regression: synthetic monotonous spacing detection ────────────

  it("detects when all pages share the same py-* value (regression)", () => {
    // Simulate monotonous content: every "page" only uses py-16
    const monotonousPages = [
      'className="py-16"',
      'className="py-16"',
      'className="py-16"',
    ];
    const allValues = new Set<string>();
    for (const content of monotonousPages) {
      const matches = content.match(/\bpy-(\d+)\b/g) ?? [];
      for (const m of matches) allValues.add(m);
    }
    // Should fail the "at least 3 distinct" check
    expect(allValues.size).toBeLessThan(3);
  });

  it("detects when a single py-* value dominates (regression)", () => {
    // Simulate: py-16 appears in 5 out of 7 "pages"
    const pageContents = [
      "py-16 py-20",
      "py-16",
      "py-16",
      "py-16",
      "py-16",
      "py-12",
      "py-24",
    ];
    const valueCounts = new Map<string, number>();
    for (const content of pageContents) {
      const matches = [...new Set(content.match(/\bpy-(\d+)\b/g) ?? [])];
      for (const v of matches) {
        valueCounts.set(v, (valueCounts.get(v) ?? 0) + 1);
      }
    }
    const threshold = Math.ceil(pageContents.length / 2); // 4
    const dominant = [...valueCounts.entries()].find(
      ([, count]) => count > threshold,
    );
    // py-16 appears in 5 pages — should exceed the threshold
    expect(dominant).toBeDefined();
    expect(dominant![0]).toBe("py-16");
  });

  it("detects when all gap values are identical (regression)", () => {
    const monotonousGaps = [
      'className="gap-6"',
      'className="gap-6"',
      'className="gap-6"',
    ];
    const allGaps = new Set<string>();
    for (const content of monotonousGaps) {
      const matches = content.match(/\bgap-(\d+)\b/g) ?? [];
      for (const m of matches) allGaps.add(m);
    }
    expect(allGaps.size).toBeLessThan(3);
  });
});
