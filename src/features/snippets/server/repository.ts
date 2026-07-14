import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { SnippetSearchParams } from "@/features/snippets/schemas/search-params";
import type {
  DashboardSummary,
  SnippetListItem,
  SnippetTag,
  TagSummary,
} from "@/features/snippets/types";
import type { Database, Json } from "@/lib/supabase/types";

type DatabaseClient = SupabaseClient<Database>;

const detailColumns =
  "id,title,description,code,language,visibility,is_favorite,copy_count,created_at,updated_at" as const;

function parseTags(value: Json): SnippetTag[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((entry) => {
    if (
      !entry ||
      Array.isArray(entry) ||
      typeof entry !== "object" ||
      typeof entry.id !== "string" ||
      typeof entry.name !== "string" ||
      typeof entry.normalized_name !== "string"
    ) {
      return [];
    }
    return [
      {
        id: entry.id,
        name: entry.name,
        normalized_name: entry.normalized_name,
      },
    ];
  });
}

function searchArguments(params: SnippetSearchParams) {
  return {
    p_query: params.q || null,
    p_language: params.language ?? null,
    p_tag: params.tag ?? null,
    p_favorite:
      params.favorite === undefined ? null : params.favorite === "true",
    p_visibility: params.visibility ?? null,
    p_sort: params.sort,
    p_offset: (params.page - 1) * params.pageSize,
    p_limit: params.pageSize,
  };
}

export async function listSnippets(
  client: DatabaseClient,
  params: SnippetSearchParams,
) {
  const args = searchArguments(params);
  const result = await client.rpc("search_snippets", args);
  let total = result.data?.[0]?.total_count ?? 0;

  if (!result.error && !result.data?.length && params.page > 1) {
    const firstResult = await client.rpc("search_snippets", {
      ...args,
      p_offset: 0,
      p_limit: 1,
    });
    if (firstResult.error)
      return { data: [], total: 0, error: firstResult.error };
    total = firstResult.data?.[0]?.total_count ?? 0;
  }

  const data: SnippetListItem[] = (result.data ?? []).map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    description: snippet.description,
    language: snippet.language,
    visibility: snippet.visibility,
    is_favorite: snippet.is_favorite,
    copy_count: snippet.copy_count,
    created_at: snippet.created_at,
    updated_at: snippet.updated_at,
    tags: parseTags(snippet.tags),
  }));

  return { data, total, error: result.error };
}

export function getSnippet(
  client: DatabaseClient,
  ownerId: string,
  snippetId: string,
) {
  return client
    .from("snippets")
    .select(detailColumns)
    .eq("id", snippetId)
    .eq("owner_id", ownerId)
    .maybeSingle();
}

export async function getSnippetTags(
  client: DatabaseClient,
  ownerId: string,
  snippetId: string,
) {
  const { data: links, error: linkError } = await client
    .from("snippet_tags")
    .select("tag_id")
    .eq("snippet_id", snippetId);

  if (linkError || !links?.length) {
    return { data: [], error: linkError };
  }

  return client
    .from("tags")
    .select("id,name,normalized_name")
    .eq("owner_id", ownerId)
    .in(
      "id",
      links.map((link) => link.tag_id),
    )
    .order("normalized_name");
}

export async function listTagSummaries(client: DatabaseClient, limit = 100) {
  const { data, error } = await client.rpc("list_tag_summaries", {
    p_limit: limit,
  });
  return { data: (data ?? []) as TagSummary[], error };
}

export async function getDashboardSummary(
  client: DatabaseClient,
  ownerId: string,
): Promise<{ data: DashboardSummary | null; error: unknown }> {
  const weekStart = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const recentParams: SnippetSearchParams = {
    q: "",
    tag: undefined,
    sort: "updated-desc",
    page: 1,
    pageSize: 5,
  };

  const [total, favorites, publicSnippets, updated, recent, tags] =
    await Promise.all([
      client
        .from("snippets")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId),
      client
        .from("snippets")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .eq("is_favorite", true),
      client
        .from("snippets")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .eq("visibility", "public"),
      client
        .from("snippets")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .gte("updated_at", weekStart),
      listSnippets(client, recentParams),
      listTagSummaries(client, 6),
    ]);

  const error =
    total.error ??
    favorites.error ??
    publicSnippets.error ??
    updated.error ??
    recent.error ??
    tags.error;
  if (error) return { data: null, error };

  return {
    data: {
      total: total.count ?? 0,
      favorites: favorites.count ?? 0,
      public: publicSnippets.count ?? 0,
      updatedThisWeek: updated.count ?? 0,
      recent: recent.data,
      topTags: tags.data,
    },
    error: null,
  };
}
