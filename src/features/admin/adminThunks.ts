import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "@/lib/api/adminApi";
import type { RootState } from "@/store";

import type { AdminListParams } from "@/features/admin/adminUserTypes";

export type PaginatedFetchParams = AdminListParams & { force?: boolean };

const toErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

export const fetchPendingArtistsThunk = createAsyncThunk(
  "admin/fetchPendingArtists",
  async (payload: { force?: boolean } | undefined, { rejectWithValue }) => {
    try {
      return await adminApi.listArtistsByStatus("PENDING_APPROVAL");
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload, { getState }) => {
      const { artistsStatus } = (getState() as RootState).admin;
      if (payload?.force) return true;
      // Prevent duplicate network calls from StrictMode/effect re-runs.
      return artistsStatus === "idle";
    },
  }
);

export const fetchApprovedArtistsThunk = createAsyncThunk(
  "admin/fetchApprovedArtists",
  async (payload: { force?: boolean } | undefined, { rejectWithValue }) => {
    try {
      return await adminApi.listArtistsByStatus("APPROVED");
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload, { getState }) => {
      const { approvedArtistsStatus } = (getState() as RootState).admin;
      if (payload?.force) return true;
      return approvedArtistsStatus === "idle";
    },
  }
);

export const fetchPendingVenuesThunk = createAsyncThunk(
  "admin/fetchPendingVenues",
  async (payload: { force?: boolean } | undefined, { rejectWithValue }) => {
    try {
      return await adminApi.listVenuesByStatus("PENDING_APPROVAL");
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload, { getState }) => {
      const { venuesStatus } = (getState() as RootState).admin;
      if (payload?.force) return true;
      // Prevent duplicate network calls from StrictMode/effect re-runs.
      return venuesStatus === "idle";
    },
  }
);

export const fetchApprovedVenuesThunk = createAsyncThunk(
  "admin/fetchApprovedVenues",
  async (payload: { force?: boolean } | undefined, { rejectWithValue }) => {
    try {
      return await adminApi.listVenuesByStatus("APPROVED");
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload, { getState }) => {
      const { approvedVenuesStatus } = (getState() as RootState).admin;
      if (payload?.force) return true;
      return approvedVenuesStatus === "idle";
    },
  }
);

export const fetchDraftArtistsThunk = createAsyncThunk(
  "admin/fetchDraftArtists",
  async (payload: { force?: boolean } | undefined, { rejectWithValue }) => {
    try {
      return await adminApi.listArtistsByStatus("DRAFT");
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload, { getState }) => {
      const { draftArtistsStatus } = (getState() as RootState).admin;
      if (payload?.force) return true;
      return draftArtistsStatus === "idle";
    },
  }
);

export const fetchDraftVenuesThunk = createAsyncThunk(
  "admin/fetchDraftVenues",
  async (payload: { force?: boolean } | undefined, { rejectWithValue }) => {
    try {
      return await adminApi.listVenuesByStatus("DRAFT");
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload, { getState }) => {
      const { draftVenuesStatus } = (getState() as RootState).admin;
      if (payload?.force) return true;
      return draftVenuesStatus === "idle";
    },
  }
);

export const fetchAllArtistsThunk = createAsyncThunk(
  "admin/fetchAllArtists",
  async (payload: PaginatedFetchParams | undefined, { rejectWithValue }) => {
    try {
      return await adminApi.listAllArtists(payload);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload, { getState }) => {
      if (payload?.force) return true;
      if (payload?.pageIndex !== undefined) return true;
      const { allArtistsStatus } = (getState() as RootState).admin;
      return allArtistsStatus === "idle";
    },
  }
);

export const fetchAllVenuesThunk = createAsyncThunk(
  "admin/fetchAllVenues",
  async (payload: PaginatedFetchParams | undefined, { rejectWithValue }) => {
    try {
      return await adminApi.listAllVenues(payload);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload, { getState }) => {
      if (payload?.force) return true;
      if (payload?.pageIndex !== undefined) return true;
      const { allVenuesStatus } = (getState() as RootState).admin;
      return allVenuesStatus === "idle";
    },
  }
);

export const fetchAudienceUsersThunk = createAsyncThunk(
  "admin/fetchAudienceUsers",
  async (payload: PaginatedFetchParams | undefined, { rejectWithValue }) => {
    try {
      return await adminApi.listAudienceUsers(payload);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload, { getState }) => {
      if (payload?.force) return true;
      if (payload?.pageIndex !== undefined) return true;
      const { audienceUsersStatus } = (getState() as RootState).admin;
      return audienceUsersStatus === "idle";
    },
  }
);

export const fetchArtistDraftReadinessThunk = createAsyncThunk(
  "admin/fetchArtistDraftReadiness",
  async (
    payload: { force?: boolean; artistProfileIds?: number[] } | undefined,
    { rejectWithValue }
  ) => {
    try {
      return await adminApi.getDraftArtistReadinessBatch(payload?.artistProfileIds);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  },
  {
    condition: (payload) => {
      if (payload?.force) return true;
      if (payload?.artistProfileIds?.length) return true;
      return false;
    },
  }
);

export const approveArtistThunk = createAsyncThunk(
  "admin/approveArtist",
  async (artistProfileId: number, { rejectWithValue }) => {
    try {
      return await adminApi.approveArtist(artistProfileId);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const rejectArtistThunk = createAsyncThunk(
  "admin/rejectArtist",
  async (
    { artistProfileId, rejectionReason }: { artistProfileId: number; rejectionReason: string },
    { rejectWithValue }
  ) => {
    try {
      return await adminApi.rejectArtist(artistProfileId, rejectionReason);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const approveVenueThunk = createAsyncThunk(
  "admin/approveVenue",
  async (venueId: number, { rejectWithValue }) => {
    try {
      return await adminApi.approveVenue(venueId);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const rejectVenueThunk = createAsyncThunk(
  "admin/rejectVenue",
  async (
    { venueId, rejectionReason }: { venueId: number; rejectionReason: string },
    { rejectWithValue }
  ) => {
    try {
      return await adminApi.rejectVenue(venueId, rejectionReason);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const requestArtistChangesThunk = createAsyncThunk(
  "admin/requestArtistChanges",
  async (
    { artistProfileId, message }: { artistProfileId: number; message: string },
    { rejectWithValue }
  ) => {
    try {
      return await adminApi.requestArtistChanges(artistProfileId, message);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const requestVenueChangesThunk = createAsyncThunk(
  "admin/requestVenueChanges",
  async (
    { venueId, message }: { venueId: number; message: string },
    { rejectWithValue }
  ) => {
    try {
      return await adminApi.requestVenueChanges(venueId, message);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);
