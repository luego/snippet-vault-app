import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../../src/features/auth/schemas/auth";
import { signUpErrorMessage } from "../../src/features/auth/errors";
import { evaluatePasswordStrength } from "../../src/features/auth/password-strength";
import { isAppNavigationActive } from "../../src/config/navigation";

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

  it("requires strong passwords for signup and reset", () => {
    const weakSignup = signUpSchema.safeParse({
      displayName: "Developer",
      email: "developer@example.com",
      password: "correct-horse",
      confirmPassword: "correct-horse",
    });
    const strongReset = resetPasswordSchema.safeParse({
      password: "CorrectHorse123!",
      confirmPassword: "CorrectHorse123!",
    });

    expect(weakSignup.success).toBe(false);
    expect(strongReset.success).toBe(true);
  });

  it("scores the same requirements shown by the password meter", () => {
    expect(evaluatePasswordStrength("password")).toMatchObject({
      score: 1,
      label: "Weak",
    });
    expect(evaluatePasswordStrength("CorrectHorse123!")).toMatchObject({
      score: 5,
      label: "Strong",
    });
  });
});

describe("application navigation", () => {
  it("activates the current section instead of always selecting dashboard", () => {
    expect(
      isAppNavigationActive("/settings/profile", "/settings/profile"),
    ).toBe(true);
    expect(isAppNavigationActive("/settings/profile", "/dashboard")).toBe(
      false,
    );
    expect(
      isAppNavigationActive(
        "/snippets/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/edit",
        "/snippets",
      ),
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
