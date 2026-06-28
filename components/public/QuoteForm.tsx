"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Send,
  CheckCircle2,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { submitQuote } from "@/app/(public)/actions/quote";
import type { ActionResult } from "@/db/types";

interface QuoteFormProps {
  services: Array<{ slug: string; title: string }>;
  serviceAreas: string[];
  whatsapp: string;
}

interface FieldError {
  name?: string;
  phone?: string;
  email?: string;
}

export default function QuoteForm({
  services,
  serviceAreas,
  whatsapp,
}: QuoteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [started, setStarted] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});

  useEffect(() => {
    setStarted(Date.now());
  }, []);

  const validate = useCallback(
    (formData: FormData): FieldError => {
      const e: FieldError = {};
      const name = formData.get("name") as string;
      const phone = formData.get("phone") as string;
      const email = formData.get("email") as string;

      if (!name || name.trim().length < 2) {
        e.name = "Please enter your name";
      }

      if (!phone || phone.replace(/\D/g, "").length < 9) {
        e.phone = "Please enter a valid phone number";
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        e.email = "Please enter a valid email address";
      }

      return e;
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Honeypot check
      const honeypot = formData.get("website") as string;
      if (honeypot) return;

      // Validate
      const fieldErrors = validate(formData);
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) return;

      // Add hidden fields
      formData.set("_started", String(started));
      formData.set("source", "website");

      setSubmitting(true);

      try {
        const result: ActionResult = await submitQuote(formData);

        if (result.ok) {
          setSuccess(true);
          toast.success("Quote request sent! We'll be in touch shortly.");
          formRef.current?.reset();
        } else {
          toast.error(result.message || "Something went wrong. Please try again.");
        }
      } catch {
        toast.error("Network error. Please try again or WhatsApp us instead.");
      } finally {
        setSubmitting(false);
      }
    },
    [started, validate]
  );

  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hi, I'd like to get a quote for pressure cleaning / property care."
  )}`;

  if (success) {
    return (
      <div className="bg-ink-soft rounded-2xl border border-line p-8 md:p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h3 className="font-display text-bone text-2xl mb-3">
          Quote Request Sent!
        </h3>
        <p className="text-muted mb-6 max-w-md mx-auto">
          Thanks for reaching out. We&apos;ll review your request and get back
          to you as soon as possible, usually within a few hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setSuccess(false);
              setStarted(Date.now());
            }}
            className="text-accent hover:text-accent/80 font-medium text-sm transition-colors"
          >
            Submit another request
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-green-400 hover:text-green-300 font-medium text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Or chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink-soft rounded-2xl border border-line p-6 md:p-8">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        {/* Honeypot - hidden from real users */}
        <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Hidden _started timestamp */}
        <input type="hidden" name="_started" value={started || ""} />

        {/* Name */}
        <div>
          <label
            htmlFor="quote-name"
            className="block text-bone text-sm font-medium mb-1.5"
          >
            Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="quote-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={`w-full bg-ink border rounded-xl px-4 py-3 text-bone placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? "border-red-500 focus:ring-red-500/30"
                : "border-line focus:ring-accent/30 focus:border-accent/50"
            }`}
            onChange={() => {
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          {errors.name && (
            <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="quote-phone"
            className="block text-bone text-sm font-medium mb-1.5"
          >
            Phone <span className="text-accent">*</span>
          </label>
          <input
            type="tel"
            id="quote-phone"
            name="phone"
            required
            autoComplete="tel"
            placeholder="e.g. 083 123 4567"
            className={`w-full bg-ink border rounded-xl px-4 py-3 text-bone placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.phone
                ? "border-red-500 focus:ring-red-500/30"
                : "border-line focus:ring-accent/30 focus:border-accent/50"
            }`}
            onChange={() => {
              if (errors.phone)
                setErrors((prev) => ({ ...prev, phone: undefined }));
            }}
          />
          {errors.phone && (
            <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="quote-email"
            className="block text-bone text-sm font-medium mb-1.5"
          >
            Email
          </label>
          <input
            type="email"
            id="quote-email"
            name="email"
            autoComplete="email"
            placeholder="your@email.com (optional)"
            className={`w-full bg-ink border rounded-xl px-4 py-3 text-bone placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-red-500 focus:ring-red-500/30"
                : "border-line focus:ring-accent/30 focus:border-accent/50"
            }`}
            onChange={() => {
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {errors.email && (
            <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Service */}
        <div>
          <label
            htmlFor="quote-service"
            className="block text-bone text-sm font-medium mb-1.5"
          >
            Service
          </label>
          <select
            id="quote-service"
            name="service"
            className="w-full bg-ink border border-line rounded-xl px-4 py-3 text-bone text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all appearance-none"
            defaultValue=""
          >
            <option value="" disabled className="text-muted">
              Select a service (optional)
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug} className="bg-ink-soft">
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Area */}
        <div>
          <label
            htmlFor="quote-area"
            className="block text-bone text-sm font-medium mb-1.5"
          >
            Area
          </label>
          <select
            id="quote-area"
            name="area"
            className="w-full bg-ink border border-line rounded-xl px-4 py-3 text-bone text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all appearance-none"
            defaultValue=""
          >
            <option value="" disabled className="text-muted">
              Select your area (optional)
            </option>
            {serviceAreas.map((area) => (
              <option key={area} value={area} className="bg-ink-soft">
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="quote-message"
            className="block text-bone text-sm font-medium mb-1.5"
          >
            Message
          </label>
          <textarea
            id="quote-message"
            name="message"
            rows={4}
            placeholder="Tell us about your project... (optional)"
            className="w-full bg-ink border border-line rounded-xl px-4 py-3 text-bone placeholder:text-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all resize-y min-h-[100px]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent text-ink font-bold rounded-full px-6 py-4 text-base transition-all hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Quote Request
            </>
          )}
        </button>
      </form>

      {/* WhatsApp Alternative */}
      <div className="mt-5 pt-5 border-t border-line text-center">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-green-400 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Prefer WhatsApp? Chat with us directly
        </a>
      </div>
    </div>
  );
}
