"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { deleteService } from "@/app/admin/actions/services";
import type { Service } from "@/db/types";

export function ServicesList({ items }: { items: Service[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteService(id);
      if (result.ok) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setDeletingId(null);
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-accent sm:text-4xl">
            Services
          </h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} service{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Link>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-line bg-ink-soft p-12 text-center">
          <p className="text-muted">No services yet.</p>
          <Link
            href="/admin/services/new"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add your first service
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line">
          {/* Table header - desktop */}
          <div className="hidden border-b border-line bg-ink-soft px-4 py-3 sm:grid sm:grid-cols-[1fr_140px_80px_80px_100px]">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Service
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Slug
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted text-center">
              Order
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted text-center">
              Status
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted text-right">
              Actions
            </span>
          </div>

          {/* Rows */}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 border-b border-line bg-ink-soft/50 px-4 py-4 last:border-b-0 sm:grid sm:grid-cols-[1fr_140px_80px_80px_100px] sm:items-center sm:gap-0 sm:py-3"
            >
              {/* Title */}
              <div className="flex items-center gap-2">
                <GripVertical className="hidden h-4 w-4 shrink-0 text-muted/40 sm:block" />
                <span className="font-medium text-bone text-sm">
                  {item.title}
                </span>
              </div>

              {/* Slug */}
              <span className="truncate text-xs text-muted font-mono">
                {item.slug}
              </span>

              {/* Sort order */}
              <span className="text-center text-xs text-muted">
                {item.sort_order}
              </span>

              {/* Status */}
              <div className="flex justify-center">
                {item.published ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-400">
                    <Eye className="h-3.5 w-3.5" /> Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <EyeOff className="h-3.5 w-3.5" /> Draft
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/services/${item.id}`}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-ink px-3 py-2 text-xs font-medium text-bone transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="sm:hidden">Edit</span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  disabled={pending && deletingId === item.id}
                  className="flex items-center justify-center rounded-lg border border-line bg-ink px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
