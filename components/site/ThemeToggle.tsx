"use client";

import { useTheme } from "@/hooks/useTheme";
import { useLocale } from "@/lib/i18n";

/** 主题切换:亮/暗 */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? t({ zh: "切换深色模式", en: "Switch to dark mode" }) : t({ zh: "切换浅色模式", en: "Switch to light mode" })}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink-2 transition-colors hover:text-ink"
    >
      {theme === "light" ? (
        /* 月亮 */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ) : (
        /* 太阳 */
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
