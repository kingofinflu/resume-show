"use client";

import { useEffect, useState } from "react";
import { resume } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import PrintButton from "./PrintButton";

/** 收尾:联系 CTA(复制邮箱)+ 打印 + console 彩蛋 */
export default function Footer() {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  // 非安全上下文(如局域网 http)下 navigator.clipboard 不可用,用 execCommand 兜底
  const copyEmail = async () => {
    const email = resume.contact.email;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 剪贴板彻底不可用:不显示成功态,静默失败 */
    }
  };

  // 卸载时清理未触发的定时器,避免 state update after unmount
  useEffect(() => {
    return () => setCopied(false);
  }, []);

  // console 彩蛋:ASCII 名片
  useEffect(() => {
    console.log(
      [
        "%c  ┌──────────────────────────────┐",
        "  │  " + t(resume.contact.name) + " · " + t(resume.contact.title) + "  │",
        "  │  " + t(resume.contact.tagline) + "  │",
        "  │  " + resume.contact.email + "  │",
        "  └──────────────────────────────┘",
      ].join("\n"),
      "color:#0d9488",
    );
  }, [t]);

  return (
    <footer className="print:hidden border-t border-line bg-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-14 text-center md:px-6">
        <h2 className="text-2xl font-bold md:text-3xl">
          {t({ zh: "对我的经历感兴趣?", en: "Interested in my story?" })}
        </h2>
        <p className="max-w-md text-sm text-ink-2">
          {t({
            zh: "欢迎联系我,聊聊 AI 产品、医疗数据,或者音乐。",
            en: "Let's talk about AI products, health data, or music.",
          })}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={copyEmail}
            className="flex h-10 items-center gap-2 rounded-full bg-teal px-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
            {copied ? t({ zh: "已复制 ✓", en: "Copied ✓" }) : resume.contact.email}
          </button>
          <PrintButton label={t({ zh: "打印 / 下载 PDF", en: "Print / Download PDF" })} />
        </div>
        <p className="num text-xs text-ink-3">
          © 2026 {t(resume.contact.name)} · {t({ zh: "由一份数据源驱动", en: "Driven by a single data source" })}
        </p>
      </div>
    </footer>
  );
}
