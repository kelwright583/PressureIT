import type { Metadata } from "next";
import { Anton, Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pressure-It | Premium Property Care — Durban",
    template: "%s | Pressure-It",
  },
  description:
    "Durban's premium property-care specialists since 2010. High-pressure cleaning, roof restoration, painting & property transformation.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.pressure-it.co.za"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-bone font-body">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
