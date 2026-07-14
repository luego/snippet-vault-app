import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import type { SnippetSearchParams } from "@/features/snippets/schemas/search-params";
import { buildSnippetSearchHref } from "@/features/snippets/utils/search-query";

export function SnippetPagination({
  pathname,
  params,
  total,
}: {
  pathname: string;
  params: SnippetSearchParams;
  total: number;
}) {
  const pages = Math.ceil(total / params.pageSize);
  if (pages <= 1) return null;

  const start = Math.max(1, Math.min(params.page - 2, pages - 4));
  const visiblePages = Array.from(
    { length: Math.min(5, pages) },
    (_, index) => start + index,
  );

  return (
    <nav className="snippet-pagination" aria-label="Snippet pages">
      {params.page > 1 ? (
        <Link
          className="pagination-direction"
          href={buildSnippetSearchHref(pathname, params, {
            page: params.page - 1,
          })}
        >
          <ChevronLeft className="size-4" /> Previous
        </Link>
      ) : (
        <span className="pagination-direction disabled">
          <ChevronLeft className="size-4" /> Previous
        </span>
      )}
      <span className="pagination-pages">
        {visiblePages.map((page) => (
          <Link
            href={buildSnippetSearchHref(pathname, params, { page })}
            aria-current={page === params.page ? "page" : undefined}
            key={page}
          >
            {page}
          </Link>
        ))}
      </span>
      {params.page < pages ? (
        <Link
          className="pagination-direction"
          href={buildSnippetSearchHref(pathname, params, {
            page: params.page + 1,
          })}
        >
          Next <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className="pagination-direction disabled">
          Next <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
