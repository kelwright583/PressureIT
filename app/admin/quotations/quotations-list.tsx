"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  FileText,
  Trash2,
  PenLine,
  Download,
  Send,
} from "lucide-react";
import {
  updateQuotationStatus,
} from "@/app/admin/actions/quotations";
import { deleteQuotation } from "@/app/admin/actions/quotations";
import type { Quotation } from "@/db/types";

type QuotationStatus = Quotation["status"];

interface QuotationWithCustomer extends Quotation {
  customer_name: string;
  customer_email: string | null;
  quote_request_id: string;
}

const STATUS_CONFIG: Record<
  QuotationStatus,
  { label: string; bg: string; text: string }
> = {
  draft: { label: "Draft", bg: "bg-gray-500/15", text: "text-gray-400" },
  sent: { label: "Sent", bg: "bg-blue-500/15", text: "text-blue-400" },
  accepted: {
    label: "Accepted",
    bg: "bg-green-500/15",
    text: "text-green-400",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-500/15",
    text: "text-red-400",
  },
};

const TABS: { key: "all" | QuotationStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "sent", label: "Sent" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

export function QuotationsList({
  items,
}: {
  items: QuotationWithCustomer[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"all" | QuotationStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered =
    activeTab === "all"
      ? items
      : items.filter((q) => q.status === activeTab);

  const counts = {
    all: items.length,
    draft: items.filter((q) => q.status === "draft").length,
    sent: items.filter((q) => q.status === "sent").length,
    accepted: items.filter((q) => q.status === "accepted").length,
    rejected: items.filter((q) => q.status === "rejected").length,
  };

  function handleStatusChange(id: string, status: QuotationStatus) {
    setUpdatingId(id);
    startTransition(async () => {
      const result = await updateQuotationStatus(id, status);
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setUpdatingId(null);
    });
  }

  function handleDelete(id: string, quoteNumber: string) {
    if (
      !confirm(
        `Delete quotation ${quoteNumber}? This cannot be undone.`
      )
    ) {
      return;
    }
    setUpdatingId(id);
    startTransition(async () => {
      const result = await deleteQuotation(id);
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
      <div>
        <h1 className="font-display text-3xl tracking-tight text-accent sm:text-4xl">
          Quotations
        </h1>
        <p className="mt-1 text-sm text-muted">
          {items.length} quotation{items.length !== 1 ? "s" : ""} created
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-ink-soft p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-accent text-ink"
                : "text-muted hover:bg-line hover:text-bone"
            }`}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span
                className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  activeTab === tab.key
                    ? "bg-ink/20 text-ink"
                    : "bg-line text-muted"
                }`}
              >
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-line bg-ink-soft p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted" />
          <p className="text-muted">
            {activeTab === "all"
              ? "No quotations yet. Create one from a notification."
              : `No ${activeTab} quotations.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => {
            const config = STATUS_CONFIG[q.status];
            const isUpdating = updatingId === q.id;

            return (
              <div
                key={q.id}
                className="flex flex-col gap-3 rounded-xl border border-line bg-ink-soft p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                {/* Status badge */}
                <span
                  className={`shrink-0 self-start rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}
                >
                  {config.label}
                </span>

                {/* Quote info */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-bone">
                    {q.quote_number}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {q.customer_name} &middot;{" "}
                    {formatDate(q.created_at)}
                  </p>
                </div>

                {/* Total */}
                <p className="shrink-0 font-display text-lg text-accent">
                  {formatCurrency(Number(q.total))}
                </p>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  {/* Status dropdown */}
                  <select
                    value={q.status}
                    onChange={(e) =>
                      handleStatusChange(
                        q.id,
                        e.target.value as QuotationStatus
                      )
                    }
                    disabled={isUpdating}
                    className="rounded-lg border border-line bg-ink px-2 py-1.5 text-xs text-bone focus:border-accent focus:outline-none disabled:opacity-50"
                  >
                    {(
                      Object.keys(STATUS_CONFIG) as QuotationStatus[]
                    ).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_CONFIG[s].label}
                      </option>
                    ))}
                  </select>

                  {/* Edit */}
                  <Link
                    href={`/admin/quotations/${q.quote_request_id}`}
                    className="rounded-lg p-2 text-muted hover:bg-line hover:text-bone"
                    title="Edit quotation"
                  >
                    <PenLine className="h-4 w-4" />
                  </Link>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(q.id, q.quote_number)
                    }
                    disabled={isUpdating}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    title="Delete quotation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
