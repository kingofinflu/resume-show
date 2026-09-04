import type { Metric } from "@/data/resume";

/**
 * 数字格式化:统一保留两位小数(如 94.60、1.22、3.70)。
 * 唯一的例外是计数字段(几段实习、几个产品),在 data 里显式 precision: 0。
 */
export function formatValue(value: number, precision = 2): string {
  return value.toFixed(precision);
}

/** 指标值 + 单位,如 "94.60%"。unit 省略时默认为 "%",计数类指标显式传 "";isDelta 指标带实际方向正负号(如 "+1.22pp"、"-28.64pp") */
export function metricText(m: Metric): string {
  const sign = m.isDelta ? (m.polarity === "down-good" ? "-" : "+") : "";
  return `${sign}${formatValue(m.value, m.precision ?? 2)}${m.unit ?? "%"}`;
}

/**
 * 变化量文本(如 "-10.10pp"):
 * - 有 baseline:符号 = 实际方向(value − baseline,幻觉率 13.80→3.70 显示 -10.10pp,
 *   改善与否由 status 色 + 文字表达,不再翻号)
 * - isDelta:value 存变化幅度(正数),符号由 polarity 声明(down-good 为负,如耗时降低 -28.64pp)
 * - 都不是:返回 null
 */
export function deltaText(m: Metric): string | null {
  if (m.baseline !== undefined) {
    const raw = m.value - m.baseline;
    const sign = raw >= 0 ? "+" : "-";
    return `${sign}${formatValue(Math.abs(raw), m.precision ?? 2)}pp`;
  }
  if (m.isDelta) {
    const sign = m.polarity === "down-good" ? "-" : "+";
    return `${sign}${formatValue(m.value, m.precision ?? 2)}${m.unit ?? "pp"}`;
  }
  return null;
}

/** 时间区间文本,如 "2019.09 - 2024.06";endLabel 用于双语化的"至今"(如 t({zh:"至今",en:"Present"})) */
export function periodText(start: string, end: string, endLabel?: string): string {
  return `${start} - ${endLabel ?? end}`;
}

/** 指标前后对比文本,如 "78.40% → 94.60%"(遵循两位小数与 unit 约定,计数类不拼 %) */
export function rangeText(m: Metric): string {
  if (m.baseline === undefined) return metricText(m);
  const unit = m.unit ?? "%";
  const to = (v: number) => `${formatValue(v, m.precision ?? 2)}${unit}`;
  return `${to(m.baseline)} → ${to(m.value)}`;
}
