import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings, Service } from "@/db/types";
import QuoteForm from "@/components/public/QuoteForm";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Request a Free Quote",
  description:
    "Request a free, no-obligation quote from Pressure-It for high-pressure cleaning, roof restoration, painting and property care in Durban.",
  openGraph: {
    title: "Get a Free Quote | Pressure-It",
    description:
      "Fill in the form and we'll get back to you with a detailed quote. Premium property care across Durban since 2010.",
  },
};

export default async function QuotePage() {
  const supabase = await createClient();

  const [settingsRes, servicesRes] = await Promise.all([
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", true)
      .single<SiteSettings>(),
    supabase
      .from("services")
      .select("slug, title")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
  ]);

  const settings = settingsRes.data;
  const services = (servicesRes.data ?? []) as Pick<Service, "slug" | "title">[];

  const whatsapp = settings?.whatsapp ?? "27748518879";
  const serviceAreas = settings?.service_areas ?? [];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-ink pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll animation="fade-down" delay={0} duration={600}>
            <p className="text-accent uppercase tracking-widest text-sm mb-3">
              No Obligation
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={150} duration={700}>
            <h1 className="text-gradient font-display text-4xl md:text-6xl lg:text-7xl mb-4">
              Request a Free Quote
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={300} duration={700}>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
              Tell us about your property and what you need. We&apos;ll review
              your request and get back to you with a detailed quote — usually
              within a few hours.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Quote Form ── */}
      <section className="relative py-16 md:py-28 overflow-hidden">
        {/* Gradient orb */}
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]" />
        <AnimateOnScroll animation="fade-up" delay={200} duration={700}>
          <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <QuoteForm
              services={services}
              serviceAreas={serviceAreas}
              whatsapp={whatsapp}
            />
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
