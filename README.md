# Kenangan Kelompok

Website untuk menyimpan kenangan kelompok teman — setiap foto bisa punya
banyak cerita dari orang yang berbeda, tanpa perlu login.

## Struktur data

```
Foto (siapa saja bisa unggah)
├── Gambar
├── Judul momen (opsional)
├── Tanggal kejadian (opsional)
├── Diunggah oleh
│
└── Cerita (banyak, dari siapa saja, boleh berkali-kali)
    ├── Nama penulis
    ├── Cerita panjang
    └── Waktu ditulis
```

## 1. Setup Supabase

1. Buka [supabase.com](https://supabase.com) → buat project baru (gratis).
2. Setelah project selesai dibuat, buka **SQL Editor** → **New query**,
   lalu salin-tempel isi file `supabase/schema.sql` dan klik **Run**.
   Ini membuat tabel `photos` dan `stories`.
3. Ikuti `supabase/storage-setup.md` untuk membuat bucket foto bernama `photos`.
4. Buka **Project Settings > API**, salin **Project URL** dan **anon public key**.

## 2. Setup project di komputer kamu

```bash
npm install
cp .env.example .env
```

Buka file `.env`, isi dengan URL dan anon key dari langkah di atas:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=isi-dengan-anon-key-kamu
```

Jalankan di lokal untuk dicoba dulu:

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

## 3. Push ke GitHub

```bash
git init
git add .
git commit -m "Inisialisasi kenangan kelompok"
git branch -M main
git remote add origin https://github.com/USERNAME/kenangan-kelompok.git
git push -u origin main
```

(`.env` sudah otomatis diabaikan oleh `.gitignore`, jadi kunci Supabase
kamu tidak ikut ter-upload ke GitHub.)

## 4. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → login pakai akun GitHub kamu.
2. **New Project** → pilih repo `kenangan-kelompok`.
3. Sebelum deploy, buka bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (isi dengan nilai yang sama seperti di file `.env` kamu)
4. Klik **Deploy**.

Setiap kali kamu `git push` ke branch `main`, Vercel otomatis build ulang
dan update situsnya.

## Catatan keamanan

Website ini sengaja dibuat **tanpa login** supaya gampang dipakai semua
anggota kelompok. Konsekuensinya: siapa saja yang punya link situsnya bisa
menambah foto dan cerita. Ini aman untuk dipakai di antara teman-teman yang
saling percaya, tapi jangan sebar link-nya ke luar kelompok kamu.
