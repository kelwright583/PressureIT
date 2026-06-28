import Link from "next/link";
import { Shield, Sparkles, TrendingUp, Heart, Phone, Award, Leaf, Clock, HardHat, Droplets } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings, Service, BeforeAfter, Testimonial } from "@/db/types";
import Hero from "@/components/public/Hero";
import StatsBar from "@/components/public/StatsBar";
import ServiceCard from "@/components/public/ServiceCard";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";
import TestimonialCard from "@/components/public/TestimonialCard";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";
import Marquee from "@/components/public/Marquee";

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media`;

const WHY_US = [
  {
    icon: Shield,
    title: "Protects Your Investment",
    description:
      "Regular maintenance prevents costly repairs and extends the lifespan of your property's exterior surfaces.",
  },
  {
    icon: Sparkles,
    title: "Enhances Curb Appeal",
    description:
      "First impressions matter. A clean, well-maintained property stands out in any neighbourhood.",
  },
  {
    icon: TrendingUp,
    title: "Increases Property Value",
    description:
      "A restored exterior can significantly boost your property's market value and attract better tenants or buyers.",
  },
  {
    icon: Heart,
    title: "Maintains & Prevents Damage",
    description:
      "Removes mould, algae, moss, dirt and mineral build-up that can impact both surfaces and surrounding spaces.",
  },
] as const;

const STEPS = [
  {
    number: 1,
    title: "Request a Quote",
    description:
      "Fill in our quick form or WhatsApp us. Tell us about your property and what you need done.",
  },
  {
    number: 2,
    title: "On-Site Assessment",
    description:
      "We visit your property, assess the scope of work, and provide a detailed, no-obligation quote.",
  },
  {
    number: 3,
    title: "We Restore",
    description:
      "Our trained team arrives with professional equipment and eco-friendly chemicals to transform your space.",
  },
  {
    number: 4,
    title: "You Impress",
    description:
      "Enjoy your restored property. Stronger spaces, better impressions — guaranteed.",
  },
] as const;

export default async function HomePage() {
  const supabase = await createClient();

  const [settingsRes, servicesRes, galleryRes, testimonialsRes] =
    await Promise.all([
      supabase
        .from("site_settings")
        .select("*")
        .eq("id", true)
        .single<SiteSettings>(),
      supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("before_after")
        .select("*")
        .eq("published", true)
        .eq("featured", true)
        .order("sort_order", { ascending: true })
        .limit(6),
      supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true }),
    ]);

  const settings = settingsRes.data;
  const services = (servicesRes.data ?? []) as Service[];
  const gallery = (galleryRes.data ?? []) as BeforeAfter[];
  const testimonials = (testimonialsRes.data ?? []) as Testimonial[];

  const heroImage = settings?.hero_image
    ? `${STORAGE_URL}/${settings.hero_image}`
    : null;

  const phone = settings?.phone ?? "074 851 8879";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <>
      {/* ── Hero ── */}
      <Hero
        hero_eyebrow={settings?.hero_eyebrow ?? "PREMIUM PROPERTY CARE"}
        hero_line1={settings?.hero_line1 ?? "RESTORE."}
        hero_line2={settings?.hero_line2 ?? "PROTECT."}
        hero_line3={settings?.hero_line3 ?? "TRANSFORM."}
        hero_subtitle={
          settings?.hero_subtitle ??
          "Durban's premium property-care specialists since 2010 — we restore, protect and transform your most valuable asset."
        }
        hero_image={heroImage}
      />

      {/* ── Stats Bar ── */}
      {settings?.stats && settings.stats.length > 0 && (
        <StatsBar stats={settings.stats} />
      )}

      {/* ── Trust Marquee ── */}
      <Marquee speed={35} className="py-6 border-y border-line bg-ink">
        {[
          { icon: Shield, text: "Fully Insured" },
          { icon: Clock, text: "Expert Service Since 2010" },
          { icon: HardHat, text: "Supervisor on Every Site" },
          { icon: Award, text: "100% Satisfaction Guaranteed" },
          { icon: Leaf, text: "Eco-Friendly Chemicals" },
          { icon: Droplets, text: "80% Water Savings" },
          { icon: Sparkles, text: "Premium Quality Workmanship" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.text}
              className="flex items-center gap-2.5 text-bone/70 text-sm md:text-base whitespace-nowrap"
            >
              <Icon className="w-4 h-4 text-accent shrink-0" />
              <span className="font-medium uppercase tracking-wider">
                {item.text}
              </span>
              <span className="text-accent/30 mx-4">|</span>
            </div>
          );
        })}
      </Marquee>

      {/* ── Services Grid ── */}
      {services.length > 0 && (
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Subtle gradient orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="text-center mb-12 md:mb-16">
                <p className="text-accent uppercase tracking-widest text-sm mb-3">
                  What We Do
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-bone">
                  Our Services
                </h2>
                <p className="text-muted mt-4 max-w-2xl mx-auto text-base md:text-lg">
                  From roof cleaning to full property restoration, we deliver
                  premium results that protect and transform your space.
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {services.map((service, i) => (
                <AnimateOnScroll
                  key={service.id}
                  animation="fade-up"
                  delay={i * 80}
                  duration={600}
                >
                  <ServiceCard service={service} />
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll animation="fade-up" delay={200}>
              <div className="text-center mt-10 md:mt-14">
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 border border-bone/20 text-bone font-medium rounded-full px-8 py-3 text-sm md:text-base transition-all hover:bg-bone/5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 active:scale-95"
                >
                  View All Services
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── Before / After Highlights ── */}
      {gallery.length > 0 && (
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-soft to-ink" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="text-center mb-12 md:mb-16">
                <p className="text-accent uppercase tracking-widest text-sm mb-3">
                  See the Difference
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-bone">
                  Before &amp; After
                </h2>
                <p className="text-muted mt-4 max-w-2xl mx-auto text-base md:text-lg">
                  Drag the slider to see the transformation. These are real
                  results from real Durban properties.
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {gallery.map((item, i) => (
                <AnimateOnScroll
                  key={item.id}
                  animation="scale-in"
                  delay={i * 120}
                  duration={700}
                >
                  <BeforeAfterSlider
                    beforeImage={`${STORAGE_URL}/${item.before_image}`}
                    afterImage={`${STORAGE_URL}/${item.after_image}`}
                    title={item.title ?? undefined}
                    caption={
                      [item.caption, item.location]
                        .filter(Boolean)
                        .join(" — ") || undefined
                    }
                  />
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll animation="fade-up" delay={200}>
              <div className="text-center mt-10 md:mt-14">
                <Link
                  href="/gallery"
                  className="group inline-flex items-center gap-2 border border-bone/20 text-bone font-medium rounded-full px-8 py-3 text-sm md:text-base transition-all hover:bg-bone/5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 active:scale-95"
                >
                  See Full Gallery
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── Why Choose Us ── */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-accent uppercase tracking-widest text-sm mb-3">
                The Pressure-It Difference
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-bone">
                Why Choose Us
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <AnimateOnScroll
                  key={item.title}
                  animation="fade-up"
                  delay={i * 100}
                  duration={600}
                >
                  <div className="gradient-border rounded-2xl p-6 md:p-8 h-full text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20">
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="font-display text-bone text-lg md:text-xl mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-soft via-ink to-ink-soft" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-accent uppercase tracking-widest text-sm mb-3">
                Simple Process
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-bone">
                How It Works
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <AnimateOnScroll
                key={step.number}
                animation="fade-up"
                delay={i * 150}
                duration={600}
              >
                <div className="relative text-center group">
                  {/* Numbered Circle with glow */}
                  <div className="w-16 h-16 rounded-full border-2 border-accent bg-ink flex items-center justify-center mx-auto mb-5 transition-all duration-500 group-hover:bg-accent/10 group-hover:shadow-lg group-hover:shadow-accent/30 animate-pulse-glow">
                    <span className="font-display text-accent text-2xl">
                      {step.number}
                    </span>
                  </div>

                  {/* Connector line */}
                  {step.number < 4 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-accent/30 via-accent/10 to-transparent" />
                  )}

                  <h3 className="font-display text-bone text-lg md:text-xl mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/3 rounded-full blur-[150px] pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="text-center mb-12 md:mb-16">
                <p className="text-accent uppercase tracking-widest text-sm mb-3">
                  What Our Clients Say
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-bone">
                  Testimonials
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <AnimateOnScroll
                  key={testimonial.id}
                  animation="fade-up"
                  delay={i * 100}
                  duration={600}
                >
                  <TestimonialCard testimonial={testimonial} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Service Areas ── */}
      {settings?.service_areas && settings.service_areas.length > 0 && (
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink-soft to-ink" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="text-center mb-12 md:mb-16">
                <p className="text-accent uppercase tracking-widest text-sm mb-3">
                  Where We Work
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-bone">
                  Service Areas
                </h2>
                <p className="text-muted mt-4 max-w-2xl mx-auto text-base md:text-lg">
                  We provide mobile property-care services across Durban and
                  the greater eThekwini region.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="scale-in">
              <div className="flex flex-wrap justify-center gap-3">
                {settings.service_areas.map((area, i) => (
                  <span
                    key={area}
                    className="bg-gradient-to-br from-bone/8 to-bone/3 border border-bone/10 text-bone rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:border-accent/30 hover:bg-accent/10 hover:shadow-md hover:shadow-accent/10 hover:-translate-y-0.5"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* ── Big CTA Band ── */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-ink to-accent/5" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[180px] pointer-events-none animated-gradient" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll animation="fade-up">
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-bone mb-6">
              Ready to Transform
              <span className="text-gradient block mt-1">Your Property?</span>
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={150}>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Get a free, no-obligation quote today. We&apos;ll show you what a
              difference premium property care can make.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="glow-accent inline-flex items-center justify-center bg-accent text-ink font-bold rounded-full px-10 py-4 text-base md:text-lg transition-all hover:brightness-110 hover:scale-105 active:scale-95 shadow-lg shadow-accent/25"
              >
                Get a Free Quote
              </Link>
              <a
                href={phoneHref}
                className="inline-flex items-center justify-center gap-2 border border-bone/20 text-bone font-medium rounded-full px-10 py-4 text-base md:text-lg transition-all hover:bg-bone/5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 active:scale-95"
              >
                <Phone className="w-5 h-5" />
                {phone}
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
