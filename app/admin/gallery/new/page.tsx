import { createClient } from "@/lib/supabase/server";
import { BeforeAfterForm } from "../form";

export default async function NewBeforeAfterPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("slug, title")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  return (
    <BeforeAfterForm services={services ?? []} />
  );
}
