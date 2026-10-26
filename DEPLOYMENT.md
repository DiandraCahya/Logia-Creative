# Panduan Deployment Logia Creative & CMS API

Panduan resmi deployment aplikasi website **Logia Creative** dan **API-Logia (CMS Backend)** menuju domain produksi `logia.chyas.my.id`.

---

## 1. Arsitektur Domain & Hosting

| Layanan | Domain / Subdomain | Target Hosting | Teknologi |
| :--- | :--- | :--- | :--- |
| **Frontend Website** | `logia.chyas.my.id` | Vercel | Next.js 15 (App Router, Tailwind CSS) |
| **CMS Backend API** | `api-logia.chyas.my.id` | VPS (Ubuntu) / Railway / Render | Node.js, Express, Persistent Storage |

> **Catatan Penting Storage**:  
> Karena CMS backend menyimpan file gambar karya/portofolio pada folder `/uploads` dan data pada `src/data/db.json`, backend wajib di-host pada server yang memiliki **penyimpanan permanen (persistent volume)** seperti VPS atau Railway (dengan persistent volume), bukan Vercel serverless functions yang bersifat read-only.

---

## 2. Konfigurasi DNS (Cloudflare / Registrar Domain)

Tambahkan record DNS berikut pada panel domain `chyas.my.id`:

| Tipe | Nama Record | Target / Nilai | Keterangan |
| :--- | :--- | :--- | :--- |
| **CNAME** | `logia` | `cname.vercel-dns.com` | Mengarahkan frontend ke Vercel |
| **A** | `api-logia` | `<IP_SERVER_VPS_ANDA>` | Mengarahkan API ke VPS (jika pakai VPS) |
| *atau CNAME* | `api-logia` | `<DOMAIN_RAILWAY_ATAU_RENDER>` | Jika menggunakan platform PaaS |

---

## 3. Deployment Frontend ke Vercel

### Langkah-langkah:
1. Masuk ke [Vercel Dashboard](https://vercel.com) dan klik **Add New Project**.
2. Hubungkan repositori GitHub Anda dan pilih direktori root `Logia-Creative`.
3. Framework preset akan terdeteksi otomatis sebagai **Next.js**.
4. Masukkan **Environment Variables** berikut pada panel Vercel:

```env
# Domain Publik Website
NEXT_PUBLIC_SITE_URL=https://logia.chyas.my.id

# Endpoint API Backend CMS (sesuaikan dengan subdomain backend Anda)
NEXT_PUBLIC_API_URL=https://api-logia.chyas.my.id/api

# Email & Kontak Form
COLLABORATION_TO=logiacreative.id@gmail.com
COLLABORATION_FROM=onboarding@resend.dev
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RESEND_FROM=onboarding@resend.dev

# AI Chat Widget
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GROQ_MODEL=openai/gpt-oss-20b

# Notifikasi Telegram Tim
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=-1001234567890
```

5. Klik tombol **Deploy**.
6. Setelah build berhasil, buka menu **Settings** > **Domains** di Vercel, lalu tambahkan domain:  
   `logia.chyas.my.id`

---

## 4. Deployment Backend API (API-Logia)

### Opsi A: Deployment di VPS menggunakan Docker (Paling Praktis)
File `Dockerfile` dan `docker-compose.yml` telah disiapkan di dalam folder `API-Logia`.

1. Salin seluruh isi folder `API-Logia` ke server VPS Anda (misal ke `/var/www/API-Logia`).
2. Buat file `.env` di VPS:
   ```env
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=buat_kunci_rahasia_acak_yang_panjang_disini
   JWT_EXPIRES_IN=7d
   REQUIRE_AUTH=false
   ADMIN_USERNAME=Logiaaa
   ADMIN_PASSWORD=rakhakucrut
   CORS_ORIGIN=https://logia.chyas.my.id,http://localhost:3000
   ```
3. Jalankan container dengan persistent volume:
   ```bash
   docker compose up -d --build
   ```
   Folder `uploads/` dan file database `src/data/db.json` akan otomatis di-mount ke host sehingga data tidak hilang saat container restart.

---

### Opsi B: Deployment di VPS menggunakan PM2 & Nginx

1. Masuk ke server VPS via SSH, install Node.js 20 dan PM2:
   ```bash
   npm install -g pm2
   ```
2. Salin folder `API-Logia` ke server, lalu install dependensi:
   ```bash
   cd /var/www/API-Logia
   npm install --production
   ```
3. Jalankan service dengan file `ecosystem.config.js` yang telah disediakan:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```
4. Pasang konfigurasi Nginx reverse proxy menggunakan template `nginx-api.conf`:
   ```bash
   sudo cp nginx-api.conf /etc/nginx/sites-available/api-logia
   sudo ln -s /etc/nginx/sites-available/api-logia /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```
5. Pasang sertifikat SSL gratis via Certbot (Let's Encrypt):
   ```bash
   sudo certbot --nginx -d api-logia.chyas.my.id
   ```

---

### Opsi C: Deployment di Railway / Render
1. Buka [Railway.app](https://railway.app), klik **New Project** > **Deploy from GitHub repo**.
2. Pilih folder `API-Logia`.
3. Buka tab **Volumes**, tambahkan persistent disk mount pada path:
   - `/app/uploads` (untuk gambar)
   - `/app/src/data` (untuk data JSON)
4. Masukkan Environment Variables sesuai Opsi A.
5. Tambahkan custom domain pada Railway: `api-logia.chyas.my.id`.

---

## 5. Verifikasi Akhir Pasca Deployment

Setelah kedua layanan aktif, jalankan verifikasi:
1. Buka `https://api-logia.chyas.my.id/api/health` di browser. Respons harus menunjukkan status `online`.
2. Buka `https://logia.chyas.my.id`. Pastikan carousel portfolio, gambar klien testimoni, dan form inquiry berjalan normal.
3. Buka dashboard CMS di `https://logia.chyas.my.id/admin`, coba unggah gambar atau perbarui teks konten, lalu cek perubahannya di halaman depan secara langsung.
