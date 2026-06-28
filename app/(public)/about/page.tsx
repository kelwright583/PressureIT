import type { Metadata } from "next";
import {
  Shield,
  Clock,
  HardHat,
  ThumbsUp,
  Award,
  Leaf,
  Droplets,
  Users,
  Star,
  Wrench,
  CheckCircle2,
  Heart,
  Sparkles,
} from "lucide-react";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Pressure-It — Durban's premium property-care specialists since 2010. Founded by Sharon Myburgh, we restore, protect and transform properties across KwaZulu-Natal.",
  openGraph: {
    title: "About Pressure-It",
    description:
      "Since 2010, Pressure-It has been Durban's go-to for premium high-pressure cleaning, restoration and property transformation.",
  },
};

const TRUST_SIGNALS = [
  { icon: Clock, label: "Expert Service Since 2010" },
  { icon: Shield, label: "Fully Insured & Experienced" },
  { icon: HardHat, label: "Supervisor On Site" },
  { icon: ThumbsUp, label: "100% Satisfaction Guaranteed" },
  { icon: Award, label: "Premium Quality Workmanship" },
  { icon: Leaf, label: "Eco-Friendly Chemicals" },
  { icon: Droplets, label: "80% Water Savings" },
  { icon: Users, label: "Trained Professional Teams" },
  { icon: Star, label: "Competitive Pricing" },
  { icon: Wrench, label: "Professional Equipment" },
] as const;

const P_MARK_MEANING = [
  {
    element: "Roof Line",
    meaning: "The homes we protect and restore",
  },
  {
    element: "Water Flow",
    meaning: "Our pressure-cleaning expertise",
  },
  {
    element: "Precision Spray",
    meaning: "Attention to detail in every project",
  },
  {
    element: "Transformation Curve",
    meaning: "Before and after — restored and renewed",
  },
] as const;

