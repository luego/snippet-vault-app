import { Clock3, Globe2, LockKeyhole, Star } from "lucide-react";
import Link from "next/link";

import type { SnippetListItem } from "@/features/snippets/types";
import {
  SUPPORTED_LANGUAGES,
  toSupportedLanguage,
} from "@/lib/constants/languages";

export function SnippetCard({ snippet }: { snippet: SnippetListItem }) {
  const language = SUPPORTED_LANGUAGES[toSupportedLanguage(snippet.language)];
  const updated = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(snippet.updated_at));

  return (
    <article className="snippet-card">
      <div className="snippet-card-heading">
        <div>
          <Link href={`/snippets/${snippet.id}`}>{snippet.title}</Link>
          <p>{snippet.description || "No description provided."}</p>
        </div>
        {snippet.is_favorite && (
          <Star className="size-4" aria-label="Favorite" />
        )}
      </div>
      <div className="snippet-card-meta">
        <span className="badge">{language}</span>
        <span>
          {snippet.visibility === "private" ? (
            <LockKeyhole className="size-3.5" />
          ) : (
            <Globe2 className="size-3.5" />
          )}{" "}
          {snippet.visibility}
        </span>
        <span>
          <Clock3 className="size-3.5" /> Updated {updated}
        </span>
      </div>
      {snippet.tags.length > 0 && (
        <div className="snippet-card-tags" aria-label="Tags">
          {snippet.tags.slice(0, 3).map((tag) => (
            <span key={tag.id}>#{tag.name}</span>
          ))}
          {snippet.tags.length > 3 && <span>+{snippet.tags.length - 3}</span>}
        </div>
      )}
    </article>
  );
}
