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

/** Tailwind gradient-text class combo */
const GRADIENT_TEXT_CLASSES = ["bg-clip-text", "text-transparent"];

/** Inline-style gradient-text patterns */
const GRADIENT_TEXT_INLINE = [
  /background-clip:\s*text/,
  /-webkit-background-clip:\s*text/,
  /-webkit-text-fill-color:\s*transparent/,
];

function hasGradientText(block: string): boolean {
  const hasTailwind =
    GRADIENT_TEXT_CLASSES.every((cls) => block.includes(cls));
  const hasInline =
    GRADIENT_TEXT_INLINE.some((rx) => rx.test(block));
  return hasTailwind || hasInline;
}

/**
 * Gradient text is created by combining bg-clip-text + text-transparent (Tailwind)
 * or background-clip: text + transparent fill (inline styles).
 * We forbid this pattern inside any heading (h1-h6) or metric/stat element
 * (prices, counters, stat numbers).
 */
describe("No gradient text on headings/metrics", () => {
  const srcFiles = collectSourceFiles(join(ROOT, "src"), [".tsx", ".ts"]);
  const cssFiles = collectSourceFiles(join(ROOT, "src"), [".css"]);

  it("no heading elements use gradient text classes", () => {
    const violations: string[] = [];

    for (const file of srcFiles) {
      if (file.includes("no-gradient-text.test")) continue;
      const content = readFileSync(file, "utf-8");

      const headingBlocks = content.match(/<h[1-6][\s\S]*?<\/h[1-6]>/g) ?? [];
      for (const block of headingBlocks) {
        if (hasGradientText(block)) {
          violations.push(`${file}: heading uses gradient text: ${block.slice(0, 120)}...`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("no metric/price/stat elements use gradient text", () => {
    // Patterns that identify metric-like JSX blocks: price displays, stats, badges
    const metricPatterns = [
      /\$\d+/,           // dollar amounts like $9.99
      /text-\d*xl\b.*font-bold/,  // large bold numbers (stat style)
    ];
    const violations: string[] = [];

    for (const file of srcFiles) {
      if (file.includes("no-gradient-text.test")) continue;
      const content = readFileSync(file, "utf-8");

      // Match self-contained JSX elements that look like metrics/prices
      // e.g. <div className="text-4xl font-bold ...">$9.99</div>
      // or   <span className="text-2xl font-bold ...">1,234</span>
      const blocks =
        content.match(/<(?:div|span|p)[^>]*>[\s\S]*?<\/(?:div|span|p)>/g) ?? [];

      for (const block of blocks) {
        const isMetric = metricPatterns.some((rx) => rx.test(block));
        if (isMetric && hasGradientText(block)) {
          violations.push(`${file}: metric/price uses gradient text: ${block.slice(0, 120)}...`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("page.tsx hero heading uses solid color, not gradient", () => {
    const content = readFileSync(join(ROOT, "src/app/page.tsx"), "utf-8");
    const h1Blocks = content.match(/<h1[\s\S]*?<\/h1>/g) ?? [];
    expect(h1Blocks.length).toBeGreaterThan(0);

    for (const block of h1Blocks) {
      expect(block).not.toContain("bg-clip-text");
      expect(block).not.toContain("text-transparent");
      expect(block).not.toMatch(/bg-gradient-to-\w/);
    }
  });

  it("CSS files do not apply gradient text to headings or metric selectors", () => {
    const violations: string[] = [];
    // Selectors that target headings or stats
    const headingOrMetricSelector = /(?:h[1-6]|\.stat|\.metric|\.price|\.counter)/;

    for (const file of cssFiles) {
      const content = readFileSync(file, "utf-8");

      // Check for background-clip: text anywhere in the CSS
      if (/background-clip:\s*text/.test(content)) {
        // Extract the rule block(s) containing background-clip: text
        const ruleBlocks = content.match(/[^{}]*\{[^}]*background-clip:\s*text[^}]*\}/g) ?? [];
        for (const rule of ruleBlocks) {
          if (headingOrMetricSelector.test(rule)) {
            violations.push(`${file}: CSS rule applies gradient text to heading/metric: ${rule.slice(0, 120)}...`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
