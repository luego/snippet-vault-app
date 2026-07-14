import { NextResponse } from "next/server";

import { publicEnv } from "@/lib/env/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { safeInternalRedirect } from "@/lib/utils";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeInternalRedirect(requestUrl.searchParams.get("next"));

  if (code && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
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
