-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query
-- Kalau tabel & policy sebelumnya sudah ada, bagian "create table" dan
-- 4 policy pertama akan gagal dengan pesan "already exists" - itu normal,
-- lewati saja dan jalankan bagian "POLICY HAPUS (BARU)" di bawah.

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  event_date date,
  uploader_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null references photos(id) on delete cascade,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists stories_photo_id_idx on stories(photo_id);

alter table photos enable row level security;
alter table stories enable row level security;

create policy "Siapa saja bisa lihat foto" on photos for select using (true);
create policy "Siapa saja bisa unggah foto" on photos for insert with check (true);
create policy "Siapa saja bisa lihat cerita" on stories for select using (true);
create policy "Siapa saja bisa menambah cerita" on stories for insert with check (true);

-- =========================================
-- POLICY HAPUS (BARU) — hanya admin (login) yang boleh menghapus
-- =========================================

create policy "Hanya admin bisa hapus foto"
  on photos for delete
  using (auth.role() = 'authenticated');

create policy "Hanya admin bisa hapus cerita"
  on stories for delete
  using (auth.role() = 'authenticated');
