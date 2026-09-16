-- Jalankan file ini di Supabase Dashboard > SQL Editor > New query

-- Tabel foto (pusat kenangan)
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  event_date date,
  uploader_name text not null,
  created_at timestamptz not null default now()
);

-- Tabel cerita (banyak cerita per foto, dari siapa saja)
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null references photos(id) on delete cascade,
  author_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists stories_photo_id_idx on stories(photo_id);

-- Aktifkan Row Level Security
alter table photos enable row level security;
alter table stories enable row level security;

-- Karena website ini dipakai tanpa login (semua anggota kelompok
-- pakai kunci "anon" yang sama), kita izinkan siapa saja yang punya
-- link untuk membaca dan menambah data. Jangan bagikan URL & anon key
-- proyek ini ke luar kelompok kamu.

create policy "Siapa saja bisa lihat foto"
  on photos for select
  using (true);

create policy "Siapa saja bisa unggah foto"
  on photos for insert
  with check (true);

create policy "Siapa saja bisa lihat cerita"
  on stories for select
  using (true);

create policy "Siapa saja bisa menambah cerita"
  on stories for insert
  with check (true);
