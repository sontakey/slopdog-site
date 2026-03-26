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

/**
 * Gradient text is created by combining bg-gradient-to-*, bg-clip-text, and
 * text-transparent on the same element. We forbid this pattern inside any
 * heading (h1-h6) or element that looks like a metric/stat display.
 */
describe("No gradient text on headings/metrics", () => {
  const srcFiles = collectSourceFiles(join(ROOT, "src"), [".tsx", ".ts"]);

  it("no heading elements use gradient text classes", () => {
    const violations: string[] = [];

    for (const file of srcFiles) {
      if (file.includes("no-gradient-text.test")) continue;
      const content = readFileSync(file, "utf-8");

      // Match heading blocks: <h1 ... </h1> through <h6 ... </h6>
      const headingBlocks = content.match(/<h[1-6][\s\S]*?<\/h[1-6]>/g) ?? [];
      for (const block of headingBlocks) {
        if (block.includes("bg-clip-text") && block.includes("text-transparent")) {
          violations.push(`${file}: heading uses gradient text: ${block.slice(0, 100)}...`);
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
});
