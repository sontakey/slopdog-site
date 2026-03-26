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

const ROOT = join(__dirname, "../..");

// Detect cubic-bezier with overshoot (any parameter > 1 indicates bounce/elastic)
function hasBounceEasing(content: string): boolean {
  const cubicBezierRegex =
    /cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g;
  let match;
  while ((match = cubicBezierRegex.exec(content)) !== null) {
    const [, , p2, , p4] = match;
    // p2 or p4 > 1 or < 0 indicates overshoot (bounce/elastic behavior)
    if (
      parseFloat(p2) > 1 ||
      parseFloat(p2) < 0 ||
      parseFloat(p4) > 1 ||
      parseFloat(p4) < 0
    ) {
      return true;
    }
  }
  return false;
}

describe("No bounce/elastic easing", () => {
  it("source files do not use animate-bounce class", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      if (/animate-bounce/.test(content)) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });

  it("stitch-designs do not use animate-bounce class", () => {
    const dir = join(ROOT, "stitch-designs");
    const files = collectSourceFiles(dir, [".html"]);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      if (/animate-bounce/.test(content)) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });

  it("no elastic or spring easing keywords in source files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      if (/\belastic\b/.test(content) || /\bspring\b/.test(content)) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });

  it("tailwind config does not define bounce keyframes", () => {
    const content = readFileSync(
      join(ROOT, "tailwind.config.ts"),
      "utf-8"
    );
    expect(content).not.toMatch(/bounce/);
    expect(content).not.toMatch(/elastic/);
    expect(content).not.toMatch(/spring/);
  });

  it("no cubic-bezier with overshoot values in source files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      if (hasBounceEasing(content)) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });
});
