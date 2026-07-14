import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Code2, Globe2, Heart, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const stats = [
  ["Total snippets", "48", Code2],
  ["Favorites", "12", Heart],
  ["Public", "5", Globe2],
  ["Updated this week", "8", Clock3],
] as const;

const recent = [
  [
    "Type-safe fetch wrapper",
    "Reusable API request helper with typed errors",
    "TypeScript",
    "2m ago",
  ],
  [
    "Postgres RLS policy",
    "Owner-scoped access policy for new tables",
    "SQL",
    "1h ago",
  ],
  [
    "Docker health check",
    "Minimal health probe for Alpine containers",
    "Bash",
    "Yesterday",
  ],
  [
    "Retry with exponential backoff",
    "Dependency-free async retry helper",
    "Python",
    "3d ago",
  ],
] as const;

export default function DashboardPage() {
  return (
    <main className="app-content">
      <div className="page-heading">
        <div>
          <h1>Good morning, Alex</h1>
          <p>Your code library is ready when you are.</p>
        </div>
        <Link href="/snippets/new" className="button button-primary">
          <Plus className="size-4" /> New snippet
        </Link>
      </div>
      <div className="foundation-note">
        <strong>Milestone 3:</strong> Secure snippet CRUD is live in All
        snippets. Dashboard summaries remain sample data until Milestone 4.
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
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Recent snippets</h2>
            <Link href="/snippets">View all</Link>
          </div>
          {recent.map(([title, description, language, time]) => (
            <article className="snippet-row" key={title}>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="badge">{language}</span>
              <span className="snippet-meta">{time}</span>
            </article>
          ))}
        </section>
        <section className="panel">
          <div className="panel-header">
            <h2>Top tags</h2>
            <Link href="/tags">Manage</Link>
          </div>
          <div className="tag-list">
            {[
              ["api", 12],
              ["typescript", 9],
              ["database", 7],
              ["docker", 5],
              ["utilities", 5],
              ["auth", 4],
            ].map(([tag, count]) => (
              <span className="tag-pill" key={tag}>
                #{tag} <small>{count}</small>
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
