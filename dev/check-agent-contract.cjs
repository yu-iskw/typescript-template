const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const rootPackage = readJson('package.json');
const errors = [];

const pnpmBuiltins = new Set(['add', 'approve-builds', 'exec', 'install']);
const markdownContracts = [
  'AGENTS.md',
  'README.md',
  'CLAUDE.md',
  '.claude/README.md',
  '.claude/skills/initialize-project/SKILL.md',
];

for (const file of markdownContracts) {
  const markdown = readText(file);
  for (const command of extractPnpmCommands(markdown)) {
    if (!pnpmBuiltins.has(command) && !rootPackage.scripts?.[command]) {
      errors.push(`${file} references missing root pnpm script: ${command}`);
    }
  }
}

const claudeEntry = readText('CLAUDE.md');
for (const agent of tableEntries(claudeEntry, 'Available agents')) {
  assertExists(`.claude/agents/${agent}.md`, `CLAUDE.md advertises missing agent: ${agent}`);
}
for (const skill of tableEntries(claudeEntry, 'Available skills')) {
  assertExists(
    `.claude/skills/${skill}/SKILL.md`,
    `CLAUDE.md advertises missing skill: ${skill}`,
  );
}

if (claudeEntry.includes('/parallel-executor')) {
  errors.push('CLAUDE.md advertises /parallel-executor, but that workflow is not checked in');
}

const claudeReadme = readText('.claude/README.md');
if (claudeEntry.includes('Task tool') || claudeReadme.includes('Task tool')) {
  errors.push('Claude compatibility docs use the stale "Task tool" name; use "Agent tool"');
}

const claudeSettings = readJson('.claude/settings.json');
if (claudeSettings.permissions?.allow?.includes('Task')) {
  errors.push('.claude/settings.json allows stale tool name "Task"; use "Agent"');
}

const initializeSkill = readText('.claude/skills/initialize-project/SKILL.md');
if (initializeSkill.includes('StrReplace')) {
  errors.push('initialize-project depends on stale editor-specific tool name "StrReplace"');
}

const packageLicense = rootPackage.license;
for (const packageDir of fs.readdirSync(path.join(root, 'packages'), { withFileTypes: true })) {
  if (!packageDir.isDirectory()) continue;
  const manifestPath = `packages/${packageDir.name}/package.json`;
  if (!fs.existsSync(path.join(root, manifestPath))) continue;
  const manifest = readJson(manifestPath);
  if (manifest.license !== packageLicense) {
    errors.push(
      `${manifestPath} license ${JSON.stringify(manifest.license)} does not match root license ${JSON.stringify(packageLicense)}`,
    );
  }
}

if (errors.length > 0) {
  console.error('Agent contract checks failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Agent contract checks passed.');
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function assertExists(relativePath, message) {
  if (!fs.existsSync(path.join(root, relativePath))) errors.push(message);
}

function tableEntries(markdown, heading) {
  const sectionStart = markdown.indexOf(`## ${heading}`);
  if (sectionStart === -1) return [];

  const section = markdown.slice(sectionStart + heading.length + 3);
  const nextSection = section.search(/^## /m);
  const body = nextSection === -1 ? section : section.slice(0, nextSection);
  return [...body.matchAll(/^\|\s*`([^`]+)`\s*\|/gm)].map((match) => match[1]);
}

function extractPnpmCommands(markdown) {
  const codeFragments = [];
  let inFence = false;
  let fenced = [];

  for (const line of markdown.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      if (inFence) {
        codeFragments.push(fenced.join('\n'));
        fenced = [];
      }
      inFence = !inFence;
      continue;
    }
    if (inFence) fenced.push(line);
  }

  for (const match of markdown.matchAll(/`([^`\n]+)`/g)) codeFragments.push(match[1]);

  const commands = new Set();
  for (const fragment of codeFragments) {
    for (const match of fragment.matchAll(/\bpnpm\s+([a-z][\w:-]*)/g)) commands.add(match[1]);
  }
  return commands;
}
