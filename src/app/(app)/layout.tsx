import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { requireVerifiedClaims } from "@/features/auth/server/session";

export default async function ApplicationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const claims = await requireVerifiedClaims();
  const metadata =
    claims.user_metadata && typeof claims.user_metadata === "object"
      ? claims.user_metadata
      : {};
  const displayName =
    typeof metadata.display_name === "string"
      ? metadata.display_name
      : typeof claims.email === "string"
        ? claims.email
        : "Developer";

  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-main">
        <AppTopbar displayName={displayName} />
        {children}
      </div>
    </div>
  );
}
