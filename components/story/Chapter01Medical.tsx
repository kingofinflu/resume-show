"use client";

import { resume } from "@/data/resume";
import { useLocale } from "@/lib/i18n";
import { periodText } from "@/lib/format";
import { withBase } from "@/lib/site";
import Reveal from "@/components/ui/Reveal";

/** Ch01 医学生:教育时间线(数据思维从医学统计开始) */
export default function Chapter01Medical() {
  const { t } = useLocale();
  // 数据里的 "至今" 是中文常量,展示层本地化
  const endLabel = t({ zh: "至今", en: "Present" });

  return (
    <div className="relative ml-6 border-l border-line pl-6 sm:ml-0 md:pl-8">
      {resume.education.map((edu, i) => (
        <Reveal key={edu.id} delay={i * 0.15} className="relative pb-12">
          {/* 时间线节点:有校徽素材用校徽(白底方形裁圆 / 透明底按原形),否则默认 teal 圆点(资源路径必须走 withBase) */}
          {edu.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- 静态导出下按项目约定走 withBase(见 CLAUDE.md),装饰性小图无需 next/image
            <img
              src={withBase(edu.logo)}
              alt=""
              className={`absolute -left-[40px] -top-1 h-8 w-8 md:-left-[52px] md:h-10 md:w-10 ${
                edu.logoRound ? "rounded-full object-cover ring-1 ring-line" : "object-contain"
              }`}
            />
          ) : (
            <span
              aria-hidden
              className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-teal bg-bg md:-left-[39px]"
            />
          )}
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="text-xl font-bold md:text-2xl">{t(edu.title)}</h3>
            {/* 学校标签:医学青强调(teal 是本章主题色,浅色底 + 同色描边/文字) */}
            <span className="inline-block rounded-full border border-teal/30 bg-teal/10 px-2.5 py-0.5 text-xs font-medium text-teal">
              {t(edu.badge)}
            </span>
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
