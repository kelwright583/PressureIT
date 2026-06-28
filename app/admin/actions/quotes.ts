"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/db/types";

const QuoteStatusSchema = z.object({
  id: z.string().uuid("Invalid quote id"),
  status: z.enum(["new", "contacted", "quoted", "won", "lost"], {
    message: "Status must be one of: new, contacted, quoted, won, lost",
  }),
});

export async function updateQuoteStatus(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const parsed = QuoteStatusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("quote_requests")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/quotes");

  return { ok: true, message: "Quote status updated." };
}

export async function markQuoteRead(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const { error } = await supabase
    .from("quote_requests")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/quotes");
  revalidatePath("/admin");
  return { ok: true, message: "Marked as read." };
}

export async function markQuoteUnread(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const { error } = await supabase
    .from("quote_requests")
    .update({ read_at: null })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/quotes");
  revalidatePath("/admin");
  return { ok: true, message: "Marked as unread." };
}

export async function deleteQuoteRequest(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const { error } = await supabase
    .from("quote_requests")
    .delete()
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/quotes");
  revalidatePath("/admin");
  return { ok: true, message: "Quote request deleted." };
}
