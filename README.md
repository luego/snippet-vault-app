# Snippet Vault

A production-minded, responsive developer workspace for saving, organizing, searching, and selectively sharing reusable code snippets.

> Current status: Milestone 1 foundation. The polished marketing site, responsive application shell, theme system, validation utilities, health route, tests, and production container are implemented. Supabase authentication and live data begin in Milestone 2.

## Features

- Server-rendered Next.js App Router foundation
- Responsive landing, authentication, and application layouts
- Light, dark, and system themes
- Typed public/server environment boundaries
- Security headers and a minimal health endpoint
- Safe redirect, tag normalization, language allowlist, and URL-search validation utilities
- Unit and browser test foundations
- Non-root, read-only-compatible production container

## Stack

Next.js 16, React 19, strict TypeScript, Tailwind CSS 4, next-themes, Zod, Lucide, Vitest, Playwright, pnpm, and Docker. Supabase Postgres/Auth is planned for Milestone 2.

## Architecture

Routes compose UI in `src/app`; reusable product behavior lives in `src/features`; shared layout and feedback components live in `src/components`; environment/security utilities live in `src/lib`. Client Components are limited to browser-only theme behavior and error recovery.

## Local development

Prerequisites: Node.js 22.13+ (Node 24 LTS recommended) and pnpm 11.

```bash
cp .env.local.example .env.local
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The Milestone 1 build does not contact Supabase, so placeholder Supabase values are sufficient.

## Supabase setup (Milestone 2)

1. Create a Supabase project and copy its URL and publishable key into `.env.local`.
2. Never expose the service-role key with a `NEXT_PUBLIC_` name.
3. Apply committed SQL migrations with the Supabase CLI once Milestone 2 adds them.
4. Configure local and production auth callback URLs explicitly in the Supabase dashboard.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm check
```

Playwright browsers may be installed with `pnpm exec playwright install chromium`.

## Docker

```bash
docker build -t snippet-vault .
docker run --rm --env-file .env.local -p 3000:3000 snippet-vault
curl --fail http://localhost:3000/api/health
```

Or run `docker compose up --build`. The container uses Node 24 LTS, runs as an unprivileged user, and exposes only the minimal process health response.

## Deployment

Deploy to Vercel or any host that supports the standalone Next.js output. Set `NEXT_PUBLIC_APP_URL` to the canonical HTTPS origin and add browser-safe Supabase values when Milestone 2 is complete. A live demo URL and product screenshot will be added before release.

## Security

Current controls include strict server/client environment separation, a restrictive baseline CSP, clickjacking and MIME-sniffing headers, safe internal redirect validation, no user-controlled HTML rendering, and non-root container execution. The database schema, RLS isolation policies, verified auth flows, and mutation schemas are explicitly deferred to Milestone 2 and later as required by the build specification. See [SECURITY.md](./SECURITY.md).

## Trade-offs and future work

The dashboard currently uses clearly labeled sample data so the complete responsive shell can be reviewed before backend work begins. Future milestones add Supabase authentication and RLS, snippet CRUD, tags/search/pagination, server-side syntax highlighting, public sharing, and the full critical-path E2E suite.
