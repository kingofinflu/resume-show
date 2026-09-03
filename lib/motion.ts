import type { Transition, Variants } from "motion/react";

/** 全站共享的入场动画 variants,组件不要自写重复定义 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

/** 从左侧滑入(时间线用) */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0 },
};

/** 通用过渡:弹性感 */
export const spring: Transition = { type: "spring", stiffness: 120, damping: 20 };

/** 缓出过渡 */
export const easeOut: Transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

/** 视口触发配置:进入一次后不再重复 */
export const onceViewport = { once: true, margin: "-10% 0px" } as const;
