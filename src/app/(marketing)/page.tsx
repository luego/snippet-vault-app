import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Braces,
  Check,
  Clock3,
  Code2,
  Copy,
  FolderSearch2,
  Heart,
  KeyRound,
  LockKeyhole,
  Search,
  Share2,
  Tags,
  TerminalSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Your reusable code, organized and ready",
  description:
    "Save, find, and securely share the code snippets you rely on every day.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Snippet Vault — Your reusable code, organized and ready",
    description: "A calm, secure workspace for your reusable code.",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

const features = [
  {
    icon: Search,
    title: "Find it in seconds",
    description:
      "Search across titles and descriptions, then filter by language, tag, visibility, or favorites.",
  },
  {
    icon: Tags,
    title: "Structure without friction",
    description:
      "Organize your collection with flexible tags and language labels that stay tidy as your vault grows.",
  },
  {
    icon: Code2,
    title: "Made for readable code",
    description:
      "Keep formatting intact with a focused editor and clear syntax-aware presentation for every snippet.",
  },
  {
    icon: LockKeyhole,
    title: "Private by default",
    description:
      "Your vault starts private. Account-level database policies keep every user’s data isolated.",
  },
  {
    icon: Share2,
    title: "Share on your terms",
    description:
      "Publish individual snippets with a clean read-only link, then revoke access whenever you need.",
  },
  {
    icon: Copy,
    title: "Ready when you are",
    description:
      "Copy production-ready fragments in one click, whether you are on desktop, tablet, or mobile.",
  },
];

const snippets = [
  [
    "Type-safe fetch wrapper",
    "Reusable API request helper",
    "TypeScript",
    "private",
    "2m ago",
  ],
  [
    "Postgres RLS policy",
    "Owner-scoped table access",
    "SQL",
    "public",
    "1h ago",
  ],
  [
    "Docker health check",
    "Minimal container probe",
    "Bash",
    "private",
    "Yesterday",
  ],
];

function ProductPreview() {
  return (
    <div className="product-frame" aria-label="Snippet Vault dashboard preview">
      <div className="product-frame-bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="mock-app">
        <aside className="mock-sidebar" aria-hidden="true">
          <div className="mock-brand">
            <span className="mock-logo">
              <Braces className="size-4" />
            </span>
            <span>Snippet Vault</span>
          </div>
          <div className="mock-nav-item active">
            <FolderSearch2 className="size-4" />
            <span>Dashboard</span>
          </div>
          <div className="mock-nav-item">
            <Code2 className="size-4" />
            <span>All snippets</span>
          </div>
          <div className="mock-nav-item">
            <Heart className="size-4" />
            <span>Favorites</span>
          </div>
          <div className="mock-nav-item">
            <Tags className="size-4" />
            <span>Tags</span>
          </div>
        </aside>
        <div className="mock-main">
          <div className="mock-top">
            <div>
              <h2>Good morning, Alex</h2>
              <p>Your code library is ready when you are.</p>
            </div>
            <span className="mock-button">+ New snippet</span>
          </div>
          <div className="mock-stats">
            {[
              ["Total snippets", "48"],
              ["Favorites", "12"],
              ["Public", "5"],
              ["This week", "8"],
            ].map(([label, value]) => (
              <div className="mock-stat" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="mock-list">
            <div className="mock-list-header">
              <span>Snippet</span>
              <span>Language</span>
              <span>Visibility</span>
              <span>Updated</span>
            </div>
            {snippets.map(
              ([title, description, language, visibility, updated]) => (
                <div className="mock-row" key={title}>
                  <div>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </div>
                  <span className="mock-cell">{language}</span>
                  <span className="mock-cell">
                    {visibility === "public" ? "◉ Public" : "● Private"}
                  </span>
                  <span className="mock-cell">{updated}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container-shell">
          <div className="hero-copy">
            <span className="eyebrow">
              <TerminalSquare className="size-4" /> Your personal code library
            </span>
            <h1>
              Your reusable code, <span>organized and ready.</span>
            </h1>
            <p>
              Save the commands, patterns, and fragments you trust. Find them
              instantly, keep them private, or share exactly what you choose.
            </p>
            <div className="hero-actions">
              <Link href="/sign-up" className="button button-primary">
                Create your vault <ArrowRight className="size-4" />
              </Link>
              <Link href="/dashboard" className="button button-secondary">
                Explore the demo
              </Link>
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="section section-muted" id="features">
        <div className="container-shell">
          <div className="section-heading centered">
            <span className="eyebrow">Everything in its place</span>
            <h2>A better home for the code you use every day</h2>
            <p>
              Snippet Vault turns scattered notes and forgotten files into a
              fast, focused personal workspace.
            </p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, description }) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="workflow">
        <div className="container-shell">
          <div className="section-heading">
            <span className="eyebrow">A simple workflow</span>
            <h2>Capture once. Reuse without the hunt.</h2>
          </div>
          <div className="workflow">
            {[
              [
                "01",
                "Save the useful part",
                "Paste your code, preserve its formatting, and add only the context future-you will need.",
              ],
              [
                "02",
                "Organize as you go",
                "Add a language and a few lightweight tags. No complex folder system to maintain.",
              ],
              [
                "03",
                "Find, copy, ship",
                "Search your vault, copy the right fragment, and get back to the problem that matters.",
              ],
            ].map(([number, title, description]) => (
              <article className="workflow-step" key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-muted" id="security">
        <div className="container-shell">
          <div className="security-card">
            <div className="security-copy">
              <span className="eyebrow">
                <KeyRound className="size-4" /> Built with boundaries
              </span>
              <h2>Your private code stays yours.</h2>
              <p>
                Security is part of the data model—not a switch painted onto the
                interface. Every request is authenticated and every database row
                enforces ownership.
              </p>
              <div className="security-list">
                {[
                  "Private by default",
                  "Database-enforced access controls",
                  "Server-validated changes",
                  "Revocable public sharing",
                ].map((item) => (
                  <div className="security-item" key={item}>
                    <Check className="size-4" /> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="code-art" aria-label="Security policy example">
              <span>
                <span className="purple">create policy</span>{" "}
                <span className="green">&quot;Owner access&quot;</span>
              </span>
              <span>
                <span className="purple">on</span> public.snippets
              </span>
              <span>
                <span className="purple">for all</span>
              </span>
              <span>
                <span className="purple">using</span> (
              </span>
              <span>&nbsp;&nbsp;owner_id = auth.uid()</span>
              <span>);</span>
              <br />
              <span className="muted">
                -- Authorization belongs at the data layer.
              </span>
              <span className="cyan">✓ policy enabled</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-shell">
          <div className="cta-card">
            <Clock3 className="mx-auto size-7 text-cyan-400" />
            <h2>Stop rewriting the good stuff.</h2>
            <p>
              Build a reliable library of the code you already know works, ready
              whenever the next project needs it.
            </p>
            <Link href="/sign-up" className="button button-primary">
              Create your vault <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
