"use client";

import { useTheme } from "@/components/layout/theme-provider";
import { SunIcon, MoonIcon } from "@/components/ui/icons";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      title={isDark ? "Светлая тема" : "Тёмная тема"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-glow bg-background-deep/40 text-text-secondary transition-all hover:text-text-primary hover:border-primary/60 hover:bg-primary/10"
    >
      {isDark ? (
        <SunIcon className="h-4 w-4" />
      ) : (
        <MoonIcon className="h-4 w-4" />
      )}
    </button>
  );
}
