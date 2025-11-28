-- Create the bucket 'consentimiento' if it doesn't exist
insert into storage.buckets (id, name, public)
values ('consentimiento', 'consentimiento', true)
on conflict (id) do nothing;

-- Drop existing policies to avoid conflicts if re-running
drop policy if exists "Allow Authenticated Uploads" on storage.objects;
drop policy if exists "Allow Public Access" on storage.objects;
drop policy if exists "Allow Individual Delete" on storage.objects;

-- POLICY 1: Allow authenticated users to upload files to 'consentimiento' bucket
create policy "Allow Authenticated Uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'consentimiento' );

-- POLICY 2: Allow public access to view files in 'consentimiento' bucket
create policy "Allow Public Access"
on storage.objects for select
to public
using ( bucket_id = 'consentimiento' );

-- POLICY 3: Allow users to update/delete their own files
create policy "Allow Individual Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'consentimiento' and auth.uid() = owner );
