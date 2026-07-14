# Snippet Vault — Codex Build Specification

> A polished, production-style developer portfolio project for securely saving, organizing, searching, and sharing code snippets.

## 0. Instructions for Codex

Build this project incrementally and keep it runnable after every milestone.

### Non-negotiable rules

1. Use the latest stable versions compatible with each other at implementation time.
2. Use **Next.js App Router**, TypeScript strict mode, React Server Components by default, and Client Components only where browser interactivity is necessary.
3. Use **pnpm**.
4. Do not expose secrets, the Supabase service-role key, database credentials, or privileged operations to the browser.
5. Enforce authorization in PostgreSQL using **Row Level Security (RLS)**. UI checks alone are never sufficient.
6. Treat every browser request and every database value as untrusted input.
7. Do not render user-provided HTML. Snippet code must be rendered as escaped text.
8. Do not use `dangerouslySetInnerHTML` for user-controlled content.
9. Validate all mutations on the server with Zod.
10. Prefer Server Actions for first-party form mutations. Use Route Handlers only where an HTTP endpoint is genuinely useful.
11. Keep modules small, cohesive, testable, and reusable.
12. No `any` unless unavoidable and documented inline.
13. Run linting, type checking, tests, and a production build before considering a milestone complete.
14. Include useful empty, loading, error, unauthorized, and not-found states.
15. The finished application must be responsive from 320 px mobile screens through large desktop displays.

---

# 1. Product Summary

## Product name

**Snippet Vault**

## One-line description

A secure personal workspace for saving, tagging, searching, favoriting, and copying reusable code snippets.

## Portfolio objective

Demonstrate the ability to build a realistic SaaS-style product with:

- Modern server-rendered UI
- Authentication and authorization
- Secure CRUD operations
- PostgreSQL data modeling
- Supabase RLS
- Search and filtering
- Accessible responsive design
- Dockerized production deployment
- Testing and CI-ready scripts
- SEO for public pages
- Maintainable architecture

## Primary users

- Software developers
- Technical students
- Freelancers
- Engineers who frequently reuse commands, configurations, SQL, regex, or code fragments

---

# 2. MVP Scope

## Public functionality

- Marketing landing page
- Feature overview
- Public snippet view for snippets explicitly marked public
- Sign-up page
- Sign-in page
- Forgot-password flow
- Reset-password flow
- Terms placeholder page
- Privacy placeholder page

## Authenticated functionality

- Dashboard overview
- Create snippet
- View snippet
- Edit snippet
- Delete snippet with confirmation
- Duplicate snippet
- Search snippets
- Filter by language, tag, favorite status, and visibility
- Sort by recently updated, recently created, title, and most copied
- Add and remove tags
- Mark or unmark favorite
- Copy code to clipboard
- Choose public or private visibility
- Generate a public share URL for public snippets
- Revoke public access by changing visibility to private
- Profile and preferences page
- Light, dark, and system theme

## Deliberately out of MVP

- Teams
- Paid subscriptions
- AI code generation
- Comments
- Real-time collaboration
- Arbitrary HTML/Markdown rendering
- File attachments
- Browser extensions

These can be mentioned in the README as future work, but must not delay the MVP.

---

# 3. Recommended Technology Stack

Use current stable releases and confirm exact APIs against official documentation before implementation.

- **Framework:** Next.js with App Router
- **Language:** TypeScript with `strict: true`
- **Package manager:** pnpm
- **UI:** Tailwind CSS
- **Components:** shadcn/ui primitives where useful; do not blindly install every component
- **Icons:** Lucide React
- **Database/Auth:** Supabase Postgres + Supabase Auth
- **Supabase SSR:** `@supabase/ssr`
- **Validation:** Zod
- **Forms:** Native server-action forms where practical; React Hook Form only for forms that materially benefit from client-side form state
- **Syntax highlighting:** Shiki, performed server-side where possible
- **Theme:** `next-themes`
- **Toasts:** Sonner or the current recommended shadcn-compatible toast solution
- **Unit/component tests:** Vitest + React Testing Library
- **End-to-end tests:** Playwright
- **Linting:** ESLint using the current Next.js-compatible setup
- **Formatting:** Prettier
- **Git hooks:** Optional Husky + lint-staged; do not make local setup fragile
- **Deployment:** Vercel and Docker-compatible hosting

## Avoid unnecessary dependencies

Do not add Redux, TanStack Query, an ORM, or a global state library unless a concrete need appears. Server Components, URL search parameters, Server Actions, and Supabase are enough for this project.

---

# 4. Architecture

Use a pragmatic feature-oriented architecture with clear boundaries. Do not create enterprise ceremony for a small application.

