import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/db/types";
import ServiceCard from "@/components/public/ServiceCard";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media`;

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore Pressure-It's full range of property-care services in Durban: high-pressure cleaning, roof restoration, exterior painting, commercial cleaning, and more.",
  openGraph: {
    title: "Our Services | Pressure-It",
    description:
      "From roof cleaning to full property restoration — Durban's premium property-care specialists since 2010.",
  },
};

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  const services = (data ?? []) as Service[];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-ink pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        {/* Gradient orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-24 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll animation="fade-down" delay={0} duration={600}>
            <p className="text-accent uppercase tracking-widest text-sm mb-3">
              What We Do
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={150} duration={700}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-bone mb-4">
              Our Services
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={300} duration={700}>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
              Premium property care, restoration and transformation services
              across Durban and surrounds. Every project handled with care,
              precision and pride.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Services Grid ── */}
      {services.length > 0 && (
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Gradient orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {services.map((service, index) => (
                <AnimateOnScroll
                  key={service.id}
                  animation="fade-up"
                  delay={index * 100}
                  duration={700}
                  threshold={0.1}
                >
                  <ServiceCard service={service} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Detail Sections ── */}
      {services.length > 0 && (
        <section className="pb-20 md:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-20 md:space-y-32">
              {services.map((service, idx) => (
                <div
                  key={service.id}
                  id={service.slug}
                  className="relative scroll-mt-24 overflow-hidden"
                >
                  {/* Per-section gradient orb */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none ${
                      idx % 2 === 0 ? "-left-40" : "-right-40"
                    }`}
                  />
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${
                      idx % 2 === 1 ? "lg:direction-rtl" : ""
                    }`}
                  >
                    {/* Image */}
                    {service.image && (
                      <AnimateOnScroll
                        animation={idx % 2 === 0 ? "fade-right" : "fade-left"}
                        delay={0}
                        duration={700}
                        threshold={0.1}
                      >
                        <div
                          className={`relative aspect-[4/3] rounded-2xl overflow-hidden border border-line gradient-border ${
                            idx % 2 === 1 ? "lg:order-2" : ""
                          }`}
                        >
                          <Image
                            src={`${STORAGE_URL}/${service.image}`}
                            alt={service.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      </AnimateOnScroll>
                    )}

                    {/* Content */}
                    <AnimateOnScroll
                      animation={idx % 2 === 0 ? "fade-left" : "fade-right"}
                      delay={150}
                      duration={700}
                      threshold={0.1}
                    >
                      <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
                        <h2 className="font-display text-2xl md:text-4xl text-bone mb-4">
                          {service.title}
                        </h2>

                        {service.body && (
                          <div className="text-muted leading-relaxed mb-6 space-y-3">
                            {service.body.split("\n").map((paragraph, i) =>
                              paragraph.trim() ? (
                                <p key={i}>{paragraph}</p>
                              ) : null
                            )}
                          </div>
                        )}

                        {service.short_desc && !service.body && (
                          <p className="text-muted leading-relaxed mb-6">
                            {service.short_desc}
                          </p>
                        )}

                        {/* Features */}
                        {service.features.length > 0 && (
                          <ul className="space-y-2.5 mb-8">
                            {service.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-3 text-bone text-sm"
                              >
                                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}

                        <Link
                          href="/quote"
                          className="inline-flex items-center gap-2 bg-accent text-ink font-bold rounded-full px-8 py-3 text-sm md:text-base transition-all hover:brightness-110 hover:scale-105 active:scale-95 glow-accent"
                        >
                          Get a Quote
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </AnimateOnScroll>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Empty State ── */}
      {services.length === 0 && (
        <section className="py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-muted text-lg">
              Services are being updated. Please check back soon or{" "}
              <Link href="/contact" className="text-accent hover:underline">
                contact us
              </Link>{" "}
              directly.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
