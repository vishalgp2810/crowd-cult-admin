import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "@/lib/api/adminApi";
import type { RootState } from "@/store";

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
