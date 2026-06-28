import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/db/types";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .single<SiteSettings>();

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-red-400">
          Failed to load settings: {error?.message ?? "No settings found."}
        </p>
      </div>
    );
  }

  return <SettingsForm settings={data} />;
}
