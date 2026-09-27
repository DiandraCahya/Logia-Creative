export interface Package {
  name: string;
  price: string;
  period: string;
  badge?: string;
  desc: string;
  features: string[];
}

export interface SingleItem {
  name: string;
  price: string;
}

export interface SingleCategory {
  category: string;
  items: SingleItem[];
}

export interface TermGroup {
  title: string;
  body: string[];
}

export const PACKAGES: Package[] = [
  {
    name: "STARTER BRAND",
    price: "Rp 350.000",
    period: "Project-Based",
    desc: "Fondasi identitas visual bisnis yang profesional.",
    features: [
      "Desain Logo Utama & Alternatif",
      "Color Palette & Typography Guide",
      "Brand Mini Guideline",
      "3 Template Media Sosial (Editable)",
      "1 Desain Merchandise / Kemasan sederhana",
    ],
  },
  {
    name: "DIGITAL PRESENCE",
    price: "Rp 850.000",
    period: "Project-Based",
    desc: "Identitas + kehadiran digital dalam satu paket.",
    features: [
      "Semua layanan Starter Brand",
      "Landing Page Website (1 Halaman, Template-Based)",
      "Setup Media Social Business",
      "6 Konten Awal (Desain + Copywriting)",
      "Optimasi Profil Digital (Bio & Link)",
    ],
  },
  {
    name: "GROWTH PACKAGE",
    price: "Rp 1.500.000 / Bulan",
    period: "Langganan bulanan, minimal 3 bulan",
    badge: "Most Popular",
    desc: "Konsistensi konten bulanan + GRATIS website.",
    features: [
      "Semua layanan Digital Presence",
      "GRATIS Website Company Profile (Basic) — dikerjakan di bulan pertama",
      "Basic UI/UX Design",
      "12 Feed Design / bulan",
      "4 Reels / TikTok Videos / bulan",
      "Monthly Performance Report",
    ],
  },
  {
    name: "SMART BUSINESS PACKAGE",
    price: "Mulai dari Rp 2.750.000",
    period: "Project-Based",
    desc: "Otomasi & dashboard untuk efisiensi operasional.",
    features: [
      "Dashboard Monitoring Bisnis (Sales/Operasional)",
      "Sistem Registrasi Digital (Event/Organisasi)",
      "Simple Workflow Automation",
      "Reporting Dashboard Terintegrasi",
      "1x Sesi Pelatihan Penggunaan Sistem",
    ],
  },
];

export const SINGLE_SERVICES: SingleCategory[] = [
  {
    category: "Brand",
    items: [
      { name: "Logo", price: "Rp 150.000" },
      { name: "Style Guide", price: "Rp 350.000" },
      { name: "Flyer / Poster", price: "Rp 45.000" },
      { name: "Banner / X-Banner", price: "Rp 100.000" },
      { name: "Pitch Deck", price: "Rp 20.000 / slide" },
    ],
  },
  {
    category: "Konten",
    items: [
      { name: "Feed IG", price: "Rp 35.000 / post" },
      { name: "Carousel IG", price: "Rp 60.000 / post" },
      { name: "Reels / TikTok", price: "Rp 75.000 / video" },
      { name: "Caption", price: "Rp 15.000" },
      { name: "Content Planning", price: "Rp 150.000" },
    ],
  },
  {
    category: "Web",
    items: [
      { name: "Landing Page", price: "Rp 500.000" },
      { name: "Company Profile", price: "Rp 1.000.000" },
      { name: "UI/UX", price: "Rp 150.000 / hal" },
      { name: "Maintenance", price: "Rp 250.000 / bln" },
      { name: "Dashboard Monitoring", price: "Rp 450.000" },
      { name: "Sistem Registrasi", price: "Rp 450.000" },
      { name: "Workflow Automation", price: "Mulai dari Rp 1.000.000" },
      { name: "Konsultasi", price: "Rp 100.000 / sesi" },
    ],
  },
];

export const TERMS: TermGroup[] = [
  {
    title: "Pembayaran",
    body: [
      "Uang muka (DP) sebesar 50% dibayarkan untuk memulai pekerjaan; pelunasan 50% sebelum handover/go-live.",
      "Retainer Growth dibayar di awal setiap bulan berjalan.",
    ],
  },
  {
    title: "Revisi",
    body: [
      "Maksimal 2x revisi minor termasuk dalam setiap paket.",
      "Revisi ke-3+ atau ganti konsep dikenakan Rp 50.000 / revisi.",
    ],
  },
  {
    title: "Teknologi",
    body: [
      "Website default menggunakan CMS/No-Code builder; custom code = biaya terpisah.",
      "Harga belum termasuk domain & hosting premium tahunan.",
    ],
  },
  {
    title: "Langganan",
    body: [
      "Paket langganan (Growth) berlaku minimal 3 bulan untuk menjaga konsistensi hasil.",
    ],
  },
  {
    title: "Waktu Pengerjaan",
    body: [
      "Timeline branding 3–7 hari kerja per paket.",
      "Timeline website & otomasi 7–14 hari kerja tergantung kompleksitas.",
    ],
  },
];
