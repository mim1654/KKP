# Setup Storage (untuk foto)

Ini dilakukan lewat Supabase Dashboard, bukan SQL Editor:

1. Buka **Storage** di sidebar dashboard Supabase kamu.
2. Klik **New bucket**.
3. Nama bucket: `photos` (harus sama persis, huruf kecil semua).
4. Aktifkan **Public bucket** (supaya foto bisa ditampilkan langsung di website tanpa login).
5. Klik **Save**.

Setelah bucket dibuat, buka bucket `photos` > tab **Policies**, lalu tambahkan policy berikut (klik **New policy** > **For full customization**):

- **Nama:** Siapa saja bisa unggah foto
  **Allowed operation:** INSERT
  **Target roles:** anon, authenticated
  **USING/WITH CHECK expression:** `true`

- **Nama:** Siapa saja bisa lihat foto
  **Allowed operation:** SELECT
  **Target roles:** anon, authenticated
  **USING expression:** `true`

Kalau bucket sudah diatur **Public**, biasanya policy SELECT ini otomatis ada — tinggal cek saja.
