"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendQuoteNotification, sendQuoteAcknowledgement } from "@/lib/email/resend";
import type { ActionResult } from "@/db/types";

const QuoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  service: z.string().optional(),
  area: z.string().optional(),
  message: z.string().optional(),
});

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (value === null || value === "") return undefined;
  return String(value);
}

export async function submitQuote(formData: FormData): Promise<ActionResult> {
  // Honeypot check — bots will fill this hidden field
  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    return { ok: true, message: "Quote request submitted successfully!" };
  }

  // Time-based check — form must have been open for at least 3 seconds
  const startedAt = formData.get("_started");
  if (startedAt) {
    const elapsed = Date.now() - Number(startedAt);
    if (elapsed < 3000) {
      return { ok: true, message: "Quote request submitted successfully!" };
    }
  }

  const parsed = QuoteSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: emptyToUndefined(formData.get("email")) ?? "",
    service: emptyToUndefined(formData.get("service")),
    area: emptyToUndefined(formData.get("area")),
    message: emptyToUndefined(formData.get("message")),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const insertData: Record<string, unknown> = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    status: "new" as const,
    source: "website",
  };

  if (parsed.data.email && parsed.data.email.length > 0) {
    insertData.email = parsed.data.email;
  }
  if (parsed.data.service) {
    insertData.service = parsed.data.service;
  }
  if (parsed.data.area) {
    insertData.area = parsed.data.area;
  }
  if (parsed.data.message) {
    insertData.message = parsed.data.message;
  }

  const { error } = await supabase.from("quote_requests").insert(insertData);

  if (error) {
    return { ok: false, message: "Something went wrong. Please try again or call us directly." };
  }

  // Send email notification — non-blocking, failures logged but don't break the flow
  try {
    await sendQuoteNotification({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email && parsed.data.email.length > 0 ? parsed.data.email : undefined,
      service: parsed.data.service,
      area: parsed.data.area,
      message: parsed.data.message,
    });
    // Acknowledge the customer if they provided an email
    if (parsed.data.email && parsed.data.email.length > 0) {
      await sendQuoteAcknowledgement({
        email: parsed.data.email,
        name: parsed.data.name,
      });
    }
  } catch (emailError) {
    console.error("[submitQuote] Failed to send email:", emailError);
  }

  revalidatePath("/");

  return { ok: true, message: "Quote request submitted successfully!" };
}
