"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import {
  createTestimonial,
  updateTestimonial,
} from "@/app/admin/actions/testimonials";
import type { Testimonial } from "@/db/types";

interface TestimonialFormProps {
  item?: Testimonial;
}

export function TestimonialForm({ item }: TestimonialFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(item?.name ?? "");
  const [location, setLocation] = useState(item?.location ?? "");
  const [quote, setQuote] = useState(item?.quote ?? "");
  const [rating, setRating] = useState(item?.rating ?? 5);
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
  const [published, setPublished] = useState(item?.published ?? true);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!quote.trim()) {
      toast.error("Quote is required.");
      return;
    }

    const formData = new FormData();
    if (item) formData.set("id", item.id);
    formData.set("name", name.trim());
    formData.set("location", location);
    formData.set("quote", quote.trim());
    formData.set("rating", String(rating));
    formData.set("sort_order", String(sortOrder));
    formData.set("published", published ? "true" : "false");

    const action = item ? updateTestimonial : createTestimonial;

    startTransition(async () => {
      const result = await action(formData);
      if (result.ok) {
        toast.success(result.message);
        router.push("/admin/testimonials");
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
          href="/admin/testimonials"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-line hover:text-bone"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-2xl tracking-tight text-accent sm:text-3xl">
          {item ? "Edit" : "New"} Testimonial
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Customer name"
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Location */}
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
            placeholder="e.g. Fourways, Johannesburg"
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Quote */}
        <div>
          <label
            htmlFor="quote"
            className="mb-1.5 block text-sm font-medium text-bone"
          >
            Quote <span className="text-red-400">*</span>
          </label>
          <textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={4}
            placeholder="What the customer said..."
            className="w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-bone placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-bone">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                className="rounded-lg p-1.5 transition-colors hover:bg-line"
                aria-label={`${val} star${val !== 1 ? "s" : ""}`}
              >
                <Star
                  className={`h-6 w-6 ${
                    val <= rating
                      ? "fill-accent text-accent"
                      : "fill-transparent text-muted/30"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted">{rating}/5</span>
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
          {item ? "Update" : "Create"} Testimonial
        </button>
      </form>
    </div>
  );
}
