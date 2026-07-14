import { Hash, Tags } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { requireVerifiedClaims } from "@/features/auth/server/session";
import { listTagSummaries } from "@/features/snippets/server/repository";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Tags", robots: { index: false } };

export default async function TagsPage() {
  await requireVerifiedClaims();
  const client = await createClient();
  const { data, error } = await listTagSummaries(client, 200);
  if (error) throw new Error("Unable to load tags");

  return (
    <main className="app-content route-page tags-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Organization</span>
          <h1>Tags</h1>
          <p>
            {data.length === 1
              ? "1 active tag in your vault."
              : `${data.length} active tags in your vault.`}
          </p>
        </div>
      </div>

      {data.length ? (
        <section className="tag-summary-grid" aria-label="Tags in your vault">
          {data.map((tag) => (
            <Link
              className="tag-summary-card"
              href={`/snippets?tag=${encodeURIComponent(tag.normalized_name)}`}
              key={tag.id}
            >
              <span className="tag-summary-icon">
                <Hash className="size-5" />
              </span>
              <span>
                <strong>{tag.name}</strong>
                <small>
                  {tag.snippet_count}{" "}
                  {tag.snippet_count === 1 ? "snippet" : "snippets"}
                </small>
              </span>
            </Link>
          ))}
        </section>
      ) : (
        <section className="empty-state organization-empty">
          <span className="empty-state-icon">
            <Tags aria-hidden="true" className="size-6" />
          </span>
          <h2>No tags yet</h2>
          <p>Add comma-separated tags while creating or editing a snippet.</p>
          <Link href="/snippets/new" className="button button-primary">
            Create snippet
          </Link>
        </section>
      )}
    </main>
  );
}
