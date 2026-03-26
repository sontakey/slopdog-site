import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

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

const ROOT = join(__dirname, "../..");

// Detect cubic-bezier with overshoot (any control point y-value > 1 or < 0)
function hasBounceEasing(content: string): { found: boolean; lines: number[] } {
  const cubicBezierRegex =
    /cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g;
  const lines: number[] = [];
  const contentLines = content.split("\n");

  for (let i = 0; i < contentLines.length; i++) {
    let match;
    while ((match = cubicBezierRegex.exec(contentLines[i])) !== null) {
      const [, , p2, , p4] = match;
      if (
        parseFloat(p2) > 1 ||
        parseFloat(p2) < 0 ||
        parseFloat(p4) > 1 ||
        parseFloat(p4) < 0
      ) {
        lines.push(i + 1);
      }
    }
  }

  return { found: lines.length > 0, lines };
}

// Bounce/elastic keyword patterns
const BOUNCE_KEYWORDS = [
  /\banimate-bounce\b/,
  /\belastic\b/,
  /\bspring\b/,
  /\bbounce\b/,
  /\bwobble\b/,
  /\brubberBand\b/i,
  /\bjello\b/i,
];

// CSS timing-function keywords that indicate bounce/elastic
const TIMING_FUNCTION_PATTERNS = [
  /animation-timing-function\s*:\s*[^;]*\b(?:bounce|elastic|spring)\b/i,
  /transition-timing-function\s*:\s*[^;]*\b(?:bounce|elastic|spring)\b/i,
  /@apply[^;]*animate-bounce/,
];

function findKeywordViolations(
  content: string,
  patterns: RegExp[]
): { line: number; text: string }[] {
  const violations: { line: number; text: string }[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    for (const pattern of patterns) {
      if (pattern.test(lines[i])) {
        violations.push({ line: i + 1, text: lines[i].trim() });
      }
    }
  }

  return violations;
}

describe("No bounce/elastic easing", () => {
  it("source files do not use bounce/elastic class names or keywords", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      const hits = findKeywordViolations(content, BOUNCE_KEYWORDS);
      for (const hit of hits) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(`${relative}:${hit.line} → ${hit.text}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("stitch-designs do not use bounce/elastic class names or keywords", () => {
    const dir = join(ROOT, "stitch-designs");
    const files = collectSourceFiles(dir, [".html"]);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      const hits = findKeywordViolations(content, BOUNCE_KEYWORDS);
      for (const hit of hits) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(`${relative}:${hit.line} → ${hit.text}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("no CSS timing-function properties reference bounce/elastic/spring", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      const hits = findKeywordViolations(content, TIMING_FUNCTION_PATTERNS);
      for (const hit of hits) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(`${relative}:${hit.line} → ${hit.text}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("tailwind config does not define bounce/elastic keyframes or animations", () => {
    const content = readFileSync(
      join(ROOT, "tailwind.config.ts"),
      "utf-8"
    );
    expect(content).not.toMatch(/bounce/i);
    expect(content).not.toMatch(/elastic/i);
    expect(content).not.toMatch(/spring/i);
    expect(content).not.toMatch(/wobble/i);
    expect(content).not.toMatch(/rubberBand/i);
    expect(content).not.toMatch(/jello/i);
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
      const result = hasBounceEasing(content);
      if (result.found) {
        const relative = file.replace(ROOT + "/", "");
        for (const line of result.lines) {
          violations.push(`${relative}:${line}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("no cubic-bezier with overshoot values in stitch-designs", () => {
    const dir = join(ROOT, "stitch-designs");
    const files = collectSourceFiles(dir, [".html"]);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      const result = hasBounceEasing(content);
      if (result.found) {
        const relative = file.replace(ROOT + "/", "");
        for (const line of result.lines) {
          violations.push(`${relative}:${line}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("globals.css does not contain bounce/elastic animations", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    expect(content).not.toMatch(/bounce/i);
    expect(content).not.toMatch(/elastic/i);
    expect(content).not.toMatch(/spring/i);
  });

  it("no Tailwind arbitrary animation values with bounce/elastic", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const arbitraryBounce = /\[animation:[^\]]*(?:bounce|elastic|spring|wobble)\b[^\]]*\]/i;
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (arbitraryBounce.test(lines[i])) {
          const relative = file.replace(ROOT + "/", "");
          violations.push(`${relative}:${i + 1} → ${lines[i].trim()}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("no inline style objects with bounce/elastic easing", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [".tsx", ".ts"]);
    const inlineEasing =
      /(?:transition|animation|easing)\s*[:=]\s*[`"'][^`"']*(?:bounce|elastic|spring|wobble)\b/i;
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (inlineEasing.test(lines[i])) {
          const relative = file.replace(ROOT + "/", "");
          violations.push(`${relative}:${i + 1} → ${lines[i].trim()}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("no CSS animation shorthand with bounce/elastic easing", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [".css"]);
    const animShorthand =
      /animation\s*:\s*[^;]*\b(?:bounce|elastic|spring|wobble)\b/i;
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (animShorthand.test(lines[i])) {
          const relative = file.replace(ROOT + "/", "");
          violations.push(`${relative}:${i + 1} → ${lines[i].trim()}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
