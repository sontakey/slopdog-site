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

// Files where backdrop-blur is allowed for functional reasons (e.g. sticky headers)
const FUNCTIONAL_BLUR_ALLOWLIST = ["Header.tsx"];

const ROOT = join(__dirname, "../..");

describe("No decorative glassmorphism", () => {
  it("AlbumCard badge does not use backdrop-blur", () => {
    const content = readFileSync(
      join(ROOT, "src/components/AlbumCard.tsx"),
      "utf-8"
    );
    expect(content).not.toMatch(/backdrop-blur/);
  });

  it("backdrop-blur only appears in functionally allowed files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      // Skip test files
      if (file.includes(".test.")) continue;
      // Skip allowlisted files
      if (FUNCTIONAL_BLUR_ALLOWLIST.some((name) => file.endsWith(name)))
        continue;

      const content = readFileSync(file, "utf-8");
      if (/backdrop-blur/.test(content)) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });
});
