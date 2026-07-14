import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { requireVerifiedClaims } from "@/features/auth/server/session";
import { SnippetForm } from "@/features/snippets/components/snippet-form";
import { snippetIdSchema } from "@/features/snippets/schemas/snippet";
import {
  getSnippet,
  getSnippetTags,
} from "@/features/snippets/server/repository";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit snippet",
  robots: { index: false },
};

export default async function EditSnippetPage({
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

  return (
    <main className="app-content route-page editor-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/snippets">Snippets</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/snippets/${snippet.id}`}>{snippet.title}</Link>
        <span aria-hidden="true">/</span>
        <span>Edit</span>
      </nav>
      <div className="page-heading">
        <div>
          <h1>Edit snippet</h1>
          <p>Update the code or context while keeping its stable URL.</p>
        </div>
      </div>
      <SnippetForm snippet={snippet} tags={tags} />
    </main>
  );
}
