import { createClient } from "@/lib/supabase/server";
import type { BeforeAfter } from "@/db/types";
import { GalleryList } from "./gallery-list";

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("before_after")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<BeforeAfter[]>();

  if (error) {
    return (
      <div className="mx-auto max-w-5xl">
        <p className="text-red-400">Failed to load gallery: {error.message}</p>
      </div>
    );
  }

  return <GalleryList items={data ?? []} />;
}
