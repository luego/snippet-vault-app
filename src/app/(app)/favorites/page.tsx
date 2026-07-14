import type { Metadata } from "next";
import { FoundationPage } from "@/components/feedback/foundation-page";
export const metadata: Metadata = {
  title: "Favorites",
  robots: { index: false },
};
export default function FavoritesPage() {
  return (
    <FoundationPage
      title="Favorites"
      description="Keep your most useful fragments close at hand."
    />
  );
}
