"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

export function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const stepTime = end > 0 ? Math.abs(Math.floor(duration / end)) : duration;

      const timer = setInterval(() => {
        start += 1;
        setValue(start);
        if (start >= end) {
          setValue(end);
          clearInterval(timer);
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
