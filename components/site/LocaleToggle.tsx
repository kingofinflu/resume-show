"use client";

import { useLocale } from "@/lib/i18n";

/** 语言切换:中文 / EN */
export default function LocaleToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      aria-label={t({ zh: "切换语言", en: "Switch language" })}
      className={`num flex h-9 items-center justify-center rounded-full border border-line bg-card px-3 text-xs font-medium tracking-wide transition-colors hover:text-ink ${
        locale === "zh" ? "text-ink" : "text-ink-3"
      }`}
    >
      {locale === "zh" ? "EN" : "中文"}
    </button>
  );
}
