"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/db/types";

const TestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  quote: z.string().min(1, "Quote is required"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  sort_order: z.coerce.number().int().default(0),
  published: z.preprocess((v) => v === "true" || v === "on", z.boolean()),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (value === null || value === "") return undefined;
  return String(value);
}

export async function createTestimonial(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const parsed = TestimonialSchema.safeParse({
    name: formData.get("name"),
    location: emptyToUndefined(formData.get("location")),
    quote: formData.get("quote"),
    rating: formData.get("rating") ?? "5",
    sort_order: formData.get("sort_order") ?? "0",
    published: formData.get("published") ?? "false",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("testimonials").insert(parsed.data);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");

  return { ok: true, message: "Testimonial created." };
}

export async function updateTestimonial(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return { ok: false, message: "Missing id." };
  }

  const parsed = TestimonialSchema.safeParse({
    name: formData.get("name"),
    location: emptyToUndefined(formData.get("location")),
    quote: formData.get("quote"),
    rating: formData.get("rating") ?? "5",
    sort_order: formData.get("sort_order") ?? "0",
    published: formData.get("published") ?? "false",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("testimonials")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");

  return { ok: true, message: "Testimonial updated." };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  if (!id) {
    return { ok: false, message: "Missing id." };
  }

  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");

  return { ok: true, message: "Testimonial deleted." };
}
