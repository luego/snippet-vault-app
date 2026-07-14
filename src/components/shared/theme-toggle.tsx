"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="icon-button"
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
      title={isDark ? "Use light theme" : "Use dark theme"}
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-[18px]" />
      ) : (
        <Moon aria-hidden="true" className="size-[18px]" />
      )}
    </button>
  );
}
