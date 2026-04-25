#!/usr/bin/env node
// Syncs Trunk-managed git hooks so pre-commit/pre-push checks run locally.
// Called automatically via the postinstall script and the Claude Code SessionStart hook.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

if (process.env.SKIP_TRUNK_GIT_HOOKS === '1') {
  process.exit(0);
}

const gitDir = join(process.cwd(), '.git');
if (!existsSync(gitDir)) {
  // Not in a git worktree (e.g. CI install step with a checkout-less cache)
  process.exit(0);
}

try {
  execSync('pnpm exec trunk git-hooks sync', { stdio: 'inherit' });
} catch (error) {
  // Trunk may be unavailable in network-restricted environments; warn but don't fail.
  process.stderr.write(
    `[hooks:install] Warning: trunk git-hooks sync failed (${error.message}). ` +
      'Pre-commit/pre-push hooks may not be installed.\n',
  );
}
