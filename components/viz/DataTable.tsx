"use client";

import type { Metric } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import { rangeText, deltaText } from "@/lib/format";

/**
 * 数据表视图(折叠):每个图表的无障碍补充,屏幕阅读器与数据核对用。
 * 表格语义:行头(scope=row)+ 列头(scope=col),表格带可访问名称。
 */
export default function DataTable({ metrics }: { metrics: Metric[] }) {
  const { t } = useLocale();
  const colLabel = t({ zh: "指标", en: "Metric" });
  const colValue = t({ zh: "数值", en: "Value" });
  const colDelta = t({ zh: "变化", en: "Δ" });
  const colNote = t({ zh: "说明", en: "Note" });

  return (
    <details className="mt-4 rounded-xl border border-line bg-bg px-4 py-3">
      <summary className="cursor-pointer select-none text-xs font-medium text-ink-3 hover:text-ink-2">
        {t({ zh: "数据表", en: "Data table" })}
      </summary>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs text-ink-2" aria-label={t({ zh: "指标数据表", en: "Metrics data table" })}>
          <thead>
            <tr className="border-b border-line text-ink-3">
              <th scope="col" className="py-1.5 pr-3 font-medium">{colLabel}</th>
              <th scope="col" className="py-1.5 pr-3 font-medium">{colValue}</th>
              <th scope="col" className="py-1.5 pr-3 font-medium">{colDelta}</th>
              <th scope="col" className="py-1.5 font-medium">{colNote}</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.id} className="border-b border-line last:border-b-0">
                <th scope="row" className="py-1.5 pr-3 font-normal text-ink">
                  {t(m.label)}
                </th>
                <td className="num py-1.5 pr-3">{m.isDelta ? "—" : rangeText(m)}</td>
                <td className="num py-1.5 pr-3">{deltaText(m) ?? "—"}</td>
                <td className="py-1.5 text-ink-3">{t(m.description)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
