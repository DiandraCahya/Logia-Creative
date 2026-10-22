/**
 * Logia Creative CMS - Content Reader API
 * High-performance, cached reader functions with resilient defaults fallback.
 */

import { getStore } from "./store";
import type {
  SiteContent,
  ProjectItem,
  PromoItem,
  TestimonialsContent,
  RateCardContent,
  MediaItem,
} from "./types";

export async function getSite(): Promise<SiteContent> {
  const store = getStore();
  try {
    const data = await store.readJson<SiteContent>("content/site.json");
    if (data && data.hero && data.targetPasar && data.about && data.services && data.footer) {
      return data;
    }
    throw new Error("Invalid site.json structure");
  } catch {
    return await store.readJson<SiteContent>("content/defaults/site.json");
  }
}

export async function getProjects(): Promise<ProjectItem[]> {
  const store = getStore();
  try {
    const data = await store.readJson<ProjectItem[]>("content/projects.json");
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    throw new Error("Invalid projects.json structure");
  } catch {
    return await store.readJson<ProjectItem[]>("content/defaults/projects.json");
  }
}

export async function getPromos(): Promise<PromoItem[]> {
  const store = getStore();
  try {
    const data = await store.readJson<PromoItem[]>("content/promos.json");
    if (Array.isArray(data)) {
      return data;
    }
    throw new Error("Invalid promos.json structure");
  } catch {
    return await store.readJson<PromoItem[]>("content/defaults/promos.json");
  }
}

export async function getTestimonials(): Promise<TestimonialsContent> {
  const store = getStore();
  try {
    const data = await store.readJson<TestimonialsContent>("content/testimonials.json");
    if (data && Array.isArray(data.testimonials)) {
      return data;
    }
    throw new Error("Invalid testimonials.json structure");
  } catch {
    return await store.readJson<TestimonialsContent>("content/defaults/testimonials.json");
  }
}

export async function getRateCard(): Promise<RateCardContent> {
  const store = getStore();
  try {
    const data = await store.readJson<RateCardContent>("content/rate-card.json");
    if (data && Array.isArray(data.solutions)) {
      return data;
    }
    throw new Error("Invalid rate-card.json structure");
  } catch {
    return await store.readJson<RateCardContent>("content/defaults/rate-card.json");
  }
}

export async function getMedia(): Promise<MediaItem[]> {
  const store = getStore();
  try {
    const data = await store.readJson<MediaItem[]>("content/media.json");
    if (Array.isArray(data)) {
      return data;
    }
    throw new Error("Invalid media.json structure");
  } catch {
    return await store.readJson<MediaItem[]>("content/defaults/media.json");
  }
}

export const getMediaRegistry = getMedia;
