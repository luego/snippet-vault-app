import type { Metadata } from "next";
import { FoundationPage } from "@/components/feedback/foundation-page";
export const metadata: Metadata = {
  title: "All snippets",
  robots: { index: false },
};
export default function SnippetsPage() {
  return (
    <FoundationPage
      title="All snippets"
      description="Search, filter, and organize your reusable code."
    />
  );
}
