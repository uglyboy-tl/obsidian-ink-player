import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { $ } from "bun";

const TYPES = {
  feat: "Features",
  fix: "Bug Fixes",
  docs: "Documentation",
  style: "Styles",
  refactor: "Refactoring",
  perf: "Performance",
  test: "Tests",
  build: "Build",
  ci: "CI/CD",
  chore: "Chores",
};

const TYPES_ORDER = [
  "feat",
  "fix",
  "perf",
  "refactor",
  "docs",
  "style",
  "test",
  "build",
  "ci",
  "chore",
];

function parseCommit(message) {
  const lines = message.split("\n");
  const firstLine = lines[0];

  const match = firstLine.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);
  if (!match) return null;

  const [, type, scope, subject] = match;
  return { type, scope, subject };
}

function isReleaseCommit(commit) {
  return (
    commit.type === "chore" &&
    commit.scope === "release" &&
    /^v?\d+\.\d+\.\d+$/.test(commit.subject)
  );
}

async function getCommitsBetween(fromTag, toTag = "HEAD") {
  const range = fromTag ? `${fromTag}..${toTag}` : toTag;
  const result = await $`git log ${range} --pretty=format:%s%n%b%n---COMMIT_END---`.quiet();
  const output = result.text();

  const commits = [];
  for (const block of output.split("---COMMIT_END---")) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const [subjectLine] = trimmed.split("\n");
    const parsed = parseCommit(subjectLine);

    if (parsed && !isReleaseCommit(parsed)) {
      commits.push(parsed);
    }
  }

  return commits;
}

async function getPreviousTag(currentTag) {
  try {
    const result = await $`git describe --tags --abbrev=0 ${currentTag}^`.quiet();
    return result.text().trim() || null;
  } catch {
    return null;
  }
}

async function getTagDate(tag) {
  if (!tag) return formatDate();
  const result = await $`git log -1 --format=%ci ${tag}`.quiet();
  const dateStr = result.text().trim().split(" ")[0];
  return dateStr || formatDate();
}

async function getRepoUrl() {
  const result = await $`git remote get-url origin`.quiet();
  const url = result.text().trim();
  return url.replace(/^git@([^:]+):/, "https://$1/").replace(/\.git$/, "");
}

function formatDate(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function groupCommitsByType(commits) {
  const grouped = {};

  for (const commit of commits) {
    const { type } = commit;
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(commit);
  }

  return grouped;
}

function generateChangelogSection(type, commits) {
  const title = TYPES[type] || type;
  const lines = [`### ${title}`];

  for (const commit of commits) {
    const scope = commit.scope ? `**${commit.scope}**: ` : "";
    lines.push(`- ${scope}${commit.subject}`);
  }

  return lines.join("\n");
}

async function generateChangelog(version, commits, previousTag, repoUrl) {
  const date = await getTagDate(version);
  const grouped = groupCommitsByType(commits);

  const sections = [];
  sections.push(`## ${version} (${date})`);
  sections.push("");

  for (const type of TYPES_ORDER) {
    if (grouped[type] && grouped[type].length > 0) {
      sections.push(generateChangelogSection(type, grouped[type]));
      sections.push("");
    }
  }

  if (previousTag) {
    sections.push(`**Full Changelog**: ${repoUrl}/compare/${previousTag}...${version}`);
  }

  return sections.join("\n");
}

function updateChangelogFile(newSection, changelogPath = "CHANGELOG.md") {
  if (existsSync(changelogPath)) {
    const content = readFileSync(changelogPath, "utf-8");
    const lines = content.split("\n");
    const headerEndIndex = lines.findIndex((line) => line.startsWith("## "));
    if (headerEndIndex >= 0) {
      const header = headerEndIndex > 0 ? `${lines.slice(0, headerEndIndex).join("\n")}\n` : "";
      const existingVersions = lines.slice(headerEndIndex).join("\n").trim();
      const newContent = existingVersions
        ? `${header + newSection}\n\n${existingVersions}\n`
        : `${header + newSection}\n`;
      writeFileSync(changelogPath, newContent);
      return;
    }
    if (lines[0]?.startsWith("# ")) {
      writeFileSync(changelogPath, `${lines[0]}\n\n${newSection}\n`);
      return;
    }
    console.warn("CHANGELOG.md format unexpected, creating new changelog");
  }

  writeFileSync(
    changelogPath,
    "# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n" +
      newSection +
      "\n",
  );
}

async function main() {
  const args = process.argv.slice(2);
  const currentTag = args[0] || process.env.GITHUB_REF_NAME;

  if (!currentTag) {
    console.error("Usage: bun run changelog.mjs <current-tag>");
    process.exit(1);
  }

  const previousTag = await getPreviousTag(currentTag);
  console.log(`Generating changelog for ${currentTag}...`);
  if (previousTag) {
    console.log(`Previous tag: ${previousTag}`);
  }

  const commits = await getCommitsBetween(previousTag, currentTag);
  console.log(`Found ${commits.length} commits`);

  if (commits.length === 0) {
    console.log(`Skipping ${currentTag} - no valid commits`);
    return;
  }

  const repoUrl = await getRepoUrl();
  const changelog = await generateChangelog(currentTag, commits, previousTag, repoUrl);

  updateChangelogFile(changelog);
  console.log(`Updated CHANGELOG.md`);

  console.log("\n--- Changelog Content ---\n");
  console.log(changelog);
}

main();
