"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/db/types";

const StatItemSchema = z.object({
  label: z.string(),
  value: z.number(),
  suffix: z.string().optional(),
});

const SettingsSchema = z.object({
  hero_eyebrow: z.string().min(1, "Hero eyebrow is required"),
  hero_line1: z.string().min(1, "Hero line 1 is required"),
  hero_line2: z.string().min(1, "Hero line 2 is required"),
  hero_line3: z.string().min(1, "Hero line 3 is required"),
  hero_subtitle: z.string().min(1, "Hero subtitle is required"),
  hero_image: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Valid email is required"),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  facebook_url: z.string().url("Valid Facebook URL is required"),
  service_areas: z.preprocess(
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
  stats: z.preprocess(
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
    z.array(StatItemSchema)
  ),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (value === null || value === "") return undefined;
  return String(value);
}

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const parsed = SettingsSchema.safeParse({
    hero_eyebrow: formData.get("hero_eyebrow"),
    hero_line1: formData.get("hero_line1"),
    hero_line2: formData.get("hero_line2"),
    hero_line3: formData.get("hero_line3"),
    hero_subtitle: formData.get("hero_subtitle"),
    hero_image: emptyToUndefined(formData.get("hero_image")),
    phone: formData.get("phone"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    facebook_url: formData.get("facebook_url"),
    service_areas: formData.get("service_areas") ?? "[]",
    stats: formData.get("stats") ?? "[]",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("site_settings")
    .update(parsed.data)
    .eq("id", true);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");

  return { ok: true, message: "Settings updated." };
}
