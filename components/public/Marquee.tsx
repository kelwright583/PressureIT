"use client";

import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  speed = 30,
  pauseOnHover = true,
  className = "",
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden relative ${className}`}
      style={
        { "--marquee-speed": `${speed}s` } as React.CSSProperties
      }
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />

      <div
        className={`flex w-max animate-marquee ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
      >
        {/* Duplicate content for seamless loop */}
        <div className="flex shrink-0 items-center gap-6 px-3">{children}</div>
        <div className="flex shrink-0 items-center gap-6 px-3" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
