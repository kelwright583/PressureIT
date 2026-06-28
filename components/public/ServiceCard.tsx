import Link from "next/link";
import {
  Home,
  LayoutGrid,
  Building,
  Factory,
  Paintbrush,
  Building2,
  Palette,
  Truck,
  GraduationCap,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/db/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  LayoutGrid,
  Building,
  Factory,
  Paintbrush,
  Building2,
  Palette,
  Truck,
  GraduationCap,
  Sun,
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon ? ICON_MAP[service.icon] : null;

  return (
    <Link
      href={`/services#${service.slug}`}
      className="group block gradient-border rounded-2xl p-6 h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10"
    >
      {/* Icon */}
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20">
          <Icon className="w-6 h-6 text-accent transition-transform duration-500 group-hover:rotate-6" />
        </div>
      )}

      {/* Title */}
      <h3 className="font-display text-bone text-xl mb-2 tracking-tight">
        {service.title}
      </h3>

      {/* Description */}
      {service.short_desc && (
        <p className="text-muted text-sm leading-relaxed line-clamp-3">
          {service.short_desc}
        </p>
      )}

      {/* Hover arrow indicator */}
      <div className="mt-4 flex items-center gap-1 text-accent text-sm font-medium opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
        Learn more
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path
            d="M5 3L9 7L5 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
