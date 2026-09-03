"use client";

import { resume } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import { metricText, deltaText } from "@/lib/format";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";

/** Ch03 AI 实战:阿里夸克 AI 浏览器 4 个战役,数据重章 */
export default function Chapter03Projects() {
  const { t } = useLocale();
  const exp = resume.experiences.find((e) => e.id === "exp-alibaba");
  // 数据缺失时整章不渲染(静态构建阶段即暴露数据问题,而不是运行时抛错)
  if (!exp) return null;
  const battle = t({ zh: "战役", en: "BATTLE" });

  return (
    <div className="space-y-6">
      {/* 章节引言 */}
      <Reveal>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-2">
          {t(exp.summary)}
          <span className="mt-2 block text-ink-3">{t(resume.projectsIntro)}</span>
        </p>
      </Reveal>

      {resume.projects.map((prj, i) => (
        <Reveal key={prj.id} delay={0.1 + i * 0.1}>
          <div className="rounded-2xl border border-line bg-card p-6 md:p-8">
            {/* 战役头 */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="num text-xs font-bold tracking-widest text-blue">
                {battle} 0{i + 1}
              </span>
              <h3 className="text-xl font-bold md:text-2xl">{t(prj.title)}</h3>
            </div>
            <p className="mt-1 text-sm font-medium text-blue">{t(prj.subtitle)}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">{t(prj.summary)}</p>

            {/* 挑战 → 方案 两栏 */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-line bg-bg p-4">
                <p className="text-xs font-bold tracking-wider text-ink-3">
                  {t({ zh: "问题", en: "CHALLENGE" })}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{t(prj.challenge)}</p>
              </div>
              <div className="rounded-xl border border-teal/30 bg-bg p-4">
                <p className="text-xs font-bold tracking-wider text-teal">
                  {t({ zh: "方案", en: "SOLUTION" })}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{t(prj.solution)}</p>
              </div>
            </div>

            {/* 数据(图表组件在后续步骤接入,此处先渲染指标瓷砖) */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {prj.metrics.map((m) => (
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

            {/* 关键机制 */}
            <div className="mt-5 flex flex-wrap gap-2">
              {prj.methods.map((method) => (
                <Tag key={method.zh}>{t(method)}</Tag>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
