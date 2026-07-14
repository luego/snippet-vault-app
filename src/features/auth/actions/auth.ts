"use server";

import { redirect } from "next/navigation";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/features/auth/schemas/auth";
import { signUpErrorMessage } from "@/features/auth/errors";
import type { AuthActionState } from "@/features/auth/types";
import { publicEnv } from "@/lib/env/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { safeInternalRedirect } from "@/lib/utils";

const configurationError: AuthActionState = {
  status: "error",
  message:
    "Authentication is not configured yet. Add the Supabase environment variables and try again.",
};

function validationError(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}): AuthActionState {
  return {
    status: "error",
    message: "Check the highlighted fields and try again.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: textValue(formData, "email"),
    password: textValue(formData, "password"),
    next: textValue(formData, "next"),
  });
  if (!parsed.success) return validationError(parsed.error);
  if (!isSupabaseConfigured()) return configurationError;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return { status: "error", message: "The email or password is incorrect." };
  }

  redirect(safeInternalRedirect(parsed.data.next));
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = signUpSchema.safeParse({
    displayName: textValue(formData, "displayName"),
    email: textValue(formData, "email"),
    password: textValue(formData, "password"),
    confirmPassword: textValue(formData, "confirmPassword"),
  });
  if (!parsed.success) return validationError(parsed.error);
  if (!isSupabaseConfigured()) return configurationError;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName || null },
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    console.error("Supabase sign-up failed", {
      code: error.code,
      name: error.name,
      status: error.status,
    });
    return {
      status: "error",
      message: signUpErrorMessage(error),
    };
  }
  if (data.session) redirect("/dashboard");

  return {
    status: "success",
    message: "Check your email to confirm your account, then sign in.",
  };
}

export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: textValue(formData, "email"),
  });
  if (!parsed.success) return validationError(parsed.error);
  if (!isSupabaseConfigured()) return configurationError;

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  return {
    status: "success",
    message: "If an account exists for that email, a reset link is on its way.",
  };
}

export async function resetPassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: textValue(formData, "password"),
    confirmPassword: textValue(formData, "confirmPassword"),
  });
  if (!parsed.success) return validationError(parsed.error);
  if (!isSupabaseConfigured()) return configurationError;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return {
      status: "error",
      message: "This reset session is invalid or expired. Request a new link.",
    };
  }

  await supabase.auth.signOut();
  redirect("/sign-in?reset=success");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/sign-in");
}
