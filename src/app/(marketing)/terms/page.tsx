import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Snippet Vault terms of use.",
};

export default function TermsPage() {
  return (
    <article className="legal-page container-shell">
      <span className="eyebrow">Legal</span>
      <h1>Terms of use</h1>
      <p>Last updated July 14, 2026</p>
      <h2>Using Snippet Vault</h2>
      <p>
        You are responsible for the content you save and share. Do not store
        secrets, credentials, or material you do not have permission to use.
      </p>
      <h2>Availability</h2>
      <p>
        This is a portfolio project and is provided without a service-level
        guarantee. These placeholder terms must be reviewed before a production
        launch.
      </p>
    </article>
  );
}
