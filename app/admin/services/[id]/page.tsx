import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/db/types";
import { ServiceForm } from "../form";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single<Service>();

  if (!data) {
    notFound();
  }

  return <ServiceForm item={data} />;
}
