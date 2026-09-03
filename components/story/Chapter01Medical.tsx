"use client";

import { resume } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import { periodText } from "@/lib/format";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";

/** Ch01 医学生:教育时间线(数据思维从医学统计开始) */
export default function Chapter01Medical() {
  const { t } = useLocale();
  // 数据里的 "至今" 是中文常量,展示层本地化
  const endLabel = t({ zh: "至今", en: "Present" });

  return (
    <div className="relative border-l border-line pl-6 md:pl-8">
      {resume.education.map((edu, i) => (
        <Reveal key={edu.id} delay={i * 0.15} className="relative pb-12">
          {/* 时间线节点 */}
          <span
            aria-hidden
            className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-teal bg-bg md:-left-[39px]"
          />
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="text-xl font-bold md:text-2xl">{t(edu.title)}</h3>
            <Tag>{t(edu.badge)}</Tag>
            <span className="num text-sm text-ink-3">{periodText(edu.start, edu.end, edu.current ? endLabel : undefined)}</span>
          </div>
          <p className="mt-1 text-sm text-ink-2">
            {t(edu.subtitle)} · {t(edu.major)}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {edu.courses.map((course) => (
              <span key={course.zh} className="rounded-md border border-line bg-card px-2.5 py-1 text-xs text-ink-2">
                {t(course)}
              </span>
            ))}
          </div>
        </Reveal>
      ))}

      {/* 一句话收束(数据驱动,不在组件里写死) */}
      <Reveal delay={0.3}>
        <div className="mt-10 rounded-xl border border-line bg-card p-5">
          <p className="text-sm leading-relaxed text-ink-2">{t(resume.educationOutro)}</p>
        </div>
      </Reveal>
    </div>
  );
}
