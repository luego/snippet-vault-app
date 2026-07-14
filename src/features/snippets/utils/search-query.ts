import type { SnippetSearchParams } from "@/features/snippets/schemas/search-params";

type SearchOverrides = Partial<SnippetSearchParams>;

export function buildSnippetSearchHref(
  pathname: string,
  params: SnippetSearchParams,
  overrides: SearchOverrides = {},
) {
  const next = { ...params, ...overrides };
  const query = new URLSearchParams();

  if (next.q) query.set("q", next.q);
  if (next.language) query.set("language", next.language);
  if (next.tag) query.set("tag", next.tag);
  if (next.favorite) query.set("favorite", next.favorite);
  if (next.visibility) query.set("visibility", next.visibility);
  if (next.sort !== "updated-desc") query.set("sort", next.sort);
  if (next.page > 1) query.set("page", String(next.page));
  if (next.pageSize !== 20) query.set("pageSize", String(next.pageSize));

  const value = query.toString();
  return value ? `${pathname}?${value}` : pathname;
}

export function hasSnippetFilters(params: SnippetSearchParams) {
  return Boolean(
    params.q ||
    params.language ||
    params.tag ||
    params.favorite ||
    params.visibility ||
    params.sort !== "updated-desc",
  );
}
