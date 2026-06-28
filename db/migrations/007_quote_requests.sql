-- Quote requests (lead capture)
create table quote_requests (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text not null,
  email         text,
  service       text,
  area          text,
  message       text,
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  source        text default 'website',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table quote_requests enable row level security;

-- Anonymous visitors can insert (submit quote requests)
create policy "Anon insert quote_requests"
  on quote_requests for insert
  with check (true);

-- Admin can read all quote requests
create policy "Admin read quote_requests"
  on quote_requests for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Admin can update quote requests (status changes)
create policy "Admin update quote_requests"
  on quote_requests for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

-- Indexes for performance
create index idx_quote_requests_status on quote_requests (status);
create index idx_quote_requests_created_at on quote_requests (created_at desc);

create trigger quote_requests_updated_at
  before update on quote_requests
  for each row execute function set_updated_at();
