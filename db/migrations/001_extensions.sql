-- Enable required extensions
create extension if not exists "pgcrypto";

-- Shared trigger function for updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
