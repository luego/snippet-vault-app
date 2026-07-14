import { describe, expect, it } from "vitest";

import {
  preferenceSettingsSchema,
  profileSettingsSchema,
} from "../../src/features/settings/schemas/settings";

describe("settings validation", () => {
  it("normalizes optional profile fields", () => {
    expect(
      profileSettingsSchema.parse({ displayName: "  Ada  ", avatarUrl: "" }),
    ).toEqual({ displayName: "Ada", avatarUrl: null });
  });

  it("only permits secure avatar URLs", () => {
    expect(
      profileSettingsSchema.safeParse({
        displayName: "Ada",
        avatarUrl: "http://example.com/avatar.png",
      }).success,
    ).toBe(false);
  });

  it("only permits supported themes", () => {
    expect(
      preferenceSettingsSchema.safeParse({ theme: "system" }).success,
    ).toBe(true);
    expect(preferenceSettingsSchema.safeParse({ theme: "neon" }).success).toBe(
      false,
    );
  });
});
