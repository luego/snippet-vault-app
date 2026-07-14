import { BrandMark } from "@/components/shared/brand-mark";
import { AppNavigationLinks } from "@/components/layout/app-navigation-links";

export function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <BrandMark />
      <nav className="app-sidebar-nav" aria-label="Application navigation">
        <AppNavigationLinks />
      </nav>
    </aside>
  );
}
