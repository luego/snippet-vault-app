import { FileSearch, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireVerifiedClaims } from "@/features/auth/server/session";
import { SnippetCard } from "@/features/snippets/components/snippet-card";
import { SnippetFilters } from "@/features/snippets/components/snippet-filters";
import { SnippetPagination } from "@/features/snippets/components/snippet-pagination";
import { snippetSearchParamsSchema } from "@/features/snippets/schemas/search-params";
import {
  listSnippets,
  listTagSummaries,
} from "@/features/snippets/server/repository";
import {
  buildSnippetSearchHref,
  hasSnippetFilters,
} from "@/features/snippets/utils/search-query";
import { createClient } from "@/lib/supabase/server";

type RawSearchParams = Record<string, string | string[] | undefined>;

export async function SnippetCollection({
  searchParams,
  pathname,
  eyebrow,
  title,
  description,
  favoriteOnly = false,
}: {
  searchParams: Promise<RawSearchParams>;
  pathname: string;
  eyebrow: string;
  title: string;
  description: string;
  favoriteOnly?: boolean;
}) {
  const params = snippetSearchParamsSchema.parse(await searchParams);
  const userFiltered = hasSnippetFilters(params);
  if (favoriteOnly) params.favorite = "true";

  await requireVerifiedClaims();
  const client = await createClient();
  const [snippets, tags] = await Promise.all([
    listSnippets(client, params),
    listTagSummaries(client),
  ]);
  if (snippets.error || tags.error) throw new Error("Unable to load snippets");

  const pages = Math.ceil(snippets.total / params.pageSize);
  if (pages > 0 && params.page > pages) {
    redirect(buildSnippetSearchHref(pathname, params, { page: pages }));
  }

  const emptyTitle = userFiltered
    ? "No matching snippets"
    : favoriteOnly
      ? "No favorites yet"
      : "No snippets yet";
  const emptyDescription = userFiltered
    ? "Try a broader search or reset the active filters."
    : favoriteOnly
      ? "Favorite a snippet from its detail page to keep it close at hand."
      : "Save your first reusable idea and it will show up here.";

  return (
    <main className="app-content route-page collection-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <Link href="/snippets/new" className="button button-primary">
          <Plus className="size-4" /> New snippet
        </Link>
      </div>

      <SnippetFilters
        params={params}
        tags={tags.data}
        action={pathname}
        hideFavorite={favoriteOnly}
      />

      <div className="collection-summary" aria-live="polite">
        <strong>{snippets.total}</strong>{" "}
        {snippets.total === 1 ? "snippet" : "snippets"}
        {userFiltered
          ? " match these filters"
          : favoriteOnly
            ? " in your favorites"
            : " in your vault"}
      </div>

      {snippets.data.length ? (
        <section className="snippet-list" aria-label={title}>
          {snippets.data.map((snippet) => (
            <SnippetCard snippet={snippet} key={snippet.id} />
          ))}
        </section>
      ) : (
        <section className="empty-state organization-empty">
          <span className="empty-state-icon">
            <FileSearch aria-hidden="true" className="size-6" />
          </span>
          <h2>{emptyTitle}</h2>
          <p>{emptyDescription}</p>
          <Link
            href={
              userFiltered
                ? pathname
                : favoriteOnly
                  ? "/snippets"
                  : "/snippets/new"
            }
            className="button button-primary"
          >
            {userFiltered
              ? "Reset filters"
              : favoriteOnly
                ? "Browse snippets"
                : "Create snippet"}
          </Link>
        </section>
      )}

      <SnippetPagination
        pathname={pathname}
        params={params}
        total={snippets.total}
      />
    </main>
  );
}
