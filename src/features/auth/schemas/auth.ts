import { z } from "zod";

const email = z
  .string()
  .trim()
  .max(254)
  .pipe(z.email("Enter a valid email address"));
const password = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Use no more than 72 characters");

export const signInSchema = z.object({
  email,
  password,
  next: z.string().optional(),
});

export const signUpSchema = z
  .object({
    displayName: z.string().trim().max(80).optional(),
    email,
    password,
    confirmPassword: password,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password, confirmPassword: password })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
