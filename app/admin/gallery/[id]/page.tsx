import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BeforeAfter } from "@/db/types";
import { BeforeAfterForm } from "../form";

export default async function EditBeforeAfterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [itemRes, servicesRes] = await Promise.all([
    supabase
      .from("before_after")
      .select("*")
      .eq("id", id)
      .single<BeforeAfter>(),
    supabase
      .from("services")
      .select("slug, title")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (!itemRes.data) {
    notFound();
  }

  return (
    <BeforeAfterForm
      item={itemRes.data}
      services={servicesRes.data ?? []}
    />
  );
}
