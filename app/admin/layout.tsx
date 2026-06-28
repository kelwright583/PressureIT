import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/db/types";
import { AdminShell } from "./admin-shell";

export const metadata: Metadata = {
  manifest: "/api/admin-manifest",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current pathname from proxy header (must await in Next.js 16)
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/admin";

  // Skip auth gate for the login page — it renders without the admin shell
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Check role in profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role")
    .eq("id", user.id)
    .single<Pick<Profile, "id" | "name" | "role">>();

  if (!profile || !["admin", "editor"].includes(profile.role)) {
    redirect("/admin/login?error=unauthorized");
  }

  // Fetch unread quote count for notification bell
  const { count: newQuoteCount } = await supabase
    .from("quote_requests")
    .select("*", { count: "exact", head: true })
    .is("read_at", null);

  return (
    <AdminShell
      pathname={pathname}
      userName={profile.name}
      userRole={profile.role}
      newQuoteCount={newQuoteCount ?? 0}
    >
      {children}
    </AdminShell>
  );
}
