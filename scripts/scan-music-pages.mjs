#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const contentDir = path.join(root, "content");
const musicDir = path.join(contentDir, "music");

const nonPublicStatuses = new Set(["draft", "hidden", "in_production", "private", "unready"]);
const catalogSignals = [
  /current releases include/i,
  /tracks? in the catalog/i,
  /the catalog/i,
  /broader catalog/i,
  /current catalog/i,
  /full catalog/i,
  /catalog so far/i,
  /three tracks/i,
  /four tracks/i,
  /all three/i,
  /more coming/i,
  /where can i listen to ai hip hop/i,
];
const staleCountSignals = [
  /three tracks/i,
  /four tracks/i,
  /all three/i,
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && full.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function normText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9%]+/g, " ")
    .trim();
}

function trackNames(track) {
  const title = String(track.title || "");
  const slug = String(track.slug || "");
  return Array.from(new Set([
    title,
    title.toLowerCase(),
    slug,
    slug.replaceAll("-", " "),
  ].filter(Boolean))).map(normText).filter(Boolean);
}

function isPublicTrack(data) {
  const status = normText(data.releaseStatus || data.status || "released");
  return !nonPublicStatuses.has(status);
}

function parseMusic() {
  const tracks = [];
  for (const file of walk(musicDir)) {
    const parsed = matter(fs.readFileSync(file, "utf8"));
    const slug = parsed.data.slug || path.basename(file, ".mdx");
    tracks.push({
      file,
      rel: path.relative(root, file),
      slug,
      title: parsed.data.title || slug,
      trackNumber: Number(parsed.data.trackNumber || 0),
      date: String(parsed.data.date || ""),
      status: parsed.data.releaseStatus || parsed.data.status || "released",
      public: isPublicTrack(parsed.data),
    });
  }
  tracks.sort((a, b) => (b.trackNumber - a.trackNumber) || b.date.localeCompare(a.date));
  return tracks;
}

function containsAny(text, names) {
  const normalized = normText(text);
  return names.some((name) => normalized.includes(name));
}

function main() {
  const tracks = parseMusic();
  const publicTracks = tracks.filter((track) => track.public);
  const draftTracks = tracks.filter((track) => !track.public);
  const latest = publicTracks[0];
  const errors = [];
  const warnings = [];

  if (!latest) errors.push("no public music tracks found");

  const publicContentFiles = walk(contentDir).filter((file) => {
    if (!file.includes(`${path.sep}music${path.sep}`)) return true;
    const rel = path.relative(root, file);
    return publicTracks.some((track) => track.rel === rel);
  });

  const candidateFiles = publicContentFiles.filter((file) => {
    const raw = fs.readFileSync(file, "utf8");
    return catalogSignals.some((re) => re.test(raw));
  });

  for (const file of publicContentFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const rel = path.relative(root, file);
    for (const draft of draftTracks) {
      if (containsAny(raw, trackNames(draft))) {
        errors.push(`${rel}: public page mentions draft/non-public track "${draft.title}"`);
      }
    }
  }

  if (latest) {
    const latestNames = trackNames(latest);
    for (const file of candidateFiles) {
      const raw = fs.readFileSync(file, "utf8");
      const rel = path.relative(root, file);
      if (!containsAny(raw, latestNames)) {
        errors.push(`${rel}: catalog-like page does not mention latest public track "${latest.title}"`);
      }
      if (staleCountSignals.some((re) => re.test(raw))) {
        errors.push(`${rel}: stale fixed-count wording found, replace with current catalog wording`);
      }
    }
  }

  const publicSummary = publicTracks.map((track) => `#${String(track.trackNumber).padStart(3, "0")} ${track.title} (${track.slug})`).join("\n");
  console.log("public tracks:");
  console.log(publicSummary || "none");
  console.log(`\nlatest: ${latest ? latest.title : "none"}`);
  console.log(`catalog pages scanned: ${candidateFiles.length}`);
  console.log(`public content files scanned for draft leaks: ${publicContentFiles.length}`);

  if (warnings.length) {
    console.log("\nwarnings:");
    for (const warning of warnings) console.log(`- ${warning}`);
  }

  if (errors.length) {
    console.error("\nscan failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("\nscan passed: public pages mention the latest music where catalog context appears, and draft tracks did not leak.");
}

main();
