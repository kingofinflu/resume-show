"use client";

import { motion } from "motion/react";
import type { Skill } from "@/data/resume";
import { useLocale } from "@/lib/i18n";

const CX = 160;
const CY = 160;
const R = 92;

/** 第 i 个轴(共 n 个)的角度:从正上方顺时针 */
function angleOf(i: number, n: number): number {
  return (2 * Math.PI * i) / n - Math.PI / 2;
}

function pointOf(i: number, n: number, radius: number): [number, number] {
  const a = angleOf(i, n);
  return [CX + radius * Math.cos(a), CY + radius * Math.sin(a)];
}

/**
 * SVG 雷达图(单序列,建议 ≤6 轴):
 * - 数据多边形 teal 填充 + 描线动画,网格 4 环
 * - 每轴直接标注技能名 + 分值,无图例
 */
export default function SkillRadar({ skills }: { skills: Skill[] }) {
  const { t } = useLocale();
  const n = skills.length;
  if (n < 3) return null;

  // 网格:4 个同心多边形(25/50/75/100)
  const rings = [0.25, 0.5, 0.75, 1].map((r) =>
    Array.from({ length: n }, (_, i) => pointOf(i, n, R * r).join(",")).join(" "),
  );
  // 轴辐线
  const spokes = Array.from({ length: n }, (_, i) => {
    const [x, y] = pointOf(i, n, R);
    return { x1: CX, y1: CY, x2: x, y2: y };
  });
  // 数据多边形
  const dataPts = skills.map((s, i) => pointOf(i, n, (s.level / 100) * R));
  const dataPath = dataPts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ") + " Z";
  // role="img" 会吞掉内部文字,把数值拼进 aria-label 保证可访问
  const ariaLabel =
    t({ zh: "技能雷达图", en: "Skill radar chart" }) +
    ":" +
    skills.map((s) => `${t(s.name)} ${s.level}`).join(", ");

  return (
    <svg
      viewBox="0 0 320 320"
      className="mx-auto w-full max-w-sm"
      role="img"
      aria-label={ariaLabel}
    >
      {rings.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="var(--line)" strokeWidth="1" />
      ))}
      {spokes.map((s, i) => (
        <line key={i} {...s} stroke="var(--line)" strokeWidth="1" />
      ))}

      {/* 数据多边形 */}
      <motion.path
        data-animate
        d={dataPath}
        fill="var(--teal)"
        fillOpacity="0.15"
        stroke="var(--teal)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {dataPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--teal)" />
      ))}

      {/* 轴标签:技能名 + 分值 */}
      {skills.map((s, i) => {
        const a = angleOf(i, n);
        const lx = CX + (R + 26) * Math.cos(a);
        const ly = CY + (R + 26) * Math.sin(a) + 4;
        // 根据角度决定文字锚点;±60° 的侧轴也居中锚定(侧轴多词标签离边缘太近会裁剪)
        const anchor = Math.abs(Math.cos(a)) < 0.6 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
        return (
          <text
            key={s.id}
            x={lx}
            y={ly}
            textAnchor={anchor}
            className="fill-ink-2"
            style={{ fontSize: "11px" }}
          >
            <tspan x={lx} dy="-0.2em">
              {t(s.name)}
            </tspan>
            <tspan x={lx} dy="1.3em" className="num fill-ink-3" style={{ fontSize: "10px" }}>
              {s.level}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}
