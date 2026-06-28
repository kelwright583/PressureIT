import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/db/types";
import { TestimonialForm } from "../form";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single<Testimonial>();

  if (!data) {
    notFound();
  }

  return <TestimonialForm item={data} />;
}
