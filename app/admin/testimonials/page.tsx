import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/db/types";
import { TestimonialsList } from "./testimonials-list";

export default async function TestimonialsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<Testimonial[]>();

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-red-400">
          Failed to load testimonials: {error.message}
        </p>
      </div>
    );
  }

  return <TestimonialsList items={data ?? []} />;
}
