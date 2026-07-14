import Link from "next/link";

export function SettingsNavigation({
  current,
}: {
  current: "profile" | "preferences";
}) {
  return (
    <nav className="settings-navigation" aria-label="Settings sections">
      <Link
        href="/settings/profile"
        aria-current={current === "profile" ? "page" : undefined}
      >
        Profile
      </Link>
      <Link
        href="/settings/preferences"
        aria-current={current === "preferences" ? "page" : undefined}
      >
        Preferences
      </Link>
    </nav>
  );
}
