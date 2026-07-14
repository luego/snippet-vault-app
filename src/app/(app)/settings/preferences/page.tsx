import type { Metadata } from "next";
import { FoundationPage } from "@/components/feedback/foundation-page";
export const metadata: Metadata = {
  title: "Preferences",
  robots: { index: false },
};
export default function PreferencesPage() {
  return (
    <FoundationPage
      title="Preferences"
      description="Choose how Snippet Vault looks and feels."
    />
  );
}
