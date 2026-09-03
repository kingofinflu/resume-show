"use client";

import { useEffect, useState } from "react";

/** 移动端检测:移动端章节降级为普通滚动 + 入场动画,不做 sticky scrubbing */
export function useIsMobile(breakpoint = 767): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
