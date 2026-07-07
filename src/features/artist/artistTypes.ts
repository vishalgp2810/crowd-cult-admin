export interface ArtistCollection {
  mediaCollectionId: number;
  name: string;
  collectionType: string;
  coverUrl: string | null;
  sortOrder: number;
  assetCount: number;
}

export interface ArtistMediaAsset {
  mediaAssetId: number;
  mediaCollectionId: number | null;
  assetType: string;
  title: string;
  url: string | null;
  embedId: string | null;
  durationSeconds: number | null;
  byteSize: number | null;
}

export interface ArtistHubProfile {
  artistProfileId: number;
  userId: number;
  slug: string;
  stageName: string;
  legalName?: string | null;
  fullName?: string | null;
  emailAddress?: string | null;
  performerTypeCode?: string | null;
  performerTypeLabel?: string | null;
  phoneNumber?: string | null;
  profileMeta?: Record<string, unknown> | null;
  genre: string | null;
  city: string | null;
  countryCode: string | null;
  formattedAddress: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  state: string | null;
  postalCode: string | null;
  placeId: string | null;
  latitude: number | null;
  longitude: number | null;
  hourlyRate: number | null;
  bio: string | null;
  available: boolean;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  ratingAvg: number | null;
  reviewCount: number;
  completedBookingsCount: number;
  tags: string[];
  skills: string[];
  equipment: string[];
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "BANNED";
  rejectionReason: string | null;
  createdAt?: string;
  updatedAt?: string;
  collections: ArtistCollection[];
  mediaAssets: ArtistMediaAsset[];
}

export interface ArtistReadinessSection {
  complete: boolean;
  missing: string[];
  label: string;
  tabId?: string;
}

export interface ArtistReadiness {
  ready: boolean;
  sections: Record<string, ArtistReadinessSection>;
  incompleteSections: string[];
  performerTypeCode: string;
}
