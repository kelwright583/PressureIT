# Pressure-It — Premium Property Care

A modern, mobile-first website and self-service admin panel for **Pressure-It**, Durban's premium property-care and high-pressure cleaning business.

## What This Is

**Two halves, one app:**

1. **Public marketing site** — dark, premium, high-impact. Showcases services, before/after transformations, captures quote requests, and drives leads via phone, WhatsApp, and email.
2. **Admin panel (`/admin`)** — a password-protected dashboard where the owner (Sharon) can manage everything from her phone: add before/after photo pairs, edit services, update the homepage, and track incoming quote requests — all without code or redeploys.

Built with Next.js 16, Supabase, Tailwind CSS, and deployed to Vercel.

---

## Prerequisites

- **Node.js** 20+
- **pnpm** (package manager)
- **Supabase** project (free tier works fine)
- **Resend** account with a verified sender domain (for email notifications)

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd PressureIt
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API (anon/public key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API (service_role key — keep secret!) |
| `RESEND_API_KEY` | Resend Dashboard > API Keys |
| `QUOTE_NOTIFY_TO` | Email address to receive quote notifications (default: sharon@pressure-it.co.za) |
| `QUOTE_FROM_EMAIL` | Must match a verified Resend sender |
| `NEXT_PUBLIC_SITE_URL` | Your live site URL |

### 3. Database setup

Run the SQL migration files in order against your Supabase project. You can do this via the **Supabase SQL Editor** (Dashboard > SQL Editor):

1. Run each file in `db/migrations/` in order (001 through 009)
2. Run `db/seed.sql` to populate initial data (services, testimonials, settings)

Or concatenate them:
```bash
cat db/migrations/*.sql db/seed.sql | pbcopy
# Paste into Supabase SQL Editor and run
```

### 4. Create the media storage bucket

In Supabase Dashboard > Storage:
1. Create a bucket called `media`
2. Set it to **Public**
3. Set file size limit to 5MB
4. Allow mime types: `image/jpeg`, `image/png`, `image/webp`
5. Add storage policies:
   - **Public read**: Allow `select` for all users
   - **Authenticated write**: Allow `insert`, `update`, `delete` for authenticated users

### 5. Create Sharon's admin user

In Supabase Dashboard > Authentication > Users > Add User:
- Email: `sharon@pressure-it.co.za`
- Password: (choose a strong password)
- The `profiles` table auto-populates via trigger with role = `admin`

### 6. Run locally

```bash
pnpm dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin panel.

---

## Deploy

### Vercel (recommended)

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.example`
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain
5. Deploy

### Netlify

1. Push to GitHub
2. Import in Netlify
3. Build command: `pnpm build`
4. Publish directory: `.next`
5. Add environment variables
6. Install the Next.js runtime plugin

---

## How Sharon Uses It (Owner's Guide)

### Logging in

1. Go to `yoursite.com/admin`
2. Enter your email and password
3. You'll see the dashboard with quick stats

### Adding a Before/After pair (the star feature!)

1. Click **Before/After** in the sidebar (or "Add Before/After" on the dashboard)
2. Click **Add New**
3. Fill in:
   - **Title** — e.g. "Tile Roof — Hillcrest"
   - **Location** — the suburb
   - **Service** — pick from the dropdown
   - Upload a **Before** photo and an **After** photo (they'll be compressed automatically)
   - Toggle **Featured** if you want it on the homepage
   - Toggle **Published** when ready to go live
4. Click **Save** — it appears on the site immediately!

### Editing services

1. Click **Services** in the sidebar
2. Click any service to edit its title, description, features, and icon
3. Click **Save** — changes go live immediately

### Editing the homepage

1. Click **Settings** in the sidebar
2. Update the hero text, subtitle, or upload a hero background image
3. Change contact details (phone, email, WhatsApp, Facebook)
4. Add or remove service areas
5. Click **Save**

### Reading quote requests

1. Click **Quotes** in the sidebar
2. New quotes appear with a yellow "NEW" badge
3. Click a quote to see full details — tap the phone number or WhatsApp to respond
4. Change the status as you work through them: New > Contacted > Quoted > Won/Lost

### Managing testimonials

1. Click **Testimonials** in the sidebar
2. Add, edit, or remove customer testimonials
3. Set star ratings and toggle published status

---

## Adding Real Logo Files

Place your brand files in `/public/brand/`:

- `logo-primary.svg` — Full logo for dark backgrounds
- `logo-onecolour.svg` — White/one-colour version
- `icon-mark.svg` — The P-mark alone (favicon, PWA icon)
- `logo.png` — Raster fallback

The app gracefully falls back to a text logo if files are missing.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Images not showing | Check the `media` storage bucket is set to Public. Verify `images.remotePatterns` in `next.config.ts` includes your Supabase URL. |
| Emails not sending | Verify your sender domain in Resend. Check `RESEND_API_KEY` and `QUOTE_FROM_EMAIL` match a verified sender. |
| Can't log in | Check the user exists in Supabase Auth. Verify a matching row exists in the `profiles` table with `role = 'admin'`. |
| Build errors | Run `pnpm typecheck` to see TypeScript errors. Ensure all env vars are set. |
| Admin pages return 404 | Ensure `proxy.ts` exists at project root (Next.js 16 uses `proxy.ts` instead of `middleware.ts`). |
| Changes not appearing | Admin saves call `revalidatePath()` automatically. Try a hard refresh (Ctrl+Shift+R). |

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript, Server Actions)
- **Supabase** (Postgres, Auth, Storage, Row Level Security)
- **Tailwind CSS v4** with brand tokens
- **Resend** (transactional email)
- **Zod** (validation)
- **Lucide React** (icons)
- **Sonner** (toast notifications)
