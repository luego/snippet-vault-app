import { Menu, Search } from "lucide-react";

import { AppNavigationLinks } from "@/components/layout/app-navigation-links";
import { signOut } from "@/features/auth/actions/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";

function initials(value: string) {
  const parts = value.trim().split(/\s+/u).filter(Boolean);
  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SV"
  );
}

export function AppTopbar({ displayName }: { displayName: string }) {
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
          <AppNavigationLinks />
        </nav>
      </details>
      <form className="global-search" action="/snippets" method="get">
        <button
          className="global-search-submit"
          type="submit"
          aria-label="Submit snippet search"
        >
          <Search aria-hidden="true" className="size-4" />
        </button>
        <label className="sr-only" htmlFor="global-snippet-search">
          Search snippets
        </label>
        <input
          id="global-snippet-search"
          name="q"
          type="search"
          maxLength={100}
          placeholder="Search your snippets…"
        />
      </form>
      <div className="topbar-actions">
        <ThemeToggle />
        <span className="avatar" aria-label={`Signed in as ${displayName}`}>
          {initials(displayName)}
        </span>
        <form action={signOut}>
          <button className="topbar-signout" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
