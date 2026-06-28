"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  whatsapp: string;
}

export default function WhatsAppButton({ whatsapp }: WhatsAppButtonProps) {
  const [visible, setVisible] = useState(false);

  // Delay appearance slightly so it doesn't flash on load
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const whatsappHref = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hi, I'd like to enquire about your services."
  )}`;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 hover:shadow-green-500/40 active:scale-95 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <MessageCircle className="w-6 h-6 md:w-5 md:h-5" />

      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 pointer-events-none"
        aria-hidden="true"
      />
    </a>
  );
}
