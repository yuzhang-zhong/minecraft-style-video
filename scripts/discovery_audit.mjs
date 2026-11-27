#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const QUERY_FILE = path.join(ROOT, "tests", "discovery_queries.json");

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    throw new Error("skills/minecraft-style-video/SKILL.md is missing YAML frontmatter");
  }
  const nameMatch = match[1].match(/^name:\s*(\S+)\s*$/m);
  if (!nameMatch) {
    throw new Error("SKILL.md frontmatter is missing name");
  }
  return { name: nameMatch[1], text: match[1] };
}

function normalize(value) {
  return value.normalize("NFKC").toLocaleLowerCase("en");
}

export function auditLocalDiscovery(root = ROOT) {
  const config = JSON.parse(fs.readFileSync(path.join(root, "tests", "discovery_queries.json"), "utf8"));
  const skillMarkdown = fs.readFileSync(
    path.join(root, "skills", "minecraft-style-video", "SKILL.md"),
    "utf8"
  );
  const frontmatter = parseFrontmatter(skillMarkdown);
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const searchableSurface = normalize(
    [
      frontmatter.text,
      skillMarkdown,
      fs.readFileSync(path.join(root, "README.md"), "utf8"),
      fs.readFileSync(path.join(root, "README.zh-CN.md"), "utf8"),
      fs.readFileSync(path.join(root, "llms.txt"), "utf8"),
      fs.readFileSync(path.join(root, "CITATION.cff"), "utf8"),
      packageJson.description,
      packageJson.keywords.join(" "),
      fs.readFileSync(path.join(root, "plugin.json"), "utf8"),
      fs.readFileSync(path.join(root, ".claude-plugin", "plugin.json"), "utf8"),
      fs.readFileSync(path.join(root, ".cursor-plugin", "plugin.json"), "utf8"),
      fs.readFileSync(path.join(root, "agents", "openai.yaml"), "utf8")
    ].join("\n")
  );

  const checks = [
    {
      id: "canonical-skill-name",
      passed: frontmatter.name === config.expectedSkill,
      detail:
        frontmatter.name === config.expectedSkill
          ? config.expectedSkill
          : `expected ${config.expectedSkill}, found ${frontmatter.name}`
    }
  ];

  for (const relativePath of config.requiredPaths) {
    const passed = fs.existsSync(path.join(root, relativePath));
    checks.push({
      id: `path:${relativePath}`,
      passed,
      detail: passed ? "present" : "missing"
    });
  }

  for (const command of config.requiredInstallCommands) {
    const passed = searchableSurface.includes(normalize(command));
    checks.push({
      id: `install:${command.split(" ").slice(0, 3).join(" ")}`,
      passed,
      detail: passed ? "documented" : "missing from README/search metadata"
    });
  }

  for (const query of config.queries) {
    const missingTerms = query.requiredTerms.filter(
      (term) => !searchableSurface.includes(normalize(term))
    );
    checks.push({
      id: `query:${query.id}`,
      passed: missingTerms.length === 0,
      detail: missingTerms.length === 0 ? query.query : `missing: ${missingTerms.join(", ")}`
    });
  }

  return {
    mode: "local",
    repository: config.repository,
    expectedSkill: config.expectedSkill,
    passed: checks.every((check) => check.passed),
    checks
  };
}

function auditRemoteDiscovery(localReport) {
  const config = JSON.parse(fs.readFileSync(QUERY_FILE, "utf8"));
  const checks = [];
  const preview = spawnSync(
    "gh",
    ["skill", "preview", config.repository, config.expectedSkill],
    { cwd: ROOT, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 }
  );
  checks.push({
    id: "remote-preview",
    passed: preview.status === 0,
    detail:
      preview.status === 0
        ? "previewable"
        : (preview.stderr || preview.stdout || `gh exited ${preview.status}`).trim()
  });
  return {
    mode: "remote",
    checkedAt: new Date().toISOString(),
    repository: config.repository,
    expectedSkill: config.expectedSkill,
    passed: checks.every((check) => check.passed),
    checks
  };
}

function printReport(report) {
  const passedCount = report.checks.filter((check) => check.passed).length;
  console.log(
    `${report.mode === "remote" ? "Remote" : "Local"} discovery audit: ` +
      `${passedCount}/${report.checks.length} checks passed`
  );
  for (const check of report.checks) {
    if (!check.passed) {
      console.log(`FAIL ${check.id}: ${check.detail}`);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const localReport = auditLocalDiscovery();
  printReport(localReport);
  if (!localReport.passed) {
    process.exitCode = 1;
    return;
  }
  if (!args.includes("--remote")) return;
  const remoteReport = auditRemoteDiscovery(localReport);
  printReport(remoteReport);
  if (!remoteReport.passed) process.exitCode = 1;
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  main();
}