```text
snippet-vault/
├─ public/
│  ├─ brand/
│  ├─ icons/
│  └─ images/
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ privacy/page.tsx
│  │  │  └─ terms/page.tsx
│  │  ├─ (auth)/
│  │  │  ├─ layout.tsx
│  │  │  ├─ sign-in/page.tsx
│  │  │  ├─ sign-up/page.tsx
│  │  │  ├─ forgot-password/page.tsx
│  │  │  ├─ reset-password/page.tsx
│  │  │  └─ auth/callback/route.ts
│  │  ├─ (app)/
│  │  │  ├─ layout.tsx
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ snippets/page.tsx
│  │  │  ├─ snippets/new/page.tsx
│  │  │  ├─ snippets/[snippetId]/page.tsx
│  │  │  ├─ snippets/[snippetId]/edit/page.tsx
│  │  │  ├─ favorites/page.tsx
│  │  │  ├─ tags/page.tsx
│  │  │  └─ settings/
│  │  │     ├─ profile/page.tsx
│  │  │     └─ preferences/page.tsx
│  │  ├─ s/[publicId]/page.tsx
│  │  ├─ api/
│  │  │  └─ health/route.ts
│  │  ├─ error.tsx
│  │  ├─ global-error.tsx
│  │  ├─ not-found.tsx
│  │  ├─ robots.ts
│  │  ├─ sitemap.ts
│  │  ├─ layout.tsx
│  │  └─ globals.css
│  ├─ features/
│  │  ├─ auth/
│  │  │  ├─ actions/
│  │  │  ├─ components/
│  │  │  ├─ schemas/
│  │  │  └─ server/
│  │  ├─ snippets/
│  │  │  ├─ actions/
│  │  │  ├─ components/
│  │  │  ├─ schemas/
│  │  │  ├─ server/
│  │  │  │  ├─ repository.ts
│  │  │  │  ├─ queries.ts
│  │  │  │  └─ mappers.ts
│  │  │  ├─ types/
│  │  │  └─ utils/
│  │  ├─ tags/
│  │  └─ profile/
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ layout/
│  │  ├─ feedback/
│  │  └─ shared/
│  ├─ lib/
│  │  ├─ supabase/
│  │  │  ├─ browser.ts
│  │  │  ├─ server.ts
│  │  │  ├─ middleware.ts
│  │  │  └─ types.ts
│  │  ├─ auth/
│  │  ├─ env.ts
│  │  ├─ security/
│  │  ├─ constants/
│  │  └─ utils.ts
│  ├─ config/
│  │  ├─ site.ts
│  │  └─ navigation.ts
│  └─ middleware.ts
├─ supabase/
│  ├─ migrations/
│  ├─ seed.sql
│  └─ config.toml
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
├─ .env.example
├─ .env.local.example
├─ .dockerignore
├─ .gitignore
├─ Dockerfile
├─ compose.yaml
├─ next.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
├─ vitest.config.ts
├─ playwright.config.ts
├─ README.md
└─ SECURITY.md
```

## Boundary rules

- `app/` composes routes and layouts; it must not become the domain layer.
- Feature-specific code lives in `features/<feature>`.
- Server-only modules must include `import "server-only"`.
- Database operations live in server repositories/query modules.
- Components never instantiate privileged database clients.
- Validation schemas are shared only when the same shape is genuinely valid on both client and server.
- Server Actions authenticate the current user, validate input, perform the operation, and revalidate/redirect.
- Repository methods accept an authenticated Supabase client or user ID explicitly; no hidden global mutable state.

---

# 5. Routing and Layout Strategy

Use route groups so public, authentication, and application layouts remain separate without affecting URLs.

## Route map

| Route                        | Access                        | Purpose                       |
| ---------------------------- | ----------------------------- | ----------------------------- |
| `/`                          | Public                        | Landing page                  |
| `/sign-in`                   | Anonymous preferred           | Sign in                       |
| `/sign-up`                   | Anonymous preferred           | Create account                |
| `/forgot-password`           | Public                        | Request reset email           |
| `/reset-password`            | Reset session required        | Set new password              |
| `/auth/callback`             | Public callback               | Exchange auth code            |
| `/dashboard`                 | Authenticated                 | Summary and recent snippets   |
| `/snippets`                  | Authenticated                 | Searchable snippet collection |
| `/snippets/new`              | Authenticated                 | Create snippet                |
| `/snippets/[snippetId]`      | Owner only                    | Private/owned snippet detail  |
| `/snippets/[snippetId]/edit` | Owner only                    | Edit owned snippet            |
| `/favorites`                 | Authenticated                 | Favorite snippets             |
| `/tags`                      | Authenticated                 | Tag overview                  |
| `/settings/profile`          | Authenticated                 | Profile settings              |
| `/settings/preferences`      | Authenticated                 | Theme/editor preferences      |
| `/s/[publicId]`              | Public when visibility allows | Public read-only snippet      |
| `/api/health`                | Public                        | Health check without secrets  |

## Routing rules

- Use `<Link>` for navigable UI.
- Preserve filters in URL search parameters, for example:

```text
/snippets?q=postgres&language=sql&tag=supabase&favorite=true&sort=updated-desc&page=1
```

- Parse and validate search parameters with Zod.
- Never trust `snippetId` or `publicId`; authorize through RLS and return `notFound()` when inaccessible.
- Use route-level `loading.tsx` only where it improves UX; prefer meaningful skeletons close to slow content.
- Add route-level `error.tsx` boundaries for recoverable failures.
- Use `generateMetadata` for public snippet pages without leaking private content.
- Redirect authenticated users away from sign-in/sign-up when sensible.
- Middleware may refresh Supabase sessions and perform coarse redirects, but final authorization must occur in server code and RLS.

