"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";

interface HeaderProps {
  phone: string;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header({ phone }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ink/90 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-ink/70 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/brand/logo-primary.jpg"
              alt="Pressure-It — Premium Property Care"
              width={340}
              height={136}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-bone/80 hover:text-bone text-sm font-medium px-4 py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/quote"
              className="ml-2 bg-accent text-ink font-bold rounded-full px-6 py-2 text-sm transition-all hover:brightness-110 hover:scale-105 active:scale-95"
            >
              Get a Free Quote
            </Link>

            <a
              href={phoneHref}
              className="ml-2 flex items-center gap-2 text-bone/80 hover:text-accent text-sm font-medium px-3 py-2 rounded-lg transition-colors"
              aria-label={`Call ${phone}`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">{phone}</span>
            </a>
          </nav>

          {/* Mobile: Phone + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={phoneHref}
              className="flex items-center justify-center w-10 h-10 rounded-full text-bone/80 hover:text-accent transition-colors"
              aria-label={`Call ${phone}`}
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-bone/80 hover:text-bone transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-ink/98 backdrop-blur-xl lg:hidden transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-2 px-8">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`font-display text-bone text-4xl sm:text-5xl tracking-tight hover:text-accent transition-all duration-300 py-3 ${
                menuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: menuOpen ? `${100 + i * 60}ms` : "0ms",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div
            className={`mt-8 flex flex-col items-center gap-4 transition-all duration-300 ${
              menuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: menuOpen
                ? `${100 + NAV_LINKS.length * 60}ms`
                : "0ms",
            }}
          >
            <Link
              href="/quote"
              onClick={closeMenu}
              className="bg-accent text-ink font-bold rounded-full px-10 py-4 text-lg transition-all hover:brightness-110 active:scale-95"
            >
              Get a Free Quote
            </Link>

            <a
              href={phoneHref}
              className="flex items-center gap-2 text-muted hover:text-accent text-base font-medium transition-colors"
            >
              <Phone className="w-5 h-5" />
              {phone}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
