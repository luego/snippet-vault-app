import { Clock3, Code2, Globe2, Heart, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { requireVerifiedClaims } from "@/features/auth/server/session";
import { getDashboardSummary } from "@/features/snippets/server/repository";
import {
  SUPPORTED_LANGUAGES,
  toSupportedLanguage,
} from "@/lib/constants/languages";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { data, error } = await getDashboardSummary(client, claims.sub);
  if (error || !data) throw new Error("Unable to load dashboard");

  const metadata =
    claims.user_metadata && typeof claims.user_metadata === "object"
      ? claims.user_metadata
      : {};
  const displayName =
    typeof metadata.display_name === "string"
      ? metadata.display_name.split(/\s+/u)[0]
      : "Developer";
  const stats = [
    ["Total snippets", data.total, Code2],
    ["Favorites", data.favorites, Heart],
    ["Public", data.public, Globe2],
    ["Updated this week", data.updatedThisWeek, Clock3],
  ] as const;

  return (
    <main className="app-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Workspace overview</span>
          <h1>Welcome back, {displayName}</h1>
          <p>Your code library is ready when you are.</p>
        </div>
        <Link href="/snippets/new" className="button button-primary">
          <Plus className="size-4" /> New snippet
        </Link>
      </div>

      <section className="stats-grid" aria-label="Vault summary">
        {stats.map(([label, value, Icon]) => (
          <article className="stat-card" key={label}>
            <div className="stat-card-top">
              <span>{label}</span>
              <span className="stat-card-icon">
                <Icon className="size-4" />
              </span>
            </div>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      {data.total === 0 ? (
        <div className="dashboard-empty">
          <EmptyState />
        </div>
      ) : (
        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-header">
              <h2>Recent snippets</h2>
              <Link href="/snippets">View all</Link>
            </div>
            {data.recent.map((snippet) => (
              <Link
                href={`/snippets/${snippet.id}`}
                className="snippet-row"
                key={snippet.id}
              >
                <div>
                  <h3>{snippet.title}</h3>
                  <p>{snippet.description || "No description provided."}</p>
                </div>
                <span className="badge">
                  {SUPPORTED_LANGUAGES[toSupportedLanguage(snippet.language)]}
                </span>
                <span className="snippet-meta">
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "medium",
                  }).format(new Date(snippet.updated_at))}
                </span>
              </Link>
            ))}
          </section>
          <section className="panel">
            <div className="panel-header">
              <h2>Top tags</h2>
              <Link href="/tags">View all</Link>
            </div>
            {data.topTags.length ? (
              <div className="tag-list">
                {data.topTags.map((tag) => (
                  <Link
                    className="tag-pill"
                    href={`/snippets?tag=${encodeURIComponent(tag.normalized_name)}`}
                    key={tag.id}
                  >
                    #{tag.name} <small>{tag.snippet_count}</small>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="panel-empty">
                Add tags to see your most-used topics.
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
