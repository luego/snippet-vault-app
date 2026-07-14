import type { Metadata } from "next";

import { SnippetCollection } from "@/features/snippets/components/snippet-collection";

export const metadata: Metadata = {
  title: "Favorites",
  robots: { index: false },
};

export default function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <SnippetCollection
      searchParams={searchParams}
      pathname="/favorites"
      eyebrow="Quick access"
      title="Favorites"
      description="Keep your most useful fragments close at hand."
      favoriteOnly
    />
  );
}