---

# 6. Database Design

Create SQL migrations in `supabase/migrations`. Do not rely on undocumented dashboard-only changes.

## Extensions

Enable only what is needed:

```sql
create extension if not exists pg_trgm;
```

## Enums

```sql
create type public.snippet_visibility as enum ('private', 'public');
```

## Profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_theme text not null default 'system'
    check (preferred_theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Snippets

```sql
create table public.snippets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  public_id uuid not null default gen_random_uuid() unique,
  title text not null,
  description text,
  code text not null,
  language text not null default 'plaintext',
  visibility public.snippet_visibility not null default 'private',
  is_favorite boolean not null default false,
  copy_count bigint not null default 0 check (copy_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint snippets_title_length check (char_length(title) between 1 and 120),
  constraint snippets_description_length check (
    description is null or char_length(description) <= 500
  ),
  constraint snippets_code_length check (char_length(code) between 1 and 50000),
  constraint snippets_language_length check (char_length(language) between 1 and 50)
);
```

## Tags

Tags are owned by a user so different users can use the same tag names safely.

```sql
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  created_at timestamptz not null default now(),

  constraint tags_name_length check (char_length(name) between 1 and 30),
  constraint tags_normalized_length check (char_length(normalized_name) between 1 and 30),
  unique (owner_id, normalized_name)
);
```

## Snippet tags

```sql
create table public.snippet_tags (
  snippet_id uuid not null references public.snippets(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (snippet_id, tag_id)
);
```

## Indexes

```sql
create index snippets_owner_updated_idx
  on public.snippets (owner_id, updated_at desc);

create index snippets_owner_created_idx
  on public.snippets (owner_id, created_at desc);

create index snippets_owner_language_idx
  on public.snippets (owner_id, language);

create index snippets_owner_favorite_idx
  on public.snippets (owner_id, is_favorite)
  where is_favorite = true;

create index snippets_public_id_public_idx
  on public.snippets (public_id)
  where visibility = 'public';

create index snippets_title_trgm_idx
  on public.snippets using gin (title gin_trgm_ops);

create index snippets_description_trgm_idx
  on public.snippets using gin (description gin_trgm_ops);

create index tags_owner_name_idx
  on public.tags (owner_id, normalized_name);
```

## Updated-at trigger

Create one reusable function and apply it to `profiles` and `snippets`.

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

## New-user profile trigger

Create a profile after signup. Keep the function minimal and lock its search path.

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 80), '')
  );
  return new;
end;
$$;
```

Create the trigger on `auth.users` after insert.

## Tag normalization

Normalize tag input in server code:

- Unicode trim
- Collapse repeated internal whitespace
- Lowercase using a predictable locale-independent approach
- Reject empty tags
- Limit to 10 tags per snippet
- Limit each tag to 30 characters

Database uniqueness remains the final race-condition-safe guard.

---

# 7. Row Level Security

Enable RLS on every public schema table.

```sql
alter table public.profiles enable row level security;
alter table public.snippets enable row level security;
alter table public.tags enable row level security;
alter table public.snippet_tags enable row level security;
```

## Profiles policies

- Authenticated user can select only their own profile.
- Authenticated user can update only their own profile.
- Inserts normally happen through the signup trigger.

Use explicit `to authenticated` and both `using` and `with check` where applicable.

## Snippets policies

### Owner select

Authenticated users can select snippets where:

```sql
owner_id = (select auth.uid())
```

### Public select

Anonymous and authenticated users can select snippets only where:

```sql
visibility = 'public'
```

This allows `/s/[publicId]` to use the publishable/anonymous key safely.

### Insert

Authenticated users can insert only when:

```sql
owner_id = (select auth.uid())
```

Do not trust a client-supplied owner ID. The server action must always set `owner_id` from the verified current user.

### Update and delete

Authenticated users can update/delete only their own rows. Include owner validation in both `using` and `with check` for updates.

## Tags policies

Users may select, insert, update, and delete only tags where `owner_id = auth.uid()`.

## Snippet-tag policies

A user may access a junction row only when they own both the referenced snippet and tag. Use `exists` subqueries in policies.

## RLS test cases

Automated integration tests must prove:

1. User A cannot read User B's private snippet.
2. User A cannot edit/delete User B's snippet.
3. User A cannot attach User B's tag.
4. Anonymous user cannot read private snippets.
5. Anonymous user can read a public snippet by public ID.
6. Changing a public snippet to private immediately prevents anonymous access.
7. A forged `owner_id` cannot create a snippet for another user.

---

# 8. Authentication

Use Supabase Auth with `@supabase/ssr` and cookie-based server rendering.

## Required flows

- Email/password registration
- Email/password login
- Logout
- Email verification, depending on Supabase project configuration
- Forgot password
- Reset password
- Auth callback route

## Client separation

Create three concepts, not one universal client:

1. **Browser client** for browser-safe authenticated operations only when necessary.
2. **Server client** reading/writing auth cookies for Server Components, Server Actions, and Route Handlers.
3. **Admin client**, only if ever needed, in a clearly named server-only module. The MVP should not need it.

## Security rules

- Never expose `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_*` variable.
- Prefer `supabase.auth.getUser()` or the current official verified-user approach for authorization-sensitive server operations; do not blindly trust unverified session payloads.
- Every protected page must verify the user server-side.
- Every Server Action must independently verify the user.
- Do not depend exclusively on middleware for authentication.
- Use generic login/reset responses where useful to reduce account enumeration.
- Configure allowed redirect URLs explicitly in Supabase for local and production environments.
- Do not log access tokens, refresh tokens, passwords, or reset links.

---

# 9. Environment Variables

## `.env.example`

Commit this file with placeholders only:

```dotenv
# Public application URL used for canonical URLs and auth redirects.
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Browser-safe Supabase configuration.
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Optional server-only value for local integration tooling.
# Never expose this to browser code and do not require it for normal app runtime.
SUPABASE_SERVICE_ROLE_KEY=

