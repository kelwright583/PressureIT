import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import AnimateOnScroll from "@/components/public/AnimateOnScroll";

interface FooterProps {
  phone: string;
  email: string;
  whatsapp: string;
  facebookUrl: string;
  serviceAreas: string[];
}

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Footer({
  phone,
  email,
  whatsapp,
  facebookUrl,
  serviceAreas,
}: FooterProps) {
  const year = new Date().getFullYear();
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}`;

  return (
    <footer className="relative bg-ink-soft border-t border-line">
      {/* Accent gradient line at the top of the footer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <AnimateOnScroll animation="fade-up" duration={700}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand Column */}
            <AnimateOnScroll animation="fade-up" delay={0} duration={700}>
              <div className="lg:col-span-1">
                <div className="mb-4">
                  <div className="inline-block mb-2" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)", maskComposite: "intersect", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)", WebkitMaskComposite: "source-in" }}>
                    <Image
                      src="/brand/logo-primary.jpg"
                      alt="Pressure-It"
                      width={300}
                      height={120}
                      className="h-24 w-auto object-contain"
                    />
                  </div>
                  <span className="text-muted text-sm mt-1 block">
                    Stronger Spaces. Better Impressions.
                  </span>
                </div>
                <p className="text-muted text-sm leading-relaxed">
                  Durban&apos;s premium property-care specialists. Transforming
                  spaces with expert high-pressure cleaning, restoration and
                  painting services.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Contact Column */}
            <AnimateOnScroll animation="fade-up" delay={100} duration={700}>
              <div>
                <h3 className="font-display text-bone text-lg mb-4">Contact</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href={phoneHref}
                      className="flex items-center gap-3 text-muted hover:text-accent transition-colors text-sm group"
                    >
                      <Phone className="w-4 h-4 shrink-0 text-accent/60 group-hover:text-accent transition-colors" />
                      {phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 text-muted hover:text-accent transition-colors text-sm group"
                    >
                      <Mail className="w-4 h-4 shrink-0 text-accent/60 group-hover:text-accent transition-colors" />
                      {email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted hover:text-accent transition-colors text-sm group"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0 text-accent/60 group-hover:text-accent transition-colors" />
                      WhatsApp Us
                    </a>
                  </li>
                  <li>
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-muted hover:text-accent transition-colors text-sm group"
                    >
                      <ExternalLink className="w-4 h-4 shrink-0 text-accent/60 group-hover:text-accent transition-colors" />
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>

            {/* Quick Links Column */}
            <AnimateOnScroll animation="fade-up" delay={200} duration={700}>
              <div>
                <h3 className="font-display text-bone text-lg mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {QUICK_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm group"
                      >
                        <ChevronRight className="w-3 h-3 shrink-0 text-accent/40 group-hover:text-accent transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>

            {/* Service Areas Column */}
            <AnimateOnScroll animation="fade-up" delay={300} duration={700}>
              <div>
                <h3 className="font-display text-bone text-lg mb-4">
                  Service Areas
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {serviceAreas.join(", ")}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>
            &copy; {year} Pressure-It. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>Expert service since 2010</span>
            <Link
              href="/admin"
              className="hover:text-accent transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
