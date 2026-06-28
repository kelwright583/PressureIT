-- Media assets (upload ledger)
create table media_assets (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text not null,
  uploaded_by   uuid references auth.users,
  width         int,
  height        int,
  created_at    timestamptz default now()
);

alter table media_assets enable row level security;

-- Admin can read/write media assets
create policy "Admin read media_assets"
  on media_assets for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

create policy "Admin insert media_assets"
  on media_assets for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );

create policy "Admin delete media_assets"
  on media_assets for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'editor')
    )
  );
