import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
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

// Cyan-family hex values to reject
const CYAN_HEX_PATTERNS = [
  /#00ffff/i, // pure cyan hex
  /#0ff\b/i, // shorthand cyan
  /#00f5d4/i, // teal accent that was removed
  /#00e5ff/i, // Material Design cyan A400
  /#00bcd4/i, // Material Design cyan 500
  /#00acc1/i, // Material Design cyan 700
  /#26c6da/i, // Material Design cyan 400
  /#4dd0e1/i, // Material Design cyan 300
  /#80deea/i, // Material Design cyan 200
  /#00897b/i, // Material Design teal 600
  /#009688/i, // Material Design teal 500
  /#67e8f9/i, // Tailwind cyan-300
  /#22d3ee/i, // Tailwind cyan-400
  /#06b6d4/i, // Tailwind cyan-500
  /#0891b2/i, // Tailwind cyan-600
  /#2dd4bf/i, // Tailwind teal-400
  /#14b8a6/i, // Tailwind teal-500
  /#0d9488/i, // Tailwind teal-600
];

// CSS named colors and Tailwind class prefixes for cyan/teal
const CYAN_CLASS_PATTERNS = [
  /\bcyan\b/i, // css named color or tailwind cyan
  /\bteal\b/i, // css named color or tailwind teal
  /\baqua\b/i, // css synonym for cyan
  /\btext-cyan-/i, // tailwind cyan text classes
  /\bbg-cyan-/i, // tailwind cyan bg classes
  /\bborder-cyan-/i, // tailwind cyan border classes
  /\bring-cyan-/i, // tailwind cyan ring classes
  /\bfill-cyan-/i, // tailwind cyan fill classes
  /\bstroke-cyan-/i, // tailwind cyan stroke classes
  /\bfrom-cyan-/i, // tailwind cyan gradient from
  /\bto-cyan-/i, // tailwind cyan gradient to
  /\bvia-cyan-/i, // tailwind cyan gradient via
  /\bdecoration-cyan-/i, // tailwind cyan text decoration
  /\boutline-cyan-/i, // tailwind cyan outline
  /\bdivide-cyan-/i, // tailwind cyan divide
  /\baccent-cyan-/i, // tailwind cyan accent
  /\bshadow-cyan-/i, // tailwind cyan shadow
  /\bplaceholder-cyan-/i, // tailwind cyan placeholder
  /\btext-teal-/i, // tailwind teal text classes
  /\bbg-teal-/i, // tailwind teal bg classes
  /\bborder-teal-/i, // tailwind teal border classes
  /\bring-teal-/i, // tailwind teal ring classes
  /\bfill-teal-/i, // tailwind teal fill classes
  /\bstroke-teal-/i, // tailwind teal stroke classes
  /\bfrom-teal-/i, // tailwind teal gradient from
  /\bto-teal-/i, // tailwind teal gradient to
  /\bvia-teal-/i, // tailwind teal gradient via
  /\bdecoration-teal-/i, // tailwind teal text decoration
  /\boutline-teal-/i, // tailwind teal outline
  /\bdivide-teal-/i, // tailwind teal divide
  /\baccent-teal-/i, // tailwind teal accent
  /\bshadow-teal-/i, // tailwind teal shadow
  /\bplaceholder-teal-/i, // tailwind teal placeholder
];

// All patterns combined
const CYAN_PATTERNS = [...CYAN_HEX_PATTERNS, ...CYAN_CLASS_PATTERNS];

// OKLCH hues in the cyan range (160-210) indicate cyan/teal colors
const OKLCH_CYAN_HUE = /oklch\(\s*\d+%?\s+[\d.]+\s+(1[6-9]\d|20\d|210)\s*\)/i;

const ROOT = join(__dirname, "../..");

describe("No cyan-on-dark palette", () => {
  it("tailwind.config.ts contains no cyan/teal color definitions", () => {
    const content = readFileSync(join(ROOT, "tailwind.config.ts"), "utf-8");
    for (const pattern of CYAN_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
  });

  it("tailwind.config.ts contains no OKLCH colors in the cyan hue range", () => {
    const content = readFileSync(join(ROOT, "tailwind.config.ts"), "utf-8");
    expect(content).not.toMatch(OKLCH_CYAN_HUE);
  });

  it("globals.css contains no cyan/teal colors", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    for (const pattern of CYAN_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
  });

  it("globals.css contains no OKLCH colors in the cyan hue range", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    expect(content).not.toMatch(OKLCH_CYAN_HUE);
  });

  it("SlopdogCharacter.tsx contains no cyan/teal colors", () => {
    const content = readFileSync(
      join(ROOT, "src/components/SlopdogCharacter.tsx"),
      "utf-8"
    );
    for (const pattern of CYAN_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
  });

  it("no source file uses cyan/teal Tailwind classes or hex values", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes("no-cyan-palette.test")) continue;
      const content = readFileSync(file, "utf-8");
      for (const pattern of CYAN_PATTERNS) {
        if (pattern.test(content)) {
          violations.push(`${file} matches ${pattern}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("no source file uses OKLCH colors in the cyan hue range", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes("no-cyan-palette.test")) continue;
      const content = readFileSync(file, "utf-8");
      if (OKLCH_CYAN_HUE.test(content)) {
        violations.push(`${file} uses OKLCH color in cyan hue range`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("stitch-design HTML files contain no cyan/teal colors", () => {
    const stitchDir = join(ROOT, "stitch-designs");
    if (!existsSync(stitchDir)) return;

    const files = collectSourceFiles(stitchDir, [".html"]);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      for (const pattern of CYAN_PATTERNS) {
        if (pattern.test(content)) {
          violations.push(`${file} matches ${pattern}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("accent.amber replaces accent.teal in tailwind config", () => {
    const content = readFileSync(join(ROOT, "tailwind.config.ts"), "utf-8");
    expect(content).toContain('"#f5a623"');
    expect(content).toContain("amber");
  });
});
