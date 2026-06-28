-- Create the public media storage bucket
-- NOTE: Run this via the Supabase dashboard or CLI, not plain SQL.
-- Supabase SQL editor may not support storage.buckets directly.
-- Included here for documentation purposes.

-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values (
--   'media',
--   'media',
--   true,
--   5242880, -- 5MB
--   array['image/jpeg', 'image/png', 'image/webp']
-- );

-- Storage policies (run in Supabase dashboard > Storage > Policies):
-- 1. Public read: allow select for all users
-- 2. Authenticated insert: allow insert for authenticated users
-- 3. Authenticated update: allow update for authenticated users
-- 4. Authenticated delete: allow delete for authenticated users
