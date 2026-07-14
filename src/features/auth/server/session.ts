import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getVerifiedClaims() {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims.sub) return null;
    return data.claims;
  } catch {
    return null;
  }
}

export async function requireVerifiedClaims() {
  const claims = await getVerifiedClaims();
  if (!claims) redirect("/sign-in");
  return claims;
}

export async function redirectIfAuthenticated() {
  if (await getVerifiedClaims()) redirect("/dashboard");
}
