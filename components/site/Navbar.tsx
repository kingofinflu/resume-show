"use client";

import { resume } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import ScrollProgress from "./ScrollProgress";
import ThemeToggle from "./ThemeToggle";
import LocaleToggle from "./LocaleToggle";
import PrintButton from "./PrintButton";

/** 固定导航:章节点锚链 + 主题/语言切换 + 打印 */
export default function Navbar() {
  const { t } = useLocale();
  const links = resume.chapters.filter((c) => c.id !== "hero");

  return (
    <>
      <ScrollProgress />
      <header className="print:hidden fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
          <a href="#hero" className="flex items-baseline gap-2">
            <span className="text-sm font-bold">{t(resume.contact.name)}</span>
            <span className="hidden text-xs text-ink-3 sm:inline">{t(resume.contact.tagline)}</span>
          </a>

          <div className="hidden items-center gap-5 md:flex">
            {links.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="num text-xs text-ink-2 transition-colors hover:text-ink"
              >
                {c.index} {t(c.title)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LocaleToggle />
            <ThemeToggle />
            <span className="hidden sm:block">
              <PrintButton label={t({ zh: "打印简历", en: "Print resume" })} />
            </span>
          </div>
        </nav>
      </header>
    </>
  );
}
