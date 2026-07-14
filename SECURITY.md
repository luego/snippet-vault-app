# Security policy

## Supported version

Only the latest version on the default branch receives security updates while Snippet Vault is under active development.

## Reporting a vulnerability

Please report a suspected vulnerability privately to the repository owner. Do not open a public issue for exploitable behavior, credentials, tokens, private user data, or other secrets. Include concise reproduction steps without attaching real credentials or private snippet content.

## Security model

Snippet Vault separates browser-safe configuration from server-only secrets, validates untrusted auth and snippet input with Zod, and never requires a privileged database key in the browser. Supabase PostgreSQL Row Level Security is the final authorization boundary: authenticated users can mutate only rows they own, anonymous users can read only explicitly public snippets, ownership cannot be reassigned, and grants are limited by role. Cookie-based SSR sessions are refreshed at the request boundary and every protected mutation verifies signed claims. Snippet code is tokenized by pinned Shiki server-side and rendered through React text nodes without user-controlled HTML. Database isolation and atomic CRUD behavior are exercised with two-user pgTAP tests, including inert XSS payloads.
