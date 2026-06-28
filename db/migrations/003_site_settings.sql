-- Site settings (single row)
create table site_settings (
  id              boolean primary key default true check (id),
  hero_eyebrow    text default 'PREMIUM PROPERTY CARE',
  hero_line1      text default 'RESTORE.',
  hero_line2      text default 'PROTECT.',
  hero_line3      text default 'TRANSFORM.',
  hero_subtitle   text default 'Durban''s premium property-care specialists since 2010. We restore, protect and transform your most valuable asset.',
  hero_image      text,
  phone           text default '074 851 8879',
  email           text default 'sharon@pressure-it.co.za',
  whatsapp        text default '27748518879',
  facebook_url    text default 'https://www.facebook.com/pressurecleaningdurban/',
  service_areas   jsonb not null default '[]',
  stats           jsonb not null default '[]',
  theme           jsonb not null default '{}',
  updated_at      timestamptz default now()
);

alter table site_settings enable row level security;

-- Public can read (homepage needs it)
create policy "Public read site_settings"
  on site_settings for select
  using (true);

-- Only authenticated admin/editor can update
create policy "Admin update site_settings"
  on site_settings for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

create trigger site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();