# Optional direct database URL for migration tooling only.
# Never expose to the browser.
SUPABASE_DB_URL=

# Environment label.
APP_ENV=development
```

Use the currently documented Supabase publishable key naming. If the project still provides a legacy anon key, support it only through an explicitly documented migration-compatible variable name; do not duplicate keys unnecessarily.

## `.env.local.example`

May mirror `.env.example` with comments showing local usage. Never commit `.env.local`.

## Typed environment validation

Create `src/lib/env.ts` using Zod with separate public and server schemas.

Requirements:

- Fail fast at startup/build for missing required values.
- Validate URLs.
- Ensure server-only values are never exported through a client-importable module.
- Do not spread all of `process.env` into client code.
- Only access public variables by their static names so Next.js can safely inline them.

## Git ignore

Ignore:

```text
.env
.env.*
!.env.example
!.env.local.example
```

---

# 10. Server Actions and Data Flow

## Mutations

Implement Server Actions for:

- `createSnippet`
- `updateSnippet`
- `deleteSnippet`
- `duplicateSnippet`
- `toggleFavorite`
- `setSnippetVisibility`
- `updateProfile`
- `updatePreferences`

Each action must:

1. Execute only on the server.
2. Verify the current authenticated user.
3. Parse `FormData` or structured input with Zod.
4. Ignore/forbid client-supplied ownership fields.
5. Normalize values.
6. Execute through the repository.
7. Return a typed success/error result for expected validation failures.
8. Avoid leaking raw SQL/Supabase errors to users.
9. Log unexpected errors with sensitive fields redacted.
10. Revalidate relevant paths or tags.
11. Redirect only to trusted internal routes.

## Queries

- Fetch dashboard and list data in Server Components.
- Use URL search parameters for list state.
- Select only required columns.
- Paginate at the database; never fetch every snippet and filter in the browser.
- Default page size: 20.
- Maximum accepted page size: 50.
- Use stable secondary ordering by ID to avoid inconsistent pagination.
- Escape wildcard characters when constructing `ilike` patterns, or use a controlled Postgres search function.

## Search

MVP search fields:

- Title
- Description
- Tags
- Optionally code, but only after measuring performance

Search constraints:

- Trim query
- Maximum 100 characters
- Debounce only if using client-side navigation
- URL remains the source of truth
- No raw SQL built from user input

---

# 11. Validation Rules

Create Zod schemas with these baseline limits.

## Snippet

- `title`: trimmed, 1–120 characters
- `description`: trimmed, optional, maximum 500 characters
- `code`: preserve meaningful whitespace, 1–50,000 characters
- `language`: allowlisted language identifier, maximum 50 characters
- `visibility`: `private | public`
- `tags`: maximum 10 unique normalized tags
- Each tag: 1–30 characters

## Profile

- `displayName`: trimmed, optional, maximum 80 characters
- `avatarUrl`: optional HTTPS URL; do not support uploads in MVP unless implemented securely
- `theme`: `light | dark | system`

## IDs

- Validate UUIDs before querying.
- Invalid IDs should return not found or a safe validation error, never a stack trace.

## Shared language allowlist

Create a curated map such as:

```ts
const SUPPORTED_LANGUAGES = {
  plaintext: "Plain text",
  typescript: "TypeScript",
  javascript: "JavaScript",
  tsx: "TSX",
  jsx: "JSX",
  csharp: "C#",
  python: "Python",
  java: "Java",
  go: "Go",
  rust: "Rust",
  sql: "SQL",
  bash: "Bash",
  powershell: "PowerShell",
  json: "JSON",
  yaml: "YAML",
  html: "HTML",
  css: "CSS",
  markdown: "Markdown",
  dockerfile: "Dockerfile",
} as const;
```

Unknown values should fall back to plaintext rather than dynamically loading arbitrary grammars.

---

# 12. XSS, Injection, and Web Security

## XSS prevention

- Render titles, descriptions, tags, and code using normal React text interpolation.
- Never insert user-controlled strings into `dangerouslySetInnerHTML`.
- Syntax highlighting must operate on raw code and return trusted output from a pinned, reputable library. Keep highlighting server-side. Do not accept custom grammar definitions from users.
- If highlighted HTML must be rendered, it may only come directly from Shiki processing of the escaped code string—not from stored HTML—and the boundary must be documented and covered by tests.
- Prefer a renderer that converts tokens to React elements rather than injecting HTML when practical.
- Do not render user-provided Markdown in MVP.
- Never place user input into inline scripts, style tags, raw SVG, or unquoted attributes.
- Sanitize any future rich content with a mature allowlist sanitizer on the server and test known payloads.

## Required XSS tests

Create snippets containing:

```text
<script>alert(1)</script>
<img src=x onerror=alert(1)>
</textarea><script>alert(document.cookie)</script>
javascript:alert(1)
<svg onload=alert(1)>
{{constructor.constructor('alert(1)')()}}
```

Verify they appear as harmless code/text and never execute on list, detail, edit, public-share, metadata, or toast surfaces.

## SQL injection prevention

- Use Supabase query APIs or parameterized SQL functions.
- Never concatenate input into raw SQL.
- Never accept arbitrary sort column/direction values; map validated enum values to known query branches.
- Do not pass unsanitized user strings to `.order()` column names.

## CSRF

- Prefer same-origin Server Actions and Supabase SSR cookies.
- Keep cookies secure with framework/Supabase defaults.
- For custom state-changing Route Handlers, validate origin/host and require authenticated sessions.
- Never mutate data through GET requests.

## Open redirects

- Accept only internal relative paths from a strict allowlist.
- Default post-login redirect to `/dashboard`.
- Reject values beginning with `//`, containing another origin, or using an unexpected protocol.

