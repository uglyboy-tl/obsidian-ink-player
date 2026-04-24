#!/usr/bin/env bun

/**
 * Release script for InkWeave
 *
 * Usage:
 *   bun scripts/release.mjs patch     # Bump patch
 *   bun scripts/release.mjs minor    # Bump minor
 *   bun scripts/release.mjs major    # Bump major
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const input = process.argv[2] || "patch";

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function getNewVersion(baseVersion, bumpType) {
  const parts = baseVersion.split(".").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    console.error(`Invalid version format: ${baseVersion}`);
    process.exit(1);
  }
  const [major, minor, patch] = parts;
  switch (bumpType) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      console.error(`Invalid bump type: ${bumpType}`);
      process.exit(1);
  }
}

function main() {
  if (!input || !["patch", "minor", "major"].includes(input)) {
    console.error("Usage: bun scripts/release.mjs <patch|minor|major>");
    process.exit(1);
  }

  // Get current version and calculate new version
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const version = getNewVersion(pkg.version, input);
  console.log(`Updating from ${pkg.version} to ${version}\n`);

  // Update package.json version
  pkg.version = version;
  writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
  console.log("Updated package.json");

  console.log("\nRunning version-bump script...");
  run(`npm_package_version=${version} bun run scripts/version-bump.mjs`);

  console.log("\nGenerating changelog...");
  run(`bun run scripts/changelog.mjs ${version}`);

  console.log("\nStaging all files...");
  run("git add .");

  console.log("\nCommitting...");
  run(`git commit --author "InkWeave Bot <bot@uglyboy.cn>" -m "chore(release): v${version}"`);

  console.log("\nCreating tag...");
  run(`git tag ${version}`);

  console.log("\nPushing...");
  run(`git push origin master ${version}`);

  console.log(`\n✅ Released v${version}`);
}

main();
