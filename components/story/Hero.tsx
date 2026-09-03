"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { resume } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import { metricText, deltaText } from "@/lib/format";
import { fadeUp, spring } from "@/lib/motion";

/** 心电/数据曲线:医学 → AI 的视觉隐喻(加载时描线一次) */
function EcgLine({ reduce }: { reduce: boolean }) {
  return (
    <svg
      aria-hidden
      className="h-16 w-full max-w-2xl text-teal md:h-20"
      viewBox="0 0 600 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="none"
    >
      <motion.path
        data-animate
        d="M0 40 H140 L155 40 L162 14 L170 66 L178 40 L210 40 H300 L315 40 L322 8 L330 72 L338 40 L370 40 H450 L465 40 L472 24 L480 56 L488 40 L520 40 H600"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

/** Ch00 开场:姓名/人设 + 心电线 + KPI 大数字行 */
export default function Hero() {
  const { t } = useLocale();
  // motion v13 的 useReducedMotion 返回 boolean | null
  const reduce = useReducedMotion() ?? false;
  // 双击彩蛋:用触发计数驱动 effect,重复触发会重置倒计时
  const [eggCount, setEggCount] = useState(0);
  const easterEgg = eggCount > 0;

  useEffect(() => {
    if (eggCount === 0) return;
    const timer = setTimeout(() => setEggCount(0), 2400);
    return () => clearTimeout(timer);
  }, [eggCount]);

  return (
    <section id="hero" className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 pt-14 md:px-6">
      <div className="mx-auto w-full max-w-5xl text-center">
        {/* 姓名 + 双击彩蛋 */}
        <motion.h1
          data-animate
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={fadeUp}
          transition={{ ...spring, duration: 0.8 }}
          onDoubleClick={() => setEggCount((c) => c + 1)}
          className="cursor-default select-none text-4xl font-bold tracking-tight md:text-6xl"
        >
          {t(resume.contact.name)}
          {easterEgg && (
            <motion.span
              data-animate
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-3 align-middle text-lg font-medium text-teal"
            >
              {t({ zh: "心跳尚在,热爱仍在 ♥", en: "The pulse is alive, the passion remains ♥" })}
            </motion.span>
          )}
        </motion.h1>

        <motion.p
          data-animate
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={fadeUp}
          transition={{ ...spring, duration: 0.8, delay: 0.1 }}
          className="mt-3 text-base text-ink-2 md:text-lg"
        >
          {t(resume.contact.tagline)} · {t(resume.contact.title)}
        </motion.p>

        <motion.p
          data-animate
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={fadeUp}
          transition={{ ...spring, duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ink-3"
        >
          {t(resume.summary)}
        </motion.p>

        {/* 心电图 → 数据曲线 */}
        <motion.div
          data-animate
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={fadeUp}
          transition={{ ...spring, duration: 0.8, delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <EcgLine reduce={reduce} />
        </motion.div>

        {/* KPI 大数字行 */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {resume.heroStats.map((stat, i) => (
            <motion.div
              key={stat.id}
              data-animate
              initial={reduce ? false : "hidden"}
              animate="show"
              variants={fadeUp}
              transition={{ ...spring, duration: 0.8, delay: 0.4 + i * 0.1 }}
              className="rounded-xl border border-line bg-card px-4 py-5"
            >
              <p className="text-xs text-ink-3">{t(stat.label)}</p>
              <p className="num mt-2 text-2xl font-bold md:text-3xl">
                {metricText(stat)}
                {stat.baseline !== undefined && (
                  <span className="num ml-1.5 align-middle text-xs font-medium text-teal">{deltaText(stat)}</span>
                )}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-3">{t(stat.description)}</p>
            </motion.div>
          ))}
        </div>

        {/* 下滑提示(导航装饰,不打印) */}
        <motion.div
          data-animate
          initial={reduce ? false : "hidden"}
          animate="show"
          variants={fadeUp}
          transition={{ ...spring, duration: 0.8, delay: 0.8 }}
          className="print:hidden mt-14 flex justify-center"
        >
          <motion.svg
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-ink-3"
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="m6 9 6 6 6-6" />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
}
