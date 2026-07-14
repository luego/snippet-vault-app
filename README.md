# Snippet Vault

A production-minded, responsive developer workspace for saving, organizing, searching, and selectively sharing reusable code snippets.

> Current status: Milestone 4. Secure snippet CRUD, URL-driven search/filter/sort/pagination, favorites, tag navigation, live dashboard summaries, copy feedback, and server-side syntax highlighting are implemented. Public share pages and final polish begin in Milestone 5.

## Features

- Server-rendered Next.js App Router foundation
- Responsive landing, authentication, and application layouts
- Light, dark, and system themes
- Email/password signup, login, logout, and password recovery
- Cookie-based Supabase SSR sessions with protected application routes
- PostgreSQL schema, triggers, indexes, grants, and Row Level Security
- Atomic snippet and tag mutations through authenticated database functions
- RLS-scoped database search with escaped wildcard input and stable pagination
- Shareable URL filters for query, language, tag, favorite, visibility, and sort
- Live dashboard totals, recent snippets, top tags, favorites, and tag overview
- Responsive snippet editor, collection, detail, and delete-confirmation experiences
- Server-rendered Shiki highlighting with line numbers and inert user content
- Typed public/server environment boundaries
- Security headers and a minimal health endpoint
- Safe redirect, tag normalization, language allowlist, and URL-search validation utilities
- Unit, browser, and pgTAP database isolation tests
- Non-root, read-only-compatible production container

## Stack

Next.js 16, React 19, strict TypeScript, Tailwind CSS 4, next-themes, Zod, Lucide, Vitest, Playwright, Supabase Postgres/Auth with `@supabase/ssr`, pnpm, and Docker.

## Architecture

Routes compose UI in `src/app`; reusable product behavior lives in `src/features`; shared layout and feedback components live in `src/components`; environment/security utilities live in `src/lib`. Server Components own data loading while small Client Components handle browser-only form, clipboard, dialog, and theme interactions.

## Local development

Prerequisites: Node.js 22.13+ (Node 24 LTS recommended), pnpm 11, and Docker Desktop when using the local Supabase stack.

```bash
cp .env.local.example .env.local
pnpm install
pnpm supabase:start
pnpm supabase:reset
pnpm dev
```

Copy the local API URL and publishable key printed by `pnpm supabase:start` into `.env.local`, then open `http://localhost:3000`. Stop the local services with `pnpm supabase:stop` when finished. Marketing and health routes can build without Supabase values; authentication requires both public Supabase variables.

## Supabase setup

1. Create a Supabase project and copy its URL and publishable key into `.env.local`.
2. Never expose the service-role key with a `NEXT_PUBLIC_` name.
3. Apply `supabase/migrations` with `supabase db push` for a linked hosted project, or use `pnpm supabase:reset` locally.
4. Configure the site URL plus `/auth/callback` as an allowed redirect for local and production environments.
5. Keep email confirmation enabled. Local development uses the Supabase mail viewer printed by the CLI.

For a hosted project, open **Authentication → Email Templates → Confirm signup** and make the confirmation button link to:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard
```

Use the following link in the **Reset password** template:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password
```

These token-hash endpoints work with cookie-based SSR even when the email opens in a different browser context. Ensure the Supabase Site URL exactly matches `NEXT_PUBLIC_APP_URL`, including the scheme, hostname, and port during local development.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:db
pnpm build
pnpm test:e2e
pnpm check
```

Playwright browsers may be installed with `pnpm exec playwright install chromium`.

## Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -t snippet-vault .
docker run --rm --env-file .env.local -p 3000:3000 snippet-vault
curl --fail http://localhost:3000/api/health
```

Export the three public variables before building because Next.js embeds browser-safe values at build time. The publishable key is designed for client use; never pass the service-role key as a build argument. You can also run `docker compose up --build` after exporting them. The container uses Node 24 LTS, runs as an unprivileged user, and exposes only the minimal process health response.

## Deployment

Deploy to Vercel or any host that supports the standalone Next.js output. Set `NEXT_PUBLIC_APP_URL` to the canonical HTTPS origin, configure the browser-safe Supabase URL and publishable key, and add the matching callback URL to Supabase Auth. A live demo URL and product screenshot will be added before release.

## Security

Current controls include strict server/client environment separation, a restrictive baseline CSP, clickjacking and MIME-sniffing headers, safe internal redirect validation, React text rendering for user content, token-based server syntax rendering, non-root container execution, server-validated mutations, verified Supabase claims, least-privilege grants, and RLS policies tested with isolated users. See [SECURITY.md](./SECURITY.md).

## Trade-offs and future work

Milestone 5 adds revocable anonymous public sharing, public metadata controls, final accessibility/responsive polish, screenshots, and the remaining critical-path E2E coverage.
