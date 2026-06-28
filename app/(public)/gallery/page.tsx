import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Service, BeforeAfter } from "@/db/types";
import GalleryClient from "./gallery-client";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media`;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "See stunning before and after transformations by Pressure-It. High-pressure cleaning, roof restoration, painting and property care results in Durban.",
  openGraph: {
    title: "Our Transformations | Pressure-It",
    description:
      "Real results from real Durban properties. Drag the slider and see the Pressure-It difference.",
  },
};

export default async function GalleryPage() {
  const supabase = await createClient();

  const [galleryRes, servicesRes] = await Promise.all([
    supabase
      .from("before_after")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("services")
      .select("slug, title")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
  ]);

  const items = (galleryRes.data ?? []) as BeforeAfter[];
  const services = (servicesRes.data ?? []) as Pick<Service, "slug" | "title">[];

  // Build storage URLs for the client
  const itemsWithUrls = items.map((item) => ({
    ...item,
    before_image_url: `${STORAGE_URL}/${item.before_image}`,
    after_image_url: `${STORAGE_URL}/${item.after_image}`,
  }));

  // Get unique service slugs that actually have gallery entries
  const activeServiceSlugs = new Set(
    items
      .map((item) => item.service_slug)
      .filter((slug): slug is string => slug !== null)
  );

  const filterServices = services.filter((s) =>
    activeServiceSlugs.has(s.slug)
  );

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-ink pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll animation="fade-down" delay={0} duration={700}>
            <p className="text-accent uppercase tracking-widest text-sm mb-3">
              Real Results
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={150} duration={700}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-bone mb-4">
              Our Transformations
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={300} duration={700}>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
              Drag the slider on any image to see the dramatic before and after.
              These are real Durban properties restored by our team.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Gallery with Client-Side Filtering ── */}
      <section className="relative py-16 md:py-28">
        {/* Gradient orb behind gallery */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up" delay={0} duration={700}>
            <GalleryClient items={itemsWithUrls} services={filterServices} />
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Empty State ── */}
      {items.length === 0 && (
        <section className="pb-20 md:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted text-lg">
              Our gallery is being updated with fresh transformations. Check back
              soon!
            </p>
          </div>
        </section>
      )}
    </>
  );
}
