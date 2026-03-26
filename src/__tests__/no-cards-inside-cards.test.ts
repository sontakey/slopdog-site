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
 * A "card" element has all of: rounded-{lg,xl,2xl}, border, bg-*, and p-{number}.
 * This regex matches a className string containing all four markers.
 */
const CARD_PATTERN =
  /className="[^"]*\brounded-(?:lg|xl|2xl)\b[^"]*\bborder\b[^"]*\bbg-[^"]*\bp-\d/;

/**
 * Detect nested card elements in JSX source.
 *
 * Strategy: walk through opening tags. When we encounter a tag whose className
 * matches the card pattern, push a nesting level. Track depth via a simple
 * brace / angle-bracket counter. If we encounter another card-pattern tag
 * while already inside a card, that's a violation.
 */
function findNestedCards(content: string): { line: number; text: string }[] {
  const violations: { line: number; text: string }[] = [];
  const lines = content.split("\n");

  // Simple approach: find all lines that open a "card" element, then check
  // whether any card-opening line is nested inside another card's scope.
  // We track card scopes by counting `{` and `}` plus `<` `>` depth.

  // Collect card-opening lines
  const cardOpenings: { lineIdx: number; col: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (CARD_PATTERN.test(lines[i])) {
      // Approximate indentation as nesting indicator
      const indent = lines[i].search(/\S/);
      cardOpenings.push({ lineIdx: i, col: indent });
    }
  }

  // For each card opening, check if there's a parent card opening that
  // encloses it (appears earlier with less indentation, and hasn't been
  // closed before this line). We use a simpler heuristic: if a card line
  // appears at greater indentation than a previous card line, and the
  // previous card's closing tag hasn't been reached, it's nested.
  //
  // Even simpler: look for any card-pattern className that is indented
  // more than a preceding card-pattern className within 50 lines.
  for (let i = 1; i < cardOpenings.length; i++) {
    const current = cardOpenings[i];
    for (let j = i - 1; j >= 0; j--) {
      const parent = cardOpenings[j];
      // Only flag if current is more indented (nested) and within reasonable range
      if (
        current.col > parent.col &&
        current.lineIdx - parent.lineIdx < 80
      ) {
        // Verify the parent card hasn't been closed before current line
        // by checking if there's a closing tag at parent's indentation level
        let parentClosed = false;
        for (let k = parent.lineIdx + 1; k < current.lineIdx; k++) {
          const lineIndent = lines[k].search(/\S/);
          // A closing tag at parent's indent level or less means the parent is closed
          if (lineIndent <= parent.col && /<\/\w|^\s*\}\)/.test(lines[k].trimStart())) {
            parentClosed = true;
            break;
          }
        }
        if (!parentClosed) {
          violations.push({
            line: current.lineIdx + 1,
            text: lines[current.lineIdx].trim().slice(0, 100),
          });
          break; // Only report once per nested card
        }
      }
    }
  }

  return violations;
}

describe("No cards inside cards", () => {
  it("BeatLicenseSection does not nest cards inside an outer card", () => {
    const content = readFileSync(
      join(ROOT, "src/components/BeatLicenseSection.tsx"),
      "utf-8"
    );
    const violations = findNestedCards(content);
    expect(
      violations,
      "BeatLicenseSection should not have card elements nested inside another card"
    ).toEqual([]);
  });

  it("ViewToggle does not use card styling (it lives inside parent cards)", () => {
    const content = readFileSync(
      join(ROOT, "src/components/ViewToggle.tsx"),
      "utf-8"
    );
    // ViewToggle should not have any card-pattern elements since it's
    // always rendered inside a parent card
    const hasCard = CARD_PATTERN.test(content);
    expect(
      hasCard,
      "ViewToggle should not contain card-styled elements (it renders inside parent cards)"
    ).toBe(false);
  });

  it("success page download links are not styled as cards inside a card", () => {
    const content = readFileSync(
      join(ROOT, "src/app/success/page.tsx"),
      "utf-8"
    );
    const violations = findNestedCards(content);
    expect(
      violations,
      "Success page should not have card elements nested inside another card"
    ).toEqual([]);
  });

  it("no source file has card-inside-card nesting", () => {
    const files = collectSourceFiles(join(ROOT, "src"), [".tsx"]);
    const allViolations: { file: string; violations: { line: number; text: string }[] }[] = [];

    for (const file of files) {
      if (file.includes(".test.") || file.includes("__tests__")) continue;
      const content = readFileSync(file, "utf-8");
      const violations = findNestedCards(content);
      if (violations.length > 0) {
        const relative = file.replace(ROOT + "/", "");
        allViolations.push({ file: relative, violations });
      }
    }

    expect(
      allViolations,
      `Found cards nested inside cards:\n${allViolations
        .map(
          (v) =>
            `  ${v.file}:\n${v.violations
              .map((vi) => `    line ${vi.line}: ${vi.text}`)
              .join("\n")}`
        )
        .join("\n")}`
    ).toEqual([]);
  });
});
