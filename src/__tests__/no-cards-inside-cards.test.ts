import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
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
 * Card markers: rounded (bare or -lg/-xl/-2xl), border, bg-*, and p-{number}.
 */
const ROUNDED = /\brounded(?:-(?:lg|xl|2xl))?(?=\s|"|`|$)/;
const BORDER = /\bborder\b/;
const BG = /\bbg-\S+/;
const PADDING = /\bp-\d/;

/**
 * Test whether a className string contains all four card markers (order-independent).
 */
function isCardClass(cls: string): boolean {
  return ROUNDED.test(cls) && BORDER.test(cls) && BG.test(cls) && PADDING.test(cls);
}

/**
 * JSX: className="..." pattern (single-line, order-dependent for speed).
 */
const CARD_PATTERN =
  /className="[^"]*\brounded-(?:lg|xl|2xl)\b[^"]*\bborder\b[^"]*\bbg-[^"]*\bp-\d/;

/**
 * JSX: template literal className={`...`} (single-line).
 */
const TEMPLATE_LITERAL_CLASS = /className=\{`([^`]*)`\}/;

/**
 * HTML: extract class="..." attribute values.
 */
const HTML_CLASS_ATTR = /class="([^"]*)"/g;

/**
 * Check if a single line contains a card-pattern element.
 */
function lineHasCard(line: string, isHtml: boolean): boolean {
  if (isHtml) {
    let match;
    HTML_CLASS_ATTR.lastIndex = 0;
    while ((match = HTML_CLASS_ATTR.exec(line)) !== null) {
      if (isCardClass(match[1])) return true;
    }
    return false;
  }
  if (CARD_PATTERN.test(line)) return true;
  const tmpl = TEMPLATE_LITERAL_CLASS.exec(line);
  if (tmpl && isCardClass(tmpl[1])) return true;
  return false;
}

/**
 * Check for multi-line template literal classNames in JSX.
 */
function lineHasCardMultiline(lines: string[], idx: number, isHtml: boolean): boolean {
  const line = lines[idx];
  if (lineHasCard(line, isHtml)) return true;

  if (!isHtml && /className=\{`/.test(line) && !TEMPLATE_LITERAL_CLASS.test(line)) {
    let combined = line;
    for (let j = idx + 1; j < Math.min(idx + 10, lines.length); j++) {
      combined += " " + lines[j];
      if (lines[j].includes("`")) break;
    }
    const match = /className=\{`([^`]*)`\}/.exec(combined);
    if (match && isCardClass(match[1])) return true;
  }

  return false;
}

/**
 * Detect nested card elements in JSX source using indentation heuristics.
 */
function findNestedCardsJsx(content: string): { line: number; text: string }[] {
  const violations: { line: number; text: string }[] = [];
  const lines = content.split("\n");

  const cardOpenings: { lineIdx: number; col: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (lineHasCardMultiline(lines, i, false)) {
      const indent = lines[i].search(/\S/);
      cardOpenings.push({ lineIdx: i, col: indent });
    }
  }

  for (let i = 1; i < cardOpenings.length; i++) {
    const current = cardOpenings[i];
    for (let j = i - 1; j >= 0; j--) {
      const parent = cardOpenings[j];
      if (
        current.col > parent.col &&
        current.lineIdx - parent.lineIdx < 80
      ) {
        let parentClosed = false;
        for (let k = parent.lineIdx + 1; k < current.lineIdx; k++) {
          const lineIndent = lines[k].search(/\S/);
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
          break;
        }
      }
    }
  }

  return violations;
}

/**
 * Detect nested card elements in HTML source using tag-depth tracking.
 *
 * Walk all opening/closing tags. Track a stack of open tags. When we encounter
 * an opening tag with a card-class, record its depth. If we later find another
 * card-class tag at a deeper depth, that's a nested card violation.
 */
function findNestedCardsHtml(content: string): { line: number; text: string }[] {
  const violations: { line: number; text: string }[] = [];

  // Self-closing / void HTML tags that don't affect depth
  const VOID_TAGS = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
  ]);

  // Map character offset to line number
  const lineStarts: number[] = [0];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === "\n") lineStarts.push(i + 1);
  }
  function offsetToLine(offset: number): number {
    let lo = 0, hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= offset) lo = mid; else hi = mid - 1;
    }
    return lo + 1; // 1-based
  }

  // Match all HTML tags (opening, closing, self-closing)
  const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;

  let depth = 0;
  // Stack of card depths: when we enter a card, push current depth
  const cardStack: { depth: number; line: number }[] = [];
  let match;

  while ((match = TAG_RE.exec(content)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isSelfClosing = fullTag.endsWith("/>") || VOID_TAGS.has(tagName);
    const isClosing = fullTag.startsWith("</");

    if (isClosing) {
      depth--;
      // Pop card stack if we've closed back to a card's depth
      while (cardStack.length > 0 && depth <= cardStack[cardStack.length - 1].depth) {
        cardStack.pop();
      }
    } else {
      // Check if this opening tag has a card-class
      const classMatch = /class="([^"]*)"/.exec(fullTag);
      if (classMatch && isCardClass(classMatch[1])) {
        if (cardStack.length > 0) {
          // We're inside another card -- violation!
          const line = offsetToLine(match.index);
          const lineText = content.substring(match.index, match.index + 120).replace(/\n/g, " ").trim();
          violations.push({ line, text: lineText.slice(0, 100) });
        }
        if (!isSelfClosing) {
          cardStack.push({ depth, line: offsetToLine(match.index) });
        }
      }

      if (!isSelfClosing) {
        depth++;
      }
    }
  }

  return violations;
}

/**
 * Unified nested card finder.
 */
function findNestedCards(content: string, isHtml = false): { line: number; text: string }[] {
  return isHtml ? findNestedCardsHtml(content) : findNestedCardsJsx(content);
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

  it("detects card patterns in template literal classNames", () => {
    const mockContent = `
      <div className={\`rounded-xl border border-white/10 bg-white/5 p-5 \${spanClass}\`}>
        <div className={\`rounded-lg border border-white/10 bg-black p-4 \${otherClass}\`}>
        </div>
      </div>
    `;
    const violations = findNestedCards(mockContent);
    expect(violations.length).toBeGreaterThan(0);
  });

  it("detects card patterns in multi-line template literal classNames", () => {
    const mockContent = `
      <div className={\`rounded-xl border p-5 \${
        featured ? "bg-primary/5" : "bg-white/5"
      }\`}>
        <div className={\`rounded-lg border p-4 \${
          active ? "bg-primary/10" : "bg-black/50"
        }\`}>
        </div>
      </div>
    `;
    const violations = findNestedCards(mockContent);
    expect(violations.length).toBeGreaterThan(0);
  });

  it("no stitch-design HTML file has card-inside-card nesting", () => {
    const stitchDir = join(ROOT, "stitch-designs");
    if (!existsSync(stitchDir)) return;

    const htmlFiles = collectSourceFiles(stitchDir, [".html"]);
    const allViolations: { file: string; violations: { line: number; text: string }[] }[] = [];

    for (const file of htmlFiles) {
      const content = readFileSync(file, "utf-8");
      const violations = findNestedCards(content, true);
      if (violations.length > 0) {
        const relative = file.replace(ROOT + "/", "");
        allViolations.push({ file: relative, violations });
      }
    }

    expect(
      allViolations,
      `Found cards nested inside cards in stitch-designs:\n${allViolations
        .map(
          (v) =>
            `  ${v.file}:\n${v.violations
              .map((vi) => `    line ${vi.line}: ${vi.text}`)
              .join("\n")}`
        )
        .join("\n")}`
    ).toEqual([]);
  });

  it("detects nested cards in HTML class attributes", () => {
    const mockHtml = `
<div class="rounded-xl border border-white/10 bg-white/5 p-8">
  <div class="rounded border border-green/30 bg-black/80 p-4">
    inner content
  </div>
</div>
    `;
    const violations = findNestedCards(mockHtml, true);
    expect(violations.length).toBeGreaterThan(0);
  });
});
