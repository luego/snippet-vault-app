import type { Metadata } from "next";

import { requireVerifiedClaims } from "@/features/auth/server/session";
import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { SettingsNavigation } from "@/features/settings/components/settings-navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Profile settings",
  robots: { index: false },
};

export default async function ProfileSettingsPage() {
  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { data, error } = await client
    .from("profiles")
    .select("display_name,avatar_url")
    .eq("id", claims.sub)
    .maybeSingle();
  if (error) throw new Error("Unable to load profile settings");

  return (
    <main className="app-content route-page settings-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Account settings</span>
          <h1>Profile</h1>
          <p>Manage the name and optional avatar associated with your vault.</p>
        </div>
      </div>
      <SettingsNavigation current="profile" />
      <section
        className="settings-panel"
        aria-labelledby="profile-details-title"
      >
        <div className="settings-panel-heading">
          <h2 id="profile-details-title">Profile details</h2>
          <p>
            Your email remains private and is never shown on shared snippets.
          </p>
        </div>
        <ProfileSettingsForm
          email={typeof claims.email === "string" ? claims.email : ""}
          displayName={data?.display_name ?? ""}
          avatarUrl={data?.avatar_url ?? ""}
        />
      </section>
    </main>
  );
}
