"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  PenLine,
} from "lucide-react";
import { updateQuoteStatus } from "@/app/admin/actions/quotes";
import type { QuoteRequest } from "@/db/types";

type Status = QuoteRequest["status"];

const STATUS_CONFIG: Record<
  Status,
  { label: string; bg: string; text: string }
> = {
  new: { label: "New", bg: "bg-yellow-500/15", text: "text-yellow-400" },
  contacted: {
    label: "Contacted",
    bg: "bg-blue-500/15",
    text: "text-blue-400",
  },
  quoted: {
    label: "Quoted",
    bg: "bg-purple-500/15",
    text: "text-purple-400",
  },
  won: { label: "Won", bg: "bg-green-500/15", text: "text-green-400" },
  lost: { label: "Lost", bg: "bg-red-500/15", text: "text-red-400" },
};

const STATUSES: Status[] = ["new", "contacted", "quoted", "won", "lost"];

function stripPhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "");
}

function whatsappUrl(phone: string): string {
  const stripped = stripPhone(phone).replace(/^\+/, "");
  return `https://wa.me/${stripped}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function QuotesInbox({ items }: { items: QuoteRequest[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const newCount = items.filter((q) => q.status === "new").length;

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  function handleStatusChange(id: string, status: Status) {
    setUpdatingId(id);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      formData.set("status", status);
      const result = await updateQuoteStatus(formData);
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setUpdatingId(null);
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl tracking-tight text-accent sm:text-4xl">
              Quote Requests
            </h1>
            {newCount > 0 && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">
                {newCount} NEW
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {items.length} total request{items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-line bg-ink-soft p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted" />
          <p className="text-muted">No quote requests yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const expanded = expandedId === item.id;
            const config = STATUS_CONFIG[item.status];
            const isUpdating = updatingId === item.id;

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-line bg-ink-soft transition-colors hover:border-line"
              >
                {/* Row header - clickable */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left sm:gap-4"
                >
                  {/* Status badge */}
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}
                  >
                    {config.label}
                  </span>

                  {/* Name + service */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-bone">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {[item.service, item.area]
                        .filter(Boolean)
                        .join(" - ") || "No details"}
                    </p>
                  </div>

                  {/* Date */}
                  <span className="hidden shrink-0 text-xs text-muted sm:block">
                    {formatDate(item.created_at)}
                  </span>

                  {/* Expand icon */}
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
                  )}
                </button>

                {/* Expanded detail */}
                {expanded && (
                  <div className="space-y-4 border-t border-line bg-ink px-4 py-4 sm:px-6">
                    {/* Contact row */}
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`tel:${stripPhone(item.phone)}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-ink-soft px-4 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-line"
                      >
                        <Phone className="h-4 w-4 text-accent" />
                        {item.phone}
                      </a>
                      {item.email && (
                        <a
                          href={`mailto:${item.email}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-ink-soft px-4 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-line"
                        >
                          <Mail className="h-4 w-4 text-accent" />
                          {item.email}
                        </a>
                      )}
                      <a
                        href={whatsappUrl(item.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600/20 px-4 py-2.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-600/30"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </div>

                    {/* Detail grid */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                          Service
                        </p>
                        <p className="mt-0.5 text-sm text-bone">
                          {item.service || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                          Area
                        </p>
                        <p className="mt-0.5 text-sm text-bone">
                          {item.area || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                          Source
                        </p>
                        <p className="mt-0.5 text-sm text-bone">
                          {item.source}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                          Date
                        </p>
                        <p className="mt-0.5 text-sm text-bone">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Message */}
                    {item.message && (
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                          Message
                        </p>
                        <p className="mt-1 whitespace-pre-wrap rounded-lg bg-ink-soft p-3 text-sm leading-relaxed text-bone">
                          {item.message}
                        </p>
                      </div>
                    )}

                    {/* Status + Quote actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label
                        htmlFor={`status-${item.id}`}
                        className="text-sm font-medium text-muted"
                      >
                        Status:
                      </label>
                      <select
                        id={`status-${item.id}`}
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(
                            item.id,
                            e.target.value as Status
                          )
                        }
                        disabled={isUpdating}
                        className="rounded-lg border border-line bg-ink-soft px-3 py-2 text-sm text-bone focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_CONFIG[s].label}
                          </option>
                        ))}
                      </select>
                      {isUpdating && (
                        <span className="text-xs text-muted">Updating...</span>
                      )}
                      <Link
                        href={`/admin/quotes/${item.id}`}
                        className="ml-auto inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-ink transition-all hover:brightness-110 active:scale-[0.98]"
                      >
                        <PenLine className="h-4 w-4" />
                        {item.status === "quoted" ? "View Quote" : "Create Quote"}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
