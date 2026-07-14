import { describe, expect, it } from "vitest";

import {
  snippetIdSchema,
  snippetInputSchema,
} from "../../src/features/snippets/schemas/snippet";

describe("snippet validation", () => {
  it("normalizes unique tags while preserving code exactly", () => {
    const payload = '<script>alert("xss")</script>\n  const value = 1;';
    const result = snippetInputSchema.parse({
      title: "  Safe rendering  ",
      description: "  Demonstrates escaping  ",
      code: payload,
      language: "typescript",
      visibility: "private",
      tags: " TypeScript,  security, typescript ",
    });

    expect(result.title).toBe("Safe rendering");
    expect(result.code).toBe(payload);
    expect(result.tags).toEqual(["typescript", "security"]);
  });

  it("rejects arbitrary languages and oversized fields", () => {
    expect(
      snippetInputSchema.safeParse({
        title: "x".repeat(121),
        description: "",
        code: "code",
        language: "custom-grammar",
        visibility: "private",
        tags: "",
      }).success,
    ).toBe(false);
  });

  it("validates route identifiers as UUIDs", () => {
    expect(snippetIdSchema.safeParse("../../another-user").success).toBe(false);
    expect(
      snippetIdSchema.safeParse("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa").success,
    ).toBe(true);
  });
});
