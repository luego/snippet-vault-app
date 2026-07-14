# Security policy

## Supported version

Only the latest version on the default branch receives security updates while Snippet Vault is under active development.

## Reporting a vulnerability

Please report a suspected vulnerability privately to the repository owner. Do not open a public issue for exploitable behavior, credentials, tokens, private user data, or other secrets. Include concise reproduction steps without attaching real credentials or private snippet content.

## Security model

Snippet Vault separates browser-safe configuration from server-only secrets, validates untrusted auth, snippet, settings, and URL-search input with Zod, and never requires a privileged database key in the browser. New and reset passwords require 12–72 characters with lowercase, uppercase, number, and symbol criteria; the live meter and server validation share the same rules. Supabase PostgreSQL Row Level Security is the final authorization boundary: authenticated users can mutate and search only rows they own, anonymous users can read only explicitly public snippets and their attached tags, ownership cannot be reassigned, and grants are limited by role. Returning a snippet to private immediately removes anonymous access to the snippet, tag links, and tags. Cookie-based SSR sessions are refreshed at the request boundary and every protected mutation verifies signed claims. Public responses omit owner email, owner ID, internal snippet ID, and edit controls; public metadata never includes code and defaults to `noindex`. Search executes through an allowlisted, paginated database function that escapes `%`, `_`, and backslash wildcard characters and maps sort values to fixed query branches. Snippet code is tokenized by pinned Shiki server-side and rendered through React text nodes without user-controlled HTML. Database isolation, search behavior, atomic CRUD behavior, anonymous sharing, and revocation are exercised with pgTAP tests, including inert XSS payloads.
