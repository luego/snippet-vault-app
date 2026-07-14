import type { Metadata } from "next";

import { SnippetCollection } from "@/features/snippets/components/snippet-collection";

export const metadata: Metadata = {
  title: "All snippets",
  robots: { index: false },
};

export default function SnippetsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <SnippetCollection
      searchParams={searchParams}
      pathname="/snippets"
      eyebrow="Your library"
      title="All snippets"
      description="Search and organize every reusable fragment in your vault."
    />
  );
}