## Security headers

Configure headers in `next.config.ts`. Start with:

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: DENY
```

Add a Content Security Policy appropriate for Next.js and Supabase. The policy must be tested in production mode and should avoid `unsafe-eval`. Minimize `unsafe-inline`; if the framework requires a nonce-based strategy, implement it according to current Next.js guidance rather than copying an obsolete policy.

Expected CSP concepts:

- `default-src 'self'`
- Allow images from `self`, data URLs only where needed, and the configured Supabase project host if avatars are used
- Allow network connections only to `self` and the configured Supabase API/WebSocket origins
- `object-src 'none'`
- `base-uri 'self'`
- `frame-ancestors 'none'`
- `form-action 'self'`
- `upgrade-insecure-requests` in production

Do not hardcode a user-specific Supabase hostname; derive the allowed origin safely at configuration time.

## Other controls

- Use UUIDs, but never treat obscurity as authorization.
- Use RLS as the final data boundary.
- Limit body/form sizes where possible.
- Do not expose stack traces in production.
- Redact secrets and code content from logs.
- Rate-limit authentication and public copy-count endpoints if introduced. For the portfolio MVP, copy counts may be updated only for authenticated owners or omitted from public mutation flows to avoid abuse.
- Run `pnpm audit` as an advisory check, but assess findings rather than applying unsafe forced upgrades.

---

# 13. UI and Responsive Design

## Visual direction

A calm, premium developer tool—not a neon cyberpunk cliché.

### Brand palette

Use these design tokens as a starting point and verify contrast:

```text
Primary / Indigo:       #6366F1
Primary hover:          #4F46E5
Accent / Cyan:          #06B6D4
Light background:       #F8FAFC
Light surface:          #FFFFFF
Light elevated surface: #F1F5F9
Light text:             #0F172A
Light muted text:       #64748B
Dark background:        #090D18
Dark surface:           #111827
Dark elevated surface:  #172033
Dark text:              #F8FAFC
Dark muted text:        #94A3B8
Success:                #16A34A
Warning:                #D97706
Danger:                 #DC2626
Border light:           #E2E8F0
Border dark:            #273449
```

Use indigo for primary actions and cyan sparingly for focus/accent moments. Do not use gradients on every surface.

## Typography

- Interface font: Geist Sans or the current Next.js default optimized font
- Code font: Geist Mono
- Use `next/font`; avoid render-blocking external font requests
- Clear type scale with compact developer-tool density

## Desktop application layout

- Collapsible left sidebar, approximately 256 px expanded
- Top bar with global search, theme switcher, and profile menu
- Main content with maximum readable width where appropriate
- Snippet grid/list toggle is optional; implement one excellent list first
- Detail view uses a two-column layout on large screens:
  - Main code panel
  - Metadata/actions sidebar

## Mobile layout

- Sidebar becomes a sheet/drawer
- Search remains prominent
- Primary create action is reachable without scrolling excessively
- Snippet cards stack vertically
- Filter controls open in a bottom sheet or drawer
- Detail actions become a compact sticky action bar without covering content
- Code blocks scroll horizontally and never force the page width beyond viewport
- Touch targets at least 44×44 px

## Breakpoints

Design explicitly for:

- 320–479 px: narrow mobile
- 480–767 px: mobile
- 768–1023 px: tablet
- 1024–1439 px: desktop
- 1440 px and above: wide desktop

## Core screens

### Landing page

- Header
- Hero with product screenshot/mockup
- Benefits
- Three-step workflow
- Feature grid
- Security callout
- CTA
- Footer

### Dashboard

- Greeting and create button
- Compact stat cards: total, favorites, public, recently updated
- Recent snippets
- Top tags
- Empty state for new users

### Snippet list

- Search
- Filter controls
- Sort menu
- Responsive result count
- Cards/rows showing title, description, language, tags, favorite, visibility, updated date
- Pagination

### Snippet editor

- Title
- Description
- Language selector
- Code textarea/editor
- Tags input
- Visibility control
- Save and cancel
- Sticky actions on small screens
- Unsaved-change protection where practical

Do not add a heavyweight code editor for MVP unless it works well on mobile and does not inflate the bundle excessively. A high-quality monospace textarea with tab handling and preview is acceptable.

### Snippet detail

- Breadcrumb
- Title and actions
- Metadata
- Highlighted code
- Copy button with accessible confirmation
- Tags
- Public-share section when applicable

## Accessibility

- WCAG AA color contrast
- Semantic landmarks
- Visible focus states
- Keyboard-operable menus/dialogs
- Correct form labels and descriptions
- Error summary or per-field errors linked with `aria-describedby`
- `aria-live` for copy/save feedback where appropriate
- Respect reduced-motion preferences
- Do not rely solely on color to communicate state
- Dialogs must trap focus and restore it on close

---

# 14. Google Stitch Prompts

Use Google Stitch to generate visual references, not final production code. Codex must translate the chosen design into reusable application components while preserving accessibility and architecture.

## Stitch prompt 1 — Product design system and dashboard

```text
Design a polished responsive SaaS dashboard for a web app called “Snippet Vault”, a secure personal code snippet manager for software developers.

