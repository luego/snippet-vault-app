import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

export default function ApplicationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-main">
        <AppTopbar />
        {children}
      </div>
    </div>
  );
}
