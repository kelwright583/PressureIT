-- Testimonials table
create table testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  location    text,
  quote       text not null,
  rating      int default 5 check (rating between 1 and 5),
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now()
);

alter table testimonials enable row level security;

-- Public can read published testimonials
create policy "Public read published testimonials"
  on testimonials for select
  using (published = true);

-- Admin can read all
create policy "Admin read all testimonials"
  on testimonials for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can insert
create policy "Admin insert testimonials"
  on testimonials for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can update
create policy "Admin update testimonials"
  on testimonials for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can delete
create policy "Admin delete testimonials"
  on testimonials for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );
