import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

/**
 * Collect all source files (ts, tsx, css, html) under a directory, excluding node_modules.
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

// Tailwind class patterns that indicate a purple-to-blue gradient
const TAILWIND_PURPLE_BLUE_PATTERNS = [
  /from-purple-\d+\s.*?to-blue-\d+/,
  /from-violet-\d+\s.*?to-blue-\d+/,
  /from-indigo-\d+\s.*?to-blue-\d+/,
  /from-fuchsia-\d+\s.*?to-blue-\d+/,
  /from-primary\s.*?to-blue-\d+/,
  /from-purple\s.*?to-blue/,
  /from-violet\s.*?to-blue/,
];

// CSS linear-gradient patterns with purple-to-blue hex/named colors
const CSS_PURPLE_BLUE_GRADIENT_PATTERNS = [
  /linear-gradient\([^)]*#(8b5cf6|7c3aed|6d28d9|a855f7|9333ea|a78bfa|c084fc)[^)]*#(3b82f6|2563eb|1d4ed8|60a5fa|93c5fd)[^)]*\)/i,
  /linear-gradient\([^)]*purple[^)]*blue[^)]*\)/i,
  /linear-gradient\([^)]*violet[^)]*blue[^)]*\)/i,
  /linear-gradient\([^)]*indigo[^)]*blue[^)]*\)/i,
];

const PURPLE_BLUE_GRADIENT_PATTERNS = [
  ...TAILWIND_PURPLE_BLUE_PATTERNS,
  ...CSS_PURPLE_BLUE_GRADIENT_PATTERNS,
];

const ROOT = join(__dirname, "../..");

describe("No purple-to-blue gradients", () => {
  it("page.tsx contains no purple-to-blue gradient classes", () => {
    const content = readFileSync(join(ROOT, "src/app/page.tsx"), "utf-8");
    for (const pattern of PURPLE_BLUE_GRADIENT_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
  });

  it("globals.css contains no purple-to-blue gradients", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    for (const pattern of PURPLE_BLUE_GRADIENT_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
  });

  it("tailwind.config.ts defines no purple/violet gradient colors", () => {
    const content = readFileSync(join(ROOT, "tailwind.config.ts"), "utf-8");
    expect(content).not.toMatch(/#(8b5cf6|7c3aed|6d28d9|a855f7|9333ea)/i);
  });

  it("no source file uses purple-to-blue gradient classes", () => {
    const srcFiles = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const designFiles = collectSourceFiles(join(ROOT, "stitch-designs"), [
      ".html",
    ]);
    const files = [...srcFiles, ...designFiles];
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes("no-purple-blue-gradient.test")) continue;
      const content = readFileSync(file, "utf-8");
      for (const pattern of PURPLE_BLUE_GRADIENT_PATTERNS) {
        if (pattern.test(content)) {
          violations.push(`${file} matches ${pattern}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
