"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Final value to count up to. */
  end: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to show (e.g. 1 for 4.9). */
  decimals?: number;
  /** Number grouping locale — "en-IN" gives 1,20,000; "en-US" gives 120,000. */
  locale?: string;
  /** Animation duration in ms. */
  duration?: number;
  className?: string;
}

/** Animates from 0 → end the first time it scrolls into view. */
export function CountUp({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  locale = "en-IN",
  duration = 1600,
  className,
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setValue(end * eased);
        if (t < 1) requestAnimationFrame(step);
        else setValue(end);
      };
      requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === "undefined") {
      animate();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          animate();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  const display = value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
