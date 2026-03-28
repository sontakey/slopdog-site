import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * Collect all source files (ts, tsx, css) under a directory, excluding node_modules.
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

// Pure black hex patterns (excluding SVG fill/stroke where tinted equivalents are used)
const PURE_BLACK_HEX = [
  /#000000\b/i,
  /(?<![\w.-])#000(?![\w])/i, // #000 not followed by more hex chars
];

// Pure white hex patterns
const PURE_WHITE_HEX = [
  /#ffffff\b/i,
  /(?<![\w.-])#fff(?![\w])/i, // #fff not followed by more hex chars
];

// Untinted neutral CSS variable or hardcoded values
const UNTINTED_NEUTRALS = [
  /#050a06\b/i, // old bg color
  /#111111\b/i, // old cyber-gray
  /#0f0f0f\b/i, // old cyber-card
  /#eaeaea\b/i, // old fg color
];

// Pure black/white Tailwind utility classes (bg-black, text-black, bg-white, text-white, border-black, border-white)
const PURE_BW_TAILWIND = [
  /\bbg-black\b/,
  /\btext-black\b/,
  /\bborder-black\b/,
  /\bbg-white\b/,
  /\btext-white\b/,
  /\bborder-white\b/,
];

// Default Tailwind zinc/gray classes (untinted neutrals)
const ZINC_GRAY_CLASSES = [
  /\btext-zinc-\d+\b/,
  /\bbg-zinc-\d+\b/,
  /\bborder-zinc-\d+\b/,
  /\btext-gray-\d+\b/,
  /\bbg-gray-\d+\b/,
  /\bborder-gray-\d+\b/,
];

const ROOT = join(__dirname, "../..");

// Files excluded from scanning: test fixtures (contain mock class strings)
// and Mdx.tsx (prose utility wrapper, not modifiable per PRD)
function shouldSkip(file: string): boolean {
  return (
    file.includes("__tests__") ||
    file.includes(".test.") ||
    file.endsWith("/Mdx.tsx")
  );
}

describe("Tinted neutrals — no pure black/white", () => {
  it("tailwind.config.ts defines tinted neutral palette with oklch", () => {
    const content = readFileSync(join(ROOT, "tailwind.config.ts"), "utf-8");
    // Should have oklch-based neutral scale
    expect(content).toContain("oklch(12%");
    expect(content).toContain("oklch(93%");
    // Should have bg, surface, fg tokens
    expect(content).toContain("bg:");
    expect(content).toContain("surface:");
    expect(content).toContain("fg:");
    // Should NOT have old pure neutral hex values
    expect(content).not.toMatch(/#111111/i);
    expect(content).not.toMatch(/#0f0f0f/i);
    expect(content).not.toMatch(/#eaeaea/i);
  });

  it("globals.css uses tinted CSS variables, not pure hex", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    // Should use oklch for --bg and --fg
    expect(content).toMatch(/--bg:\s*oklch/);
    expect(content).toMatch(/--fg:\s*oklch/);
    // Should NOT have old hex values
    expect(content).not.toMatch(/#050a06/);
    expect(content).not.toMatch(/#eaeaea/);
    expect(content).not.toMatch(/#d4d4d8/i);
    // Scrollbar should not use #000
    expect(content).not.toMatch(/#000(?![0-9a-f])/i);
  });

  it("no source file uses pure black/white Tailwind classes", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (shouldSkip(file)) continue;
      const content = readFileSync(file, "utf-8");
      for (const pattern of PURE_BW_TAILWIND) {
        if (pattern.test(content)) {
          violations.push(`${file} matches ${pattern}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("no source file uses untinted zinc/gray Tailwind classes", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (shouldSkip(file)) continue;
      const content = readFileSync(file, "utf-8");
      for (const pattern of ZINC_GRAY_CLASSES) {
        if (pattern.test(content)) {
          violations.push(`${file} matches ${pattern}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("no source file uses old untinted neutral hex values", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (shouldSkip(file)) continue;
      const content = readFileSync(file, "utf-8");
      for (const pattern of UNTINTED_NEUTRALS) {
        if (pattern.test(content)) {
          violations.push(`${file} matches ${pattern}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("no source file uses pure #000 or #fff hex values", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (shouldSkip(file)) continue;
      const content = readFileSync(file, "utf-8");

      for (const pattern of PURE_BLACK_HEX) {
        if (pattern.test(content)) {
          violations.push(`${file} matches ${pattern} (pure black)`);
        }
      }
      for (const pattern of PURE_WHITE_HEX) {
        if (pattern.test(content)) {
          violations.push(`${file} matches ${pattern} (pure white)`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("tailwind.config.ts neutral scale uses hue 60 for warm tinting", () => {
    const content = readFileSync(join(ROOT, "tailwind.config.ts"), "utf-8");
    // All oklch values in the neutral scale should use hue 60 (warm/amber tint)
    const oklchMatches = content.match(/oklch\([^)]+\)/g) ?? [];
    for (const match of oklchMatches) {
      // Extract the hue value (last number before closing paren or slash)
      const hue = match.match(/oklch\(\d+%\s+[\d.]+\s+(\d+)/);
      if (hue) {
        expect(Number(hue[1])).toBe(60);
      }
    }
  });
});
