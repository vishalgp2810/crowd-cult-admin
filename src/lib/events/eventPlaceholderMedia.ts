/** Placeholder media until GCP upload is restored. */
export const DEFAULT_EVENT_BANNER_URL =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop";

export const DEFAULT_EVENT_GALLERY_URLS = [
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=900&fit=crop",
];

export function withPlaceholderMedia<T extends {
  bannerUrl?: string;
  galleryUrls?: string[];
}>(payload: T): T {
  const next = { ...payload };
  if (!next.bannerUrl?.trim()) {
    next.bannerUrl = DEFAULT_EVENT_BANNER_URL;
  }
  if (!next.galleryUrls?.length) {
    next.galleryUrls = [...DEFAULT_EVENT_GALLERY_URLS];
  }
  return next;
}
