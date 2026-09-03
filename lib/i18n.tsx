"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { L } from "@/data/resume";

export type Locale = "zh" | "en";

const LOCALE_KEY = "resume-locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** 取双语文本的当前语言版本 */
  t: (l: L) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "zh",
  setLocale: () => {},
  t: (l) => l.zh,
});

/** 从 localStorage 读初始语言(在 Provider 内执行,hydrate 后生效) */
function readInitialLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  const saved = window.localStorage.getItem(LOCALE_KEY);
  return saved === "en" ? "en" : "zh";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  /** 统一把语言应用到 <html>(初始化恢复与手动切换共用,行为对称) */
  const applyLocale = useCallback((l: Locale) => {
    document.documentElement.setAttribute("data-locale", l);
    document.documentElement.lang = l === "zh" ? "zh-CN" : "en";
  }, []);

  // hydrate 后同步 localStorage(避免 SSR/CSR 不一致)
  useEffect(() => {
    const initial = readInitialLocale();
    setLocaleState(initial);
    applyLocale(initial);
  }, [applyLocale]);

  const setLocale = useCallback(
    (l: Locale) => {
      setLocaleState(l);
      window.localStorage.setItem(LOCALE_KEY, l);
      applyLocale(l);
    },
    [applyLocale],
  );

  const t = useCallback((l: L) => l[locale], [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
