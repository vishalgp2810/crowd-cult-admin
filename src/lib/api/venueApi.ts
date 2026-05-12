import { apiClient, unwrapApiResponse } from "./client";
import type { VenueProfile, UpdateVenuePayload } from "@/features/venue/venueTypes";

export const venueApi = {
  getMyProfile: async () => {
    const res = await apiClient.get("/venues/me/profile");
    return unwrapApiResponse<VenueProfile>(res);
  },
  updateProfile: async (payload: UpdateVenuePayload) => {
    const res = await apiClient.put("/venues/me/profile", payload);
    return unwrapApiResponse<VenueProfile>(res);
  },
  updateAmenities: async (amenities: string[]) => {
    const res = await apiClient.put("/venues/me/profile/amenities", { amenities });
    return unwrapApiResponse<VenueProfile>(res);
  },
  updateTechSpecs: async (techSpecs: string[]) => {
    const res = await apiClient.put("/venues/me/profile/tech-specs", { techSpecs });
    return unwrapApiResponse<VenueProfile>(res);
  },
  submitProfile: async () => {
    const res = await apiClient.post("/venues/me/profile/submit");
    return unwrapApiResponse<VenueProfile>(res);
  },
  getProfileBySlug: async (slug: string) => {
    const res = await apiClient.get(`/public/venues/${slug}`);
    return unwrapApiResponse<VenueProfile>(res);
  },
};
