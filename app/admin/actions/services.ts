"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/db/types";

const ServiceSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  short_desc: z.string().optional(),
  body: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  features: z.preprocess(
    (v) => {
      if (Array.isArray(v)) return v;
      if (typeof v === "string" && v.trim()) {
        try {
          const parsed = JSON.parse(v);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    },
    z.array(z.string())
  ),
  sort_order: z.coerce.number().int().default(0),
  published: z.preprocess((v) => v === "true" || v === "on", z.boolean()),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (value === null || value === "") return undefined;
  return String(value);
}

export async function createService(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const parsed = ServiceSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    short_desc: emptyToUndefined(formData.get("short_desc")),
    body: emptyToUndefined(formData.get("body")),
    icon: emptyToUndefined(formData.get("icon")),
    image: emptyToUndefined(formData.get("image")),
    features: formData.get("features") ?? "[]",
    sort_order: formData.get("sort_order") ?? "0",
    published: formData.get("published") ?? "false",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("services").insert(parsed.data);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/services");

  return { ok: true, message: "Service created." };
}

export async function updateService(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const id = formData.get("id");
  if (!id || typeof id !== "string") {
    return { ok: false, message: "Missing id." };
  }

  const parsed = ServiceSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    short_desc: emptyToUndefined(formData.get("short_desc")),
    body: emptyToUndefined(formData.get("body")),
    icon: emptyToUndefined(formData.get("icon")),
    image: emptyToUndefined(formData.get("image")),
    features: formData.get("features") ?? "[]",
    sort_order: formData.get("sort_order") ?? "0",
    published: formData.get("published") ?? "false",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("services")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/services");

  return { ok: true, message: "Service updated." };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  if (!id) {
    return { ok: false, message: "Missing id." };
  }

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/services");

  return { ok: true, message: "Service deleted." };
}
