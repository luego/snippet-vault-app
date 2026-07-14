import { Filter, Search, X } from "lucide-react";
import Link from "next/link";

import type { SnippetSearchParams } from "@/features/snippets/schemas/search-params";
import type { TagSummary } from "@/features/snippets/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants/languages";

export function SnippetFilters({
  params,
  tags,
  action,
  hideFavorite = false,
}: {
  params: SnippetSearchParams;
  tags: TagSummary[];
  action: string;
  hideFavorite?: boolean;
}) {
  return (
    <form className="snippet-filters" action={action} method="get">
      <label className="filter-search">
        <Search aria-hidden="true" className="size-4" />
        <span className="sr-only">Search title, description, or tags</span>
        <input
          type="search"
          name="q"
          defaultValue={params.q}
          maxLength={100}
          placeholder="Search title, description, or tags…"
        />
      </label>
      <div className="filter-grid">
        <label>
          <span>Language</span>
          <select name="language" defaultValue={params.language ?? ""}>
            <option value="">All languages</option>
            {Object.entries(SUPPORTED_LANGUAGES).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Tag</span>
          <select name="tag" defaultValue={params.tag ?? ""}>
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option value={tag.normalized_name} key={tag.id}>
                #{tag.name} ({tag.snippet_count})
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Visibility</span>
          <select name="visibility" defaultValue={params.visibility ?? ""}>
            <option value="">Any visibility</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </label>
        {!hideFavorite && (
          <label>
            <span>Favorite</span>
            <select name="favorite" defaultValue={params.favorite ?? ""}>
              <option value="">All snippets</option>
              <option value="true">Favorites only</option>
              <option value="false">Not favorited</option>
            </select>
          </label>
        )}
        <label>
          <span>Sort</span>
          <select name="sort" defaultValue={params.sort}>
            <option value="updated-desc">Recently updated</option>
            <option value="created-desc">Recently created</option>
            <option value="title-asc">Title A–Z</option>
            <option value="copies-desc">Most copied</option>
          </select>
        </label>
      </div>
      {params.pageSize !== 20 && (
        <input type="hidden" name="pageSize" value={params.pageSize} />
      )}
      <div className="filter-actions">
        <button className="button button-secondary" type="submit">
          <Filter className="size-4" /> Apply filters
        </button>
        <Link href={action} className="button button-ghost">
          <X className="size-4" /> Reset
        </Link>
      </div>
    </form>
  );
}
