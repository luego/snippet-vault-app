import type { Metadata } from "next";
import { FoundationPage } from "@/components/feedback/foundation-page";
export const metadata: Metadata = {
  title: "Profile settings",
  robots: { index: false },
};
export default function ProfileSettingsPage() {
  return (
    <FoundationPage
      title="Profile"
      description="Manage your public name and account details."
    />
  );
}
