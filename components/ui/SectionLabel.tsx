/** 章节标签:编号 + 标题,如 "章节 01 / 医学生"(label 由调用方传双语文案) */
export default function SectionLabel({
  label,
  index,
  title,
  accent,
}: {
  /** 前缀词,调用方传 t({ zh: "章节", en: "CHAPTER" }) */
  label: string;
  index: string;
  title: string;
  accent: "teal" | "violet" | "blue" | "gold";
}) {
  const accentText: Record<typeof accent, string> = {
    teal: "text-teal",
    violet: "text-violet",
    blue: "text-blue",
    gold: "text-gold",
  };

  return (
    <div className="flex items-baseline gap-3">
      <span className={`num text-sm font-medium tracking-widest ${accentText[accent]}`}>
        {label} {index}
      </span>
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
    </div>
  );
}
