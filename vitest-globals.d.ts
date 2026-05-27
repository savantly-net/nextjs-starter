// Makes vitest's globals (describe/it/expect/vi) available to tsc, matching
// `globals: true` in vitest.config.ts. Referenced project-wide via tsconfig's
// `**/*.ts` include, so test files can use globals without importing them.
/// <reference types="vitest/globals" />
