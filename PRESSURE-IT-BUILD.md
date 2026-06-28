# PRESSURE-IT — Build Specification & Agent Instructions

> **Read this entire document before writing any code.** This is the single source of truth for building the Pressure-It website + self-service admin PWA from scratch. Build it in the order laid out in **§16 Build Order**. Do not skip the data model. Do not invent extra scope. When something is ambiguous, prefer the simplest option that satisfies the spec and leave a `// TODO:` note.

---

## 0. TL;DR — What you are building

A **Next.js (App Router) + Supabase + Tailwind** website for **Pressure-It**, a property-restoration / high-pressure-cleaning business in Durban, South Africa. It has two halves:

1. **Public marketing site** — premium, dark, high-impact. Sells the service, shows **before/after** transformations, lists services, and captures **quote requests**.
2. **Admin panel (`/admin`)** — a password-protected dashboard where the owner (Sharon) logs in from her phone or laptop and edits the site herself: adds **before/after photo pairs**, edits **services**, tweaks the **homepage/hero/contact details**, and reads incoming **quote requests** — with **zero code and zero redeploys**.

The owner is non-technical. Everything she touches must be obvious, forgiving, and mobile-friendly. The whole thing should also be **installable as a PWA** (structure for it now; full offline can come later).

This is a **ground-up overhaul** of an old, dated WordPress site (https://pressure-it.co.za/). Keep the *business facts* below; throw away the old design entirely.

---

## 1. The business (facts to bake in)

- **Name:** Pressure-It
- **Tagline (primary):** `RESTORE. PROTECT. TRANSFORM.`
- **Descriptor:** `PREMIUM PROPERTY CARE`
- **Secondary slogan:** `Stronger Spaces. Better Impressions.`
- **Since:** 2010 (16+ years' experience — compute "years since 2010" dynamically, don't hard-code "16").
- **Location / base:** Durban, KwaZulu-Natal, South Africa. Mobile service.
- **Owner / main contact:** Sharon Myburgh
- **Phone:** `074 851 8879`
- **Email:** `sharon@pressure-it.co.za`
- **Website:** `www.pressure-it.co.za`
- **Facebook:** https://www.facebook.com/pressurecleaningdurban/

**Selling points / trust signals (must appear on the site):**
- Protects your investment
- Enhances curb appeal
- Increases property value
- Healthier home environment
- Premium quality workmanship
- Fully insured & experienced
- 100% satisfaction guaranteed
- Expert service since 2010
- Supervisor on site
- Eco-friendly, biodegradable, non-hazardous cleaning chemicals
- Saves up to 80% water vs a garden hose
- "We'll blast away your best written quote" — competitive pricing heritage (use tastefully)
- Heritage flex: cleaned 70 passenger buses on 24-hour rotation during the 2010 FIFA World Cup (nice "About" detail)

**Service areas (Durban & surrounds):** Durban North, Umhlanga, Kloof, Hillcrest, Westville, Pinetown, New Germany, Berea, Morningside, Musgrave, Glenwood, Upper Highway, Gillitts, Waterfall, Mount Edgecombe, Ballito, Amanzimtoti, Queensburgh, and surrounding areas. (Store as an editable list — see `site_settings`.)

**Services (seed these; owner can edit/add/remove later):**
1. **Roof Pressure Cleaning** — residential roofs, barge boards, fascia boards, gutters, waterproofing.
2. **Paving & Driveway Pressure Cleaning** — driveways, patios, courtyards, pool surrounds.
3. **Wall Restoration** — exterior walls, removal of mould, algae, moss, dirt and organic build-up.
4. **Commercial Pressure Cleaning** — factories, warehouses, shopping centres, petrol stations, bridges.
5. **Exterior Painting** — surface prep + premium exterior paint.
6. **Commercial Painting & Restoration** — large-scale commercial repaint & restore.
7. **Roof Painting** — re-colour and seal cleaned roofs.
8. **Fleet / Vehicle Cleaning** — on-site cars, trucks, buses (exterior, interior, engine, chassis).
9. **School Building Pressure Cleaning & Painting**
10. **Solar Panel Cleaning**

---

## 2. Brand & visual identity (NON-NEGOTIABLE — this is the soul of the overhaul)

The brand is **dark, premium, bold, high-contrast.** Think "high-end property care," not "guy with a hose." Five brand assets were provided (a final brand guideline + logo lockups). Use the **"PRESSURE-IT / Premium Property Care"** system (the bold custom **P-mark**), not the brush-script variant.

### 2.1 Colour palette (exact)
| Token | Hex | Use |
|---|---|---|
| `accent` (brand yellow) | `#FDEB00` | Primary accent, CTAs, highlights, the "IT", underlines |
| `ink` (black) | `#000000` | Page background |
| `ink-soft` (off-black) | `#1A1A1A` | Cards, panels, raised surfaces |
| `bone` (white) | `#FFFFFF` | Primary text on dark |
| `line` | `rgba(255,255,255,0.10)` | Hairline borders |
| `muted` | `rgba(255,255,255,0.60)` | Secondary text |

Some source assets use `#FFD400`. Standardise on **`#FDEB00`** as the canonical accent and expose it as a CSS variable + Tailwind token so the owner can override it from `site_settings` later.

### 2.2 Typography
- **Headings / display:** **Anton** (Google Fonts) — uppercase, tight tracking, heavy. This is the hero/heading face.
- **Body:** **Montserrat** (Google Fonts).
- Load via `next/font/google`. Expose as CSS variables `--font-display` and `--font-body`. Headings default to uppercase with slightly negative letter-spacing.

### 2.3 Logo & the P-mark
- The user will drop final logo files into `/public/brand/`. **Expect and reference these filenames** (create the folder and a README listing them; if a file is missing, fall back to a text logo gracefully):
  - `/public/brand/logo-primary.svg` (P-mark + "PRESSURE-IT" + "PREMIUM PROPERTY CARE", for dark backgrounds)
  - `/public/brand/logo-onecolour.svg` (white/one-colour version)
  - `/public/brand/icon-mark.svg` (the P-mark alone — used for favicon, PWA icon, social avatar)
  - `/public/brand/logo.png` (raster fallback)
- **The P-mark meaning** (use as microcopy / an "About the mark" touch if it fits): Roof line = the homes we protect & restore · Water flow = pressure-cleaning expertise · Precision spray = attention to detail · Transformation curve = before & after, restored & renewed.
- Generate favicons + PWA icons from the icon mark (or a placeholder if absent).

### 2.4 Art direction
- Dark backgrounds, generous whitespace, big confident type, yellow used sparingly as a "spotlight."
- Subtle motion only: fade/slide-in on scroll, hover lifts on cards, a smooth before/after slider. No gratuitous animation, nothing janky on mobile.
- Photography-forward: before/after imagery is the star. Treat images with rounded corners (`rounded-2xl`), subtle borders (`border-line`), and tasteful shadows.
- Must look **expensive on a phone first** (most traffic will be mobile), then scale up beautifully to desktop.
- Accessibility: maintain WCAG AA contrast. Yellow text on black is fine for large/bold; avoid small yellow body text on black — use `bone`/`muted` for body.

---

## 3. Tech stack (use exactly this — proven pattern)

- **Framework:** Next.js (latest stable, App Router, TypeScript, Server Actions).
- **Styling:** Tailwind CSS (latest) + a small set of CSS variables for brand tokens. Use `shadcn/ui`-style primitives only if helpful; keep dependencies lean.
- **Backend / DB / Auth / Storage:** **Supabase** (Postgres + Auth + Storage + Row Level Security).
- **Email:** **Resend** (transactional — quote-request notifications to Sharon + auto-acknowledgement to the customer).
- **Image compression:** `browser-image-compression` (compress client-side before upload).
- **Validation:** **Zod** on every server action and form.
- **Icons:** `lucide-react`.
- **Toasts:** `sonner`.
- **PWA:** `@serwist/next` (set up the structure; installable manifest + icons now, richer offline later).
- **Deploy target:** Netlify **or** Vercel — include config for both where trivial, but optimise for Vercel. Provide a `netlify.toml` only if using Netlify.

**Do NOT include** (explicitly out of scope, keep it lean): internationalisation / multi-locale, recipe/blog/film/map-pin modules, AI features, Google Maps. (These came from a reference project — ignore them.)

> Package manager: use **pnpm**. Node 20+.

---

## 4. Environment variables

Create `.env.example` with these keys (and read them through a typed config module, never inline):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server only — NEVER expose to client

# Email (Resend)
RESEND_API_KEY=
QUOTE_NOTIFY_TO=sharon@pressure-it.co.za
QUOTE_FROM_EMAIL=quotes@pressure-it.co.za   # must be a Resend-verified domain/sender

# App
NEXT_PUBLIC_SITE_URL=https://www.pressure-it.co.za
REVALIDATE_SECRET=                  # optional, for on-demand revalidation
```

Never commit `.env`. Add it to `.gitignore`.

---

## 5. Architecture overview

```
app/
  (public)/
    layout.tsx                 # public shell: header, footer, brand chrome
    page.tsx                   # HOME (hero, services, before/after, why-us, testimonials, quote CTA)
    services/page.tsx          # all services
    services/[slug]/page.tsx   # single service detail (optional v1; can be anchor sections)
    gallery/page.tsx           # full before/after gallery
    about/page.tsx             # story, heritage, trust signals
    contact/page.tsx           # contact details + quote form
    quote/page.tsx             # dedicated quote-request form (or modal reused)
  admin/
    layout.tsx                 # AUTH GATE + admin shell (sidebar)
    login/page.tsx             # Supabase email/password login
    page.tsx                   # dashboard (counts + new-lead badge)
    settings/                  # edit hero, contact, service areas, theme
    services/                  # CRUD services
    gallery/                   # CRUD before/after pairs (the headline admin feature)
    quotes/                    # inbox of quote_requests with status pipeline
  api/
    revalidate/route.ts        # optional on-demand ISR
    manifest/route.ts          # (if you generate the PWA manifest dynamically)
components/
  ui/                          # buttons, inputs, dialog, toast wrappers
  public/                      # Hero, ServiceCard, BeforeAfterSlider, QuoteForm, Footer, Header...
  admin/                       # ImageUploader, EntityTable, forms...
lib/
  supabase/{client,server,middleware}.ts
  email/resend.ts
  config.ts                    # typed env access
  utils.ts
db/
  migrations/                  # numbered .sql files (single source of truth)
  seed.sql                     # seed services + site_settings + sample gallery
public/
  brand/                       # logos, icon mark
  icons/                       # pwa icons
middleware.ts                  # protect /admin/* , attach x-pathname
```

**Routing rules**
- Public pages are statically rendered / ISR where possible, reading published content from Supabase.
- After any admin save, call `revalidatePath()` for the affected public route(s) so edits go live immediately.
- `/admin/**` is dynamic and auth-gated. Exclude `/admin` and `/api` from any PWA precache.

---

## 6. Data model (Supabase / Postgres)

Write these as **numbered SQL migration files** in `db/migrations/` (e.g. `001_extensions.sql` … `008_seed.sql`). Use `gen_random_uuid()`, `timestamptz`, a shared `set_updated_at()` trigger function, and **enable Row Level Security on every table**. This is the most important section — get it right first.

### 6.1 `profiles` (admin users)
1:1 with `auth.users`. Auto-created on signup via trigger.
```
id          uuid pk references auth.users on delete cascade
name        text
role        text not null default 'editor' check (role in ('admin','editor'))
created_at  timestamptz default now()
```
- RLS: a user may select/update their own row. Role escalation only via service role (no user-writable policy on `role`).
- Trigger `handle_new_user()` inserts a profile on `auth.users` insert.

### 6.2 `site_settings` (single editable row)
```
id              boolean pk default true check (id)          -- enforces one row
hero_eyebrow    text   default 'PREMIUM PROPERTY CARE'
hero_line1      text   default 'RESTORE.'
hero_line2      text   default 'PROTECT.'
hero_line3      text   default 'TRANSFORM.'
hero_subtitle   text   default 'Durban''s premium property-care specialists since 2010. We restore, protect and transform your most valuable asset.'
hero_image      text                                        -- storage path
phone           text   default '074 851 8879'
email           text   default 'sharon@pressure-it.co.za'
whatsapp        text   default '27748518879'                -- intl format for wa.me links
facebook_url    text   default 'https://www.facebook.com/pressurecleaningdurban/'
service_areas   jsonb  not null default '[]'                -- ["Durban North","Umhlanga",...]
stats           jsonb  not null default '[]'                -- [{label,value,suffix}] e.g. years, properties
theme           jsonb  not null default '{}'                -- {accent,ink,bone,...} optional overrides
updated_at      timestamptz default now()
```
- RLS: **public read** (the homepage needs it); **admin/editor update** only. Seed exactly one row.

### 6.3 `services`
```
id           uuid pk default gen_random_uuid()
slug         text unique not null
title        text not null
short_desc   text                                -- one-liner for cards
body         text                                -- longer markdown for detail
icon         text                                -- lucide icon name OR storage path
image        text                                -- optional hero image (storage path)
features     jsonb default '[]'                  -- ["Barge boards","Gutters",...]
sort_order   int default 0
published    boolean default true
created_at   timestamptz default now()
updated_at   timestamptz default now()
```
- RLS: public read where `published = true`; admin read-all + write-all.

### 6.4 `before_after` (THE headline feature)
```
id            uuid pk default gen_random_uuid()
title         text                               -- e.g. "Tile roof — Hillcrest"
caption       text
service_slug  text                               -- optional link to services.slug (no hard FK; keep soft)
location      text                               -- e.g. "Kloof"
before_image  text not null                      -- storage path
after_image   text not null                      -- storage path
sort_order    int default 0
featured      boolean default false              -- show on homepage highlights
published     boolean default true
created_at    timestamptz default now()
updated_at    timestamptz default now()
```
- RLS: public read where `published = true`; admin read-all + write-all.

### 6.5 `testimonials`
```
id          uuid pk default gen_random_uuid()
name        text not null
location    text
quote       text not null
rating      int default 5 check (rating between 1 and 5)
sort_order  int default 0
published   boolean default true
created_at  timestamptz default now()
```
- RLS: public read where published; admin write.

### 6.6 `quote_requests` (lead capture)
```
id            uuid pk default gen_random_uuid()
name          text not null
phone         text not null
email         text
service       text                               -- service of interest
area          text                               -- suburb / service area
message       text
status        text not null default 'new'
              check (status in ('new','contacted','quoted','won','lost'))
source        text default 'website'
created_at    timestamptz default now()
updated_at    timestamptz default now()
```
- RLS: **public INSERT allowed** (anonymous visitors submit). **No public select/update/delete.** Admin/editor may select + update (to move status, add notes). The insert policy must allow `anon` role to insert but nothing else.
- Add an index on `status` and `created_at desc`.

### 6.7 `media_assets` (upload ledger — optional but recommended)
```
id            uuid pk default gen_random_uuid()
storage_path  text not null
uploaded_by   uuid references auth.users
width         int
height        int
created_at    timestamptz default now()
```
- RLS: admin read/write only.

### 6.8 Storage bucket
- Create a public bucket **`media`** (public read; authenticated insert/update/delete). Limit to images, max ~5 MB, mime allowlist `image/jpeg,image/png,image/webp`.
- Public pages render images via the public object URL; configure `next.config` `images.remotePatterns` to allow `*.supabase.co/storage/v1/object/public/**`.

### 6.9 Seed (`db/seed.sql`)
- One `site_settings` row (defaults above + the full service-areas array from §1).
- The 10 services from §1 with slugs, short descriptions, sensible lucide icon names, and features.
- 2–3 sample testimonials (clearly placeholder, easy to delete).
- Leave `before_after` empty (Sharon adds real ones) but include 1 commented example insert.

---

## 7. Auth & admin gating

- Email/password auth via Supabase. **No public signup UI.** Sharon's user is created manually (document the `supabase` SQL/console steps in the README) or via a one-off `scripts/create-admin.ts` that uses the service-role key.
- `middleware.ts`: refresh the Supabase session and **protect `/admin/**`** (redirect unauthenticated users to `/admin/login`). Also set an `x-pathname` header so the admin layout can detect the login route. Do **not** run middleware auth on the login page itself.
- `app/admin/layout.tsx`: server-side, fetch the user, look up `profiles.role`, and require `role in ('admin','editor')`. If not, redirect to `/admin/login?error=unauthorized`. Render the sidebar shell otherwise.
- Provide a clear **logout** button.
- Login form: friendly, branded, shows validation + a generic "invalid credentials" error (don't leak which field was wrong).

---

## 8. Server actions pattern (use everywhere for writes)

Every mutation is a `'use server'` action that:
1. Creates the Supabase server client.
2. Re-checks `auth.getUser()` — return `{ ok:false, message:'Unauthorized' }` if missing (defence in depth even behind middleware).
3. Parses input with a **Zod** schema; return the first issue message on failure.
4. Performs the DB write (or Storage op).
5. Calls `revalidatePath()` for affected public routes.
6. Returns a typed `{ ok, message }` so the client can toast success/error.

The **quote submission** action is the one public-facing write — it must work for anonymous users (insert policy permits `anon`), then trigger emails (§9). Rate-limit lightly (e.g. basic honeypot field + minimum-time check) to deter spam; add an invisible honeypot input to the form.

---

## 9. Quote requests — the lead flow (high value)

When a visitor submits the quote form:
1. Validate (Zod). Honeypot must be empty.
2. Insert into `quote_requests` (status `new`).
3. **Email Sharon** via Resend: clear subject like `New quote request — {name} ({service})`, body with all fields + a tappable phone/WhatsApp link.
4. **Auto-acknowledge the customer** (if they gave an email): branded "Thanks, we've got your request and will be in touch" message.
5. Show a success state on the site (toast + inline confirmation). Never lose the lead if email fails — the DB row is the source of truth; email is best-effort (catch + log, still return success if the row saved).
6. Offer a **WhatsApp shortcut** alongside the form: a prominent "WhatsApp us" button using `https://wa.me/{whatsapp}?text=...` prefilled — many SA customers prefer this.

In `/admin/quotes`: a table/inbox sorted newest-first, a "NEW" badge count in the sidebar/dashboard, click to view full detail, and a control to move status through `new → contacted → quoted → won/lost`. Tappable phone/email/WhatsApp links on each lead.

---

## 10. Public pages — detailed requirements

### 10.1 Header
- Sticky, dark, translucent on scroll. Left: logo (icon mark + wordmark). Right: nav (Home, Services, Gallery, About, Contact) + a bright yellow **"Get a Free Quote"** button and a **click-to-call** phone link. Mobile: hamburger → full-screen overlay menu. A persistent **floating WhatsApp button** bottom-right on mobile.

### 10.2 Home (the showcase) — sections in order
1. **Hero** — full-bleed dark, P-mark, big Anton headline pulling `hero_line1/2/3` with "TRANSFORM." in yellow, subtitle, two CTAs ("Get a Free Quote" primary, "See the Transformations" → gallery). Optional hero image/overlay from `site_settings.hero_image`. Trust strip beneath (Since 2010 · Fully Insured · Supervisor on Site · 100% Satisfaction).
2. **Stats band** — animated count-up of `stats` (e.g. "16+ Years", "100% Satisfaction", "1000s of Properties"). Compute years dynamically.
3. **Services grid** — cards from `services` (icon, title, short_desc), hover lift, link to detail/section. "View all services" CTA.
4. **Before/After highlights** — 3–6 `featured` pairs using the **interactive before/after slider** component (drag handle). "See full gallery" CTA.
5. **Why choose us** — the four pillars (Protects Investment · Enhances Curb Appeal · Increases Property Value · Healthier Environment) with icons.
6. **Process** — "How it works" 3–4 steps (Request a quote → On-site assessment → We restore → You impress). 
7. **Testimonials** — from `testimonials`, rated.
8. **Service areas** — a clean list/tag-cloud from `site_settings.service_areas`.
9. **Big CTA band** — "Ready to transform your property?" + quote button + phone.
10. **Footer** — logo, contact (phone/email/WhatsApp/Facebook), quick links, service areas, "Stronger Spaces. Better Impressions.", since-2010, fully-insured. Copyright + small "Admin" link to `/admin`.

### 10.3 Services page
- Intro + grid of all published services. Each card → detail (either `/services/[slug]` pages or anchor sections). Detail shows `body`, `features` list, related before/after, and a quote CTA.

### 10.4 Gallery page
- Grid of all published `before_after` entries, each as an interactive slider or before/after toggle, filterable by `service_slug` (simple tabs/pills). Lightbox on tap. This page must feel like the "wow."

### 10.5 About page
- The story (since 2010, Durban, Sharon-led), the P-mark meaning, the 2010 FIFA bus-washing heritage anecdote, eco-friendly chemicals + 80% water saving, full trust-signal list, "The Promise" block.

### 10.6 Contact page
- Contact details (tappable phone, email, WhatsApp, Facebook), service areas, business hours if provided, and the **quote form**. Optionally an embedded simple map iframe of Durban (static, no API key) — keep optional.

### 10.7 Quote form (reusable component)
- Fields: Name*, Phone*, Email, Service (select from published services), Area (select/free text from service areas), Message, hidden honeypot. Inline validation, clear success state, WhatsApp alternative. Used on Home CTA (modal), Contact, and `/quote`.

---

## 11. Admin panel — detailed requirements

General: dark, simple, **thumb-friendly**, big tap targets, obvious save buttons, toasts on every action, optimistic where safe, confirm dialogs before delete. Every list has an empty-state with a friendly "Add your first …" prompt. Assume Sharon is on a phone.

- **Login** (`/admin/login`) — branded email/password.
- **Dashboard** (`/admin`) — tiles with live counts (Services, Before/After, Quote Requests, Testimonials), a prominent **"X new quote requests"** alert linking to the inbox, and quick-action buttons ("Add Before/After", "Add Service", "Edit Homepage").
- **Before/After** (`/admin/gallery`) — list + **Add/Edit form**: title, caption, location, service (select), `featured` toggle, `published` toggle, sort order, and **two image uploaders** (Before, After) with: drag/drop or tap-to-pick, client-side compression, live preview, progress, replace, and clear validation ("Before image required"). This is the most-used screen — make it delightful.
- **Services** (`/admin/services`) — list (reorderable by sort_order) + form: title, slug (auto from title, editable), short desc, body, icon (lucide name picker or text), features (add/remove chips), image, published.
- **Homepage / Settings** (`/admin/settings`) — edit hero (eyebrow + 3 lines + subtitle + image), contact details (phone/email/WhatsApp/Facebook), service-areas (add/remove chips), stats (add/remove), optional theme accent override with a colour picker (live-preview the accent).
- **Testimonials** (`/admin/testimonials`) — simple CRUD.
- **Quotes** (`/admin/quotes`) — inbox (§9): newest first, status pipeline, detail view, tappable contact links, optional CSV export.
- **Image uploader component** (shared): accepts an image → compress (max ~1600px long edge, ~0.8 quality, target <1MB) → upload to `media` bucket under a sensible path (e.g. `before-after/{uuid}.webp`) → record in `media_assets` → return the storage path to the form. Handle errors with toasts. Show existing image with a "Replace" / "Remove" affordance.

---

## 12. PWA

- Add a web app manifest (name "Pressure-It", short_name "Pressure-It", theme `#000000`, background `#000000`, icons from the P-mark, display `standalone`).
- Wire `@serwist/next` with a service worker (`app/sw.ts`), **disabled in dev**, excluding `/admin/**` and `/api/**` from precache.
- Generate maskable + standard icons (192, 512) and apple-touch-icon from `/public/brand/icon-mark.svg` (or a generated placeholder).
- The public site should be installable and load fast; full offline caching of dynamic content is **not** required for v1, but don't break SSR/ISR.

---

## 13. SEO, performance, analytics

- Per-page `metadata` (title, description, Open Graph + Twitter card) — Durban-focused keywords: "high pressure cleaning Durban", "roof cleaning Durban", "property restoration Durban".
- `generateMetadata` for service pages from DB content.
- JSON-LD `LocalBusiness` structured data (name, phone, area served = Durban, priceRange, sameAs Facebook).
- `sitemap.ts` and `robots.ts`. (Old site blocked crawlers — **allow** crawling now.)
- OG image: use the brand/P-mark; optionally a generated OG image route.
- Optimise images via `next/image`. Lighthouse target: 90+ on mobile for the public home page. Lazy-load below-the-fold imagery and the before/after sliders.
- Keep JS minimal on public pages (mostly server components; client components only for the sliders, forms, header menu, count-ups).

---

## 14. Quality bar / conventions

- TypeScript strict. No `any` without justification. Shared types for DB rows (generate or hand-write in `db/types.ts`).
- Tailwind tokens for brand colours (don't scatter raw hex). Define them once in the Tailwind config + CSS variables.
- Components small and composable. Server components by default; `'use client'` only when needed.
- Accessible: semantic HTML, labelled inputs, focus states, keyboard-operable menu and sliders, `alt` text on images (use caption/title).
- Error and loading states everywhere (loading.tsx / error.tsx where it helps).
- Lint + format clean (ESLint + Prettier). `pnpm typecheck`, `pnpm lint`, `pnpm build` must all pass.
- Don't hard-code business facts in components — read from `site_settings`/DB so Sharon controls them. The only hard-coded fallbacks are the defaults in `site_settings`.
- Commit in logical chunks; keep `db/migrations` as the single schema source of truth (no drift, no parallel migration folders).

---

## 15. Deliverables / README

Produce a top-level `README.md` that a non-developer-adjacent person could follow:
1. **What this is** (public site + admin).
2. **Prerequisites** (Node 20+, pnpm, a Supabase project, a Resend account + verified sender domain).
3. **Setup**: clone, `pnpm install`, copy `.env.example` → `.env`, fill keys.
4. **Database**: how to run the migrations + seed against Supabase (CLI or SQL editor), create the `media` bucket (covered by migration), and **create Sharon's admin user** (exact steps).
5. **Run locally**: `pnpm dev`.
6. **Deploy**: Vercel (or Netlify) steps + required env vars + setting `NEXT_PUBLIC_SITE_URL`.
7. **How Sharon uses it**: a short, plain-English "Owner's guide" — how to log in, add a before/after pair, edit services, change homepage text, read quote requests. Write this section warmly and simply.
8. **Adding the real logo files** to `/public/brand/`.
9. **Troubleshooting** (images not showing → check bucket public + remotePatterns; emails not sending → check Resend domain; can't log in → check user + profile role).

Also include `/public/brand/README.md` listing the exact logo filenames the app expects.

---

## 16. Build order (follow this sequence)

1. Scaffold Next.js (App Router, TS, Tailwind, pnpm). Configure Tailwind brand tokens + fonts (Anton/Montserrat) + CSS variables. Add `.env.example`, `.gitignore`, typed `lib/config.ts`.
2. Supabase clients (`client`, `server`, `middleware`) + `middleware.ts` (session + `/admin` protection + `x-pathname`).
3. **Write all migrations** (§6) + `seed.sql`. This is the foundation — do it before UI.
4. Auth: login page + admin layout gate + logout + admin-user creation script/docs.
5. Shared UI primitives + the **ImageUploader** (compression → Supabase Storage) + toasts.
6. Admin CRUD in this order: **Before/After**, **Services**, **Settings/Homepage**, **Testimonials**, **Quotes inbox**. Each with server actions + Zod + revalidate.
7. Public components: Header/Footer, Hero, ServiceCard, **BeforeAfterSlider**, QuoteForm (+ Resend wiring + WhatsApp).
8. Public pages: Home, Services, Gallery, About, Contact, Quote.
9. PWA (manifest + serwist + icons).
10. SEO (metadata, JSON-LD, sitemap, robots), performance pass, Lighthouse check.
11. README + Owner's guide + brand README. Final `typecheck`/`lint`/`build` green.

---

## 17. Definition of done

- [ ] Public site looks premium and on-brand (dark + `#FDEB00`, Anton/Montserrat) and is excellent on mobile first.
- [ ] Sharon can log in and: add/edit/delete before/after pairs (two-image upload with compression), edit services, edit homepage/hero/contact/service-areas, read & status-track quote requests — all without code or redeploys; edits appear live via revalidation.
- [ ] Quote form inserts a lead, emails Sharon, acknowledges the customer, offers WhatsApp, and survives email failure.
- [ ] RLS is on for every table; anonymous users can only insert quote requests and read published content; nothing else.
- [ ] Installable PWA; sensible favicons/icons.
- [ ] SEO basics + LocalBusiness JSON-LD + sitemap/robots (crawling allowed).
- [ ] `pnpm typecheck && pnpm lint && pnpm build` all pass.
- [ ] README lets a competent person deploy it and lets Sharon operate it.

---

### Appendix A — copy bank (use/adapt freely)
- Hero: "RESTORE. PROTECT. **TRANSFORM.**" / sub: "Durban's premium property-care specialists since 2010 — we restore, protect and transform your most valuable asset."
- CTA: "Get a Free Quote" · "See the Transformations" · "WhatsApp Us"
- Why-us: "Protects Your Investment", "Enhances Curb Appeal", "Increases Property Value", "Healthier Home Environment"
- Trust: "Fully Insured & Experienced", "Premium Quality Workmanship", "100% Satisfaction Guaranteed", "Supervisor On Site", "Expert Service Since 2010"
- Eco line: "Biodegradable, non-hazardous chemicals — and up to 80% less water than a garden hose."
- Closing: "Stronger Spaces. Better Impressions."

### Appendix B — what to deliberately NOT build (scope guard)
No multi-language, no blog/recipes/films/maps, no AI, no e-commerce, no online payments, no user accounts for the public, no Google Maps API. Keep v1 tight: marketing site + before/after + services + quote capture + owner admin.