Style: modern, calm, premium developer productivity tool. Avoid generic cyberpunk visuals, excessive gradients, glassmorphism, and overly rounded toy-like cards. Use restrained shadows, crisp borders, compact spacing, and excellent hierarchy.

Color system:
- Primary indigo #6366F1, hover #4F46E5
- Accent cyan #06B6D4 used sparingly
- Light background #F8FAFC, surfaces #FFFFFF and #F1F5F9
- Dark background #090D18, surfaces #111827 and #172033
- Light text #0F172A, muted #64748B
- Dark text #F8FAFC, muted #94A3B8
- Success #16A34A, warning #D97706, danger #DC2626

Typography: clean sans-serif similar to Geist Sans; code uses Geist Mono.

Create desktop and mobile versions. Desktop has a collapsible left sidebar with Dashboard, All Snippets, Favorites, Tags, and Settings. The top bar contains a global search field, theme toggle, and user menu. Main dashboard contains a welcome header with a prominent “New snippet” button, four compact statistic cards, a recent snippets table/list, and a top tags section.

Show realistic data with languages such as TypeScript, C#, SQL, Bash, and Python. Snippet rows include title, short description, language badge, tags, private/public indicator, favorite icon, and updated time.

Mobile: replace sidebar with a drawer, keep search easy to reach, stack cards, use 44px minimum touch targets, and ensure no horizontal page overflow. Preserve code-tool density without becoming cramped.

Meet WCAG AA contrast, use visible keyboard focus rings, and create consistent reusable components and spacing tokens.
```

## Stitch prompt 2 — Snippet collection page

```text
Design a responsive “All Snippets” page for Snippet Vault using the established indigo/cyan developer-tool design system.

Desktop layout: app sidebar and top navigation, page title and result count, primary “New snippet” action, wide search field, language filter, tag filter, visibility filter, favorites filter, sort menu, and a clean snippet list. Each snippet item must show title, two-line description, language badge, up to three tags, favorite state, private/public state, and last updated date. Add tasteful hover and selected states.

Include loading skeletons, a no-results state with a clear reset-filters action, a first-use empty state with a create-snippet CTA, and pagination.

Mobile layout: filters open in a bottom sheet or drawer, list rows become cards, actions remain thumb-friendly, and text truncation is graceful. Do not hide essential information solely on mobile.

Use light and dark modes. Keep borders crisp, corners moderately rounded, and shadows subtle. Avoid decorative charts and unnecessary gradients.
```

## Stitch prompt 3 — Create/edit snippet screen

```text
Design a professional responsive create/edit screen for Snippet Vault.

The form includes: title, optional description, programming language selector, large monospace code textarea/editor, tag entry with removable chips, private/public visibility control, save button, cancel action, and validation states. Add a compact optional syntax preview panel on wide desktop screens.

Desktop: use a spacious two-column composition with the editor as the dominant region and metadata/settings in a narrower right column. Keep the save action visible without distracting from writing.

Mobile: use one column, horizontally scrollable code content only inside the editor, a sticky bottom action area that respects safe-area insets, large touch targets, and no viewport overflow. The software keyboard should not make controls unusable.

