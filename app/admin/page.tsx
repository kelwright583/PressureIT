import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Images,
  Wrench,
  FileText,
  MessageSquareQuote,
  Plus,
  Settings,
  AlertCircle,
} from "lucide-react";

interface DashboardStat {
  label: string;
  count: number;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch counts in parallel
  const [servicesRes, galleryRes, quotesRes, quotesNewRes, testimonialsRes] =
    await Promise.all([
      supabase
        .from("services")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("before_after")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("testimonials")
        .select("id", { count: "exact", head: true }),
    ]);

  const stats: DashboardStat[] = [
    {
      label: "Services",
      count: servicesRes.count ?? 0,
      icon: <Wrench className="h-6 w-6" />,
      href: "/admin/services",
    },
    {
      label: "Before / After",
      count: galleryRes.count ?? 0,
      icon: <Images className="h-6 w-6" />,
      href: "/admin/gallery",
    },
    {
      label: "Quote Requests",
      count: quotesRes.count ?? 0,
      icon: <FileText className="h-6 w-6" />,
      href: "/admin/quotes",
      badge: quotesNewRes.count ?? 0,
    },
    {
      label: "Testimonials",
      count: testimonialsRes.count ?? 0,
      icon: <MessageSquareQuote className="h-6 w-6" />,
      href: "/admin/testimonials",
    },
  ];

  const newQuotes = quotesNewRes.count ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl tracking-tight text-accent sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Welcome back. Here is an overview of your site.
        </p>
      </div>

      {/* New quotes alert */}
      {newQuotes > 0 && (
        <Link
          href="/admin/quotes"
          className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4 transition-colors hover:bg-accent/15"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-accent" />
          <span className="text-sm font-medium text-bone">
            {newQuotes} new quote request{newQuotes !== 1 ? "s" : ""} waiting
            for review
          </span>
          <span className="ml-auto rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-ink">
            NEW
          </span>
        </Link>
      )}

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative rounded-xl border border-line bg-ink-soft p-5 transition-colors hover:border-accent/40 hover:bg-ink-soft/80"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted group-hover:text-accent transition-colors">
                {stat.icon}
              </span>
              {stat.badge !== undefined && stat.badge > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-ink">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="mt-3 font-display text-3xl tracking-tight text-bone">
              {stat.count}
            </p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-display text-xl tracking-tight text-bone">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/admin/gallery/new"
            className="flex items-center gap-3 rounded-xl border border-line bg-ink-soft px-5 py-4 text-sm font-medium text-bone transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Plus className="h-5 w-5" />
            Add Before / After
          </Link>
          <Link
            href="/admin/services/new"
            className="flex items-center gap-3 rounded-xl border border-line bg-ink-soft px-5 py-4 text-sm font-medium text-bone transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Plus className="h-5 w-5" />
            Add Service
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-xl border border-line bg-ink-soft px-5 py-4 text-sm font-medium text-bone transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Settings className="h-5 w-5" />
            Edit Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
