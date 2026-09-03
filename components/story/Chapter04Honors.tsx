"use client";

import { resume } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import Reveal from "@/components/ui/Reveal";

const stageNames = {
  fudan: { zh: "复旦大学 · 硕士", en: "Fudan University · Master's" },
  hust: { zh: "华中科技大学 · 本科", en: "HUST · Bachelor's" },
} as const;

const skillCategories = {
  data: { zh: "数据分析", en: "Data Analysis" },
  ai: { zh: "AI 工具", en: "AI Tools" },
  design: { zh: "产品设计", en: "Product Design" },
} as const;

/** Ch04 荣誉与技能:数据之外,还有生活 */
export default function Chapter04Honors() {
  const { t } = useLocale();

  return (
    <div className="space-y-10">
      {/* 荣誉(量化信息已在名称里,不重复渲染徽章) */}
      <div className="space-y-6">
        {(["fudan", "hust"] as const).map((stage, si) => (
          <Reveal key={stage} delay={si * 0.1}>
            <p className="mb-3 text-xs font-bold tracking-wider text-gold">{t(stageNames[stage])}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {resume.honors
                .filter((h) => h.stage === stage)
                .map((h) => (
                  <div key={h.id} className="rounded-xl border border-line bg-card px-4 py-3.5">
                    <p className="text-sm font-medium text-ink">
                      {t(h.name)}
                      {h.count !== undefined && <span className="num ml-1 text-xs text-ink-3">×{h.count}</span>}
                    </p>
                  </div>
                ))}
            </div>
          </Reveal>
        ))}
      </div>

      {/* 技能 */}
      <Reveal delay={0.2}>
        <div className="rounded-2xl border border-line bg-card p-6 md:p-8">
          <div className="space-y-5">
            {(Object.keys(skillCategories) as Array<keyof typeof skillCategories>).map((cat) => (
              <div key={cat}>
                <p className="text-xs font-bold tracking-wider text-ink-3">{t(skillCategories[cat])}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resume.skills
                    .filter((s) => s.category === cat)
                    .map((s) => (
                      <span key={s.id} className="flex items-center gap-1.5 rounded-md border border-line bg-bg px-2.5 py-1">
                        <span className="text-sm text-ink">{t(s.name)}</span>
                        <span className="num text-xs text-ink-3">{s.level}</span>
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 个人特色(emoji 图标数据驱动) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {resume.traits.map((trait, i) => (
          <Reveal key={trait.id} delay={0.1 + i * 0.1}>
            <div className="h-full rounded-xl border border-line bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-bold">
                {trait.emoji && (
                  <span aria-hidden>
                    {trait.emoji}
                  </span>
                )}
                {t(trait.title)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{t(trait.body)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
