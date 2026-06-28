"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  createBeforeAfter,
  updateBeforeAfter,
} from "@/app/admin/actions/gallery";
import type { BeforeAfter } from "@/db/types";

interface BeforeAfterFormProps {
  item?: BeforeAfter;
  services: { slug: string; title: string }[];
}

export function BeforeAfterForm({ item, services }: BeforeAfterFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(item?.title ?? "");
  const [caption, setCaption] = useState(item?.caption ?? "");
  const [location, setLocation] = useState(item?.location ?? "");
  const [serviceSlug, setServiceSlug] = useState(item?.service_slug ?? "");
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [published, setPublished] = useState(item?.published ?? true);
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
  const [beforeImage, setBeforeImage] = useState(item?.before_image ?? "");
  const [afterImage, setAfterImage] = useState(item?.after_image ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!beforeImage) {
      toast.error("Before image is required.");
      return;
    }
    if (!afterImage) {
      toast.error("After image is required.");
      return;
    }

    const formData = new FormData();
    if (item) formData.set("id", item.id);
    formData.set("title", title);
    formData.set("caption", caption);
    formData.set("location", location);
    formData.set("service_slug", serviceSlug);
    formData.set("featured", featured ? "true" : "false");
    formData.set("published", published ? "true" : "false");
    formData.set("sort_order", String(sortOrder));
    formData.set("before_image", beforeImage);
    formData.set("after_image", afterImage);

    const action = item ? updateBeforeAfter : createBeforeAfter;

    startTransition(async () => {
      const result = await action(formData);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/gallery");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/gallery"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-line hover:text-bone"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl tracking-tight text-accent sm:text-3xl">
          {item ? "Edit" : "New"} Before / After
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ImageUploader
            value={beforeImage}
            onChange={setBeforeImage}
            folder="before-after"
            label="Before Image"
          />
          <ImageUploader
            value={afterImage}
            onChange={setAfterImage}
            folder="before-after"
            label="After Image"
          />
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Driveway deep clean"
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Caption */}
        <div>
          <label
            htmlFor="caption"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Caption
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            placeholder="Describe the work done..."
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Location + Service */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="location"
              className="mb-1.5 block text-sm font-medium text-bone"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sandton, Johannesburg"
              className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label
              htmlFor="service"
              className="mb-1.5 block text-sm font-medium text-bone"
            >
              Service
            </label>
            <select
              id="service"
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
              className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">-- Select service --</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort order */}
        <div>
          <label
            htmlFor="sort_order"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Sort Order
          </label>
          <input
            id="sort_order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-28 rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-5 w-5 rounded border-line bg-ink-soft text-accent focus:ring-accent"
            />
            <span className="text-sm font-medium text-bone">Featured</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-5 w-5 rounded border-line bg-ink-soft text-accent focus:ring-accent"
            />
            <span className="text-sm font-medium text-bone">Published</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-accent/90 disabled:opacity-50 sm:w-auto"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {item ? "Update" : "Create"} Entry
        </button>
      </form>
    </div>
  );
}