Show error, disabled, saving, and saved states. Maintain the Snippet Vault palette: indigo #6366F1, cyan #06B6D4 used sparingly, slate light surfaces, and deep navy dark surfaces. Use Geist-like sans and mono fonts. Meet WCAG AA and provide strong focus styles.
```

## Stitch prompt 4 — Snippet detail and public share view

```text
Design two related responsive screens for Snippet Vault:
1. An authenticated snippet detail page.
2. A minimal public read-only share page.

Authenticated detail page: breadcrumb, title, favorite, visibility badge, edit, duplicate, delete, and copy actions; a large syntax-highlighted code panel with line numbers; description; language; tags; timestamps; and a compact share settings card. On desktop use a main code area plus metadata sidebar. On mobile stack sections and use a compact sticky action bar that does not cover content.

Public share page: simplified branded header, snippet title, description, language and tags, syntax-highlighted code, copy button, updated date, and a subtle CTA to create a personal Snippet Vault. Do not expose owner email, internal UUID, private metadata, or edit controls.

Use the same restrained indigo/cyan design system, both light and dark modes, excellent code readability, horizontal scrolling within the code panel, accessible copy feedback, and strong keyboard focus states.
```

## Stitch prompt 5 — Authentication and landing page

```text
Design a responsive marketing landing page and matching authentication screens for “Snippet Vault”, a secure code snippet organizer.

Landing page: concise hero with headline “Your reusable code, organized and ready”, supporting copy, primary “Create your vault” CTA, secondary “View demo” CTA, polished dashboard product mockup, feature grid for search/tags/syntax highlighting/private sharing, a three-step workflow, a security section mentioning private-by-default storage and account-level access controls, and a simple footer.

Authentication pages: sign in, sign up, forgot password, and reset password. Use a centered card on mobile and a tasteful split layout on desktop with a product preview panel. Include clear labels, password visibility control, loading states, validation messages, and links between auth flows.

Palette: primary indigo #6366F1, accent cyan #06B6D4 sparingly, light background #F8FAFC, dark background #090D18. Modern Geist-like typography, restrained rounded corners, subtle shadows, no excessive gradients or glass effects. Meet WCAG AA and show visible focus styles.
```

---

# 15. SEO and Metadata

SEO applies primarily to public marketing/legal pages and public snippet shares.

## Requirements

- Define metadata base from validated `NEXT_PUBLIC_APP_URL`.
- Unique title and description for landing/auth/legal pages.
- Canonical URL for indexable public pages.
- Open Graph and Twitter card metadata for landing page.
- Create a branded static or generated OG image.
- `robots.ts` must disallow authenticated application paths:
  - `/dashboard`
  - `/snippets`
  - `/favorites`
  - `/tags`
  - `/settings`
- Do not include private application routes in `sitemap.ts`.
- Public snippet pages may be `noindex` by default for privacy. Add an explicit product decision before making them indexable.
- Never include raw snippet code in metadata descriptions.
- Avoid leaking private titles through metadata for inaccessible routes.

---

# 16. Performance

- Server Components by default.
- Keep syntax highlighting on the server.
- Lazy-load nonessential client components.
- Do not ship all supported language grammars to the browser.
- Avoid global client providers unless necessary.
- Use `next/font`.
- Optimize landing-page images with `next/image`.
- Avoid large animation libraries for simple transitions.
- Paginate database results.
- Add database indexes based on actual query patterns.
- Use `loading` skeletons without layout shift.
- Target strong Lighthouse scores, but do not game metrics at the expense of functionality.

Suggested targets on production build:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO on public pages: 95+

---

# 17. Docker

Configure Next.js standalone output:

```ts
// next.config.ts
const nextConfig = {
  output: "standalone",
};

export default nextConfig;
```

Merge this with security headers and other configuration rather than creating multiple configs.

## Production `Dockerfile`

Create a multi-stage Dockerfile using a current supported Node.js LTS Alpine image unless a dependency requires Debian slim.

Required stages:

1. `base`
2. `deps`
3. `builder`
4. `runner`

Baseline implementation:

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
```

Codex must verify the current Node LTS and framework compatibility when implementing; update the base image if official requirements differ.

## `.dockerignore`

```text
.git
.github
.next
node_modules
coverage
playwright-report
test-results
.env
.env.*
!.env.example
!.env.local.example
README.md
npm-debug.log*
pnpm-debug.log*
```

## `compose.yaml`

