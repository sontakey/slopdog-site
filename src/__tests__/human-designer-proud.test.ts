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

describe("Would a human designer be proud of this?", () => {
  describe("No terminal/hacker copy", () => {
    const TERMINAL_PATTERNS = [
      /LATEST_DROP:/,
      /EXECUTE_READ/,
      /ENTER_EMAIL/,
      /LOG_ENTRY/,
      /VIEW_ALL_RELEASES/,
      /READ_THE_LOGS/,
      /\.mp3["'`]/,
      /\.exe/,
      />_</,
    ];

    it("pages contain no terminal-style copy", () => {
      const files = collectSourceFiles(join(ROOT, "src/app"), [".tsx"]);
      const violations: string[] = [];

      for (const file of files) {
        if (file.includes(".test.")) continue;
        const content = readFileSync(file, "utf-8");
        for (const pattern of TERMINAL_PATTERNS) {
          if (pattern.test(content)) {
            const relative = file.replace(ROOT + "/", "");
            violations.push(`${relative} matches ${pattern}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it("components contain no terminal-style copy", () => {
      const files = collectSourceFiles(join(ROOT, "src/components"), [".tsx"]);
      const violations: string[] = [];

      for (const file of files) {
        if (file.includes(".test.")) continue;
        const content = readFileSync(file, "utf-8");
        for (const pattern of TERMINAL_PATTERNS) {
          if (pattern.test(content)) {
            const relative = file.replace(ROOT + "/", "");
            violations.push(`${relative} matches ${pattern}`);
          }
        }
      }

      expect(violations).toEqual([]);
    });
  });

  describe("No glitch effects in UI chrome", () => {
    it("header does not use glitch class", () => {
      const content = readFileSync(
        join(ROOT, "src/components/Header.tsx"),
        "utf-8"
      );
      expect(content).not.toMatch(/className="glitch"/);
      expect(content).not.toMatch(/className=.*glitch/);
    });

    it("section headings do not use glitch class", () => {
      const content = readFileSync(
        join(ROOT, "src/components/SectionHeading.tsx"),
        "utf-8"
      );
      expect(content).not.toMatch(/glitch/);
    });

    it("globals.css does not contain glitch keyframes", () => {
      const content = readFileSync(
        join(ROOT, "src/app/globals.css"),
        "utf-8"
      );
      expect(content).not.toMatch(/\.glitch/);
      expect(content).not.toMatch(/glitch-flicker/);
    });
  });

  describe("No decorative scanlines on content", () => {
    it("no scanlines class used in page components", () => {
      const files = collectSourceFiles(join(ROOT, "src/app"), [".tsx"]);
      const violations: string[] = [];

      for (const file of files) {
        if (file.includes(".test.")) continue;
        const content = readFileSync(file, "utf-8");
        if (/\bscanlines\b/.test(content)) {
          const relative = file.replace(ROOT + "/", "");
          violations.push(relative);
        }
      }

      expect(violations).toEqual([]);
    });

    it("no scanlines class used in components", () => {
      const files = collectSourceFiles(join(ROOT, "src/components"), [".tsx"]);
      const violations: string[] = [];

      for (const file of files) {
        if (file.includes(".test.")) continue;
        const content = readFileSync(file, "utf-8");
        if (/\bscanlines\b/.test(content)) {
          const relative = file.replace(ROOT + "/", "");
          violations.push(relative);
        }
      }

      expect(violations).toEqual([]);
    });

    it("globals.css does not define scanlines utility", () => {
      const content = readFileSync(
        join(ROOT, "src/app/globals.css"),
        "utf-8"
      );
      expect(content).not.toMatch(/\.scanlines/);
    });
  });

  describe("No neon glow effects on interactive elements", () => {
    it("tailwind config does not define shadow-glow", () => {
      const content = readFileSync(
        join(ROOT, "tailwind.config.ts"),
        "utf-8"
      );
      expect(content).not.toMatch(/shadow.*glow/i);
    });

    it("no shadow-glow class used in source files", () => {
      const files = collectSourceFiles(join(ROOT, "src"), [".tsx", ".css"]);
      const violations: string[] = [];

      for (const file of files) {
        if (file.includes(".test.")) continue;
        const content = readFileSync(file, "utf-8");
        if (/shadow-glow/.test(content)) {
          const relative = file.replace(ROOT + "/", "");
          violations.push(relative);
        }
      }

      expect(violations).toEqual([]);
    });
  });

  describe("Scrollbar is subtle, not neon", () => {
    it("scrollbar thumb does not use primary/neon green color", () => {
      const content = readFileSync(
        join(ROOT, "src/app/globals.css"),
        "utf-8"
      );
      // Scrollbar thumb should not be #00ff41 or var(--primary)
      const scrollbarSection = content.match(
        /scrollbar-thumb[\s\S]*?(?=\n\n|::-webkit-scrollbar-thumb:hover)/
      );
      if (scrollbarSection) {
        expect(scrollbarSection[0]).not.toMatch(/var\(--primary\)/);
        expect(scrollbarSection[0]).not.toMatch(/#00ff41/);
      }
    });
  });

  describe("Entrance animations are used", () => {
    it("homepage uses motion-fade-up for staggered entrance", () => {
      const content = readFileSync(
        join(ROOT, "src/app/page.tsx"),
        "utf-8"
      );
      expect(content).toMatch(/motion-fade-up/);
    });

    it("music page uses motion-fade-up", () => {
      const content = readFileSync(
        join(ROOT, "src/app/music/page.tsx"),
        "utf-8"
      );
      expect(content).toMatch(/motion-fade-up/);
    });

    it("blog page uses motion-fade-up", () => {
      const content = readFileSync(
        join(ROOT, "src/app/blog/page.tsx"),
        "utf-8"
      );
      expect(content).toMatch(/motion-fade-up/);
    });

    it("stagger delays are applied to grid items", () => {
      const content = readFileSync(
        join(ROOT, "src/app/page.tsx"),
        "utf-8"
      );
      // Should have stagger delay classes or inline animation-delay
      expect(content).toMatch(/motion-delay-/);
    });
  });

  describe("Clean, human copy style", () => {
    it("header brand is SLOPDOG wordmark, not terminal icon", () => {
      const content = readFileSync(
        join(ROOT, "src/components/Header.tsx"),
        "utf-8"
      );
      // Should not have the >_ terminal prompt icon
      expect(content).not.toMatch(/>_/);
      // Should have the SLOPDOG wordmark
      expect(content).toMatch(/SLOP/);
      expect(content).toMatch(/DOG/);
    });

    it("nav links use clean labels without slash prefix", () => {
      const content = readFileSync(
        join(ROOT, "src/components/Header.tsx"),
        "utf-8"
      );
      // Should not render nav links with "/" prefix
      expect(content).not.toMatch(/>\s*\/\{/);
      expect(content).not.toMatch(/>\s*\/{n\.label}/);
    });

    it("footer uses human-readable labels", () => {
      const content = readFileSync(
        join(ROOT, "src/components/Footer.tsx"),
        "utf-8"
      );
      // Should not have /MUSIC, /BLOG terminal-style links
      expect(content).not.toMatch(/>\s*\/MUSIC/);
      expect(content).not.toMatch(/>\s*\/BLOG/);
      // Should not have SIGNAL heading
      expect(content).not.toMatch(/>SIGNAL</);
      // Should not have ENTER_EMAIL placeholder
      expect(content).not.toMatch(/ENTER_EMAIL/);
    });

    it("newsletter section is not a screaming neon banner", () => {
      const content = readFileSync(
        join(ROOT, "src/app/page.tsx"),
        "utf-8"
      );
      // The newsletter <section> tag itself should not use bg-primary
      // (buttons inside can use it, but the full section background shouldn't be neon)
      const sectionTag = content.match(
        /Newsletter[\s\S]*?<section[^>]*className="([^"]*)"/i
      );
      if (sectionTag) {
        expect(sectionTag[1]).not.toMatch(/\bbg-primary\b/);
      }
    });
  });

  describe("About page has breathing room", () => {
    it("about page content is not wrapped in a single bordered card", () => {
      const content = readFileSync(
        join(ROOT, "src/app/about/page.tsx"),
        "utf-8"
      );
      // The main content area should use prose styling, not be enclosed
      // in a single rounded bordered card
      expect(content).toMatch(/prose/);
    });
  });
});
