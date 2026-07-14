import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { publicEnv } from "@/lib/env/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { safeInternalRedirect } from "@/lib/utils";

const emailOtpTypes = new Set<EmailOtpType>([
  "email",
  "email_change",
  "invite",
  "magiclink",
  "recovery",
  "signup",
]);

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return Boolean(value && emailOtpTypes.has(value as EmailOtpType));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = safeInternalRedirect(requestUrl.searchParams.get("next"));

  if (tokenHash && isEmailOtpType(type) && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(
        new URL(next, publicEnv.NEXT_PUBLIC_APP_URL),
      );
    }
  }

  return NextResponse.redirect(
    new URL("/sign-in?error=callback", publicEnv.NEXT_PUBLIC_APP_URL),
  );
}
