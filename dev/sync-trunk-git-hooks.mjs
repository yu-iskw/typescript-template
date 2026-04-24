import { execSync } from 'node:child_process';

const shouldSkip = process.env.SKIP_TRUNK_GIT_HOOKS === '1';

if (shouldSkip) {
  process.exit(0);
}

try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
} catch {
  process.exit(0);
}

try {
  execSync('pnpm exec trunk git-hooks sync', { stdio: 'inherit' });
} catch {
  console.warn(
    '[trunk-hooks] Unable to sync Trunk git hooks. Run `pnpm exec trunk git-hooks sync` manually once networking is available.',
  );
}
