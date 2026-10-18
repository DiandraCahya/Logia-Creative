/**
 * Sumber tunggal Rate Card. Semua komponen (section, form, struk, email, chat)
 * render dari sini. Ubah harga/nama cukup di file ini.
 */

export type Unit = "project" | "bulan";

export interface Package {
  /** ID unik lintas solusi, dipakai form & struk, bukan `name` (nama bisa sama). */
  id: string;
  name: string;
  tagline: string;
  /** Rupiah, tanpa titik. Format via formatPrice(). */
  price: number;
  unit: Unit;
  items: string[];
  intro?: string;
  notes?: string[];
  /** ponytail: flag render daftar bernomor; ganti ke item berjudul bila makin kompleks */
  numbered?: boolean;
  popular?: boolean;
}

export interface Solution {
  id: string;
  name: string;
  packages: Package[];
}

export interface TermGroup {
  title: string;
  body: string[];
}

/** Ganti ke "Mulai dari" bila perlu satu tempat saja. */
export const START_FROM_LABEL = "Start From";

export const SOLUTIONS: Solution[] = [
  {
    id: "technology",
    name: "Technology Solution",
    packages: [
      {
        id: "technology-web-starter",
        name: "WEB STARTER",
        tagline: "Langsung online, Tanpa ribet",
        price: 250000,
        unit: "project",
        popular: false,
        items: [
          "Landing page / Company Profile (1 halaman, responsive)",
          "Panduan setup domain & hosting",
          "Tombol WhatsApp",
          "Basic speed optimization",
          "Revisi 2x",
        ],
      },
      {
        id: "technology-web-app-system",
        name: "WEB APP & SYSTEM",
        tagline: "Otomasi & pelaporan untuk bisnis yang sudah berjalan",
        price: 1500000,
        unit: "bulan",
        popular: false,
        items: [
          "Dashboard monitoring bisnis",
          "Reporting dashboard terintegrasi",
          "Simple workflow automation (tugas repetitif, notifikasi, rekap otomatis)",
          "Integrasi antar sistem (kasir, WhatsApp, spreadsheet)",
          "Support teknis prioritas",
        ],
      },
      {
        id: "technology-smart-automation",
        name: "SMART AUTOMATION",
        tagline: "Sistem digital sesuai cara kerja bisnismu",
        price: 700000,
        unit: "project",
        popular: false,
        intro: "WEB & APP SYSTEM kebutuhanmu. Sudah termasuk:",
        items: [
          "Desain UI / UX",
          "Panel Admin",
          "Pelatihan penggunaan 1x sesi",
          "Garansi bug 14 hari",
        ],
      },
    ],
  },
  {
    id: "creative",
    name: "Creative Solution",
    packages: [
      {
        id: "creative-brand-starter",
        name: "BRAND STARTER",
        tagline: "Bikin bisnismu tampil profesional dari nol",
        price: 150000,
        unit: "project",
        popular: false,
        items: [
          "Desain Logo (Utama & Alternatif/Monokrom)",
          "Panduan warna & tipografi dasar (Color Palette & Typography Guide)",
          "File master siap pakai (PNG transparan, JPG, PDF)",
        ],
      },
      {
        id: "creative-visual-campaign",
        name: "VISUAL CAMPAIGN",
        tagline: "Paket desain komplit (Promosi/event)",
        price: 350000,
        unit: "project",
        popular: false,
        intro: "Pilih fokus kebutuhanmu:",
        numbered: true,
        items: [
          "Packaging & Merch: Desain label, kemasan simple, atau merchandise (kaos, stiker).",
          "Social Media Kit: 9-12 template feed/story siap pakai (bisa diedit di Canva).",
          "Event / Print Promo: Desain banner, spanduk, brosur, dan flyer.",
        ],
      },
      {
        id: "creative-creative-growth",
        name: "CREATIVE GROWTH",
        tagline: "Terima beres urusan konten, kamu fokus jualan aja",
        price: 500000,
        unit: "bulan",
        popular: false,
        items: [
          "Desain 12 Konten Feed & 3 Video Pendek (Reels/TikTok) ringan",
          "Optimasi profil sosmed (Desain Feeds & Video Konten Ringan)",
          "Event / Print Promo: Desain banner, spanduk, brosur, dan flyer.",
          "Laporan engagement bulanan",
        ],
      },
    ],
  },
  {
    id: "integrated",
    name: "Integrated Solution",
    packages: [
      {
        id: "integrated-digital-presence",
        name: "DIGITAL PRESENCE",
        tagline: "Paket kombo maut buat yang pengen terima beres dengan harga diskon",
        price: 350000,
        unit: "project",
        popular: false,
        items: [
          "Solusi all-in-one paling hemat buat bisnis yang baru go-digital",
          "Desain Logo & Panduan Visual",
          "Landing Page / Web 1 Halaman",
          "Tombol integrasi langsung ke WhatsApp",
        ],
        notes: ["*Bundle ini hemat Rp 50.000 dibanding order terpisah!"],
      },
      {
        id: "integrated-business-launchpad",
        name: "BUSINESS LAUNCHPAD",
        tagline: "Sistem Digital + Visual premium siap mendongkrak bisnismu",
        price: 1500000,
        unit: "project",
        popular: false,
        items: [
          "Web App / Sistem Custom (E-commerce, Kasir, atau Reservasi) dari paket Web App & System.",
          "UI/UX Design yang dikustomisasi 100% dengan karakter logomu.",
          "Pembuatan banner web promosi & input 10 katalog produk awal.",
        ],
      },
      {
        id: "integrated-ultimate-partner",
        name: "ULTIMATE PARTNER",
        tagline: "Punya tim IT dan Tim Kreatif sendiri tanpa pusing bayar gaji",
        price: 1200000,
        unit: "bulan",
        popular: false,
        items: [
          "Maintenance website, dashboard bisnis, dan perbaikan minor.",
          "Konten sosmed bulanan (12 Feed + 3 Reels).",
          "Update rutin aset visual di dalam website (ganti banner, update foto).",
          "Layanan prioritas dari tim LOGIA.",
        ],
        notes: [
          "*Mengambil paket integrasi dipastikan lebih murah dibandingkan memesan layanan IT dan Desain secara terpisah.",
          "*Biaya operasional pihak ketiga (hosting, domain, API payment) ditanggung oleh klien.",
        ],
      },
    ],
  },
];

