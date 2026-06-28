import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, ExternalLink, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings, Service } from "@/db/types";
import QuoteForm from "@/components/public/QuoteForm";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Pressure-It for a free quote on high-pressure cleaning, roof restoration, painting and property care in Durban.",
  openGraph: {
    title: "Contact Pressure-It",
    description:
      "Call, WhatsApp or email us for a free, no-obligation quote. Premium property care across Durban and surrounds.",
  },
};

export default async function ContactPage() {
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

  const phone = settings?.phone ?? "074 851 8879";
  const email = settings?.email ?? "sharon@pressure-it.co.za";
  const whatsapp = settings?.whatsapp ?? "27748518879";
  const facebookUrl =
    settings?.facebook_url ??
    "https://www.facebook.com/pressurecleaningdurban/";
  const serviceAreas = settings?.service_areas ?? [];

  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hi, I'd like to enquire about your services."
  )}`;

  const contactCards: Array<{
    icon: LucideIcon;
    label: string;
    value: string;
    href: string;
    description: string;
    external?: boolean;
  }> = [
    {
      icon: Phone,
      label: "Phone",
      value: phone,
      href: phoneHref,
      description: "Tap to call us directly",
    },
    {
      icon: Mail,
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      description: "Send us an email",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      href: whatsappHref,
      description: "Quick and convenient",
      external: true,
    },
    {
      icon: ExternalLink,
      label: "Facebook",
      value: "Pressure-It Durban",
      href: facebookUrl,
      description: "Follow us for updates",
      external: true,
    },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-ink pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll animation="fade-up" delay={0}>
            <p className="text-accent uppercase tracking-widest text-sm mb-3">
              Let&apos;s Talk
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={100}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-bone mb-4">
              Get In Touch
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={200}>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
              Ready for a transformation? Reach out for a free, no-obligation
              quote or just say hello. We&apos;d love to hear from you.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Contact Cards + Form ── */}
      <section className="relative py-16 md:py-28 overflow-hidden">
        {/* Gradient orb behind contact section */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-accent/8 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* ── Left Column: Contact Details + Areas ── */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <AnimateOnScroll animation="fade-up" delay={0}>
                  <h2 className="font-display text-2xl md:text-3xl text-bone mb-6">
                    Contact Details
                  </h2>
                </AnimateOnScroll>
                <div className="space-y-4">
                  {contactCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <AnimateOnScroll
                        key={card.label}
                        animation="fade-up"
                        delay={index * 100}
                      >
                        <a
                          href={card.href}
                          {...(card.external
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                          className="group flex items-start gap-4 gradient-border rounded-2xl p-5 transition-all hover:border-accent/20 hover:-translate-y-0.5"
                        >
                          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent/20">
                            <Icon className="w-5 h-5 text-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-bone font-bold text-sm">
                              {card.label}
                            </p>
                            <p className="text-bone text-sm mt-0.5">
                              {card.value}
                            </p>
                            <p className="text-muted text-xs mt-1">
                              {card.description}
                            </p>
                          </div>
                        </a>
                      </AnimateOnScroll>
                    );
                  })}
                </div>
              </div>

              {/* ── Service Areas ── */}
              {serviceAreas.length > 0 && (
                <AnimateOnScroll animation="fade-up" delay={0}>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-bone mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-accent" />
                      Service Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {serviceAreas.map((area) => (
                        <span
                          key={area}
                          className="bg-bone/5 border border-bone/10 text-bone rounded-full px-4 py-2 text-xs font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted text-xs mt-3">
                      Mobile service — we come to you across Durban and surrounds.
                    </p>
                  </div>
                </AnimateOnScroll>
              )}
            </div>

            {/* ── Right Column: Quote Form ── */}
            <div className="lg:col-span-3">
              <AnimateOnScroll animation="fade-up" delay={0}>
                <h2 className="font-display text-2xl md:text-3xl text-bone mb-6">
                  Request a Quote
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay={100}>
                <QuoteForm
                  services={services}
                  serviceAreas={serviceAreas}
                  whatsapp={whatsapp}
                />
              </AnimateOnScroll>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
