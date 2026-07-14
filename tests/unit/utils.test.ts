import { describe, expect, it } from "vitest";

import { snippetSearchParamsSchema } from "../../src/features/snippets/schemas/search-params";
import {
  normalizeTag,
  normalizeTags,
} from "../../src/features/tags/utils/normalize-tag";
import { toSupportedLanguage } from "../../src/lib/constants/languages";
import { safeInternalRedirect } from "../../src/lib/utils";

describe("safeInternalRedirect", () => {
  it("allows local paths with search and hash values", () => {
    expect(safeInternalRedirect("/snippets?q=sql#results")).toBe(
      "/snippets?q=sql#results",
    );
  });

  it.each(["//evil.example", "https://evil.example", "javascript:alert(1)"])(
    "rejects unsafe destination %s",
    (value) => expect(safeInternalRedirect(value)).toBe("/dashboard"),
  );
});

describe("tag normalization", () => {
  it("normalizes unicode, whitespace, casing, and duplicates", () => {
    expect(normalizeTag("  TypeScript   Tips  ")).toBe("typescript tips");
    expect(normalizeTags([" API ", "api", "Postgres"])).toEqual([
      "api",
      "postgres",
    ]);
  });
});

describe("search parameter validation", () => {
  it("falls back to safe pagination and sort defaults", () => {
    const result = snippetSearchParamsSchema.parse({
      page: "-2",
      pageSize: "500",
      sort: "drop-table",
    });
    expect(result).toMatchObject({
      page: 1,
      pageSize: 20,
      sort: "updated-desc",
    });
  });
});

describe("language mapping", () => {
  it("falls unknown grammars back to plaintext", () => {
    expect(toSupportedLanguage("typescript")).toBe("typescript");
    expect(toSupportedLanguage("made-up-language")).toBe("plaintext");
  });
});
