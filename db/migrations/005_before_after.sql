-- Before/After gallery table
create table before_after (
  id            uuid primary key default gen_random_uuid(),
  title         text,
  caption       text,
  service_slug  text,
  location      text,
  before_image  text not null,
  after_image   text not null,
  sort_order    int default 0,
  featured      boolean default false,
  published     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table before_after enable row level security;

-- Public can read published entries
create policy "Public read published before_after"
  on before_after for select
  using (published = true);

-- Admin can read all
create policy "Admin read all before_after"
  on before_after for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can insert
create policy "Admin insert before_after"
  on before_after for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can update
create policy "Admin update before_after"
  on before_after for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can delete
create policy "Admin delete before_after"
  on before_after for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

create trigger before_after_updated_at
  before update on before_after
  for each row execute function set_updated_at();
