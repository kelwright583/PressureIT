"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createService, updateService } from "@/app/admin/actions/services";
import { slugify } from "@/lib/utils";
import type { Service } from "@/db/types";

interface ServiceFormProps {
  item?: Service;
}

export function ServiceForm({ item }: ServiceFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [shortDesc, setShortDesc] = useState(item?.short_desc ?? "");
  const [body, setBody] = useState(item?.body ?? "");
  const [icon, setIcon] = useState(item?.icon ?? "");
  const [image, setImage] = useState(item?.image ?? "");
  const [features, setFeatures] = useState<string[]>(item?.features ?? []);
  const [featureInput, setFeatureInput] = useState("");
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
  const [published, setPublished] = useState(item?.published ?? true);
  const [slugEdited, setSlugEdited] = useState(!!item);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugEdited) {
      setSlug(slugify(val));
    }
  }

  function handleSlugChange(val: string) {
    setSlugEdited(true);
    setSlug(slugify(val));
  }

  function addFeature() {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
    }
    setFeatureInput("");
  }

  function removeFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required.");
      return;
    }

    const formData = new FormData();
    if (item) formData.set("id", item.id);
    formData.set("title", title.trim());
    formData.set("slug", slug.trim());
    formData.set("short_desc", shortDesc);
    formData.set("body", body);
    formData.set("icon", icon);
    formData.set("image", image);
    formData.set("features", JSON.stringify(features));
    formData.set("sort_order", String(sortOrder));
    formData.set("published", published ? "true" : "false");

    const action = item ? updateService : createService;

    startTransition(async () => {
      const result = await action(formData);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/services");
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
          href="/admin/services"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-line hover:text-bone"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl tracking-tight text-accent sm:text-3xl">
          {item ? "Edit" : "New"} Service
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Driveway Cleaning"
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Slug <span className="text-red-400">*</span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="driveway-cleaning"
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 font-mono text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-muted">
            Auto-generated from title. Edit to customise.
          </p>
        </div>

        {/* Short description */}
        <div>
          <label
            htmlFor="short_desc"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Short Description
          </label>
          <input
            id="short_desc"
            type="text"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="A brief one-liner for cards..."
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Body */}
        <div>
          <label
            htmlFor="body"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Full service description..."
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Icon */}
        <div>
          <label
            htmlFor="icon"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Icon (Lucide name)
          </label>
          <input
            id="icon"
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="e.g. Droplets, Home, Sparkles"
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-muted">
            Lucide icon name. See lucide.dev/icons for options.
          </p>
        </div>

        {/* Image */}
        <ImageUploader
          value={image}
          onChange={setImage}
          folder="services"
          label="Service Image"
        />

        {/* Features */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-bone">
            Features
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="Type a feature and press Enter or Add"
              className="flex-1 rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center gap-1 rounded-xl border border-line bg-ink px-4 py-3 text-sm font-medium text-bone transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          {features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink px-3 py-1.5 text-xs font-medium text-bone"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="rounded-full p-0.5 text-muted transition-colors hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
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

        {/* Published toggle */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-5 w-5 rounded border-line bg-ink-soft text-accent focus:ring-accent"
          />
          <span className="text-sm font-medium text-bone">Published</span>
        </label>

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
          {item ? "Update" : "Create"} Service
        </button>
      </form>
    </div>
  );
}
