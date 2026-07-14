import type { Metadata } from "next";
import Link from "next/link";

import { requireVerifiedClaims } from "@/features/auth/server/session";
import { SnippetForm } from "@/features/snippets/components/snippet-form";

export const metadata: Metadata = {
  title: "New snippet",
  robots: { index: false },
};

export default async function NewSnippetPage() {
  await requireVerifiedClaims();

  return (
    <main className="app-content route-page editor-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/snippets">Snippets</Link>
        <span aria-hidden="true">/</span>
        <span>New</span>
      </nav>
      <div className="page-heading">
        <div>
          <h1>Create a snippet</h1>
          <p>Capture reusable code with the context you will need later.</p>
        </div>
      </div>
      <SnippetForm />
    </main>
  );
}
