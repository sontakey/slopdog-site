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
      if (file.includes(".test.")) continue;
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

  it("no raw CSS backdrop-filter blur outside allowlisted files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      if (FUNCTIONAL_BLUR_ALLOWLIST.some((name) => file.endsWith(name)))
        continue;

      const content = readFileSync(file, "utf-8");
      // Catch raw CSS: backdrop-filter: blur(...) or @apply backdrop-blur
      if (
        /backdrop-filter\s*:\s*blur\(/.test(content) ||
        /@apply[^;]*backdrop-blur/.test(content)
      ) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });

  it("no backdrop-saturate used for glass effects outside allowlisted files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      if (FUNCTIONAL_BLUR_ALLOWLIST.some((name) => file.endsWith(name)))
        continue;

      const content = readFileSync(file, "utf-8");
      if (/backdrop-saturate/.test(content)) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });

  it("no glass or frosted class names indicating decorative glass effects", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;

      const content = readFileSync(file, "utf-8");
      // Catch class names or CSS selectors referencing glass/frosted styling
      if (
        /\bglass(?:morphism)?\b/i.test(content) ||
        /\bfrosted\b/i.test(content)
      ) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });

  it("tailwind config does not define glass-related utilities", () => {
    const content = readFileSync(
      join(ROOT, "tailwind.config.ts"),
      "utf-8"
    );
    expect(content).not.toMatch(/glass/i);
    expect(content).not.toMatch(/frosted/i);
    expect(content).not.toMatch(/backdrop/i);
  });

  it("MerchCard does not use backdrop-blur or backdrop-filter", () => {
    const content = readFileSync(
      join(ROOT, "src/components/MerchCard.tsx"),
      "utf-8"
    );
    expect(content).not.toMatch(/backdrop-blur/);
    expect(content).not.toMatch(/backdrop-filter/);
  });

  it("BeatLicenseSection does not use backdrop-blur or backdrop-filter", () => {
    const content = readFileSync(
      join(ROOT, "src/components/BeatLicenseSection.tsx"),
      "utf-8"
    );
    expect(content).not.toMatch(/backdrop-blur/);
    expect(content).not.toMatch(/backdrop-filter/);
  });

  it("AlbumCard badge uses a solid background, not translucent", () => {
    const content = readFileSync(
      join(ROOT, "src/components/AlbumCard.tsx"),
      "utf-8"
    );
    // Badge positioned over an image should use a solid bg, not bg-color/opacity
    const badgeLines = content
      .split("\n")
      .filter((l) => l.includes("badge") || l.includes("z-20"));
    for (const line of badgeLines) {
      expect(line).not.toMatch(/bg-[a-z-]+\/\d{1,2}\b/);
    }
  });

  it("MerchCard sold-out button uses a solid background", () => {
    const content = readFileSync(
      join(ROOT, "src/components/MerchCard.tsx"),
      "utf-8"
    );
    // The disabled SOLD OUT button should not use a translucent bg over content
    const soldOutLines = content
      .split("\n")
      .filter((l) => /SOLD\s*OUT/.test(l) || /cursor-not-allowed/.test(l));
    for (const line of soldOutLines) {
      expect(line).not.toMatch(/bg-neutral-\d+\/\d+/);
    }
  });
});
