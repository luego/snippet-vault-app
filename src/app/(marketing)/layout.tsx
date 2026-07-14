import Link from "next/link";
import type { ReactNode } from "react";

import { BrandMark } from "@/components/shared/brand-mark";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="marketing-header">
        <nav
          className="marketing-nav container-shell"
          aria-label="Main navigation"
        >
          <BrandMark />
          <div className="marketing-links">
            <Link href="/#features">Features</Link>
            <Link href="/#workflow">How it works</Link>
            <Link href="/#security">Security</Link>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <Link href="/sign-in" className="button button-secondary">
              Sign in
            </Link>
            <Link href="/sign-up" className="button button-primary">
              Get started
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-inner container-shell">
          <span>
            © {new Date().getFullYear()} Snippet Vault. Built for developers.
          </span>
          <div className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
