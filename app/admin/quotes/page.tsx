import { createClient } from "@/lib/supabase/server";
import type { QuoteRequest } from "@/db/types";
import { QuotesInbox } from "./quotes-inbox";

export default async function QuotesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<QuoteRequest[]>();

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-red-400">
          Failed to load quotes: {error.message}
        </p>
      </div>
    );
  }

  return <QuotesInbox items={data ?? []} />;
}
