/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node',
          target: 'ES2022',
          esModuleInterop: true,
          isolatedModules: true,
          verbatimModuleSyntax: false,
          strict: true,
          skipLibCheck: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@kanban/config$': '<rootDir>/../../packages/config/src/index.ts',
    '^@kanban/db$': '<rootDir>/../../packages/db/src/index.ts',
    '^@kanban/errors$': '<rootDir>/../../packages/errors/src/index.ts',
    '^@kanban/logger$': '<rootDir>/../../packages/logger/src/index.ts',
    '^@kanban/types$': '<rootDir>/../../packages/types/src/index.ts',
    '^@kanban/validation$': '<rootDir>/../../packages/validation/src/index.ts',
  },
  verbose: true,
};
