"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { formatValue } from "@/lib/format";

interface CountUpProps {
  value: number;
  /** 小数位,默认 2(全站统一) */
  precision?: number;
  /** 单位后缀 */
  unit?: string;
  /** 非数字文案(如 "0→1",须为非空字符串):有值时直接静态展示,不做滚动动画 */
  display?: string;
  className?: string;
  /** 滚动到位时回调(用于同步显示配套元素,如 delta 徽章) */
  onDone?: () => void;
}

/**
 * 大数字滚动计数:进入视口时从 0 滚到目标值(带阻尼感)。
 *
 * 重要不变量(改代码前必读):
 * - React 渲染的文本节点永远是最终值(SSR/静态导出输出真实数字,爬虫/预览/无 JS 环境
 *   看到的是正确值);进入视口后 effect 先把 textContent 写成 0,再通过 spring 逐帧覆写。
 *   因此该组件的 React 渲染字符串必须恒定 —— 若 unit/precision 变成运行时可变,
 *   React 重渲染会把显示拽回初始值,需改用别的方案(如完全脱离 React 的节点)。
 * - 数字滚动 span 永久 aria-hidden,最终值由旁边的 sr-only 文本承载(滚动中读 0.00% 会误导)。
 * - 减少动态效果用户:不滚动,直接保持 SSR 的最终值。
 * - display 文案(如 "0→1")是渲染期恒定字符串,直接静态展示,两个 effect 均跳过。
 */
export default function CountUp({ value, precision = 2, unit = "", display, className, onDone }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion() ?? false;
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });
  // onDone 放 ref,回调身份变化不触发重订阅;触发一次后清空
  const onDoneRef = useRef(onDone);
  // ref 写入放 effect(react-hooks/refs 规范:渲染期不写 ref)
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const finalText = display ?? `${formatValue(value, precision)}${unit}`;

  useEffect(() => {
    if (!inView || display) return;
    if (reduce) {
      onDoneRef.current?.();
      onDoneRef.current = undefined;
      return;
    }
    // 先写 0,再从 0 滚动(SSR 文本是最终值)
    if (ref.current) ref.current.textContent = `${formatValue(0, precision)}${unit}`;
    mv.set(value);
  }, [inView, reduce, value, mv, precision, unit, display]);

  useEffect(() => {
    if (reduce || display) return;
    const epsilon = Math.max(0.01, 0.5 * 10 ** -precision);
    const unsubscribe = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${formatValue(v, precision)}${unit}`;
      if (onDoneRef.current && Math.abs(v - value) <= epsilon) {
        onDoneRef.current();
        onDoneRef.current = undefined;
      }
    });
    return unsubscribe;
  }, [spring, reduce, precision, unit, value, display]);

  return (
    <>
      <span ref={ref} data-animate className={className} aria-hidden>
        {finalText}
      </span>
      {/* 可访问文本:最终值,滚动过程不干扰屏幕阅读器 */}
      <span className="sr-only">{finalText}</span>
    </>
  );
}
