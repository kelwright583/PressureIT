import { Star } from "lucide-react";
import type { Testimonial } from "@/db/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({
  testimonial,
}: TestimonialCardProps) {
  const { name, location, quote, rating } = testimonial;

  return (
    <div className="gradient-border rounded-2xl p-6 flex flex-col h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? "text-accent fill-accent"
                : "text-bone/10"
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-bone italic text-sm md:text-base leading-relaxed flex-1 mb-5">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="pt-4 border-t border-line">
        <p className="text-bone font-bold text-sm">{name}</p>
        {location && (
          <p className="text-muted text-xs mt-0.5">{location}</p>
        )}
      </div>
    </div>
  );
}
