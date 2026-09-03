import type { Metric } from "@/data/resume";

/**
 * 数字格式化:统一保留两位小数(如 94.60、1.22、3.70)。
 * 唯一的例外是计数字段(几段实习、几个产品),在 data 里显式 precision: 0。
 */
export function formatValue(value: number, precision = 2): string {
  return value.toFixed(precision);
}

/** 指标值 + 单位,如 "94.60%"。unit 省略时默认为 "%",计数类指标显式传 "" */
export function metricText(m: Metric): string {
  return `${formatValue(m.value, m.precision ?? 2)}${m.unit ?? "%"}`;
}

/**
 * 前后对比差(改善幅度),如 "+16.20pp"。没有 baseline 时返回 null。
 * down-good 指标(如幻觉率:数值下降 = 改善)归一化为正号,保证正负号永远表示"改善/恶化"。
 */
export function deltaText(m: Metric): string | null {
  if (m.baseline === undefined) return null;
  const raw = m.value - m.baseline;
  const improved = m.polarity === "down-good" ? -raw : raw;
  const sign = improved >= 0 ? "+" : "-";
  return `${sign}${formatValue(Math.abs(improved), m.precision ?? 2)}pp`;
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
