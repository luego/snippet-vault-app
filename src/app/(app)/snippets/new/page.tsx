import type { Metadata } from "next";
import { FoundationPage } from "@/components/feedback/foundation-page";
export const metadata: Metadata = {
  title: "New snippet",
  robots: { index: false },
};
export default function NewSnippetPage() {
  return (
    <FoundationPage
      title="Create a snippet"
      description="Capture code while the context is still fresh."
    />
  );
}
