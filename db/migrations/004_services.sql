-- Services table
create table services (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  short_desc   text,
  body         text,
  icon         text,
  image        text,
  features     jsonb default '[]',
  sort_order   int default 0,
  published    boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table services enable row level security;

-- Public can read published services
create policy "Public read published services"
  on services for select
  using (published = true);

-- Admin can read all services
create policy "Admin read all services"
  on services for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can insert services
create policy "Admin insert services"
  on services for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can update services
create policy "Admin update services"
  on services for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can delete services
create policy "Admin delete services"
  on services for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

create trigger services_updated_at
  before update on services
  for each row execute function set_updated_at();
