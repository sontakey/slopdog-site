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

describe("Purposeful motion with exponential easing", () => {
  it("globals.css defines exponential easing custom properties", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    expect(content).toMatch(/--ease-out-quart/);
    expect(content).toMatch(/--ease-out-quint/);
    expect(content).toMatch(/--ease-in-quart/);
  });

  it("globals.css defines motion duration tokens", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    expect(content).toMatch(/--duration-fast/);
    expect(content).toMatch(/--duration-normal/);
    expect(content).toMatch(/--duration-slow/);
    expect(content).toMatch(/--duration-entrance/);
  });

  it("globals.css includes prefers-reduced-motion media query", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    expect(content).toMatch(/prefers-reduced-motion:\s*reduce/);
  });

  it("globals.css defines entrance animation utilities", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    expect(content).toMatch(/\.motion-fade-up/);
    expect(content).toMatch(/\.motion-fade-in/);
    expect(content).toMatch(/@keyframes fade-up/);
    expect(content).toMatch(/@keyframes fade-in/);
  });

  it("globals.css defines stagger delay utilities", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    expect(content).toMatch(/\.motion-delay-1/);
    expect(content).toMatch(/\.motion-delay-2/);
    expect(content).toMatch(/\.motion-delay-3/);
  });

  it("tailwind config defines exponential easing utilities", () => {
    const content = readFileSync(
      join(ROOT, "tailwind.config.ts"),
      "utf-8"
    );
    expect(content).toMatch(/out-quart/);
    expect(content).toMatch(/out-quint/);
    expect(content).toMatch(/in-quart/);
  });

  it("tailwind config defines fade-up and fade-in animations", () => {
    const content = readFileSync(
      join(ROOT, "tailwind.config.ts"),
      "utf-8"
    );
    expect(content).toMatch(/"fade-up"/);
    expect(content).toMatch(/"fade-in"/);
  });

  it("no bare transition classes without explicit easing in components", () => {
    const files = collectSourceFiles(join(ROOT, "src/components"), [
      ".tsx",
    ]);
    const violations: string[] = [];

    // Match `transition` that is NOT followed by easing utility like ease-out-quart
    // Bare `transition` means using default browser ease
    const bareTransitionRegex =
      /\btransition\b(?![-\w])/g;

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip non-className lines
        if (!line.includes("className")) continue;

        while (bareTransitionRegex.exec(line) !== null) {
          // Check if the same className string also contains an explicit easing
          if (
            !line.includes("ease-out-quart") &&
            !line.includes("ease-out-quint") &&
            !line.includes("ease-in-quart")
          ) {
            const relative = file.replace(ROOT + "/", "");
            violations.push(
              `${relative}:${i + 1} → bare 'transition' without explicit easing`
            );
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("no bare transition classes without explicit easing in pages", () => {
    const files = collectSourceFiles(join(ROOT, "src/app"), [".tsx"]);
    const violations: string[] = [];

    const bareTransitionRegex = /\btransition\b(?![-\w])/g;

    for (const file of files) {
      if (file.includes(".test.")) continue;
      // Skip API routes and non-visual pages
      if (file.includes("/api/")) continue;
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.includes("className")) continue;

        while (bareTransitionRegex.exec(line) !== null) {
          if (
            !line.includes("ease-out-quart") &&
            !line.includes("ease-out-quint") &&
            !line.includes("ease-in-quart")
          ) {
            const relative = file.replace(ROOT + "/", "");
            violations.push(
              `${relative}:${i + 1} → bare 'transition' without explicit easing`
            );
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("prefers-reduced-motion disables motion-fade-up and motion-fade-in", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    // The reduced-motion block should set animation: none for motion utilities
    const reducedMotionBlock = content.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/
    );
    expect(reducedMotionBlock).not.toBeNull();
    const block = reducedMotionBlock![1];
    expect(block).toMatch(/animation:\s*none/);
    expect(block).toMatch(/transition-duration:\s*0\.01ms/);
  });

  it("exponential easing values use valid cubic-bezier (no overshoot)", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );

    // Extract all cubic-bezier values from the easing custom properties
    const easingRegex =
      /--ease-(?:out|in)-quart[a-z]*:\s*cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/g;
    let match;
    let found = false;
    while ((match = easingRegex.exec(content)) !== null) {
      found = true;
      const [, , p2, , p4] = match;
      // Exponential easing should NOT overshoot (no values > 1 or < 0 in y-coordinates)
      expect(parseFloat(p2)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(p2)).toBeLessThanOrEqual(1);
      expect(parseFloat(p4)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(p4)).toBeLessThanOrEqual(1);
    }
    expect(found).toBe(true);
  });

  it("stitch-designs do not use bare transition without easing", () => {
    const dir = join(ROOT, "stitch-designs");
    let files: string[] = [];
    try {
      files = collectSourceFiles(dir, [".html"]);
    } catch {
      // stitch-designs may not exist
      return;
    }
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Check for inline style transitions without easing
        if (
          line.match(/transition\s*:/) &&
          !line.match(/cubic-bezier/) &&
          !line.match(/ease-out/) &&
          !line.match(/ease-in/) &&
          // Allow linear for continuous animations like scanlines
          !line.match(/linear/)
        ) {
          const relative = file.replace(ROOT + "/", "");
          violations.push(
            `${relative}:${i + 1} → transition without explicit easing`
          );
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
