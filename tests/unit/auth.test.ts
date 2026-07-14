import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../../src/features/auth/schemas/auth";
import { signUpErrorMessage } from "../../src/features/auth/errors";

describe("authentication schemas", () => {
  it("normalizes valid sign-in input", () => {
    const result = signInSchema.parse({
      email: "  developer@example.com ",
      password: "correct-horse",
      next: "/snippets",
    });
    expect(result.email).toBe("developer@example.com");
  });

  it("rejects invalid credentials before a server request", () => {
    expect(
      signInSchema.safeParse({ email: "not-an-email", password: "short" })
        .success,
    ).toBe(false);
  });

  it("requires matching passwords for signup and reset", () => {
    expect(
      signUpSchema.safeParse({
        displayName: "Developer",
        email: "developer@example.com",
        password: "correct-horse",
        confirmPassword: "different-horse",
      }).success,
    ).toBe(false);
    expect(
      resetPasswordSchema.safeParse({
        password: "correct-horse",
        confirmPassword: "different-horse",
      }).success,
    ).toBe(false);
  });

  it("accepts a valid password-reset email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "developer@example.com" })
        .success,
    ).toBe(true);
  });
});

describe("authentication errors", () => {
  it("explains hosted email rate limits", () => {
    expect(
      signUpErrorMessage({ code: "over_email_send_rate_limit", status: 429 }),
    ).toContain("Too many confirmation emails");
  });

  it("keeps unknown failures generic", () => {
    expect(
      signUpErrorMessage({ code: "unexpected_failure", status: 500 }),
    ).toBe("We could not create the account. Try again in a moment.");
  });
});
