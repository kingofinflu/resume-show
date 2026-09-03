"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Chapter } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/useIsMobile";
import SectionLabel from "@/components/ui/SectionLabel";

interface ChapterShellProps {
  chapter: Chapter;
  children: ReactNode;
}

/**
 * 章节通用容器:
 * - 滚动视差:章节进入视口时内容从 +48px 上移归位,离开时轻微上飘(不用 sticky 钉住 ——
 *   章节内容高度不可控,sticky + overflow-hidden 会裁掉超出一屏的内容)
 * - 移动端与减少动态效果用户:禁用视差,退化为普通滚动
 * - 章节内容本身由 children(服务端组件)提供,动画只在客户端叠加
 */
export default function ChapterShell({ chapter, children }: ChapterShellProps) {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 视差:进入 +48px → 归位 → 离开 -24px
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [48, 0, -24]);
  const applyParallax = !isMobile && !reduce;

  const label = t({ zh: "章节", en: "CHAPTER" });

  return (
    <section
      ref={ref}
      id={chapter.id}
      // 固定导航 h-14(56px),锚点跳转留出偏移
      className="scroll-mt-14 px-4 py-24 md:px-6 md:py-32"
    >
      <motion.div
        data-animate
        style={applyParallax ? { y } : undefined}
        className="mx-auto w-full max-w-5xl"
      >
        <div className="mb-10">
          <SectionLabel label={label} index={chapter.index} title={t(chapter.title)} accent={chapter.accent} />
          <p className="mt-2 text-sm text-ink-2">{t(chapter.subtitle)}</p>
        </div>
        {children}
      </motion.div>
    </section>
  );
}
