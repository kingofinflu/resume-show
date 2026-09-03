"use client";

import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n";

/**
 * 荣誉百分位条:轨道 + 金色填充,读数为 "位列年级前 30%"(金色)。
 * 30 表示 "前 30%":金色区域 = 年级最前的 30%,即自己在金色区间的左端。
 * 为避免歧义,副标题明确写 "超越 70% 同级同学"。
 */
export default function PercentileBar({ percentile }: { percentile: number }) {
  const { t } = useLocale();
  const pct = Math.min(Math.max(percentile, 0), 100);
  const beat = 100 - percentile;

  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-gold">
          {t({ zh: `位列年级前 ${percentile}%`, en: `Top ${percentile}% of the class` })}
        </span>
        <span className="num text-ink-3">
          {t({ zh: `超越 ${beat}% 同级同学`, en: `Ahead of ${beat}% of classmates` })}
        </span>
      </div>
      <div
        className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-line"
        role="img"
        aria-label={t({ zh: `位列年级前 ${percentile}%`, en: `Top ${percentile}% of the class` })}
      >
        <motion.div
          data-animate
          className="h-full rounded-full bg-gold"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
