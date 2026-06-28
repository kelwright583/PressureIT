import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { QuoteRequest, Quotation, QuotationItem } from "@/db/types";
import { QuoteBuilder } from "./quote-builder";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the quote request
  const { data: request } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .single<QuoteRequest>();

  if (!request) notFound();

  // Fetch existing quotation + items if any
  const { data: quotation } = await supabase
    .from("quotations")
    .select("*")
    .eq("quote_request_id", id)
    .maybeSingle<Quotation>();

  let items: QuotationItem[] = [];
  if (quotation) {
    const { data } = await supabase
      .from("quotation_items")
      .select("*")
      .eq("quotation_id", quotation.id)
      .order("sort_order")
      .returns<QuotationItem[]>();
    items = data ?? [];
  }

  // Fetch company info for the quote
  const { data: settings } = await supabase
    .from("site_settings")
    .select("phone, email")
    .limit(1)
    .single();

  return (
    <QuoteBuilder
      request={request}
      existingQuotation={quotation}
      existingItems={items}
      companyPhone={settings?.phone ?? "074 851 8879"}
      companyEmail={settings?.email ?? "sharon@pressure-it.co.za"}
    />
  );
}
