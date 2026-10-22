# Logia Creative CMS - Panduan Lengkap & Setup

CMS mandiri (headless) untuk website Logia Creative, dibangun di atas Next.js 15 App Router tanpa ketergantungan pada CMS atau database pihak ketiga (tanpa Sanity, Supabase, Firebase, Upstash, atau Vercel Blob).

Data disimpan dalam format file JSON di `/content/` dan media foto WebP terkompresi di `/public/uploads/`.
- **Mode Lokal (`local`)**: Menulis langsung ke sistem file lokal dengan revalidasi instan.
- **Mode Produksi (`github`)**: Menulis ke GitHub repository secara atomik via Git Data API (blob → tree → commit → update ref) yang secara otomatis memicu deployment di Vercel.

---

## 1. Setup Variabel Lingkungan (`.env.local`)

Salin konfigurasi berikut ke file `.env.local` Anda (atau Environment Variables di dashboard Vercel):

```bash
# Driver CMS: 'local' untuk pengembangan di PC lokal, 'github' untuk produksi di Vercel
CMS_STORE_DRIVER=local

# Kredensial GitHub (Wajib jika CMS_STORE_DRIVER=github)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=DiandraCahya
GITHUB_REPO=Logia-Creative
GITHUB_BRANCH=main

# Autentikasi Admin
# Password hash scrypt (dibuat via npm run cms:hash)
ADMIN_PASSWORD_HASH=
# Kunci rahasia HMAC untuk menandatangani cookie session (minimal 32 karakter acak)
SESSION_SECRET=
```

---

## 2. Cara Membuat Password Admin & Session Secret

### A. Membuat Password Admin (`ADMIN_PASSWORD_HASH`)
Jalankan perintah ini di terminal:
```bash
npm run cms:hash
```
1. Masukkan password admin yang Anda inginkan saat diminta.
2. Script akan menghasilkan hash berformat `<salt>:<hash>` dengan algoritma scrypt standar Node.js `node:crypto`.
3. Salin hasilnya ke `ADMIN_PASSWORD_HASH=` di `.env.local` (dan Vercel).

### B. Membuat `SESSION_SECRET`
Jalankan perintah satu baris ini di terminal untuk mendapatkan string acak 64 karakter yang aman:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Salin hasilnya ke `SESSION_SECRET=` di `.env.local` (dan Vercel).

---

## 3. Cara Mengambil GitHub Personal Access Token (PAT)

Jika CMS dijalankan di Vercel (`CMS_STORE_DRIVER=github`), CMS membutuhkan token GitHub untuk menulis data langsung ke repo Anda:

1. Buka [GitHub](https://github.com) dan login ke akun Anda.
2. Klik foto profil di pojok kanan atas → **Settings**.
3. Di bilah menu kiri, scroll ke paling bawah dan klik **Developer settings**.
4. Pilih **Personal access tokens** → **Tokens (classic)**.
5. Klik tombol **Generate new token** → **Generate new token (classic)**.
6. Isi formulir:
   - **Note**: `Logia Creative CMS Token`
   - **Expiration**: Pilih masa berlaku yang diinginkan (misal: *90 days* atau *No expiration*).
   - **Select scopes**: Centang kotak **`repo`** (Full control of private repositories).
7. Scroll ke bawah dan klik tombol hijau **Generate token**.
8. **PENTING**: Segera salin token yang diawali dengan `ghp_...`. GitHub hanya menampilkannya sekali.
9. Tempelkan token tersebut ke `GITHUB_TOKEN=` di `.env.local` Anda dan di Environment Variables project Vercel Anda.

---

## 4. Cara Menggunakan CMS

Akses panel admin di browser:
👉 **`http://localhost:3000/admin`** (atau `https://domain-anda.vercel.app/admin`)

### Fitur Utama:
1. **Ringkasan (`/admin`)**:
   Dashboard status sistem, driver aktif, statistik jumlah karya, paket rate card, promo, testimoni, dan galeri foto.
2. **Editor Teks (`/admin/teks`)**:
   - Mengubah seluruh teks per section (Splash Screen, Navbar, Hero, Target Pasar, Profil Perusahaan, Layanan, Footer).
   - Dilengkapi pemisah kata/heading bergaya, counter karakter, penunjuk lokasi, dan tombol pratinjau langsung ke section terkait.
   - Terintegrasi dengan Media Picker untuk mengganti foto hero dan ilustrasi.
3. **Pengelola Koleksi (`/admin/koleksi`)**:
   - **Selected Work**: Tambah, edit, reorder, dan hapus proyek portofolio.
   - **Promo & Penawaran**: Kelola promo musiman (kode kupon, potongan harga, tanggal aktif).
   - **Testimoni Klien**: Kelola kutipan klien dan foto profil.
   - **Rate Card**: Kelola solusi, paket harga (bulanan/proyek), fitur, serta syarat & ketentuan.
4. **Galeri Media (`/admin/media`)**:
   - Drag & drop foto (JPEG, PNG, WebP, AVIF). File SVG diblokir demi keamanan.
   - Otomatis dikompresi di browser via Canvas API: sisi terpanjang maksimal 1600px, format WebP kualitas tinggi (< 1MB).
   - Proteksi Hapus: Foto yang masih dipakai oleh proyek, testimoni, atau teks halaman dicegah terhapus secara otomatis.
5. **Publikasi & Rilis (`/admin/publikasi`)**:
   - Menampilkan ringkasan data yang diubah.
   - Tombol **Publikasikan Sekarang**: Melakukan commit atomik tunggal ke GitHub repository (`cms: <catatan>`) yang memicu auto-deploy Vercel, atau memperbarui cache di PC lokal.
   - **Deteksi Konflik SHA**: Jika repositori di GitHub telah diubah oleh orang lain sejak sesi dibuka, sistem memperingatkan admin untuk memuat ulang data terbaru guna mencegah penimpaan data.
   - **Reset ke Default Pabrik**: Tombol darurat untuk mengembalikan seluruh konten kembali ke data awal bawaan situs.

---

## 5. Cara Mereset Konten ke Default

Jika Anda ingin mengembalikan isi situs ke tampilan awal mula:
1. Masuk ke menu **Publikasi** (`/admin/publikasi`).
2. Scroll ke bagian **Zona Pemulihan: Reset ke Default Pabrik**.
3. Klik tombol **Reset Semua Konten ke Default** dan konfirmasi.
4. Seluruh file di folder `content/*.json` akan ditimpa dengan data default dari `content/defaults/*.json`.

---

## 6. Prosedur Pembatalan Total ("Kembalikan")

Sesuai instruksi Anda, jika Anda ingin **menghapus semua fitur CMS ini dan mengembalikan repositori ke kondisi awal sebelum CMS dibuat**, jalankan 2 perintah Git berikut di terminal Anda:

```bash
# 1. Batalkan semua modifikasi pada file publik yang sudah ada
git checkout .

# 2. Hapus seluruh file & folder baru CMS yang belum terlacak
git clean -fd
```

Semua file baru (`/admin`, `/api/admin`, `/content`, `store.ts`, dll.) akan terhapus bersih dan seluruh kode publik kembali persis seperti kondisi awal mula.

---

## 7. Catatan Commit & Push

Sesuai aturan kerja, asisten AI **TIDAK** melakukan `git commit` maupun `git push`. Anda memegang kendali penuh atas commit dan push repositori GitHub Anda secara manual.
