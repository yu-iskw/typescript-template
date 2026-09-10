import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');
const harness = path.join(repoRoot, '.claude/skills/manage-adr/scripts/test-create-adr.sh');

describe('create-adr.sh', () => {
  it('passes the portable bash regression harness', () => {
    const stdout = execFileSync('bash', [harness], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    expect(stdout).toContain('ALL PASSED');
  });
});
