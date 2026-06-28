"use client";

import { useState, useMemo } from "react";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";
import type { BeforeAfter } from "@/db/types";

interface GalleryItem extends BeforeAfter {
  before_image_url: string;
  after_image_url: string;
}

interface GalleryClientProps {
  items: GalleryItem[];
  services: Array<{ slug: string; title: string }>;
}

export default function GalleryClient({ items, services }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.service_slug === activeFilter);
  }, [items, activeFilter]);

  if (items.length === 0) return null;

  return (
    <>
      {/* ── Filter Tabs ── */}
      {services.length > 0 && (
        <AnimateOnScroll animation="fade-down" delay={0} duration={700}>
          <div className="flex flex-wrap justify-center gap-2 mb-12 md:mb-16">
            <button
              onClick={() => setActiveFilter("all")}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                activeFilter === "all"
                  ? "bg-accent text-ink"
                  : "bg-bone/5 border border-bone/10 text-bone hover:bg-bone/10"
              }`}
            >
              All
            </button>
            {services.map((service) => (
              <button
                key={service.slug}
                onClick={() => setActiveFilter(service.slug)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  activeFilter === service.slug
                    ? "bg-accent text-ink"
                    : "bg-bone/5 border border-bone/10 text-bone hover:bg-bone/10"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>
        </AnimateOnScroll>
      )}

      {/* ── Gallery Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {filteredItems.map((item, i) => (
          <AnimateOnScroll key={item.id} animation="scale-in" delay={i * 150} duration={700}>
            <div className="gradient-border rounded-2xl overflow-hidden space-y-3">
              <BeforeAfterSlider
                beforeImage={item.before_image_url}
                afterImage={item.after_image_url}
                title={item.title ?? undefined}
                caption={
                  [item.caption, item.location].filter(Boolean).join(" — ") ||
                  undefined
                }
              />
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* ── No Results for Filter ── */}
      {filteredItems.length === 0 && activeFilter !== "all" && (
        <div className="text-center py-12">
          <p className="text-muted text-base">
            No transformations found for this service yet.
          </p>
          <button
            onClick={() => setActiveFilter("all")}
            className="mt-4 text-accent text-sm font-medium hover:underline"
          >
            View all transformations
          </button>
        </div>
      )}
    </>
  );
}
