import { z } from "zod";

export const profileSettingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(80, "Use no more than 80 characters")
    .transform((value) => value || null),
  avatarUrl: z
    .string()
    .trim()
    .max(500, "Avatar URL is too long")
    .refine((value) => !value || value.startsWith("https://"), {
      message: "Use a secure HTTPS URL",
    })
    .transform((value) => value || null),
});

export const preferenceSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});
