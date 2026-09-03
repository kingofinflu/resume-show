"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** 顶部滚动进度线(teal) */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="print:hidden fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-teal"
      style={{ scaleX }}
    />
  );
}
