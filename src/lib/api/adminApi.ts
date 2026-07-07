import { apiClient, unwrapApiResponse } from "./client";
import type { ArtistHubProfile, ArtistReadiness } from "@/features/artist/artistTypes";
import type { VenueProfile } from "@/features/venue/venueTypes";
import type { AudienceUser, ArtistDraftProgress, AdminListParams, PaginatedResponse, SignupNudgePreview, SignupNudgeTargetType } from "@/features/admin/adminUserTypes";

/**
 * Platform admin moderation API.
 * Backend contract (adjust paths in one place if your server uses different routes):
 * - GET  /admin/artists?status=PENDING_APPROVAL
 * - GET  /admin/venues?status=PENDING_APPROVAL
 * - POST /admin/artists/:id/approve
 * - POST /admin/artists/:id/reject  { rejectionReason: string }
 * - POST /admin/artists/:id/request-changes { message: string }
 * - POST /admin/venues/:id/approve
 * - POST /admin/venues/:id/reject   { rejectionReason: string }
 * - POST /admin/venues/:id/request-changes { message: string }
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

  requestArtistChanges: async (artistProfileId: number, message: string) => {
    const res = await apiClient.post(`/admin/artists/${artistProfileId}/request-changes`, {
      message,
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

  requestVenueChanges: async (venueId: number, message: string) => {
    const res = await apiClient.post(`/admin/venues/${venueId}/request-changes`, {
      message,
    });
    return unwrapApiResponse<VenueProfile>(res);
  },

  getArtistReadiness: async (artistProfileId: number) => {
    const res = await apiClient.get(`/admin/artists/${artistProfileId}/readiness`);
    return unwrapApiResponse<ArtistReadiness>(res);
  },

  listAllArtists: async (params: AdminListParams = {}) => {
    const res = await apiClient.get("/admin/artists", {
      params: {
        status: params.status ?? "ALL",
        pageIndex: params.pageIndex ?? 0,
        pageSize: params.pageSize ?? 20,
        ...(params.searchKey ? { searchKey: params.searchKey } : {}),
      },
    });
    return unwrapApiResponse<PaginatedResponse<ArtistHubProfile>>(res);
  },

  listAllVenues: async (params: AdminListParams = {}) => {
    const res = await apiClient.get("/admin/venues", {
      params: {
        status: params.status ?? "ALL",
        pageIndex: params.pageIndex ?? 0,
        pageSize: params.pageSize ?? 20,
        ...(params.searchKey ? { searchKey: params.searchKey } : {}),
      },
    });
    return unwrapApiResponse<PaginatedResponse<VenueProfile>>(res);
  },

  listAudienceUsers: async (params: AdminListParams = {}) => {
    const res = await apiClient.get("/admin/audience", {
      params: {
        pageIndex: params.pageIndex ?? 0,
        pageSize: params.pageSize ?? 20,
        ...(params.searchKey ? { searchKey: params.searchKey } : {}),
      },
    });
    return unwrapApiResponse<PaginatedResponse<AudienceUser>>(res);
  },

  getDraftArtistReadinessBatch: async (artistProfileIds?: number[]) => {
    const res = await apiClient.get("/admin/artists/draft-readiness", {
      params:
        artistProfileIds && artistProfileIds.length > 0
          ? { ids: artistProfileIds.join(",") }
          : undefined,
    });
    return unwrapApiResponse<ArtistDraftProgress[]>(res);
  },

  getSignupNudgePreview: async (targetType: SignupNudgeTargetType, targetId: number) => {
    const res = await apiClient.get("/admin/signups/nudge-preview", {
      params: { targetType, targetId },
    });
    return unwrapApiResponse<SignupNudgePreview>(res);
  },

  sendSignupNudgeEmail: async (payload: {
    targetType: SignupNudgeTargetType;
    targetId: number;
    subject: string;
    message: string;
  }) => {
    const res = await apiClient.post("/admin/signups/nudge", payload);
    return unwrapApiResponse<{ success: boolean; to: string; messageId?: string; channel?: string }>(
      res
    );
  },
};
