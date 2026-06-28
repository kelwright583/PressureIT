import { createClient } from "@/lib/supabase/server";
import { QuotationsList } from "./quotations-list";

export default async function QuotationsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotations")
    .select("*, quote_requests(name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-red-400">
          Failed to load quotations: {error.message}
        </p>
      </div>
    );
  }

  const items = (data ?? []).map((q: Record<string, unknown>) => {
    const qr = q.quote_requests as { name: string; email: string | null } | null;
    return {
      ...q,
      customer_name: qr?.name ?? "Unknown",
      customer_email: qr?.email ?? null,
    };
  });

  return <QuotationsList items={items as never} />;
}
