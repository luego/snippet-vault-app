import Link from "next/link";

export default function SnippetNotFound() {
  return (
    <main className="app-content route-page">
      <section className="empty-state">
        <h1>Snippet not found</h1>
        <p>It may have been deleted, or you may not have access to it.</p>
        <Link href="/snippets" className="button button-primary">
          Back to snippets
        </Link>
      </section>
    </main>
  );
}
