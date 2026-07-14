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
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <Sun aria-hidden="true" className="theme-icon-light size-[18px]" />
      <Moon aria-hidden="true" className="theme-icon-dark size-[18px]" />
    </button>
  );
}
