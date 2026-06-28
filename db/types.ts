export interface Profile {
  id: string;
  name: string | null;
  role: "admin" | "editor";
  created_at: string;
}

export interface SiteSettings {
  id: boolean;
  hero_eyebrow: string;
  hero_line1: string;
  hero_line2: string;
  hero_line3: string;
  hero_subtitle: string;
  hero_image: string | null;
  phone: string;
  email: string;
  whatsapp: string;
  facebook_url: string;
  service_areas: string[];
  stats: StatItem[];
  theme: ThemeOverride;
  updated_at: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export interface ThemeOverride {
  accent?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  short_desc: string | null;
  body: string | null;
  icon: string | null;
  image: string | null;
  features: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BeforeAfter {
  id: string;
  title: string | null;
  caption: string | null;
  service_slug: string | null;
  location: string | null;
  before_image: string;
  after_image: string;
  sort_order: number;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  quote: string;
  rating: number;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string | null;
  area: string | null;
  property_type: string | null;
  surface_area: string | null;
  address: string | null;
  message: string | null;
  status: "new" | "contacted" | "quoted" | "won" | "lost";
  read_at: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  storage_path: string;
  uploaded_by: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface Quotation {
  id: string;
  quote_request_id: string;
  quote_number: string;
  notes: string | null;
  valid_days: number;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
}

export type ActionResult = {
  ok: boolean;
  message: string;
};
