"use client";

import { motion } from "motion/react";
import type { Metric } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import { formatValue, metricText, deltaText } from "@/lib/format";

const statusLabels = {
  good: { zh: "达标", en: "OK" },
  warning: { zh: "关注", en: "Watch" },
  serious: { zh: "问题指标", en: "Problem metric" },
  critical: { zh: "严重", en: "Critical" },
} as const;

const statusColors = {
  good: "bg-good",
  warning: "bg-warning",
  serious: "bg-serious",
  critical: "bg-critical",
} as const;

/**
 * 单序列横向条形图:
 * - 有 baseline 的指标:value 柱 + baseline 刻度线,读数 "55.60% → 86.80%"
 * - 无 baseline 的指标:单柱
 * - down-good(幻觉率):value 柱用 good 绿(数值下降 = 改善)
 * - status 指标配状态徽章 + 文字,不只靠颜色
 * - 口径说明常显在柱下方(不写口径的数字就是误导)
 */
export default function MetricBars({ metrics }: { metrics: Metric[] }) {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      {metrics.map((m) => {
        const unit = m.unit ?? "%";
        const valueColor = m.polarity === "down-good" ? "bg-good" : m.highlight ? "bg-teal-3" : "bg-teal";
        // 按指标自身归一化(各指标单位/量级不同,共享轴线会让小值缩成细条且无意义)
        const ownMax = Math.max(m.value, m.baseline ?? 0);
        const pct = (v: number) => (ownMax > 0 ? (v / ownMax) * 100 : 0);
        return (
          <div key={m.id}>
            {/* 标签行:名称 + 状态点 + 数值 */}
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-xs text-ink-2">
                {t(m.label)}
                {m.status && (
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${statusColors[m.status]}`}
                    aria-hidden
                  />
                )}
              </span>
              <span className="num text-xs">
                <span className="text-ink-2">
                  {m.baseline !== undefined
                    ? `${formatValue(m.baseline, m.precision ?? 2)}${unit} → `
                    : ""}
                </span>
                <span className="font-bold text-ink">{metricText(m)}</span>
                {m.baseline !== undefined && (
                  <span className="num ml-1.5 font-medium text-teal">{deltaText(m)}</span>
                )}
              </span>
            </div>

            {/* 条 + baseline 刻度(按自身最大值归一化,刻度永远在条内可见) */}
            <div
              className="relative mt-1.5 h-3 rounded-full bg-line"
              role="img"
              aria-label={`${t(m.label)}: ${metricText(m)}`}
            >
              <motion.div
                data-animate
                className={`h-full rounded-full ${valueColor}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct(m.value)}%` }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              {m.baseline !== undefined && (
                <span
                  aria-hidden
                  className="absolute top-0 h-full w-0.5 rounded bg-ink/30"
                  style={{ left: `${pct(m.baseline)}%` }}
                />
              )}
            </div>

            {/* 状态文字用墨色 token(状态色只做点),避免浅色主题对比度不达标 */}
            <div className="mt-1 flex items-center gap-1.5">
              {m.status && <p className="text-[11px] font-medium text-ink-2">{t(statusLabels[m.status])}</p>}
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-3">{t(m.description)}</p>
          </div>
        );
      })}
    </div>
  );
}
