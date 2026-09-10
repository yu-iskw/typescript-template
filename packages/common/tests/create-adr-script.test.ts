import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('create-adr.sh', () => {
  it('passes the portable bash regression harness', () => {
    // Vitest cwd is packages/common for this package project.
    const harness = resolve(
      process.cwd(),
      '../../.claude/skills/manage-adr/scripts/test-create-adr.sh',
    );
    expect(existsSync(harness)).toBe(true);
    const stdout = execFileSync('/bin/bash', [harness], {
      encoding: 'utf8',
    });
    expect(stdout).toContain('ALL PASSED');
  });
});
