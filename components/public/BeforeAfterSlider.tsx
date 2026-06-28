"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title?: string;
  caption?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
  caption,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((prev) => Math.max(0, prev - 2));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((prev) => Math.min(100, prev + 2));
    }
  }, []);

  // Prevent text selection while dragging
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }
    return () => {
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-2xl border border-line overflow-hidden cursor-col-resize select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="slider"
        aria-label="Before and after comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* After Image (full width, always visible behind) */}
        <div className="absolute inset-0">
          <Image
            src={afterImage}
            alt={title ? `${title} - After` : "After"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
          />
        </div>

        {/* Before Image (clipped by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <Image
            src={beforeImage}
            alt={title ? `${title} - Before` : "Before"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
          />
        </div>

        {/* Divider line — accent with animated glow */}
        <div
          className="absolute top-0 bottom-0 w-px z-10 pointer-events-none animate-slider-glow"
          style={{
            left: `${position}%`,
            transform: "translateX(-50%)",
            background: "var(--color-accent)",
          }}
        />

        {/* Drag Handle — accent glass circle with animated glow */}
        <div
          className="absolute top-1/2 z-20 pointer-events-none"
          style={{
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-10 h-10 rounded-full bg-accent/20 backdrop-blur-md border border-accent/60 flex items-center justify-center animate-slider-glow">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M5 1L1 5L5 9" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 1L15 5L11 9" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Labels — slide with the divider so they hide naturally */}
        <div
          className="absolute top-3 z-10 transition-opacity duration-200"
          style={{
            left: `${Math.min(position - 2, 50)}%`,
            transform: "translateX(-100%)",
            opacity: position > 12 ? 1 : 0,
          }}
        >
          <span className="bg-ink/70 backdrop-blur-sm text-bone text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            Before
          </span>
        </div>
        <div
          className="absolute top-3 z-10 transition-opacity duration-200"
          style={{
            left: `${Math.max(position + 2, 50)}%`,
            opacity: position < 88 ? 1 : 0,
          }}
        >
          <span className="bg-ink/70 backdrop-blur-sm text-bone text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
            After
          </span>
        </div>
      </div>

      {/* Title & Caption */}
      {(title || caption) && (
        <div className="mt-2 px-3 pb-4">
          {title && (
            <h3 className="font-display text-bone text-lg leading-tight">{title}</h3>
          )}
          {caption && <p className="text-muted text-sm mt-0.5">{caption}</p>}
        </div>
      )}
    </div>
  );
}
