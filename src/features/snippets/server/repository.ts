import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

type DatabaseClient = SupabaseClient<Database>;

const listColumns =
  "id,title,description,language,visibility,is_favorite,updated_at" as const;
const detailColumns =
  "id,title,description,code,language,visibility,is_favorite,copy_count,created_at,updated_at" as const;

export function listSnippets(client: DatabaseClient, ownerId: string) {
  return client
    .from("snippets")
    .select(listColumns, { count: "exact" })
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(20);
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
