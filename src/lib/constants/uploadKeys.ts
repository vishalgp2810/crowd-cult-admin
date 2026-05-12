/** Must match crowd-cult-backend `src/Constants/uploadKeys.js` values. */
export const UPLOAD_KEYS = {
  ARTIST_PROFILE_IMAGE: "artist-profile",
  ARTIST_COVER_IMAGE: "artist-cover",
  ARTIST_MEDIA: "artist-media",
  MEDIA_COLLECTION_COVER: "media-collection-cover",
  VENUE_PROFILE_IMAGE: "venue-profile",
  VENUE_COVER_IMAGE: "venue-cover",
  VENUE_GALLERY: "venue-gallery",
} as const;

export type UploadKeyValue = (typeof UPLOAD_KEYS)[keyof typeof UPLOAD_KEYS];
