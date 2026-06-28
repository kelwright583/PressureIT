"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/db/types";

const LineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01),
  unit_price: z.coerce.number().min(0),
});

const QuotationSchema = z.object({
  quote_request_id: z.string().uuid(),
  notes: z.string().optional(),
  valid_days: z.coerce.number().int().min(1).default(30),
  vat_rate: z.coerce.number().min(0).default(15),
  items: z.array(LineItemSchema).min(1, "At least one line item is required"),
});

export async function saveQuotation(
  data: z.infer<typeof QuotationSchema>
): Promise<ActionResult & { quotation_id?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const parsed = QuotationSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { quote_request_id, notes, valid_days, vat_rate, items } = parsed.data;

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const vat_amount = +(subtotal * (vat_rate / 100)).toFixed(2);
  const total = +(subtotal + vat_amount).toFixed(2);

  // Check for existing quotation on this request
  const { data: existing, error: existingError } = await supabase
    .from("quotations")
    .select("id")
    .eq("quote_request_id", quote_request_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error("[saveQuotation] lookup error:", existingError);
    return { ok: false, message: "Failed to check for existing quotation." };
  }

  if (existing) {
    // Update existing quotation
    const { error: updateError } = await supabase
      .from("quotations")
      .update({
        notes: notes || null,
        valid_days,
        subtotal,
        vat_rate,
        vat_amount,
        total,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (updateError) {
      console.error("[saveQuotation] update error:", updateError);
      return { ok: false, message: updateError.message };
    }

    // Delete old items and insert new ones
    await supabase
      .from("quotation_items")
      .delete()
      .eq("quotation_id", existing.id);

    const { error: itemsError } = await supabase
      .from("quotation_items")
      .insert(
        items.map((item, i) => ({
          quotation_id: existing.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: +(item.quantity * item.unit_price).toFixed(2),
          sort_order: i,
        }))
      );

    if (itemsError) {
      console.error("[saveQuotation] items update error:", itemsError);
      return { ok: false, message: itemsError.message };
    }

    revalidatePath("/admin/quotes");
    return { ok: true, message: "Quotation updated.", quotation_id: existing.id };
  }

  // Generate quote number: PIT-YYYY-NNN
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("quotations")
    .select("*", { count: "exact", head: true });
  const seq = ((count ?? 0) + 1).toString().padStart(3, "0");
  const quote_number = `PIT-${year}-${seq}`;

  // Insert quotation
  const { data: quotation, error: qError } = await supabase
    .from("quotations")
    .insert({
      quote_request_id,
      quote_number,
      notes: notes || null,
      valid_days,
      subtotal,
      vat_rate,
      vat_amount,
      total,
    })
    .select("id")
    .single();

  if (qError || !quotation) {
    console.error("[saveQuotation] insert error:", qError);
    return { ok: false, message: qError?.message ?? "Failed to create quotation" };
  }

  // Insert line items
  const { error: itemsError } = await supabase
    .from("quotation_items")
    .insert(
      items.map((item, i) => ({
        quotation_id: quotation.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: +(item.quantity * item.unit_price).toFixed(2),
        sort_order: i,
      }))
    );

  if (itemsError) {
    console.error("[saveQuotation] items insert error:", itemsError);
    return { ok: false, message: itemsError.message };
  }

  // Update quote request status to "quoted"
  await supabase
    .from("quote_requests")
    .update({ status: "quoted" })
    .eq("id", quote_request_id);

  revalidatePath("/admin/quotes");
  return { ok: true, message: "Quotation created.", quotation_id: quotation.id };
}

export async function updateQuotationStatus(
  id: string,
  status: "draft" | "sent" | "accepted" | "rejected"
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Unauthorized" };

  const { error } = await supabase
    .from("quotations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/quotes");
  return { ok: true, message: `Quotation marked as ${status}.` };
}
