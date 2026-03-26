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

describe("Typography is distinctive and well-paired", () => {
  it("layout.tsx imports two distinct fonts (display + body)", () => {
    const content = readFileSync(
      join(ROOT, "src/app/layout.tsx"),
      "utf-8"
    );
    // Must import at least two fonts from next/font/google
    const fontImports = content.match(
      /import\s*\{([^}]+)\}\s*from\s*["']next\/font\/google["']/
    );
    expect(fontImports).toBeTruthy();
    const fontNames = fontImports![1].split(",").map((s) => s.trim());
    expect(fontNames.length).toBeGreaterThanOrEqual(2);
  });

  it("layout.tsx defines separate CSS variables for display and body fonts", () => {
    const content = readFileSync(
      join(ROOT, "src/app/layout.tsx"),
      "utf-8"
    );
    // Must have two distinct font CSS variables
    const fontVars = content.match(/variable:\s*["']--font-[^"']+["']/g) ?? [];
    expect(fontVars.length).toBeGreaterThanOrEqual(2);
    // Variables must be different
    const varNames = fontVars.map((v) =>
      v.match(/--font-[^"']+/)![0]
    );
    expect(new Set(varNames).size).toBeGreaterThanOrEqual(2);
  });

  it("layout.tsx applies both font variables to the body element", () => {
    const content = readFileSync(
      join(ROOT, "src/app/layout.tsx"),
      "utf-8"
    );
    const fontVars = content.match(/variable:\s*["'](--font-[^"']+)["']/g) ?? [];
    const varNames = fontVars.map((v) =>
      v.match(/--(font-[^"']+)/)![1].replace(/-/g, "")
    );
    // Body className should reference both font variables
    const bodyMatch = content.match(/<body[^>]*className[^>]*>/);
    expect(bodyMatch).toBeTruthy();
    // The body tag should contain .variable references for each font
    expect(varNames.length).toBeGreaterThanOrEqual(2);
    expect(bodyMatch![0]).toMatch(/\.variable/);
  });

  it("tailwind config defines separate display and sans font families", () => {
    const content = readFileSync(
      join(ROOT, "tailwind.config.ts"),
      "utf-8"
    );
    // display family must NOT reference the same CSS variable as sans
    const displayMatch = content.match(
      /display:\s*\[["']var\(([^)]+)\)["']/
    );
    const sansMatch = content.match(
      /sans:\s*\[["']var\(([^)]+)\)["']/
    );
    expect(displayMatch).toBeTruthy();
    expect(sansMatch).toBeTruthy();
    expect(displayMatch![1]).not.toEqual(sansMatch![1]);
  });

  it("tailwind config defines a fluid type scale with clamp()", () => {
    const content = readFileSync(
      join(ROOT, "tailwind.config.ts"),
      "utf-8"
    );
    // Must have fontSize config entries using clamp()
    const clampMatches = content.match(/clamp\(/g) ?? [];
    expect(clampMatches.length).toBeGreaterThanOrEqual(4);

    // Must define display sizes
    expect(content).toMatch(/["']display-xl["']/);
    expect(content).toMatch(/["']display-lg["']/);
    expect(content).toMatch(/["']display-md["']/);
    expect(content).toMatch(/["']display-sm["']/);
  });

  it("globals.css assigns display font to headings", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    // headings should get the display font family
    expect(content).toMatch(/h1.*h2.*h3/s);
    expect(content).toMatch(/font-family:\s*var\(--font-syne\)/);
  });

  it("globals.css assigns body font to the body element", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    // body should use the body font, not Space Grotesk
    expect(content).not.toMatch(/font-space-grotesk/);
    expect(content).toMatch(
      /body\s*\{[^}]*font-family:\s*var\(--font-inter\)/s
    );
  });

  it("no Space_Grotesk references remain in source files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [
      ".ts",
      ".tsx",
      ".css",
    ]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      if (/Space_Grotesk|font-space-grotesk/.test(content)) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });

  it("headings in components use font-display class for the display font", () => {
    // Key page files that should use font-display on headlines
    const keyFiles = [
      "src/app/page.tsx",
      "src/components/Header.tsx",
      "src/components/SectionHeading.tsx",
      "src/components/Footer.tsx",
    ];

    for (const rel of keyFiles) {
      const content = readFileSync(join(ROOT, rel), "utf-8");
      expect(content).toMatch(/font-display/);
    }
  });

  it("display type scale sizes are used in source files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [".tsx"]);
    const displaySizes = ["text-display-xl", "text-display-lg", "text-display-md", "text-display-sm"];
    const found = new Set<string>();

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      for (const size of displaySizes) {
        if (content.includes(size)) found.add(size);
      }
    }

    // At least 3 of the 4 display sizes should be in use
    expect(found.size).toBeGreaterThanOrEqual(3);
  });

  it("body type scale sizes are used in source files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [".tsx"]);
    const bodySizes = ["text-body-lg", "text-body-sm", "text-label"];
    const found = new Set<string>();

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      for (const size of bodySizes) {
        if (content.includes(size)) found.add(size);
      }
    }

    // All body sizes should be in use
    expect(found.size).toBe(bodySizes.length);
  });

  it("hero heading uses the largest display size", () => {
    const content = readFileSync(
      join(ROOT, "src/app/page.tsx"),
      "utf-8"
    );
    // The main h1 should use display-xl (the biggest size)
    expect(content).toMatch(/text-display-xl/);
  });
});
