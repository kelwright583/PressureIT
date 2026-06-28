"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Clock, HardHat, ThumbsUp } from "lucide-react";

interface HeroProps {
  hero_eyebrow: string;
  hero_line1: string;
  hero_line2: string;
  hero_line3: string;
  hero_subtitle: string;
  hero_image: string | null;
}

const TRUST_ITEMS = [
  { icon: Clock, label: "Since 2010" },
  { icon: Shield, label: "Fully Insured" },
  { icon: HardHat, label: "Supervisor on Site" },
  { icon: ThumbsUp, label: "100% Satisfaction" },
] as const;

export default function Hero({
  hero_eyebrow,
  hero_line1,
  hero_line2,
  hero_line3,
  hero_subtitle,
  hero_image,
}: HeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so the entrance animation plays after paint
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden grain">
      {/* Background Image */}
      {hero_image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={hero_image}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
        </div>
      )}

      {/* Gradient orbs (visible when no hero image) */}
      {!hero_image && (
        <>
          <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[180px] pointer-events-none animated-gradient" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 md:pb-24 w-full">
        {/* Eyebrow */}
        <p
          className={`text-muted uppercase tracking-[0.25em] text-xs md:text-sm mb-4 md:mb-6 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {hero_eyebrow}
        </p>

        {/* Headline — each line staggers in */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-tight mb-6 md:mb-8">
          <span
            className={`text-bone block transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {hero_line1}
          </span>
          <span
            className={`text-bone block transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            {hero_line2}
          </span>
          <span
            className={`text-gradient block transition-all duration-1000 ease-out ${
              mounted
                ? "opacity-100 scale-100 blur-0 translate-y-0"
                : "opacity-0 scale-50 blur-md translate-y-4"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            {hero_line3}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`text-muted text-lg md:text-xl max-w-2xl mb-8 md:mb-10 leading-relaxed transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "650ms" }}
        >
          {hero_subtitle}
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mb-12 md:mb-16 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <Link
            href="/quote"
            className="glow-accent inline-flex items-center justify-center bg-accent text-ink font-bold rounded-full px-8 py-4 text-base md:text-lg transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-lg shadow-accent/25"
          >
            Get a Free Quote
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center border border-bone/20 text-bone font-medium rounded-full px-8 py-4 text-base md:text-lg transition-all hover:bg-bone/5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 active:scale-95"
          >
            See the Transformations
          </Link>
        </div>

        {/* Trust Strip */}
        <div
          className={`flex flex-wrap gap-3 md:gap-4 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "950ms" }}
        >
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-gradient-to-br from-bone/8 to-bone/3 border border-bone/10 rounded-full px-4 py-2 text-xs md:text-sm text-muted backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:text-bone"
                style={{ transitionDelay: `${950 + i * 80}ms` }}
              >
                <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
