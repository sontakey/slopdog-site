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

// Files where font-mono is allowed for functional reasons (displaying raw code/markdown)
const FONT_MONO_ALLOWLIST = ["ViewToggle.tsx"];

describe("No monospace-as-lazy-tech-vibes", () => {
  it("font-mono only appears in allowlisted files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      if (FONT_MONO_ALLOWLIST.some((name) => file.endsWith(name))) continue;

      const content = readFileSync(file, "utf-8");
      if (/font-mono/.test(content)) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });

  it("ViewToggle only uses font-mono on pre elements", () => {
    const content = readFileSync(
      join(ROOT, "src/components/ViewToggle.tsx"),
      "utf-8"
    );
    const lines = content.split("\n");
    for (const line of lines) {
      if (/font-mono/.test(line)) {
        expect(line).toMatch(/<pre\b/);
      }
    }
  });

  it("no inline monospace font-family styles in source files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      if (/font-family:\s*monospace/.test(content)) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });

  it("tailwind config does not define a custom monospace font", () => {
    const content = readFileSync(
      join(ROOT, "tailwind.config.ts"),
      "utf-8"
    );
    // The default mono stack is fine for code blocks, but custom monospace
    // fonts imported via next/font would indicate intentional monospace styling
    expect(content).not.toMatch(/--font-.*mono/);
  });
});
