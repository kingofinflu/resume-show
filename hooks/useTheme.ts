"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_KEY = "resume-theme";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * 主题 hook:localStorage 记忆 + 系统偏好默认。
 * state 是唯一事实来源,副作用统一在 effect 里应用(不在 updater 里做副作用)。
 */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setThemeState] = useState<Theme>("light");

  // hydrate 后同步 localStorage(避免 SSR/CSR 不一致)
  useEffect(() => {
    setThemeState(readInitialTheme());
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggle };
}
