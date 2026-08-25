import { createFolderStructure } from 'eslint-plugin-project-structure';

/**
 * Keep the reusable template strict at the repository shell while leaving package
 * internals intentionally open. Derived repositories should extend this policy
 * when their domain architecture becomes stable.
 */
export const folderStructureConfig = createFolderStructure({
  structure: [
    { name: '.*', children: [] },
    { name: '(AGENTS|CLAUDE|GEMINI|README|SECURITY|CONTRIBUTING).md' },
    { name: 'LICENSE' },
    { name: '(dev|docs|scripts)', children: [] },
    {
      name: 'packages',
      children: [{ name: '*', children: [] }],
    },
    { name: '(eslint|vitest|vite|knip|tsup).config.(js|mjs|ts)' },
    { name: '(package|tsconfig|knip).json' },
    { name: 'pnpm-lock.yaml' },
    { name: 'pnpm-workspace.yaml' },
  ],
  ignorePatterns: [
    'node_modules',
    '.pnpm-store',
    'dist',
    'coverage',
    'projectStructure.cache.json',
  ],
});
