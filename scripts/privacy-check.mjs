#!/usr/bin/env node
// Reads .private-terms (one term per line, git-ignored) and fails the build if
// any term appears in text files under src/, public/ or .next/.
// If the file is absent, exit 0 silently.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const termsFile = path.join(root, ".private-terms");

if (!fs.existsSync(termsFile)) {
  process.exit(0);
}

const terms = fs
  .readFileSync(termsFile, "utf8")
  .split(/\r?\n/)
  .map((t) => t.trim())
  .filter(Boolean);

if (terms.length === 0) process.exit(0);

const roots = ["src", "public", ".next"].filter((p) =>
  fs.existsSync(path.join(root, p)),
);

const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".mdx",
  ".css",
  ".scss",
  ".html",
  ".txt",
  ".svg",
  ".xml",
  ".yaml",
  ".yml",
]);

/** @type {string[]} */
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      walk(p);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!TEXT_EXT.has(ext)) continue;
      const text = fs.readFileSync(p, "utf8");
      for (const term of terms) {
        if (text.includes(term)) {
          hits.push(`${path.relative(root, p)} contains a private term`);
          break;
        }
      }
    }
  }
}

for (const r of roots) walk(path.join(root, r));

if (hits.length > 0) {
  console.error("Privacy check failed:");
  for (const h of hits) console.error("  -", h);
  process.exit(1);
}

console.log("Privacy check passed.");
