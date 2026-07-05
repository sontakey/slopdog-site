import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(relativePath: string) {
  return readFileSync(join(root, relativePath), "utf8");
}

describe("growth conversion surfaces", () => {
  it("keeps the homepage subscribe anchor on the experiment CTA", () => {
    const page = read("src/app/page.tsx");
    expect(page).toContain('id="subscribe"');
    expect(page).toContain("follow the experiment");
    expect(page).toContain("can an ai-native hip-hop artist build a real audience?");
  });

  it("adds the experiment CTA to lore and music detail pages", () => {
    expect(read("src/app/lore/[slug]/page.tsx")).toContain("<FollowExperimentCta />");
    expect(read("src/app/music/[slug]/page.tsx")).toContain("<FollowExperimentCta />");
  });

  it("uses the canonical SLOPDOG X handle", () => {
    expect(read("src/lib/site.ts")).toContain('twitterHandle: "@SLOPDOG_"');
    expect(read("src/components/FollowExperimentCta.tsx")).toContain("https://x.com/SLOPDOG_");
  });
});
