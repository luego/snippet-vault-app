export const SUPPORTED_LANGUAGES = {
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

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export function toSupportedLanguage(value: string): SupportedLanguage {
  return value in SUPPORTED_LANGUAGES
    ? (value as SupportedLanguage)
    : "plaintext";
}
