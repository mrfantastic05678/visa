"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

export function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 700,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const directionStyles: Record<string, string> = {
      up: "translateY(16px)",
      down: "translateY(-16px)",
      left: "translateX(16px)",
      right: "translateX(-16px)",
      none: "none",
    };

    el.style.opacity = "0";
    el.style.transform = directionStyles[direction];
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.33, 1, 0.68, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1) ${delay}ms`;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, direction, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
