export type VenueStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "BANNED";

export interface VenueProfile {
  venueId: number;
  userId: number;
  slug: string;
  businessName: string;
  venueType: string | null;
  capacity: number;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  countryCode: string | null;
  formattedAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  placeId: string | null;
  bio: string | null;
  website: string | null;
  phoneNumber: string | null;
  instagramUrl: string | null;
  spotifyUrl: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  status: VenueStatus;
  rejectionReason: string | null;
  isVerified: boolean;
  amenities: string[];
  techSpecs: string[];
  mediaAssets?: Array<{
    mediaAssetId: number;
    url: string;
    /** Short-lived signed URL for private bucket playback (use in media elements). */
    readUrl?: string;
    title?: string;
    assetType?: "audio" | "video" | "image" | "document";
    createdAt?: string;
  }>;
}

export interface UpdateVenuePayload {
  businessName?: string;
  venueType?: string;
  capacity?: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
  bio?: string;
  website?: string;
  phoneNumber?: string;
  instagramUrl?: string;
  spotifyUrl?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
}
