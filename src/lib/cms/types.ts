/**
 * Logia Creative CMS - Type Definitions
 * Strict types for all CMS content and stores
 */

export interface SeoContent {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface SplashContent {
  text: string;
  skipText: string;
}

export interface NavbarContent {
  logoImage: string;
  logoAlt: string;
  collabButton: string;
  collabExpanded: string;
  collabSubtitle: string;
}

export interface HeroContent {
  headlineLine1: string;
  headlineLine2: string;
  heroImage: string;
  heroImageAlt: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface TargetMarketStat {
  value: string;
  label: string;
  sublabel: string;
}

export interface TargetMarketSolution {
  icon: string;
  title: string;
  description: string;
  deliverableTag?: string;
}

export interface TargetMarketItem {
  id: string;
  stepNumber: string;
  sectorTag: string;
  title: string;
  subtitle: string;
  tabLabel: string;
  icon: string;
  turnaround: string;
  problemTitle: string;
  problemText: string;
  stats: TargetMarketStat[];
  solutions: TargetMarketSolution[];
}

export interface TargetPasarContent {
  title: string;
  subtitle: string;
  ctaText: string;
  markets: TargetMarketItem[];
}

export interface MissionItem {
  title: string;
  desc: string;
}

export interface BrandPillarItem {
  title: string;
  desc: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  visiQuote: string;
  visiAuthor: string;
  missions: MissionItem[];
  filosofiLogo1: string;
  filosofiLogo2: string;
  brandPillars: BrandPillarItem[];
}

export interface ServiceItem {
  title: string;
  icon: string;
  desc: string;
}

export interface ServicesContent {
  title: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface FooterContent {
  ctaHeading: string;
  ctaSubtitle: string;
  ctaButton: string;
  logoImage: string;
  description: string;
  studioTimePrefix: string;
  email: string;
  phone: string;
  phoneWaLink: string;
  website: string;
  location: string;
  instagram: string;
  linkedin: string;
  watermark: string;
  copyright: string;
  backToTop: string;
}

export interface SiteContent {
  seo: SeoContent;
  splash: SplashContent;
  navbar: NavbarContent;
  hero: HeroContent;
  targetPasar: TargetPasarContent;
  about: AboutContent;
  services: ServicesContent;
  footer: FooterContent;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: "Branding" | "Web Development" | "UI/UX" | "Marketing" | string;
  image: string;
  description: string;
  tags: string[];
  accent?: string;
  link?: string;
  figure?: boolean;
  fit?: "cover" | "contain";
  focalPoint?: "center" | "top" | "bottom" | "left" | "right";
  featured: boolean;
  order?: number;
}

export interface PromoItem {
  id: string;
  title: string;
  description: string;
  code?: string;
  discount?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  link?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
  image: string;
  alt: string;
  active: boolean;
}

export interface TestimonialsContent {
  sectionTitle: string;
  testimonials: TestimonialItem[];
}

export interface RatePackageItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  unit: "project" | "bulan";
  popular?: boolean;
  intro?: string;
  items: string[];
  notes?: string[];
  numbered?: boolean;
}

export interface RateSolutionItem {
  id: string;
  name: string;
  packages: RatePackageItem[];
}

export interface RateTermItem {
  title: string;
  body: string[];
}

export interface RateCardContent {
  sectionTitle: string;
  sectionSubtitle: string;
  termsTitle: string;
  startFromLabel: string;
  customInquiryText: string;
  customInquiryButton: string;
  solutions: RateSolutionItem[];
  terms: RateTermItem[];
}

export interface MediaItem {
  id: string;
  path: string;
  alt: string;
  width: number;
  height: number;
  size: number;
  createdAt: string;
}

export interface BatchFileChange {
  path: string;
  content: string | Buffer;
  encoding?: "utf-8" | "base64";
}

export interface CommitBatchResult {
  success: boolean;
  commitSha?: string;
  error?: string;
  isConflict?: boolean;
}

export interface ContentStore {
  driverName: "local" | "github";
  readJson<T>(relativePath: string): Promise<T>;
  writeJson<T>(relativePath: string, data: T): Promise<void>;
  writeFile(relativePath: string, data: Buffer): Promise<void>;
  deleteFile(relativePath: string): Promise<void>;
  commitBatch(
    files: BatchFileChange[],
    deletions?: string[],
    message?: string,
    expectedSha?: string
  ): Promise<CommitBatchResult>;
  getLatestSha(): Promise<string | null>;
  resetToDefaults(): Promise<CommitBatchResult>;
}
