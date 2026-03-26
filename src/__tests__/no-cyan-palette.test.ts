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

// Cyan-family color patterns to reject
const CYAN_PATTERNS = [
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
  /\bcyan\b/i, // css named color or tailwind cyan
  /\bteal\b/i, // css named color or tailwind teal
  /\btext-cyan-/i, // tailwind cyan text classes
  /\bbg-cyan-/i, // tailwind cyan bg classes
  /\bborder-cyan-/i, // tailwind cyan border classes
  /\btext-teal-/i, // tailwind teal text classes
  /\bbg-teal-/i, // tailwind teal bg classes
  /\bborder-teal-/i, // tailwind teal border classes
];

const ROOT = join(__dirname, "../..");

describe("No cyan-on-dark palette", () => {
  it("tailwind.config.ts contains no cyan/teal color definitions", () => {
    const content = readFileSync(join(ROOT, "tailwind.config.ts"), "utf-8");
    for (const pattern of CYAN_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
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
      // Skip this test file itself
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

  it("accent.amber replaces accent.teal in tailwind config", () => {
    const content = readFileSync(join(ROOT, "tailwind.config.ts"), "utf-8");
    expect(content).toContain('"#f5a623"');
    expect(content).toContain("amber");
  });
});
