import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/db/types";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import ScrollProgress from "@/components/public/ScrollProgress";
import CursorGlow from "@/components/public/CursorGlow";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .single<SiteSettings>();

  const phone = settings?.phone ?? "074 851 8879";
  const email = settings?.email ?? "sharon@pressure-it.co.za";
  const whatsapp = settings?.whatsapp ?? "27748518879";
  const facebookUrl =
    settings?.facebook_url ??
    "https://www.facebook.com/pressurecleaningdurban/";
  const serviceAreas = settings?.service_areas ?? [];

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pressure-it.co.za";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Pressure-It",
    description:
      "Durban's premium property-care specialists since 2010. High-pressure cleaning, roof restoration, painting & property transformation.",
    url: siteUrl,
    telephone: phone,
    email: email,
    image: `${siteUrl}/brand/logo.png`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Durban",
      addressRegion: "KwaZulu-Natal",
      addressCountry: "ZA",
    },
    areaServed: serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    sameAs: [facebookUrl],
    foundingDate: "2010",
    founder: {
      "@type": "Person",
      name: "Sharon Myburgh",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <CursorGlow />
      <Header phone={phone} />
      <main className="flex-1">{children}</main>
      <Footer
        phone={phone}
        email={email}
        whatsapp={whatsapp}
        facebookUrl={facebookUrl}
        serviceAreas={serviceAreas}
      />
      <WhatsAppButton whatsapp={whatsapp} />
    </>
  );
}
