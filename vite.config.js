import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Exclude test copies inside worktrees. Claude Code uses /.claude/worktrees
    // for isolated work; those subtrees contain their own checked-out copy of
    // every *.test.js file, so vitest would otherwise discover and run them
    // ALL — making "Tests 1021 passed" become "Tests 6034 passed" with 6
    // copies of the same suite. Exclude the worktree tree so we only see the
    // canonical run from the active checkout.
    exclude: ['node_modules/**', 'dist/**', '.claude/worktrees/**'],
  },
})
