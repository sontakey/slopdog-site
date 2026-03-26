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

// Monospace keyword patterns that indicate lazy tech-vibes styling
const MONOSPACE_KEYWORDS = [
  /\bfont-mono\b/,
  /\bfont-family:\s*monospace\b/,
  /\bfont-family:\s*["']?Courier/i,
  /\bfont-family:\s*["']?Consolas/i,
  /\bfont-family:\s*["']?Fira\s*Code/i,
  /\bfont-family:\s*["']?JetBrains\s*Mono/i,
  /\bfont-family:\s*["']?Source\s*Code\s*Pro/i,
  /\bfont-family:\s*["']?IBM\s*Plex\s*Mono/i,
  /\bfont-family:\s*["']?Roboto\s*Mono/i,
  /\bfont-family:\s*["']?Share\s*Tech\s*Mono/i,
];

// CSS patterns that apply monospace via @apply or similar
const CSS_APPLY_PATTERNS = [
  /@apply[^;]*\bfont-mono\b/,
];

function findViolations(
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
      const hits = findViolations(content, MONOSPACE_KEYWORDS.slice(1));
      for (const hit of hits) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(`${relative}:${hit.line} → ${hit.text}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("no @apply font-mono in CSS files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [".css"]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      const hits = findViolations(content, CSS_APPLY_PATTERNS);
      for (const hit of hits) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(`${relative}:${hit.line} → ${hit.text}`);
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

  it("stitch-designs do not use monospace for UI elements", () => {
    const dir = join(ROOT, "stitch-designs");
    const files = collectSourceFiles(dir, [".html"]);
    const violations: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      const hits = findViolations(content, MONOSPACE_KEYWORDS);
      for (const hit of hits) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(`${relative}:${hit.line} → ${hit.text}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("globals.css does not contain monospace font references", () => {
    const content = readFileSync(
      join(ROOT, "src/app/globals.css"),
      "utf-8"
    );
    expect(content).not.toMatch(/font-mono/);
    expect(content).not.toMatch(/font-family:\s*monospace/);
    expect(content).not.toMatch(/font-family:.*Courier/i);
    expect(content).not.toMatch(/font-family:.*Consolas/i);
  });

  it("no monospace font imports via next/font in layout files", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [".ts", ".tsx"]);
    const violations: string[] = [];

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      // Catch imports like: import { Fira_Code } from "next/font/google"
      if (
        /from\s+["']next\/font/.test(content) &&
        /\b(?:Fira_Code|JetBrains_Mono|Source_Code_Pro|IBM_Plex_Mono|Roboto_Mono|Share_Tech_Mono|Courier_Prime)\b/.test(content)
      ) {
        const relative = file.replace(ROOT + "/", "");
        violations.push(relative);
      }
    }

    expect(violations).toEqual([]);
  });
});
