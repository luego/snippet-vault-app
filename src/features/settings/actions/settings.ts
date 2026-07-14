"use server";

import { revalidatePath } from "next/cache";

import { requireVerifiedClaims } from "@/features/auth/server/session";
import {
  preferenceSettingsSchema,
  profileSettingsSchema,
} from "@/features/settings/schemas/settings";
import type { SettingsActionState } from "@/features/settings/types";
import { createClient } from "@/lib/supabase/server";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function validationError(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}): SettingsActionState {
  return {
    status: "error",
    message: "Check the highlighted fields and try again.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

export async function updateProfile(
  _previous: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = profileSettingsSchema.safeParse({
    displayName: textValue(formData, "displayName"),
    avatarUrl: textValue(formData, "avatarUrl"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { error } = await client
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      avatar_url: parsed.data.avatarUrl,
    })
    .eq("id", claims.sub);
  if (error) {
    console.error("Profile update failed", { code: error.code });
    return {
      status: "error",
      message: "We could not update your profile. Try again in a moment.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings/profile");
  revalidatePath("/", "layout");
  return { status: "success", message: "Profile saved." };
}

export async function updatePreferences(
  _previous: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = preferenceSettingsSchema.safeParse({
    theme: textValue(formData, "theme"),
  });
  if (!parsed.success) return validationError(parsed.error);

  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { error } = await client
    .from("profiles")
    .update({ preferred_theme: parsed.data.theme })
    .eq("id", claims.sub);
  if (error) {
    console.error("Preference update failed", { code: error.code });
    return {
      status: "error",
      message: "We could not save your preferences. Try again in a moment.",
    };
  }

  revalidatePath("/settings/preferences");
  return { status: "success", message: "Preferences saved." };
}