Provide a simple production-like local service:

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
```

The hosted Supabase project remains external. Optionally document Supabase CLI local development separately; do not bundle an unofficial database container setup.

## Docker acceptance checks

```bash
docker build -t snippet-vault .
docker run --rm --env-file .env.local -p 3000:3000 snippet-vault
curl --fail http://localhost:3000/api/health
```

---

# 18. Health Endpoint

`GET /api/health` returns minimal JSON:

```json
{
  "status": "ok"
}
```

Requirements:

- HTTP 200 when the Next.js process is healthy.
- No environment variables, versions, database credentials, stack traces, or internal hostnames.
- A database readiness check is optional; if added, use a safe lightweight query and return only generic status.

---

# 19. Testing Strategy

## Unit tests

Test:

- Zod schemas
- Tag normalization
- Search-parameter parsing
- Sort allowlist mapping
- Safe redirect helper
- Error mapping/redaction
- Language mapping

## Component tests

Test:

- Snippet card rendering
- Empty and no-results states
- Form validation messages
- Delete dialog keyboard behavior
- Copy button success/failure feedback
- Mobile navigation interactions

## Integration tests

Against a dedicated local/test Supabase project:

- Authentication helpers
- Repository queries
- RLS isolation tests listed earlier
- Create/update/delete transaction behavior
- Tag upsert and duplicate normalization

Never run destructive tests against production.

## Playwright E2E

Critical paths:

1. Sign up/sign in.
2. Create private snippet.
3. Search and filter it.
4. Edit and favorite it.
5. Copy code.
6. Make it public and open share URL in an anonymous context.
7. Make it private and verify anonymous access fails.
8. Delete it.
9. Verify mobile navigation at a narrow viewport.
10. Verify XSS payloads remain inert.

Use seeded test users and isolated test data.

---

# 20. Error Handling and Observability

- Use typed expected errors for validation/auth/conflict/not-found cases.
- Convert unexpected Supabase errors into safe user messages.
- Log server errors with a request correlation ID where practical.
- Never log passwords, auth tokens, cookies, full code snippets, or environment secrets.
- Display friendly recovery actions.
- Add a root `global-error.tsx` without exposing stack traces.
- Add `not-found.tsx` for inaccessible/missing snippets.
- Consider Sentry only as optional future work; do not require a paid service for the portfolio MVP.

---

# 21. Package Scripts

Create at least:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}
```

Adapt only where current framework tooling requires it.

---

# 22. README Requirements

The README must include:

- Product screenshot
- Live demo URL placeholder
- Feature list
- Stack
- Architecture overview
- Local prerequisites
- Supabase project setup
- Environment setup
- Migration commands
- Development commands
- Test commands
- Docker commands
- Deployment notes
- Security overview
- Trade-offs and future improvements

Do not include real keys or production identifiers.

## SECURITY.md

Include:

- Supported version statement
- How to privately report a vulnerability
- Explicit instruction not to open public issues for secrets or exploitable vulnerabilities
- High-level controls: RLS, server validation, secret management, XSS prevention

---

# 23. Implementation Milestones

## Milestone 1 — Foundation

- Scaffold Next.js App Router project
- Configure TypeScript strict mode, Tailwind, fonts, linting, formatting
- Create folders and base layouts
- Add theme support
- Add environment validation
- Add health endpoint
- Add Docker files
- Add basic tests

**Done when:** lint, typecheck, unit tests, build, and Docker startup pass.

## Milestone 2 — Supabase and authentication

- Add Supabase clients for browser/server/middleware
- Add migrations
- Add RLS policies
- Add signup/login/logout/reset flows
- Add protected app layout
- Add auth integration and RLS tests

**Done when:** two test users are isolated and all auth flows work.

## Milestone 3 — Snippet CRUD

- Add schemas, repository, actions, and pages
- Add create/detail/edit/delete/duplicate
- Add syntax highlighting
- Add copy behavior
- Add responsive states

**Done when:** CRUD works securely and XSS payloads are inert.

## Milestone 4 — Organization

- Add tags
- Add favorites
- Add search/filter/sort/pagination via URL
- Add dashboard summaries

**Done when:** list state is shareable through the URL and database queries are paginated/indexed.

## Milestone 5 — Public sharing and polish

- Add public/private visibility
- Add `/s/[publicId]`
- Add metadata/robots/sitemap
- Add landing page
- Complete accessibility and responsive review
- Complete Playwright suite
- Update README screenshots

**Done when:** public sharing can be revoked immediately and production checks pass.

---

# 24. Definition of Done

The project is complete only when:

- `pnpm check` passes.
- Playwright critical-path tests pass.
- Docker image builds and runs as non-root.
- No secret appears in git history or client bundle.
- RLS isolation tests pass.
- User-controlled code/metadata cannot execute as HTML or JavaScript.
- Private snippets cannot be accessed through guessed IDs or public routes.
- All forms validate on the server.
- The application works at 320 px width without page-level horizontal scrolling.
- Keyboard navigation works for major flows.
- Public pages have correct metadata.
- Private routes are excluded from indexing.
- Empty/loading/error/not-found states are implemented.
- README and `.env.example` allow another developer to run the project.

---

# 25. Final Codex Execution Prompt

Use the following after placing this file at the repository root:

```text
Read SNIPPET_VAULT_CODEX_SPEC.md completely before changing files.

Implement Milestone 1 only. Follow every non-negotiable rule, architecture boundary, security requirement, and responsive-design requirement in the specification. Check the latest official Next.js, Supabase, and Docker documentation for APIs that may have changed. Use pnpm and the Next.js App Router.

At the end:
1. Run lint, typecheck, unit tests, and the production build.
2. Build the Docker image.
3. Fix all errors you introduced.
4. Summarize created files, architectural choices, security controls, commands run, and any remaining limitation.
5. Do not begin Milestone 2 until explicitly requested.
```

Then proceed milestone by milestone. This reduces agent drift and makes review much easier than requesting the entire product in one enormous generation.
