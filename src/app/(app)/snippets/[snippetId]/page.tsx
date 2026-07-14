import { CalendarDays, Code2, Copy, Eye, Star } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { requireVerifiedClaims } from "@/features/auth/server/session";
import { CodeBlock } from "@/features/snippets/components/code-block";
import { CopyButton } from "@/features/snippets/components/copy-button";
import { SnippetActions } from "@/features/snippets/components/snippet-actions";
import { ShareSettings } from "@/features/snippets/components/share-settings";
import { snippetIdSchema } from "@/features/snippets/schemas/snippet";
import {
  getSnippet,
  getSnippetTags,
} from "@/features/snippets/server/repository";
import {
  SUPPORTED_LANGUAGES,
  toSupportedLanguage,
} from "@/lib/constants/languages";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Snippet",
  robots: { index: false },
};

export default async function SnippetDetailPage({
  params,
}: {
  params: Promise<{ snippetId: string }>;
}) {
  const { snippetId } = await params;
  const parsedId = snippetIdSchema.safeParse(snippetId);
  if (!parsedId.success) notFound();

  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const [{ data: snippet, error }, { data: tags, error: tagError }] =
    await Promise.all([
      getSnippet(client, claims.sub, parsedId.data),
      getSnippetTags(client, claims.sub, parsedId.data),
    ]);

  if (error || tagError || !snippet) notFound();

  const language = SUPPORTED_LANGUAGES[toSupportedLanguage(snippet.language)];
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));

  return (
    <main className="app-content route-page snippet-detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/snippets">Snippets</Link>
        <span aria-hidden="true">/</span>
        <span>Detail</span>
      </nav>

      <div className="snippet-detail-heading">
        <div>
          <div className="snippet-title-row">
            <h1>{snippet.title}</h1>
            {snippet.is_favorite && (
              <Star className="size-5" aria-label="Favorite" />
            )}
          </div>
          {snippet.description && <p>{snippet.description}</p>}
        </div>
        <CopyButton code={snippet.code} snippetId={snippet.id} />
      </div>

      <SnippetActions snippet={snippet} />

      <div className="snippet-detail-grid">
        <section className="code-panel" aria-labelledby="code-heading">
          <div className="code-panel-header">
            <h2 id="code-heading">Code</h2>
            <span className="badge">{language}</span>
          </div>
          <CodeBlock code={snippet.code} language={snippet.language} />
        </section>

        <aside className="snippet-metadata" aria-label="Snippet details">
          <h2>Details</h2>
          <dl>
            <div>
              <dt>
                <Code2 className="size-4" /> Language
              </dt>
              <dd>{language}</dd>
            </div>
            <div>
              <dt>
                <Eye className="size-4" /> Visibility
              </dt>
              <dd>{snippet.visibility}</dd>
            </div>
            <div>
              <dt>
                <Copy className="size-4" /> Copies
              </dt>
              <dd>{snippet.copy_count}</dd>
            </div>
            <div>
              <dt>
                <CalendarDays className="size-4" /> Created
              </dt>
              <dd>{formatDate(snippet.created_at)}</dd>
            </div>
            <div>
              <dt>
                <CalendarDays className="size-4" /> Updated
              </dt>
              <dd>{formatDate(snippet.updated_at)}</dd>
            </div>
          </dl>
          <div className="snippet-tags">
            <h3>Tags</h3>
            {tags.length ? (
              <div>
                {tags.map((tag) => (
                  <span className="badge" key={tag.id}>
                    #{tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <p>No tags</p>
            )}
          </div>
          <ShareSettings
            snippetId={snippet.id}
            publicId={snippet.public_id}
            visibility={snippet.visibility}
          />
        </aside>
      </div>
    </main>
  );
}
