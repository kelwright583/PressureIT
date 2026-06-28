"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Animation =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-in"
  | "scale-in"
  | "blur-in";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const ANIMATION_STYLES: Record<Animation, { from: string; to: string }> = {
  "fade-up": {
    from: "opacity-0 translate-y-8",
    to: "opacity-100 translate-y-0",
  },
  "fade-down": {
    from: "opacity-0 -translate-y-8",
    to: "opacity-100 translate-y-0",
  },
  "fade-left": {
    from: "opacity-0 translate-x-8",
    to: "opacity-100 translate-x-0",
  },
  "fade-right": {
    from: "opacity-0 -translate-x-8",
    to: "opacity-100 translate-x-0",
  },
  "fade-in": {
    from: "opacity-0",
    to: "opacity-100",
  },
  "scale-in": {
    from: "opacity-0 scale-95",
    to: "opacity-100 scale-100",
  },
  "blur-in": {
    from: "opacity-0 blur-sm",
    to: "opacity-100 blur-0",
  },
};

export default function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
  threshold = 0.15,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [threshold, once]);

  const styles = ANIMATION_STYLES[animation];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${isVisible ? styles.to : styles.from} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function StaggerChildren({
  children,
  animation = "fade-up",
  staggerMs = 100,
  duration = 600,
  className = "",
  childClassName = "",
  threshold = 0.1,
}: {
  children: ReactNode[];
  animation?: Animation;
  staggerMs?: number;
  duration?: number;
  className?: string;
  childClassName?: string;
  threshold?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <AnimateOnScroll
          key={i}
          animation={animation}
          delay={i * staggerMs}
          duration={duration}
          className={childClassName}
          threshold={threshold}
        >
          {child}
        </AnimateOnScroll>
      ))}
    </div>
  );
}
