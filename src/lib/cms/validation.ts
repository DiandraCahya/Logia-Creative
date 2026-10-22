/**
 * Logia Creative CMS - Validation & Sanitization
 * Pure TypeScript validators without external dependencies.
 */

import type {
  SiteContent,
  ProjectItem,
  PromoItem,
  TestimonialItem,
  TestimonialsContent,
  RateCardContent,
  MediaItem,
} from "./types";

/**
 * Sanitize text to prevent dangerous script injection / HTML markup while preserving clean human text.
 * Strips HTML tags and controls.
 */
export function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== "string") return "";
  const cleaned = input
    .replace(/<[^>]*>/g, "") // strip html tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // strip non-printable controls
    .trim();
  return cleaned.slice(0, maxLength);
}

export function sanitizePath(input: unknown): string {
  if (typeof input !== "string") return "";
  // Anti path traversal: no .. or double slashes
  const cleaned = input
    .replace(/\\/g, "/")
    .replace(/\/\.{1,2}\//g, "/")
    .replace(/^\.{1,2}\//, "")
    .replace(/\/+/g, "/")
    .trim();
  return cleaned.slice(0, 300);
}

export function isNonEmptyString(val: unknown, min = 1, max = 1000): val is string {
  return typeof val === "string" && val.trim().length >= min && val.trim().length <= max;
}

export function isPositiveNumber(val: unknown): val is number {
  return typeof val === "number" && !isNaN(val) && val >= 0;
}

export function validateProject(data: unknown): { valid: boolean; errors: string[]; item?: ProjectItem } {
  const errors: string[] = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data proyek harus berupa objek."] };
  }

  const p = data as Record<string, unknown>;
  const id = sanitizeText(p.id, 100) || `project-${Date.now()}`;
  const title = sanitizeText(p.title, 150);
  const category = sanitizeText(p.category, 50);
  const image = sanitizePath(p.image);
  const description = sanitizeText(p.description, 1000);
  const tags = Array.isArray(p.tags) ? p.tags.map((t) => sanitizeText(t, 40)).filter(Boolean) : [];
  const accent = typeof p.accent === "string" ? sanitizeText(p.accent, 20) : undefined;
  const link = typeof p.link === "string" && p.link.trim() ? sanitizeText(p.link, 300) : undefined;
  const figure = Boolean(p.figure);
  const fit = p.fit === "contain" || p.fit === "cover" ? (p.fit as "cover" | "contain") : (figure ? "contain" : "cover");
  const validFocalPoints = ["center", "top", "bottom", "left", "right"];
  const focalPoint = typeof p.focalPoint === "string" && validFocalPoints.includes(p.focalPoint)
    ? (p.focalPoint as "center" | "top" | "bottom" | "left" | "right")
    : "center";
  const featured = Boolean(p.featured);

  if (!title) errors.push("Judul proyek wajib diisi.");
  if (!category) errors.push("Kategori proyek wajib diisi.");
  if (!image) errors.push("Gambar proyek wajib dipilih.");
  if (!description) errors.push("Deskripsi proyek wajib diisi.");

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    item: {
      id,
      title,
      category,
      image,
      description,
      tags,
      accent,
      link,
      figure,
      fit,
      focalPoint,
      featured,
    },
  };
}

export function validatePromo(data: unknown): { valid: boolean; errors: string[]; item?: PromoItem } {
  const errors: string[] = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data promo harus berupa objek."] };
  }

  const p = data as Record<string, unknown>;
  const id = sanitizeText(p.id, 100) || `promo-${Date.now()}`;
  const title = sanitizeText(p.title, 150);
  const description = sanitizeText(p.description, 1000);
  const code = typeof p.code === "string" ? sanitizeText(p.code, 50) : undefined;
  const discount = typeof p.discount === "string" ? sanitizeText(p.discount, 50) : undefined;
  const startDate = sanitizeText(p.startDate, 30);
  const endDate = sanitizeText(p.endDate, 30);
  const active = Boolean(p.active);
  const link = typeof p.link === "string" ? sanitizeText(p.link, 300) : undefined;

  if (!title) errors.push("Judul promo wajib diisi.");
  if (!startDate) errors.push("Tanggal mulai promo wajib diisi.");
  if (!endDate) errors.push("Tanggal akhir promo wajib diisi.");

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    item: {
      id,
      title,
      description,
      code,
      discount,
      startDate,
      endDate,
      active,
      link,
    },
  };
}

export function validateTestimonial(data: unknown): { valid: boolean; errors: string[]; item?: TestimonialItem } {
  const errors: string[] = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data testimoni harus berupa objek."] };
  }

  const t = data as Record<string, unknown>;
  const id = sanitizeText(t.id, 100) || `testi-${Date.now()}`;
  const quote = sanitizeText(t.quote, 500);
  const author = sanitizeText(t.author, 100);
  const role = typeof t.role === "string" ? sanitizeText(t.role, 100) : "";
  const image = sanitizePath(t.image);
  const alt = sanitizeText(t.alt, 100) || author;
  const active = t.active !== undefined ? Boolean(t.active) : true;

  if (!quote) errors.push("Kutipan testimoni wajib diisi.");
  if (!author) errors.push("Nama pemberi testimoni wajib diisi.");
  if (!image) errors.push("Foto testimoni wajib diisi.");

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    item: {
      id,
      quote,
      author,
      role,
      image,
      alt,
      active,
    },
  };
}

