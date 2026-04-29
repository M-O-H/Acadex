# AGENTS.md - Acadex

## Developer Commands

- `pnpm install` - Install dependencies
- `pnpm run build` - Compile to dist/
- `pnpm run start:dev` - Dev server with watch mode
- `pnpm run lint` - ESLint + Prettier (auto-fix)
- `pnpm run test` - Unit tests (src/, .spec.ts)
- `pnpm run test:e2e` - E2E tests (test/, jest-e2e.json)
- `pnpm run test:cov` - Coverage report

## Key Details

- **Framework**: NestJS v11
- **Package manager**: pnpm
- **Module system**: nodenext (ESM with CommonJS compatibility)
- **TypeScript**: Strict mode enabled
- **Tests**: Jest with ts-jest, coverage in ./coverage
