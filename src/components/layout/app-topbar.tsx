import { Menu, Search } from "lucide-react";
import Link from "next/link";

import { appNavigation } from "@/config/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function AppTopbar() {
  return (
    <header className="app-topbar">
      <details className="mobile-menu">
        <summary className="icon-button" aria-label="Open navigation">
          <Menu className="size-5" />
        </summary>
        <nav
          className="mobile-menu-panel"
          aria-label="Mobile application navigation"
        >
          {appNavigation.map(({ href, label, icon: Icon }) => (
            <Link className="app-nav-link" href={href} key={href}>
              <Icon className="size-[18px]" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </details>
      <label className="global-search">
        <Search aria-hidden="true" className="size-4" />
        <span className="sr-only">Search snippets</span>
        <input type="search" placeholder="Search your snippets…" />
      </label>
      <div className="topbar-actions">
        <ThemeToggle />
        <span className="avatar" aria-label="Demo profile">
          AM
        </span>
      </div>
    </header>
  );
}
