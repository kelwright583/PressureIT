"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { deleteTestimonial } from "@/app/admin/actions/testimonials";
import type { Testimonial } from "@/db/types";

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-accent text-accent"
              : "fill-transparent text-muted/30"
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialsList({ items }: { items: Testimonial[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete testimonial from "${name}"? This cannot be undone.`))
      return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteTestimonial(id);
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
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} testimonial{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Link>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-line bg-ink-soft p-12 text-center">
          <p className="text-muted">No testimonials yet.</p>
          <Link
            href="/admin/testimonials/new"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add your first testimonial
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-line bg-ink-soft p-4 sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-bone text-sm">
                      {item.name}
                    </span>
                    {item.location && (
                      <span className="text-xs text-muted">
                        {item.location}
                      </span>
                    )}
                    {item.published ? (
                      <Eye className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted" />
                    )}
                  </div>
                  <RatingStars rating={item.rating} />
                  <p className="text-sm leading-relaxed text-muted line-clamp-2">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/admin/testimonials/${item.id}`}
                    className="flex items-center gap-1.5 rounded-lg border border-line bg-ink px-3 py-2.5 text-xs font-medium text-bone transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name)}
                    disabled={pending && deletingId === item.id}
                    className="flex items-center justify-center rounded-lg border border-line bg-ink px-3 py-2.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
