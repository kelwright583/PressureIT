"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { deleteBeforeAfter } from "@/app/admin/actions/gallery";
import type { BeforeAfter } from "@/db/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function storageUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/media/${path}`;
}

export function GalleryList({ items }: { items: BeforeAfter[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string, title: string | null) {
    const label = title || "this item";
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteBeforeAfter(id);
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
            Before / After
          </h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" />
          Add New
        </Link>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-line bg-ink-soft p-12 text-center">
          <p className="text-muted">No before/after entries yet.</p>
          <Link
            href="/admin/gallery/new"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add your first entry
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-xl border border-line bg-ink-soft transition-colors hover:border-accent/30"
            >
              {/* Thumbnail pair */}
              <div className="flex h-36">
                <div className="relative w-1/2 overflow-hidden">
                  <img
                    src={storageUrl(item.before_image)}
                    alt="Before"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bone">
                    Before
                  </span>
                </div>
                <div className="relative w-1/2 overflow-hidden border-l border-line">
                  <img
                    src={storageUrl(item.after_image)}
                    alt="After"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bone">
                    After
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-bone">
                      {item.title || "Untitled"}
                    </p>
                    {item.location && (
                      <p className="truncate text-xs text-muted">
                        {item.location}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {item.featured && (
                      <Star className="h-4 w-4 fill-accent text-accent" />
                    )}
                    {item.published ? (
                      <Eye className="h-4 w-4 text-green-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted" />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/gallery/${item.id}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-ink px-3 py-2.5 text-xs font-medium text-bone transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
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
