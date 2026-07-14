import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Snippet Vault privacy information.",
};

export default function PrivacyPage() {
  return (
    <article className="legal-page container-shell">
      <span className="eyebrow">Legal</span>
      <h1>Privacy</h1>
      <p>Last updated July 14, 2026</p>
      <h2>Your data</h2>
      <p>
        Snippet Vault is designed to store only the account and snippet
        information needed to provide the service. Private snippets are not
        published or made available to other users.
      </p>
      <h2>Security</h2>
      <p>
        Access controls are enforced at the database layer. Credentials and
        privileged keys are never shipped to the browser. This portfolio
        placeholder will be replaced with a complete policy before a production
        launch.
      </p>
    </article>
  );
}
