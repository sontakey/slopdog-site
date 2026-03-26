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

// Purple hex values (Tailwind purple/violet/fuchsia palette)
const PURPLE_HEX = "8b5cf6|7c3aed|6d28d9|a855f7|9333ea|a78bfa|c084fc|d946ef|e879f9|c026d3|7e22ce|581c87";
// Blue hex values (Tailwind blue palette)
const BLUE_HEX = "3b82f6|2563eb|1d4ed8|60a5fa|93c5fd|3b82f6|1e40af|1e3a8a|6366f1|818cf8|4f46e5";

// Tailwind class patterns that indicate a purple-to-blue gradient
const TAILWIND_PURPLE_BLUE_PATTERNS = [
  /from-purple[-/]\S*\s[^]*?to-blue/,
  /from-violet[-/]\S*\s[^]*?to-blue/,
  /from-indigo[-/]\S*\s[^]*?to-blue/,
  /from-fuchsia[-/]\S*\s[^]*?to-blue/,
  /from-purple\s.*?to-blue/,
  /from-violet\s.*?to-blue/,
  /from-\[#(8b5cf6|7c3aed|a855f7|9333ea)\].*?to-\[#(3b82f6|2563eb|60a5fa)\]/i,
];

// CSS gradient patterns — covers linear-gradient, radial-gradient, conic-gradient
const GRADIENT_FN = "(?:linear|radial|conic)-gradient";
const CSS_PURPLE_BLUE_GRADIENT_PATTERNS = [
  new RegExp(`${GRADIENT_FN}\\([^)]*#(${PURPLE_HEX})[^)]*#(${BLUE_HEX})[^)]*\\)`, "i"),
  new RegExp(`${GRADIENT_FN}\\([^)]*purple[^)]*blue[^)]*\\)`, "i"),
  new RegExp(`${GRADIENT_FN}\\([^)]*violet[^)]*blue[^)]*\\)`, "i"),
  new RegExp(`${GRADIENT_FN}\\([^)]*indigo[^)]*blue[^)]*\\)`, "i"),
  // rgb/rgba purple-to-blue in gradients
  new RegExp(`${GRADIENT_FN}\\([^)]*rgb\\([^)]*(?:1[2-6]\\d|17\\d),\\s*[2-9]\\d,\\s*(?:2[0-5]\\d)\\)[^)]*rgb\\([^)]*[3-9]\\d,\\s*(?:1[0-5]\\d),\\s*(?:2[0-5]\\d)\\)`, "i"),
];

const PURPLE_BLUE_GRADIENT_PATTERNS = [
  ...TAILWIND_PURPLE_BLUE_PATTERNS,
  ...CSS_PURPLE_BLUE_GRADIENT_PATTERNS,
];

/** Test a string against a pattern (resets lastIndex for safety) */
function matchesPattern(content: string, pattern: RegExp): boolean {
  pattern.lastIndex = 0;
  return pattern.test(content);
}

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
    expect(content).not.toMatch(new RegExp(`#(${PURPLE_HEX})`, "i"));
  });

  it("no source file uses purple-to-blue gradient patterns", () => {
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
        if (matchesPattern(content, pattern)) {
          violations.push(`${file} matches ${pattern}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  // Verify the patterns catch real purple-to-blue gradients
  describe("pattern sanity checks", () => {
    const knownBad = [
      'class="bg-gradient-to-r from-purple-500 to-blue-500"',
      'class="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-400"',
      "background: linear-gradient(135deg, #8b5cf6, #3b82f6);",
      "background: radial-gradient(circle, #a855f7 0%, #2563eb 100%);",
      "background: conic-gradient(from 0deg, #7c3aed, #1d4ed8);",
      "linear-gradient(to right, purple, blue)",
      "linear-gradient(90deg, violet, blue)",
    ];

    for (const sample of knownBad) {
      it(`detects: ${sample.slice(0, 60)}...`, () => {
        const matched = PURPLE_BLUE_GRADIENT_PATTERNS.some((p) =>
          matchesPattern(sample, p)
        );
        expect(matched).toBe(true);
      });
    }

    const knownGood = [
      'class="bg-gradient-to-r from-primary to-accent-amber"',
      "background: linear-gradient(135deg, #00ff41, #f5a623);",
      "background: radial-gradient(circle, #00ff41 0%, transparent 70%);",
      'class="text-purple-500"', // standalone purple, not a gradient
      'class="bg-blue-500"', // standalone blue, not a gradient
    ];

    for (const sample of knownGood) {
      it(`allows: ${sample.slice(0, 60)}...`, () => {
        const matched = PURPLE_BLUE_GRADIENT_PATTERNS.some((p) =>
          matchesPattern(sample, p)
        );
        expect(matched).toBe(false);
      });
    }
  });
});
