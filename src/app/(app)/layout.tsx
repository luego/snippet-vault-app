import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { requireVerifiedClaims } from "@/features/auth/server/session";
import { createClient } from "@/lib/supabase/server";

export default async function ApplicationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { data: profile } = await client
    .from("profiles")
    .select("display_name")
    .eq("id", claims.sub)
    .maybeSingle();
  const metadata =
    claims.user_metadata && typeof claims.user_metadata === "object"
      ? claims.user_metadata
      : {};
  const displayName =
    profile?.display_name ||
    (typeof metadata.display_name === "string"
      ? metadata.display_name
      : typeof claims.email === "string"
        ? claims.email
        : "Developer");

  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-main">
        <AppTopbar displayName={displayName} />
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
      </div>
    </div>
  );
}
