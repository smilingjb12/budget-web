# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages, layouts, API routes.
- `src/components`: Reusable UI (ShadCN/Radix) and feature widgets.
- `src/lib`: Utilities and React hooks (`use-*`).
- `src/db`: Drizzle ORM schema and migrations (`migrations/`, `schema/`).
- `public`: Static assets (e.g., `logo.png`).
- Config: `tsconfig.json`, `next.config.mjs`, `vitest.config.mts`, `drizzle.config.ts`, `postcss.config.mjs`.
- Tests: colocated near code (e.g., `*.test.ts`), setup in `src/test/setup.ts`.

## Build, Test, and Development Commands
- `npm run dev`: Start Next.js dev server (Turbopack).
- `npm run build`: Production build.
- `npm start`: Run production build.
- `npm run lint`: ESLint (Next config).
- `npm test` / `npm run test:once`: Vitest watch/run once.
- `npm run db:generate`: Generate Drizzle migrations.
- `npm run db:migrate`: Apply migrations via `src/db/migrate.ts`.
- `npm run db:studio`: Open Drizzle Studio.

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer explicit types at module boundaries.
- React components: PascalCase exports; filenames kebab-case (`monthly-summary-card.tsx`).
- Hooks/utilities: `use-*` and kebab-case filenames.
- Indentation: 2 spaces; keep imports sorted and relative paths via `@/*` alias.
- Styling: Tailwind CSS v4; keep class lists small and extract UI to `src/components/ui`.
- Lint: fix warnings before commit (`npm run lint`).

## Testing Guidelines
- Framework: Vitest + Testing Library + jsdom.
- File pattern: `*.test.ts[x]` near source (example: `src/lib/hooks/use-previous-month.test.ts`).
- Write tests for new logic and regressions; prefer user-facing assertions.
- Run locally with `npm test`; add snapshots sparingly.

## Commit & Pull Request Guidelines
- Commits: short, imperative mood (e.g., "Add income display", "Fix linter issues").
- PRs: clear description, linked issue, steps to verify, and screenshots/GIFs for UI changes.
- DB changes: include migration (`db:generate`), run `db:migrate`, note breaking data changes.
- Checklist: `npm run lint` and `npm test` pass; update README/Docs if behavior changes.

## Security & Configuration Tips
- Secrets via `.env.local` (dev) and platform env (prod). See `src/nextEnv.ts` keys like `DATABASE_URL`, Clerk keys, and `EXCHANGE_RATE_API_KEY`.
- Never commit `.env*` files or credentials. Prefer `DATABASE_URL` in production with SSL as configured in README.
