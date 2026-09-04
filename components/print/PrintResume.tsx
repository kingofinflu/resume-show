"use client";

import { resume, type TimelineItem } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import { periodText, rangeText, deltaText } from "@/lib/format";

const skillCategories = {
  data: { zh: "数据分析", en: "Data Analysis" },
  ai: { zh: "AI 工具", en: "AI Tools" },
  design: { zh: "产品设计", en: "Product Design" },
} as const;

/**
 * 打印版传统 A4 简历(print-only,由 page.tsx 的 hidden print:block 切换)。
 * 与网页版共用同一份数据源 —— 改 data/resume.ts 两边同步更新。
 * 跟随当前语言;分节 break-inside: avoid 防拦腰截断。
 */
export default function PrintResume() {
  const { t, locale } = useLocale();
  const endLabel = t({ zh: "至今", en: "Present" });
  // 双语时间区间(数据里的 "至今" 是中文常量,展示层本地化)
  const period = (item: TimelineItem) => periodText(item.start, item.end, item.current ? endLabel : undefined);
  // 枚举分隔符跟随语言
  const sep = locale === "zh" ? "、" : ", ";

  return (
    <div className="bg-white text-[11px] leading-relaxed text-ink">
      {/* 头部 */}
      <header className="break-inside-avoid border-b-2 border-ink pb-3">
        <h1 className="text-xl font-bold">
          {t(resume.contact.name)} · {t(resume.contact.title)}
        </h1>
        <p className="mt-1 text-ink-2">
          {resume.contact.phone} | {resume.contact.email} | {t(resume.contact.tagline)}
        </p>
        <p className="mt-1 text-ink-2">{t(resume.summary)}</p>
      </header>

      {/* 教育背景 */}
      <section className="mt-4">
        <h2 className="text-sm font-bold">
          {t({ zh: "教育背景", en: "EDUCATION" })}
        </h2>
        {resume.education.map((edu) => (
          <div key={edu.id} className="mt-2 break-inside-avoid">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold">
                {t(edu.title)} · {t(edu.major)} · {t(edu.subtitle)}
              </p>
              <p className="num text-ink-2">{period(edu)}</p>
            </div>
            <p className="text-ink-2">
              {t({ zh: "主修课程", en: "Courses" })}:{edu.courses.map((c) => t(c)).join(sep)}
            </p>
          </div>
        ))}
      </section>

      {/* 实习经历 */}
      <section className="mt-4">
        <h2 className="text-sm font-bold">
          {t({ zh: "实习经历", en: "INTERNSHIPS" })}
        </h2>
        {resume.experiences.map((exp) => (
          <div key={exp.id} className="mt-2 break-inside-avoid">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold">
                {t(exp.company)} · {t(exp.subtitle)}
              </p>
              <p className="num text-ink-2">{period(exp)}</p>
            </div>
            <p className="text-ink-2">{t(exp.summary)}</p>
            <ul className="mt-1 list-disc pl-4 text-ink-2">
              {exp.achievements.map((a, i) => (
                <li key={i}>{t(a)}</li>
              ))}
            </ul>
            {/* 指标表(数据表视图:行首列是行头,带可访问名称) */}
            <table className="mt-1.5 w-full border-collapse text-ink-2" aria-label={t({ zh: "关键指标", en: "Key metrics" })}>
              <tbody>
                {exp.metrics.map((m) => (
                  <tr key={m.id}>
                    <th scope="row" className="w-2/5 border border-line px-1.5 py-0.5 text-left font-normal">
                      {t(m.label)}
                    </th>
                    <td className="num border border-line px-1.5 py-0.5">{m.isDelta ? deltaText(m) : rangeText(m)}</td>
                    <td className="border border-line px-1.5 py-0.5">{t(m.description)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      {/* 项目经历(4 个阶段) */}
      <section className="mt-4">
        <h2 className="text-sm font-bold">
          {t({ zh: "项目经历", en: "PROJECTS" })}
        </h2>
        {resume.projects.map((prj) => (
          <div key={prj.id} className="mt-2 break-inside-avoid">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold">{t(prj.title)}</p>
              <p className="num text-ink-2">{period(prj)}</p>
            </div>
            <p className="text-ink-2">{t(prj.summary)}</p>
            <p className="text-ink-2">
              <span className="font-semibold">{t({ zh: "问题", en: "Challenge" })}:</span> {t(prj.challenge)}
            </p>
            <p className="text-ink-2">
              <span className="font-semibold">{t({ zh: "方案", en: "Solution" })}:</span> {t(prj.solution)}
            </p>
            <table className="mt-1.5 w-full border-collapse text-ink-2" aria-label={t({ zh: "关键指标", en: "Key metrics" })}>
              <tbody>
                {prj.metrics.map((m) => (
                  <tr key={m.id}>
                    <th scope="row" className="w-2/5 border border-line px-1.5 py-0.5 text-left font-normal">
                      {t(m.label)}
                    </th>
                    <td className="num border border-line px-1.5 py-0.5">{m.isDelta ? deltaText(m) : rangeText(m)}</td>
                    <td className="border border-line px-1.5 py-0.5">{t(m.description)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      {/* 荣誉 */}
      <section className="mt-4">
        <h2 className="text-sm font-bold">
          {t({ zh: "荣誉", en: "HONORS" })}
        </h2>
        <div className="mt-1 grid grid-cols-2 gap-x-4">
          {resume.honors.map((h) => (
            <p key={h.id} className="break-inside-avoid text-ink-2">
              · {t(h.name)}
              {h.count !== undefined ? ` ×${h.count}` : ""}
            </p>
          ))}
        </div>
      </section>

      {/* 技能与自我评价 */}
      <section className="mt-4">
        <h2 className="text-sm font-bold">
          {t({ zh: "技能与自我评价", en: "SKILLS & SELF-ASSESSMENT" })}
        </h2>
        <p className="mt-1 break-inside-avoid text-ink-2">
          {t({ zh: "技能", en: "Skills" })}:
          {(Object.keys(skillCategories) as Array<keyof typeof skillCategories>)
            .map(
              (cat) =>
                `${t(skillCategories[cat])}:${resume.skills
                  .filter((s) => s.category === cat)
                  .map((s) => t(s.name))
                  .join(sep)}`,
            )
            .join(locale === "zh" ? ";" : "; ")}
        </p>
        <div className="mt-1 space-y-1">
          {resume.traits.map((trait) => (
            <p key={trait.id} className="break-inside-avoid text-ink-2">
              <span className="font-semibold">{t(trait.title)}:</span> {t(trait.body)}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
