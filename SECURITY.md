# Security policy

## Supported version

Only the latest version on the default branch receives security updates while Snippet Vault is under active development.

## Reporting a vulnerability

Please report a suspected vulnerability privately to the repository owner. Do not open a public issue for exploitable behavior, credentials, tokens, private user data, or other secrets. Include concise reproduction steps without attaching real credentials or private snippet content.

## Security model

Snippet Vault separates browser-safe configuration from server-only secrets, validates untrusted input with Zod, renders user content as text, and never requires a privileged database key in the browser. The completed backend will use Supabase PostgreSQL Row Level Security as the final authorization boundary, with independently authenticated and validated server mutations.
