export const siteConfig = {
  name: "Snippet Vault",
  description:
    "A secure personal workspace for saving, organizing, and sharing reusable code snippets.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;