export default function AboutPage() {
  const currentYear = new Date().getFullYear();
  const yearsExperience = currentYear - 2010;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-ink pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll animation="fade-down" delay={0} duration={600}>
            <p className="text-accent uppercase tracking-widest text-sm mb-3">
              Our Story
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={150} duration={700}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-bone mb-4">
              About Pressure-It
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll animation="fade-up" delay={300} duration={700}>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
              {yearsExperience} years of premium property care in Durban.
              Restoring, protecting and transforming spaces since 2010.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Gradient orb behind The Story ── */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] opacity-40"
        />

        {/* ── The Story ── */}
        <section className="relative py-20 md:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <AnimateOnScroll animation="fade-up" delay={0} duration={600}>
                <p className="text-accent uppercase tracking-widest text-sm mb-3">
                  Since 2010
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-bone mb-8">
                  The Pressure-It Story
                </h2>
              </AnimateOnScroll>
            </div>

            <div className="space-y-6 text-muted text-base md:text-lg leading-relaxed">
              <AnimateOnScroll animation="fade-up" delay={100} duration={700}>
                <p>
                  Founded in 2010 in Durban by{" "}
                  <span className="text-bone font-medium">Sharon Myburgh</span>,
                  Pressure-It was born from a simple belief: every property
                  deserves to look its best. What started as a small
                  high-pressure cleaning operation has grown into a premium,
                  full-service property-care company trusted by homeowners,
                  businesses and institutions across KwaZulu-Natal.
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay={220} duration={700}>
                <p>
                  Over the past{" "}
                  <span className="text-accent font-bold">{yearsExperience} years</span>,
                  we&apos;ve built our reputation on consistent quality, honest
                  pricing and results that speak for themselves. From
                  residential roofs and driveways to commercial factories and
                  shopping centres, no job is too big or too small.
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll animation="fade-up" delay={340} duration={700}>
                <p>
                  Today, Pressure-It continues to be led by Sharon with the
                  same hands-on approach and commitment to excellence that
                  launched the business. Every project gets a supervisor on
                  site, professional equipment, and eco-friendly products that
                  are tough on grime but gentle on the environment.
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      </div>

      {/* ── The P-Mark Meaning ── */}
      <section className="py-20 md:py-32 bg-ink-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <AnimateOnScroll animation="fade-up" delay={0} duration={600}>
              <p className="text-accent uppercase tracking-widest text-sm mb-3">
                Our Identity
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-bone">
                The P-Mark
              </h2>
              <p className="text-muted mt-4 max-w-2xl mx-auto text-base md:text-lg">
                Every element of our mark tells our story.
              </p>
            </AnimateOnScroll>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {P_MARK_MEANING.map((item, index) => (
              <AnimateOnScroll
                key={item.element}
                animation="fade-up"
                delay={index * 120}
                duration={700}
              >
                <div className="gradient-border rounded-2xl p-6 md:p-8 text-center">
                  <h3 className="font-display text-accent text-lg mb-3">
                    {item.element}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {item.meaning}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2010 FIFA Heritage ── */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="scale-in" delay={0} duration={700}>
            <div className="gradient-border rounded-3xl p-8 md:p-12 lg:p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-display text-2xl md:text-4xl text-bone mb-4">
                2010 FIFA World Cup Heritage
              </h2>
              <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                In our founding year, Pressure-It was tasked with cleaning{" "}
                <span className="text-bone font-medium">
                  70 passenger buses on a 24-hour rotation
                </span>{" "}
                during the 2010 FIFA World Cup in South Africa. It was a
                baptism of fire that proved our capacity for large-scale,
                high-pressure work under demanding deadlines. That same
                work ethic and capability drives every job we take on today.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── Eco-Friendly ── */}
      <section className="py-20 md:py-32 bg-ink-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll animation="fade-right" delay={0} duration={700}>
              <div>
                <p className="text-accent uppercase tracking-widest text-sm mb-3">
                  Environmentally Responsible
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-bone mb-6">
                  Eco-Friendly Approach
                </h2>
                <div className="space-y-4 text-muted text-base md:text-lg leading-relaxed">
                  <p>
                    At Pressure-It, we believe powerful cleaning doesn&apos;t
                    have to come at the environment&apos;s expense. All our
                    cleaning chemicals are{" "}
                    <span className="text-bone font-medium">
                      biodegradable, non-hazardous
                    </span>{" "}
                    and safe for your family, pets and garden.
                  </p>
                  <p>
                    Our professional high-pressure equipment saves up to{" "}
                    <span className="text-accent font-bold">
                      80% more water
                    </span>{" "}
                    compared to a standard garden hose — delivering superior
                    results with a fraction of the water usage.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-left" delay={150} duration={700}>
              <div className="grid grid-cols-2 gap-4">
                <div className="gradient-border rounded-2xl p-6 text-center">
                  <Leaf className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-display text-bone text-lg mb-1">
                    Biodegradable
                  </h3>
                  <p className="text-muted text-xs">
                    Non-hazardous chemicals
                  </p>
                </div>
                <div className="gradient-border rounded-2xl p-6 text-center">
                  <Droplets className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-display text-bone text-lg mb-1">
                    80% Less Water
                  </h3>
                  <p className="text-muted text-xs">
                    vs a garden hose
                  </p>
                </div>
                <div className="gradient-border rounded-2xl p-6 text-center">
                  <Shield className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-display text-bone text-lg mb-1">
                    Safe
                  </h3>
                  <p className="text-muted text-xs">
                    For family, pets &amp; garden
                  </p>
                </div>
                <div className="gradient-border rounded-2xl p-6 text-center">
                  <Wrench className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-display text-bone text-lg mb-1">
                    Professional
                  </h3>
                  <p className="text-muted text-xs">
                    Industrial-grade equipment
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── Trust Signals Grid ── */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-accent/8 blur-[140px] opacity-35"
        />

        <section className="relative py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <AnimateOnScroll animation="fade-up" delay={0} duration={600}>
                <p className="text-accent uppercase tracking-widest text-sm mb-3">
                  Why Trust Us
                </p>
                <h2 className="font-display text-3xl md:text-5xl text-bone">
                  Built on Trust
                </h2>
              </AnimateOnScroll>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {TRUST_SIGNALS.map((signal, index) => {
                const Icon = signal.icon;
                return (
                  <AnimateOnScroll
                    key={signal.label}
                    animation="fade-up"
                    delay={index * 80}
                    duration={600}
                  >
                    <div className="gradient-border rounded-2xl p-5 text-center transition-all hover:border-accent/20">
                      <Icon className="w-6 h-6 text-accent mx-auto mb-3" />
                      <p className="text-bone text-xs md:text-sm font-medium leading-tight">
                        {signal.label}
                      </p>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ── The Promise ── */}
      <section className="py-20 md:py-32 bg-ink-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up" delay={0} duration={700}>
            <div className="text-center mb-12 md:mb-16">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-bone mb-4 text-gradient">
                The Pressure-It Promise
              </h2>
              <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
                Five commitments that define every job we take on.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {([
              {
                icon: ThumbsUp,
                title: "100% Satisfaction Guaranteed",
                desc: "We stand behind every project and only consider the job complete when you\u2019re fully satisfied with the result.",
              },
              {
                icon: Users,
                title: "Expert Service, Call to Completion",
                desc: "One professional team of knowledgeable specialists and a seamless experience from quotation through to final.",
              },
              {
                icon: Clock,
                title: "Proven Process",
                desc: "Over 16 years of experience delivering trusted pressure cleaning, restoration and painting services across Durban.",
              },
              {
                icon: Heart,
                title: "Care for Your Property",
                desc: "Every project is personally managed with a supervisor on site to ensure quality, safety and attention to detail.",
              },
              {
                icon: Sparkles,
                title: "The Finishing Touch",
                desc: "We leave your property looking its absolute best, including the detail clean-up and surrounding areas that matter most.",
              },
            ] as const).map((item, i) => {
              const Icon = item.icon;
              return (
                <AnimateOnScroll
                  key={item.title}
                  animation="fade-up"
                  delay={i * 100}
                  duration={600}
                >
                  <div className="gradient-border rounded-2xl p-6 text-center h-full">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-display text-bone text-sm md:text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>

          <AnimateOnScroll animation="fade-up" delay={600}>
            <p className="text-center text-bone font-medium text-lg md:text-xl mt-12">
              Stronger Spaces. Better Impressions.
            </p>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
