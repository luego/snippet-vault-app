import type { Metadata } from "next";

import { requireVerifiedClaims } from "@/features/auth/server/session";
import { PreferenceSettingsForm } from "@/features/settings/components/preference-settings-form";
import { SettingsNavigation } from "@/features/settings/components/settings-navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Preferences",
  robots: { index: false },
};

export default async function PreferencesPage() {
  const claims = await requireVerifiedClaims();
  const client = await createClient();
  const { data, error } = await client
    .from("profiles")
    .select("preferred_theme")
    .eq("id", claims.sub)
    .maybeSingle();
  if (error) throw new Error("Unable to load preferences");

  return (
    <main className="app-content route-page settings-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Account settings</span>
          <h1>Preferences</h1>
          <p>Choose how Snippet Vault looks across your sessions.</p>
        </div>
      </div>
      <SettingsNavigation current="preferences" />
      <section className="settings-panel" aria-labelledby="appearance-title">
        <div className="settings-panel-heading">
          <h2 id="appearance-title">Appearance</h2>
          <p>
            Your selection is applied immediately. Save it to use across
            sessions.
          </p>
        </div>
        <PreferenceSettingsForm
          preferredTheme={data?.preferred_theme ?? "system"}
        />
      </section>
    </main>
  );
}
