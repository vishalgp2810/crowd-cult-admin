import { apiClient, unwrapApiResponse } from "./client";
import type {
  HostedEventDetail,
  HostedEventListResponse,
  HostedEventUpsertPayload,
  ListEventsParams,
} from "@/features/events/eventTypes";

export const eventsApi = {
  list: async (params?: ListEventsParams) => {
    const res = await apiClient.get("/admin/events", { params });
    return unwrapApiResponse<HostedEventListResponse>(res);
  },

  getById: async (hostedEventId: number) => {
    const res = await apiClient.get(`/admin/events/${hostedEventId}`);
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  create: async (payload: HostedEventUpsertPayload) => {
    const res = await apiClient.post("/admin/events", payload);
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  update: async (hostedEventId: number, payload: HostedEventUpsertPayload) => {
    const res = await apiClient.put(`/admin/events/${hostedEventId}`, payload);
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  publish: async (hostedEventId: number) => {
    const res = await apiClient.post(`/admin/events/${hostedEventId}/publish`);
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  unpublish: async (hostedEventId: number) => {
    const res = await apiClient.post(`/admin/events/${hostedEventId}/unpublish`);
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  deactivate: async (hostedEventId: number) => {
    const res = await apiClient.post(`/admin/events/${hostedEventId}/deactivate`);
    return unwrapApiResponse<{ hostedEventId: number; isActive: boolean }>(res);
  },

  listReviewQueue: async (params?: { q?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get("/admin/events/review-queue", { params });
    return unwrapApiResponse<HostedEventListResponse>(res);
  },

  approve: async (
    hostedEventId: number,
    payload: {
      eventTransactionFeeRate?: number;
      eventPlatformFeeRate?: number;
      reviewNotes?: string;
    }
  ) => {
    const res = await apiClient.post(`/admin/events/${hostedEventId}/approve`, payload);
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  reject: async (hostedEventId: number, rejectionReason: string) => {
    const res = await apiClient.post(`/admin/events/${hostedEventId}/reject`, {
      rejectionReason,
    });
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  requestChanges: async (hostedEventId: number, message: string) => {
    const res = await apiClient.post(`/admin/events/${hostedEventId}/request-changes`, {
      message,
    });
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  createMediaAsset: async (
    hostedEventId: number,
    payload: {
      title: string;
      assetType: "audio" | "video";
      url: string;
      byteSize?: number;
    }
  ) => {
    const res = await apiClient.post(`/admin/events/${hostedEventId}/media-assets`, payload);
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  setMediaAssetBackground: async (
    hostedEventId: number,
    hostedEventMediaAssetId: number,
    enabled: boolean
  ) => {
    const res = await apiClient.put(
      `/admin/events/${hostedEventId}/media-assets/${hostedEventMediaAssetId}/background`,
      { enabled }
    );
    return unwrapApiResponse<HostedEventDetail>(res);
  },

  deleteMediaAsset: async (hostedEventId: number, hostedEventMediaAssetId: number) => {
    const res = await apiClient.delete(
      `/admin/events/${hostedEventId}/media-assets/${hostedEventMediaAssetId}`
    );
    return unwrapApiResponse<HostedEventDetail>(res);
  },
};
