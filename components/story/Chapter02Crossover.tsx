"use client";

import { resume } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import { periodText, metricText, deltaText } from "@/lib/format";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";

/** Ch02 跨界:百度商业产品实习(医学背景之外的第一站) */
export default function Chapter02Crossover() {
  const { t } = useLocale();
  const exp = resume.experiences.find((e) => e.id === "exp-baidu");
  // 数据缺失时整章不渲染(静态构建阶段即暴露数据问题,而不是运行时抛错)
  if (!exp) return null;

  return (
    <div className="space-y-6">
      {/* 实习主卡片 */}
      <Reveal>
        <div className="rounded-2xl border border-line bg-card p-6 md:p-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="text-xl font-bold md:text-2xl">{t(exp.company)}</h3>
            <span className="num text-sm text-ink-3">{periodText(exp.start, exp.end)}</span>
            <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-xs font-medium text-violet">
              {t(exp.subtitle)}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-ink-2">{t(exp.title)}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">{t(exp.summary)}</p>

          {/* 分点成果 */}
          <ul className="mt-5 space-y-3">
            {exp.achievements.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                <svg
                  aria-hidden
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-violet"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>{t(a)}</span>
              </li>
            ))}
          </ul>

          {/* 指标(含口径说明,数字不写明口径就是误导) */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {exp.metrics.map((m) => (
              <div key={m.id} className="rounded-xl border border-line bg-bg px-4 py-3">
                <p className="text-xs text-ink-3">{t(m.label)}</p>
                <p className="num mt-1 text-xl font-bold">
                  {metricText(m)}
                  {m.baseline !== undefined && (
                    <span className="num ml-1.5 align-middle text-xs font-medium text-teal">{deltaText(m)}</span>
                  )}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-3">{t(m.description)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {exp.tags.map((tag) => (
              <Tag key={tag.zh}>{t(tag)}</Tag>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 医学背景的反哺(数据驱动) */}
      {exp.outro && (
        <Reveal delay={0.25}>
          <div className="rounded-xl border border-line bg-card p-5">
            <p className="text-sm leading-relaxed text-ink-3">{t(exp.outro)}</p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
