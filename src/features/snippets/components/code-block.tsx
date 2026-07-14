import "server-only";

import type { CSSProperties } from "react";
import { codeToTokens } from "shiki";

import { toSupportedLanguage } from "@/lib/constants/languages";

export async function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const highlighted = await codeToTokens(code, {
    lang: toSupportedLanguage(language),
    theme: "github-dark",
  });

  return (
    <pre
      className="code-block"
      style={
        {
          "--code-background": highlighted.bg,
          "--code-foreground": highlighted.fg,
        } as CSSProperties
      }
      tabIndex={0}
      aria-label={`${language} code`}
    >
      <code>
        {highlighted.tokens.map((line, lineIndex) => (
          <span className="code-line" key={lineIndex}>
            <span className="code-line-number" aria-hidden="true">
              {lineIndex + 1}
            </span>
            <span className="code-line-content">
              {line.length ? (
                line.map((token, tokenIndex) => (
                  <span key={tokenIndex} style={{ color: token.color }}>
                    {token.content}
                  </span>
                ))
              ) : (
                <>{"\n"}</>
              )}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}
