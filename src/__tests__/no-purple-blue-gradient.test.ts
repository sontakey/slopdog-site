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

// Patterns that indicate a purple-to-blue gradient
const PURPLE_BLUE_GRADIENT_PATTERNS = [
  /from-purple-\d+\s.*?to-blue-\d+/,
  /from-violet-\d+\s.*?to-blue-\d+/,
  /from-indigo-\d+\s.*?to-blue-\d+/,
  /from-fuchsia-\d+\s.*?to-blue-\d+/,
  /from-primary\s.*?to-blue-\d+/,
  /from-purple\s.*?to-blue/,
  /from-violet\s.*?to-blue/,
];

const ROOT = join(__dirname, "../..");

describe("No purple-to-blue gradients", () => {
  it("page.tsx contains no purple-to-blue gradient classes", () => {
    const content = readFileSync(join(ROOT, "src/app/page.tsx"), "utf-8");
    for (const pattern of PURPLE_BLUE_GRADIENT_PATTERNS) {
      expect(content).not.toMatch(pattern);
    }
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
