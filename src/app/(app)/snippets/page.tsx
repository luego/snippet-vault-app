import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { requireVerifiedClaims } from "@/features/auth/server/session";
import { SnippetCard } from "@/features/snippets/components/snippet-card";
import { listSnippets } from "@/features/snippets/server/repository";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "All snippets",
  robots: { index: false },
};

export default async function SnippetsPage() {
  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { data, count, error } = await listSnippets(client, claims.sub);

  if (error) throw new Error("Unable to load snippets");

  return (
    <main className="app-content route-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Your library</span>
          <h1>All snippets</h1>
          <p>
            {count === 1 ? "1 saved snippet" : `${count ?? 0} saved snippets`}
          </p>
        </div>
        <Link href="/snippets/new" className="button button-primary">
          <Plus className="size-4" /> New snippet
        </Link>
      </div>

      {data?.length ? (
        <section className="snippet-list" aria-label="Saved snippets">
          {data.map((snippet) => (
            <SnippetCard snippet={snippet} key={snippet.id} />
          ))}
        </section>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
