import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function yearsSince(year: number): number {
  return new Date().getFullYear() - year;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getSupabasePublicUrl(path: string, supabaseUrl: string): string {
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}
