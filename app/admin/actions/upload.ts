"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/db/types";

const RecordMediaSchema = z.object({
  storage_path: z.string().min(1, "Storage path is required"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export async function recordMediaAsset(data: {
  storage_path: string;
  width?: number;
  height?: number;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const parsed = RecordMediaSchema.safeParse(data);

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("media_assets").insert({
    storage_path: parsed.data.storage_path,
    uploaded_by: user.id,
    width: parsed.data.width ?? null,
    height: parsed.data.height ?? null,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: parsed.data.storage_path };
}

export async function deleteMediaAsset(storagePath: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  if (!storagePath) {
    return { ok: false, message: "Missing storage path." };
  }

  // Delete from media_assets table
  const { error: dbError } = await supabase
    .from("media_assets")
    .delete()
    .eq("storage_path", storagePath);

  if (dbError) {
    return { ok: false, message: dbError.message };
  }

  // Delete from Supabase storage bucket
  const { error: storageError } = await supabase.storage
    .from("media")
    .remove([storagePath]);

  if (storageError) {
    return { ok: false, message: storageError.message };
  }

  return { ok: true, message: "Media asset deleted." };
}
