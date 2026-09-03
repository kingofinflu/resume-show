"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { fadeUp, onceViewport } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** 延迟秒数(编排用) */
  delay?: number;
  /** 入场动画 variants,默认 fadeUp */
  variants?: Variants;
}

/**
 * 全站入场动画唯一入口:whileInView 触发一次。
 * 统一挂 data-animate 属性 —— @media print 靠它把未入视口的动画元素强制显示。
 * 尊重系统"减少动态效果"设置。
 */
export default function Reveal({ children, className, delay = 0, variants = fadeUp }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      data-animate
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={onceViewport}
      variants={variants}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
