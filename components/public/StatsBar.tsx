"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

interface StatsBarProps {
  stats: StatItem[];
}

function useCountUp(
  target: number,
  shouldStart: boolean,
  duration: number = 2000
): number {
  const [current, setCurrent] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldStart) return;

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, shouldStart, duration]);

  return current;
}

function StatCounter({
  stat,
  visible,
}: {
  stat: StatItem;
  visible: boolean;
}) {
  // For "Years Experience" stat where value is 2010, compute dynamic years
  const displayTarget =
    stat.value === 2010
      ? new Date().getFullYear() - 2010
      : stat.value;

  const animatedValue = useCountUp(displayTarget, visible);

  return (
    <div className="flex flex-col items-center text-center py-6 md:py-8">
      <span className="font-display text-accent text-4xl md:text-5xl lg:text-6xl leading-none mb-2">
        {animatedValue}
        {stat.suffix && (
          <span className="text-3xl md:text-4xl lg:text-5xl">
            {stat.suffix}
          </span>
        )}
      </span>
      <span className="text-muted text-sm md:text-base uppercase tracking-wider">
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsBar({ stats }: StatsBarProps) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setVisible(true);
      }
    },
    []
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
      rootMargin: "0px 0px -50px 0px",
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection]);

  return (
    <section
      ref={containerRef}
      className="relative bg-gradient-to-r from-ink via-ink-soft to-ink border-y border-line py-4 md:py-6 overflow-hidden"
    >
      {/* Gradient glow behind stats */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/3 via-transparent to-accent/3 pointer-events-none" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid gap-4 md:gap-6 ${
            stats.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : stats.length === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {stats.map((stat, i) => (
            <StatCounter key={`${stat.label}-${i}`} stat={stat} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
