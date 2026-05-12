import { createSlice } from "@reduxjs/toolkit";
import type { ArtistHubProfile } from "@/features/artist/artistTypes";
import type { VenueProfile } from "@/features/venue/venueTypes";
import {
  approveArtistThunk,
  approveVenueThunk,
  fetchApprovedArtistsThunk,
  fetchApprovedVenuesThunk,
  fetchPendingArtistsThunk,
  fetchPendingVenuesThunk,
  rejectArtistThunk,
  rejectVenueThunk,
} from "./adminThunks";

export interface AdminState {
  pendingArtists: ArtistHubProfile[];
  pendingVenues: VenueProfile[];
  approvedArtists: ArtistHubProfile[];
  approvedVenues: VenueProfile[];
  artistsStatus: "idle" | "loading" | "succeeded" | "failed";
  venuesStatus: "idle" | "loading" | "succeeded" | "failed";
  approvedArtistsStatus: "idle" | "loading" | "succeeded" | "failed";
  approvedVenuesStatus: "idle" | "loading" | "succeeded" | "failed";
  mutationStatus: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: AdminState = {
  pendingArtists: [],
  pendingVenues: [],
  approvedArtists: [],
  approvedVenues: [],
  artistsStatus: "idle",
  venuesStatus: "idle",
  approvedArtistsStatus: "idle",
  approvedVenuesStatus: "idle",
  mutationStatus: "idle",
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingArtistsThunk.pending, (state) => {
        state.artistsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchPendingArtistsThunk.fulfilled, (state, action) => {
        state.artistsStatus = "succeeded";
        state.pendingArtists = action.payload;
      })
      .addCase(fetchPendingArtistsThunk.rejected, (state, action) => {
        state.artistsStatus = "failed";
        state.error = (action.payload as string) || "Failed to load artists";
      })
      .addCase(fetchPendingVenuesThunk.pending, (state) => {
        state.venuesStatus = "loading";
        state.error = null;
      })
      .addCase(fetchPendingVenuesThunk.fulfilled, (state, action) => {
        state.venuesStatus = "succeeded";
        state.pendingVenues = action.payload;
      })
      .addCase(fetchPendingVenuesThunk.rejected, (state, action) => {
        state.venuesStatus = "failed";
        state.error = (action.payload as string) || "Failed to load venues";
      })
      .addCase(fetchApprovedArtistsThunk.pending, (state) => {
        state.approvedArtistsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchApprovedArtistsThunk.fulfilled, (state, action) => {
        state.approvedArtistsStatus = "succeeded";
        state.approvedArtists = action.payload;
      })
      .addCase(fetchApprovedArtistsThunk.rejected, (state, action) => {
        state.approvedArtistsStatus = "failed";
        state.error = (action.payload as string) || "Failed to load approved artists";
      })
      .addCase(fetchApprovedVenuesThunk.pending, (state) => {
        state.approvedVenuesStatus = "loading";
        state.error = null;
      })
      .addCase(fetchApprovedVenuesThunk.fulfilled, (state, action) => {
        state.approvedVenuesStatus = "succeeded";
        state.approvedVenues = action.payload;
      })
      .addCase(fetchApprovedVenuesThunk.rejected, (state, action) => {
        state.approvedVenuesStatus = "failed";
        state.error = (action.payload as string) || "Failed to load approved venues";
      })
      .addCase(approveArtistThunk.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(approveArtistThunk.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        const id = Number(action.meta.arg);
        state.pendingArtists = state.pendingArtists.filter((a) => a.artistProfileId !== id);
      })
      .addCase(approveArtistThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) || "Approve failed";
      })
      .addCase(rejectArtistThunk.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(rejectArtistThunk.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        const id = Number(action.meta.arg.artistProfileId);
        state.pendingArtists = state.pendingArtists.filter((a) => a.artistProfileId !== id);
      })
      .addCase(rejectArtistThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) || "Reject failed";
      })
      .addCase(approveVenueThunk.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(approveVenueThunk.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        const id = Number(action.meta.arg);
        state.pendingVenues = state.pendingVenues.filter((v) => v.venueId !== id);
      })
      .addCase(approveVenueThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) || "Approve failed";
      })
      .addCase(rejectVenueThunk.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(rejectVenueThunk.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        const id = Number(action.meta.arg.venueId);
        state.pendingVenues = state.pendingVenues.filter((v) => v.venueId !== id);
      })
      .addCase(rejectVenueThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) || "Reject failed";
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
