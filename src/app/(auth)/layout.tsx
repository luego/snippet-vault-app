import type { ReactNode } from "react";

import { BrandMark } from "@/components/shared/brand-mark";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-shell">
      <section className="auth-showcase" aria-label="About Snippet Vault">
        <BrandMark />
        <div>
          <h1>Keep your best code within reach.</h1>
          <p>
            A private, searchable workspace for the commands, patterns, and
            fragments you trust.
          </p>
        </div>
        <p>Private by default · Built for focused work</p>
      </section>
      <section className="auth-panel">
        <div>{children}</div>
      </section>
    </main>
  );
}
