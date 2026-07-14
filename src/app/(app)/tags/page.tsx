import type { Metadata } from "next";
import { FoundationPage } from "@/components/feedback/foundation-page";
export const metadata: Metadata = { title: "Tags", robots: { index: false } };
export default function TagsPage() {
  return (
    <FoundationPage
      title="Tags"
      description="A lightweight map of everything in your vault."
    />
  );
}
