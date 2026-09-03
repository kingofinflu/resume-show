import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { resume } from "@/data/resume";
import { LocaleProvider } from "@/lib/i18n";
import { MotionConfig } from "motion/react";

// 静态导出:metadata 在构建期求值,默认中文
export const metadata: Metadata = {
  title: resume.meta.siteTitle.zh,
  description: resume.meta.description.zh,
};

/** hydration 前内联脚本:先按 localStorage 应用主题/语言,防止闪烁 */
const noFlashScript = `
(function () {
  try {
    var theme = localStorage.getItem("resume-theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    }
    if (localStorage.getItem("resume-locale") === "en") {
      document.documentElement.setAttribute("data-locale", "en");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="antialiased">
        <LocaleProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </LocaleProvider>
      </body>
    </html>
  );
}
