"use client";

import { resume } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import MetricBars from "@/components/viz/MetricBars";
import DataTable from "@/components/viz/DataTable";

/** Ch03 AI 实战:阿里夸克 AI 浏览器 4 个阶段,数据重章 */
export default function Chapter03Projects() {
  const { t } = useLocale();
  const exp = resume.experiences.find((e) => e.id === "exp-alibaba");
  // 数据缺失时整章不渲染(静态构建阶段即暴露数据问题,而不是运行时抛错)
  if (!exp) return null;
  const stage = t({ zh: "阶段", en: "STAGE" });

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
            {/* 阶段头 */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="num text-xs font-bold tracking-widest text-blue">
                {stage} 0{i + 1}
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

            {/* 数据:条形图 + 折叠数据表 */}
            <div className="mt-5 rounded-xl border border-line bg-bg px-4 py-4">
              <MetricBars metrics={prj.metrics} />
              <DataTable metrics={prj.metrics} />
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