/** Daftar rata untuk lookup. */
export const ALL_PACKAGES: { pkg: Package; solution: Solution }[] = SOLUTIONS.flatMap((solution) =>
  solution.packages.map((pkg) => ({ pkg, solution }))
);

export function formatPrice(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

export function priceTypeLabel(unit: Unit): string {
  return unit === "bulan" ? "Langganan Bulanan" : "Project-Based";
}

export function priceUnitLabel(unit: Unit): string {
  return unit === "bulan" ? "/ bulan" : "/ project";
}

/** "Start From Rp 250.000 / project" */
export function priceLabel(pkg: Package): string {
  return `${START_FROM_LABEL} ${formatPrice(pkg.price)} ${priceUnitLabel(pkg.unit)}`;
}

/** Label form: nama paket + solusinya. */
export function packageOptionLabel(pkg: Package, solution: Solution): string {
  return `${pkg.name} · ${solution.name}`;
}

/** Cari paket dari id (form) atau nama (chatbot). Null bila tak ada. */
export function findPackage(ref: string): { pkg: Package; solution: Solution } | null {
  const key = ref.trim().toLowerCase();
  if (!key) return null;
  const byNameLength = [...ALL_PACKAGES].sort((a, b) => b.pkg.name.length - a.pkg.name.length);
  return (
    ALL_PACKAGES.find((e) => e.pkg.id === key) ??
    ALL_PACKAGES.find((e) => e.pkg.name.toLowerCase() === key) ??
    byNameLength.find((e) => key.includes(e.pkg.name.toLowerCase())) ??
    null
  );
}

/** Opsi non-paket di form kolaborasi. */
export const CUSTOM_SERVICE_OPTION = "Custom / Konsultasi";

/** Solusi pemilik sebuah id pilihan (null untuk opsi custom / tak dikenal). */
export function solutionOf(ref: string): string | null {
  const hit = ALL_PACKAGES.find((e) => e.pkg.id === ref);
  return hit ? hit.solution.id : null;
}

/**
 * Normalisasi pilihan ke MAKSIMAL 1 paket saja di seluruh kategori.
 * Bila ada id baru yang dipilih, pilihan terakhir yang menang.
 */
export function singlePackageOnly(ids: string[]): string[] {
  if (!ids || ids.length === 0) return [];
  return [ids[ids.length - 1]];
}

/**
 * Normalisasi pilihan ke MAKS 1 paket (kini berlaku 1 paket total di seluruh kategori).
 * Menjaga kompatibilitas pemanggil yang masih menggunakan nama fungsi lama.
 */
export function onePerSolution(ids: string[]): string[] {
  return singlePackageOnly(ids);
}

export const TERMS: TermGroup[] = [
  {
    title: "Cara Memesan di Website",
    body: [
      "Isi rincian langkah pemesanan di sini, kirim teksnya dan saya pasang (placeholder sementara).",
      "Langkah 1: pilih paket di Rate Card lalu tekan kirim pada form kolaborasi.",
      "Langkah 2: terima struk + total bayar, lalu selesaikan DP 50%.",
    ],
  },
  {
    title: "Pembayaran",
    body: [
      "Uang muka (DP) sebesar 50% dibayarkan untuk memulai pekerjaan; pelunasan 50% sebelum handover/go-live.",
      "Paket bulanan (Web App & System, Creative Growth, Ultimate Partner) dibayar di awal setiap bulan berjalan.",
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
    title: "Waktu Pengerjaan",
    body: [
      "Timeline branding 3 - 7 hari kerja per paket.",
      "Timeline website & otomasi 7 - 14 hari kerja tergantung kompleksitas.",
    ],
  },
];