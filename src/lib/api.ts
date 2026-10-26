export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const API_MEDIA_URL =
  API_BASE_URL.replace(/\/api\/?$/, "") || "http://localhost:5000";

/**
 * Resolves media URLs for dynamic CMS assets (portfolio, testimonials, uploaded files).
 * Full URLs are preserved, while backend-relative paths (/uploads/...) are automatically
 * prefixed with the backend server host so it works smoothly both locally and when deployed to Vercel.
 */
export function getMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://localhost:5000/uploads/")) {
    return url.replace("http://localhost:5000", API_MEDIA_URL);
  }
  if (url.startsWith("http://127.0.0.1:5000/uploads/")) {
    return url.replace("http://127.0.0.1:5000", API_MEDIA_URL);
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/uploads/")) {
    return `${API_MEDIA_URL}${url}`;
  }
  if (url.startsWith("uploads/")) {
    return `${API_MEDIA_URL}/${url}`;
  }
  return url;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
  total?: number;
}

export interface SiteInfoContact {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  officeHours: string;
}

export interface SiteInfoSocials {
  instagram: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface SiteInfo {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  badge: string;
  contact: SiteInfoContact;
  socials: SiteInfoSocials;
  footerText: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  desc: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  accent?: string;
  link?: string;
  figure?: boolean;
  isFeatured?: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  unit: "project" | "bulan";
  popular?: boolean;
  items: string[];
  intro?: string;
  notes?: string[];
  numbered?: boolean;
}

export interface PricingSolution {
  id: string;
  name: string;
  order: number;
  packages: PackageItem[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
  alt: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface MissionItem {
  id: string;
  title: string;
  desc: string;
  order: number;
}

export interface PillarItem {
  id: string;
  title: string;
  desc: string;
  order: number;
}

export interface CompanyProfile {
  headline: string;
  tagline: string;
  aboutText: string;
  vision: string;
  missions: MissionItem[];
  pillars: PillarItem[];
}

export type InquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "completed"
  | "archived";

export interface InquiryItem {
  id: string;
  name: string;
  contact: string;
  brandName?: string;
  budget?: string;
  services: string[];
  notes?: string;
  status: InquiryStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InquiryStats {
  total: number;
  new: number;
  contacted: number;
  in_progress: number;
  completed: number;
  archived: number;
}

export interface AuthUser {
  username: string;
  name: string;
  role: string;
  updatedAt?: string;
}

export interface UploadResult {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  relativeUrl: string;
}

const TOKEN_KEY = "logia_cms_token";
const USER_KEY = "logia_cms_user";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function fetchFromAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const targetUrl = `${API_BASE_URL}${cleanEndpoint}`;

  let res: Response;
  try {
    res = await fetch(targetUrl, {
      cache: options.cache || "no-store",
      ...options,
      headers,
    });
  } catch (netErr) {
    throw new Error(
      `Tidak dapat terhubung ke server API (${targetUrl}). Pastikan server backend sedang aktif.`
    );
  }

  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Respon server tidak dalam format JSON (Status ${res.status}).`);
  }

  if (!res.ok || json.success === false) {
    const errorMsg = json.error || json.message || `Permintaan gagal dengan kode ${res.status}`;
    throw new Error(errorMsg);
  }

  return json as unknown as T;
}

export const api = {
  // Health and Aggregation
  async getHealth() {
    return fetchFromAPI<{ status: string; message: string; uptime: number; timestamp: string }>("/health");
  },

  async getAllContent() {
    return fetchFromAPI<{
      success: boolean;
      data: {
        siteInfo: SiteInfo;
        services: ServiceItem[];
        portfolio: PortfolioItem[];
        pricingSolutions: PricingSolution[];
        testimonials: TestimonialItem[];
        companyProfile: CompanyProfile;
      };
    }>("/content/all");
  },

  // Authentication
  async login(credentials: { username: string; password: string }) {
    const res = await fetchFromAPI<{
      success: boolean;
      message: string;
      data: { token: string; user: AuthUser };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.data?.token) {
      setStoredToken(res.data.token);
      setStoredUser(res.data.user);
    }
    return res;
  },

  async getMe() {
    return fetchFromAPI<{ success: boolean; data: AuthUser }>("/auth/me");
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    return fetchFromAPI<{ success: boolean; message: string }>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Site Info
  async getSiteInfo() {
    return fetchFromAPI<{ success: boolean; data: SiteInfo }>("/site-info");
  },

  async updateSiteInfo(data: Partial<SiteInfo>) {
    return fetchFromAPI<{ success: boolean; message: string; data: SiteInfo }>("/site-info", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Services
  async getServices(all = false) {
    const query = all ? "?all=true" : "";
    return fetchFromAPI<{ success: boolean; count: number; data: ServiceItem[] }>(`/services${query}`);
  },

  async getService(id: string) {
    return fetchFromAPI<{ success: boolean; data: ServiceItem }>(`/services/${id}`);
  },

  async createService(data: Omit<ServiceItem, "id">) {
    return fetchFromAPI<{ success: boolean; message: string; data: ServiceItem }>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateService(id: string, data: Partial<ServiceItem>) {
    return fetchFromAPI<{ success: boolean; message: string; data: ServiceItem }>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteService(id: string) {
    return fetchFromAPI<{ success: boolean; message: string; data: ServiceItem }>(`/services/${id}`, {
      method: "DELETE",
    });
  },

  async reorderServices(orders: { id: string; order: number }[]) {
    return fetchFromAPI<{ success: boolean; message: string; data: ServiceItem[] }>("/services/reorder", {
      method: "PUT",
      body: JSON.stringify({ orders }),
    });
  },

  // Portfolio
  async getPortfolio(params?: { category?: string; featured?: boolean; search?: string; page?: number; limit?: number }) {
    const sp = new URLSearchParams();
    if (params?.category && params.category !== "Semua") sp.set("category", params.category);
    if (params?.featured !== undefined) sp.set("featured", String(params.featured));
    if (params?.search) sp.set("search", params.search);
    if (params?.page) sp.set("page", String(params.page));
    if (params?.limit) sp.set("limit", String(params.limit));
    const qs = sp.toString() ? `?${sp.toString()}` : "";
    return fetchFromAPI<{ success: boolean; total: number; data: PortfolioItem[] }>(`/portfolio${qs}`);
  },

  async getPortfolioCategories() {
    return fetchFromAPI<{ success: boolean; data: string[] }>("/portfolio/categories");
  },

  async getPortfolioItem(id: string) {
    return fetchFromAPI<{ success: boolean; data: PortfolioItem }>(`/portfolio/${id}`);
  },

  async createPortfolio(data: Omit<PortfolioItem, "id">) {
    return fetchFromAPI<{ success: boolean; message: string; data: PortfolioItem }>("/portfolio", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updatePortfolio(id: string, data: Partial<PortfolioItem>) {
    return fetchFromAPI<{ success: boolean; message: string; data: PortfolioItem }>(`/portfolio/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deletePortfolio(id: string) {
    return fetchFromAPI<{ success: boolean; message: string; data: PortfolioItem }>(`/portfolio/${id}`, {
      method: "DELETE",
    });
  },

  async reorderPortfolio(orders: { id: string; order: number }[]) {
    return fetchFromAPI<{ success: boolean; message: string; data: PortfolioItem[] }>("/portfolio/reorder", {
      method: "PUT",
      body: JSON.stringify({ orders }),
    });
  },

  // Pricing & Solutions
  async getPricing() {
    return fetchFromAPI<{ success: boolean; count: number; data: PricingSolution[] }>("/pricing");
  },

  async getSolution(solutionId: string) {
    return fetchFromAPI<{ success: boolean; data: PricingSolution }>(`/pricing/solutions/${solutionId}`);
  },

  async createSolution(data: { id?: string; name: string; order?: number }) {
    return fetchFromAPI<{ success: boolean; message: string; data: PricingSolution }>("/pricing/solutions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateSolution(solutionId: string, data: { name?: string; order?: number }) {
    return fetchFromAPI<{ success: boolean; message: string; data: PricingSolution }>(
      `/pricing/solutions/${solutionId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  async deleteSolution(solutionId: string) {
    return fetchFromAPI<{ success: boolean; message: string; data: PricingSolution }>(
      `/pricing/solutions/${solutionId}`,
      {
        method: "DELETE",
      }
    );
  },

  async addPackage(solutionId: string, data: Omit<PackageItem, "id"> & { id?: string }) {
    return fetchFromAPI<{ success: boolean; message: string; data: PackageItem }>(
      `/pricing/solutions/${solutionId}/packages`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  async updatePackage(packageId: string, data: Partial<PackageItem>) {
    return fetchFromAPI<{ success: boolean; message: string; data: PackageItem }>(
      `/pricing/packages/${packageId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  async deletePackage(packageId: string) {
    return fetchFromAPI<{ success: boolean; message: string; data: PackageItem }>(
      `/pricing/packages/${packageId}`,
      {
        method: "DELETE",
      }
    );
  },

  // Testimonials
  async getTestimonials(all = false) {
    const query = all ? "?all=true" : "";
    return fetchFromAPI<{ success: boolean; count: number; data: TestimonialItem[] }>(`/testimonials${query}`);
  },

  async createTestimonial(data: Omit<TestimonialItem, "id">) {
    return fetchFromAPI<{ success: boolean; message: string; data: TestimonialItem }>("/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateTestimonial(id: string, data: Partial<TestimonialItem>) {
    return fetchFromAPI<{ success: boolean; message: string; data: TestimonialItem }>(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteTestimonial(id: string) {
    return fetchFromAPI<{ success: boolean; message: string; data: TestimonialItem }>(`/testimonials/${id}`, {
      method: "DELETE",
    });
  },

  async reorderTestimonials(orders: { id: string; order: number }[]) {
    return fetchFromAPI<{ success: boolean; message: string; data: TestimonialItem[] }>("/testimonials/reorder", {
      method: "PUT",
      body: JSON.stringify({ orders }),
    });
  },

  // Company Profile
  async getProfile() {
    return fetchFromAPI<{ success: boolean; data: CompanyProfile }>("/profile");
  },

  async updateProfile(data: Partial<Pick<CompanyProfile, "headline" | "tagline" | "aboutText" | "vision">>) {
    return fetchFromAPI<{ success: boolean; message: string; data: CompanyProfile }>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async addMission(data: { title: string; desc: string; order?: number }) {
    return fetchFromAPI<{ success: boolean; message: string; data: MissionItem }>("/profile/missions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateMission(id: string, data: Partial<MissionItem>) {
    return fetchFromAPI<{ success: boolean; message: string; data: MissionItem }>(`/profile/missions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteMission(id: string) {
    return fetchFromAPI<{ success: boolean; message: string; data: MissionItem }>(`/profile/missions/${id}`, {
      method: "DELETE",
    });
  },

  async addPillar(data: { title: string; desc: string; order?: number }) {
    return fetchFromAPI<{ success: boolean; message: string; data: PillarItem }>("/profile/pillars", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updatePillar(id: string, data: Partial<PillarItem>) {
    return fetchFromAPI<{ success: boolean; message: string; data: PillarItem }>(`/profile/pillars/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deletePillar(id: string) {
    return fetchFromAPI<{ success: boolean; message: string; data: PillarItem }>(`/profile/pillars/${id}`, {
      method: "DELETE",
    });
  },

  // Inquiries / Leads
  async sendInquiry(payload: {
    name: string;
    contact: string;
    brandName?: string;
    budget?: string;
    services: string[];
    notes?: string;
    website?: string;
  }) {
    return fetchFromAPI<{ success: boolean; message: string; data: InquiryItem }>("/inquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getInquiries(params?: { status?: InquiryStatus; search?: string }) {
    const sp = new URLSearchParams();
    if (params?.status) sp.set("status", params.status);
    if (params?.search) sp.set("search", params.search);
    const qs = sp.toString() ? `?${sp.toString()}` : "";
    return fetchFromAPI<{ success: boolean; count: number; data: InquiryItem[] }>(`/inquiries${qs}`);
  },

  async getInquiriesStats() {
    return fetchFromAPI<{ success: boolean; data: InquiryStats }>("/inquiries/stats");
  },

  async updateInquiryStatus(id: string, status: InquiryStatus, adminNotes?: string) {
    return fetchFromAPI<{ success: boolean; message: string; data: InquiryItem }>(
      `/inquiries/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, adminNotes }),
      }
    );
  },

  async deleteInquiry(id: string) {
    return fetchFromAPI<{ success: boolean; message: string; data: InquiryItem }>(`/inquiries/${id}`, {
      method: "DELETE",
    });
  },

  // Media / Upload
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return fetchFromAPI<{ success: boolean; message: string; data: UploadResult }>("/upload", {
      method: "POST",
      body: formData,
    });
  },

  async uploadMultiple(files: File[]) {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    return fetchFromAPI<{ success: boolean; message: string; data: UploadResult[] }>("/upload/multiple", {
      method: "POST",
      body: formData,
    });
  },
};
