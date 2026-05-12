import { apiClient, unwrapApiResponse } from "./client";
import type { ArtistHubProfile } from "@/features/artist/artistTypes";

export interface UpdateArtistProfilePayload {
  stageName?: string;
  genre?: string | null;
  city?: string | null;
  countryCode?: string | null;
  formattedAddress?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  state?: string | null;
  postalCode?: string | null;
  placeId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  hourlyRate?: number;
  bio?: string | null;
  available?: boolean;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
}

export interface AddressAutocompleteItem {
  description: string;
  placeId: string;
}

export interface AddressDetailsPayload {
  placeId: string | null;
  formattedAddress: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  countryCode: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface MediaCollectionInput {
  mediaCollectionId?: number;
  name: string;
  collectionType?: string;
  sortOrder?: number;
  coverUrl?: string | null;
}

export interface CreateMediaAssetPayload {
  title: string;
  assetType: "audio" | "video" | "image" | "document";
  url?: string | null;
  embedId?: string | null;
  durationSeconds?: number;
  byteSize?: number;
  mediaCollectionId?: number | null;
}

export const artistApi = {
  getProfile: async () => {
    const res = await apiClient.get("/artists/me/profile");
    return unwrapApiResponse<ArtistHubProfile>(res);
  },

  updateProfile: async (payload: UpdateArtistProfilePayload) => {
    const res = await apiClient.put("/artists/me/profile", payload);
    return unwrapApiResponse<ArtistHubProfile>(res);
  },

  autocompleteAddress: async (query: string) => {
    const res = await apiClient.get("/common/address/autocomplete", { params: { q: query } });
    return unwrapApiResponse<{ suggestions: AddressAutocompleteItem[] }>(res);
  },

  getAddressDetails: async (placeId: string) => {
    const res = await apiClient.get("/common/address/details", { params: { placeId } });
    return unwrapApiResponse<{ place: AddressDetailsPayload }>(res);
  },

  updateTags: async (tags: string[]) => {
    const res = await apiClient.put("/artists/me/profile/tags", { tags });
    return unwrapApiResponse<ArtistHubProfile>(res);
  },

  updateSkills: async (skills: string[]) => {
    const res = await apiClient.put("/artists/me/profile/skills", { skills });
    return unwrapApiResponse<ArtistHubProfile>(res);
  },

  updateEquipment: async (equipment: string[]) => {
    const res = await apiClient.put("/artists/me/profile/equipment", { equipment });
    return unwrapApiResponse<ArtistHubProfile>(res);
  },

  upsertCollections: async (collections: MediaCollectionInput[]) => {
    const res = await apiClient.put("/artists/me/collections", { collections });
    return unwrapApiResponse<ArtistHubProfile>(res);
  },

  createMediaAsset: async (payload: CreateMediaAssetPayload) => {
    const res = await apiClient.post("/artists/me/media-assets", payload);
    return unwrapApiResponse<ArtistHubProfile>(res);
  },
  submitProfile: async () => {
    const res = await apiClient.post("/artists/me/profile/submit");
    return unwrapApiResponse<ArtistHubProfile>(res);
  },
  getProfileBySlug: async (slug: string) => {
    const res = await apiClient.get(`/public/artists/${slug}`);
    return unwrapApiResponse<ArtistHubProfile>(res);
  },
};