export function validateMedia(data: unknown): { valid: boolean; errors: string[]; item?: MediaItem } {
  const errors: string[] = [];
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data media harus berupa objek."] };
  }

  const m = data as Record<string, unknown>;
  const id = sanitizeText(m.id, 100) || `media-${Date.now()}`;
  const path = sanitizePath(m.path);
  const alt = sanitizeText(m.alt, 200);
  const width = isPositiveNumber(m.width) ? m.width : 0;
  const height = isPositiveNumber(m.height) ? m.height : 0;
  const size = isPositiveNumber(m.size) ? m.size : 0;
  const createdAt = typeof m.createdAt === "string" ? sanitizeText(m.createdAt, 50) : new Date().toISOString();

  if (!path) errors.push("Path file media wajib ada.");
  if (!alt) errors.push("Alt text media wajib diisi.");

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    item: {
      id,
      path,
      alt,
      width,
      height,
      size,
      createdAt,
    },
  };
}

export function validateSiteContent(data: unknown): { valid: boolean; errors: string[]; content?: SiteContent } {
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Konten site harus berupa objek."] };
  }
  const s = data as any;
  if (!s.seo || !s.hero || !s.targetPasar || !s.about || !s.services || !s.footer) {
    return { valid: false, errors: ["Format site.json tidak lengkap."] };
  }
  return { valid: true, errors: [], content: data as SiteContent };
}

export function validateProjectsList(data: unknown): { valid: boolean; errors: string[]; items?: ProjectItem[] } {
  if (!Array.isArray(data)) {
    return { valid: false, errors: ["Data proyek harus berupa daftar (array)."] };
  }

  const items: ProjectItem[] = [];
  const errors: string[] = [];

  data.forEach((entry, idx) => {
    const res = validateProject(entry);
    if (!res.valid || !res.item) {
      errors.push(`Proyek #${idx + 1}: ${res.errors.join(", ")}`);
    } else {
      items.push(res.item);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], items };
}

export function validatePromosList(data: unknown): { valid: boolean; errors: string[]; items?: PromoItem[] } {
  if (!Array.isArray(data)) {
    return { valid: false, errors: ["Data promo harus berupa daftar (array)."] };
  }

  const items: PromoItem[] = [];
  const errors: string[] = [];

  data.forEach((entry, idx) => {
    const res = validatePromo(entry);
    if (!res.valid || !res.item) {
      errors.push(`Promo #${idx + 1}: ${res.errors.join(", ")}`);
    } else {
      items.push(res.item);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], items };
}

export function validateTestimonialsContent(data: unknown): { valid: boolean; errors: string[]; content?: TestimonialsContent } {
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data testimoni harus berupa objek."] };
  }

  const t = data as any;
  const sectionTitle = sanitizeText(t.sectionTitle, 100) || "Kata Mereka";
  if (!Array.isArray(t.testimonials)) {
    return { valid: false, errors: ["Daftar testimoni harus berupa array."] };
  }

  const items: TestimonialItem[] = [];
  const errors: string[] = [];

  t.testimonials.forEach((entry: unknown, idx: number) => {
    const res = validateTestimonial(entry);
    if (!res.valid || !res.item) {
      errors.push(`Testimoni #${idx + 1}: ${res.errors.join(", ")}`);
    } else {
      items.push(res.item);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    content: {
      sectionTitle,
      testimonials: items,
    },
  };
}

export function validateRateCardContent(data: unknown): { valid: boolean; errors: string[]; content?: RateCardContent } {
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data rate card harus berupa objek."] };
  }

  const r = data as any;
  const sectionTitle = sanitizeText(r.sectionTitle, 100) || "Rate Card";
  const sectionSubtitle = sanitizeText(r.sectionSubtitle, 250);
  const termsTitle = sanitizeText(r.termsTitle, 100) || "Syarat & Ketentuan Layanan";
  const startFromLabel = sanitizeText(r.startFromLabel, 50) || "Start From";
  const customInquiryText = sanitizeText(r.customInquiryText, 250);
  const customInquiryButton = sanitizeText(r.customInquiryButton, 100) || "Diskusikan Kebutuhan Anda";

  if (!Array.isArray(r.solutions)) {
    return { valid: false, errors: ["Solusi rate card harus berupa array."] };
  }

  return {
    valid: true,
    errors: [],
    content: {
      sectionTitle,
      sectionSubtitle,
      termsTitle,
      startFromLabel,
      customInquiryText,
      customInquiryButton,
      solutions: r.solutions,
      terms: Array.isArray(r.terms) ? r.terms : [],
    },
  };
}
