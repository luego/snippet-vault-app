import { appNavigation } from "@/config/navigation";
import { BrandMark } from "@/components/shared/brand-mark";
import Link from "next/link";

export function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <BrandMark />
      <nav className="app-sidebar-nav" aria-label="Application navigation">
        {appNavigation.map(({ href, label, icon: Icon }) => (
          <Link className="app-nav-link" href={href} key={href}>
            <Icon aria-hidden="true" className="size-[18px]" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
