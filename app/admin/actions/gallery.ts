"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/db/types";

const BeforeAfterSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  service_slug: z.string().optional(),
  location: z.string().optional(),
  before_image: z.string().min(1, "Before image is required"),
  after_image: z.string().min(1, "After image is required"),
  sort_order: z.coerce.number().int().default(0),
  featured: z.preprocess((v) => v === "true" || v === "on", z.boolean()),
  published: z.preprocess((v) => v === "true" || v === "on", z.boolean()),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (value === null || value === "") return undefined;
  return String(value);
}

export async function createBeforeAfter(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const parsed = BeforeAfterSchema.safeParse({
    title: emptyToUndefined(formData.get("title")),
    caption: emptyToUndefined(formData.get("caption")),
    service_slug: emptyToUndefined(formData.get("service_slug")),
    location: emptyToUndefined(formData.get("location")),
    before_image: formData.get("before_image"),
    after_image: formData.get("after_image"),
    sort_order: formData.get("sort_order") ?? "0",
    featured: formData.get("featured") ?? "false",
    published: formData.get("published") ?? "false",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("before_after").insert(parsed.data);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/gallery");

  return { ok: true, message: "Before/after entry created." };
}

export async function updateBeforeAfter(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return { ok: false, message: "Missing id." };
  }

  const parsed = BeforeAfterSchema.safeParse({
    title: emptyToUndefined(formData.get("title")),
    caption: emptyToUndefined(formData.get("caption")),
    service_slug: emptyToUndefined(formData.get("service_slug")),
    location: emptyToUndefined(formData.get("location")),
    before_image: formData.get("before_image"),
    after_image: formData.get("after_image"),
    sort_order: formData.get("sort_order") ?? "0",
    featured: formData.get("featured") ?? "false",
    published: formData.get("published") ?? "false",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("before_after")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/gallery");

  return { ok: true, message: "Before/after entry updated." };
}

export async function deleteBeforeAfter(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  if (!id) {
    return { ok: false, message: "Missing id." };
  }

  const { error } = await supabase.from("before_after").delete().eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/gallery");

  return { ok: true, message: "Before/after entry deleted." };
}
