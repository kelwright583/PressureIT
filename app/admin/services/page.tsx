import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/db/types";
import { ServicesList } from "./services-list";

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<Service[]>();

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-red-400">
          Failed to load services: {error.message}
        </p>
      </div>
    );
  }

  return <ServicesList items={data ?? []} />;
}
