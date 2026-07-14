import { z } from "zod";

import { PASSWORD_REQUIREMENTS } from "@/features/auth/password-strength";

const email = z
  .string()
  .trim()
  .max(254)
  .pipe(z.email("Enter a valid email address"));
const signInPassword = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Use no more than 72 characters");

export const strongPasswordSchema = z
  .string()
  .max(72, "Use no more than 72 characters")
  .superRefine((value, context) => {
    PASSWORD_REQUIREMENTS.forEach((requirement) => {
      if (!requirement.test(value)) {
        context.addIssue({
          code: "custom",
          message: requirement.message,
        });
      }
    });
  });

export const signInSchema = z.object({
  email,
  password: signInPassword,
  next: z.string().optional(),
});

export const signUpSchema = z
  .object({
    displayName: z.string().trim().max(80).optional(),
    email,
    password: strongPasswordSchema,
    confirmPassword: strongPasswordSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: strongPasswordSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
