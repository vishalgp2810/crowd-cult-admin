import { apiClient, unwrapApiResponse } from "./client";
import type { ArtistHubProfile } from "@/features/artist/artistTypes";
import type { VenueProfile } from "@/features/venue/venueTypes";

/**
 * Platform admin moderation API.
 * Backend contract (adjust paths in one place if your server uses different routes):
 * - GET  /admin/artists?status=PENDING_APPROVAL
 * - GET  /admin/venues?status=PENDING_APPROVAL
 * - POST /admin/artists/:id/approve
 * - POST /admin/artists/:id/reject  { rejectionReason: string }
 * - POST /admin/venues/:id/approve
 * - POST /admin/venues/:id/reject   { rejectionReason: string }
 *
 * successResponse.data should be T (array for list endpoints, profile for mutations).
 */

export const adminApi = {
  listArtistsByStatus: async (status: string) => {
    const res = await apiClient.get("/admin/artists", { params: { status } });
    return unwrapApiResponse<ArtistHubProfile[]>(res);
  },

  listVenuesByStatus: async (status: string) => {
    const res = await apiClient.get("/admin/venues", { params: { status } });
    return unwrapApiResponse<VenueProfile[]>(res);
  },

  approveArtist: async (artistProfileId: number) => {
    const res = await apiClient.post(`/admin/artists/${artistProfileId}/approve`);
    return unwrapApiResponse<ArtistHubProfile>(res);
  },

  rejectArtist: async (artistProfileId: number, rejectionReason: string) => {
    const res = await apiClient.post(`/admin/artists/${artistProfileId}/reject`, {
      rejectionReason,
    });
    return unwrapApiResponse<ArtistHubProfile>(res);
  },

  approveVenue: async (venueId: number) => {
    const res = await apiClient.post(`/admin/venues/${venueId}/approve`);
    return unwrapApiResponse<VenueProfile>(res);
  },

  rejectVenue: async (venueId: number, rejectionReason: string) => {
    const res = await apiClient.post(`/admin/venues/${venueId}/reject`, {
      rejectionReason,
    });
    return unwrapApiResponse<VenueProfile>(res);
  },
};
