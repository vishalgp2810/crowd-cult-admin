import { createSlice } from "@reduxjs/toolkit";
import type { ArtistHubProfile } from "@/features/artist/artistTypes";
import type { VenueProfile } from "@/features/venue/venueTypes";
import type { AudienceUser } from "@/features/admin/adminUserTypes";
import {
  approveArtistThunk,
  approveVenueThunk,
  fetchAllArtistsThunk,
  fetchAllVenuesThunk,
  fetchApprovedArtistsThunk,
  fetchApprovedVenuesThunk,
  fetchArtistDraftReadinessThunk,
  fetchAudienceUsersThunk,
  fetchDraftArtistsThunk,
  fetchDraftVenuesThunk,
  fetchPendingArtistsThunk,
  fetchPendingVenuesThunk,
  rejectArtistThunk,
  rejectVenueThunk,
  requestArtistChangesThunk,
  requestVenueChangesThunk,
} from "./adminThunks";

export interface AdminState {
  pendingArtists: ArtistHubProfile[];
  pendingVenues: VenueProfile[];
  approvedArtists: ArtistHubProfile[];
  approvedVenues: VenueProfile[];
  draftArtists: ArtistHubProfile[];
  draftVenues: VenueProfile[];
  allArtists: ArtistHubProfile[];
  allVenues: VenueProfile[];
  audienceUsers: AudienceUser[];
  allArtistsCount: number;
  allVenuesCount: number;
  audienceUsersCount: number;
  allArtistsPageIndex: number;
  allVenuesPageIndex: number;
  audienceUsersPageIndex: number;
  artistDraftProgress: Record<number, number>;
  artistsStatus: "idle" | "loading" | "succeeded" | "failed";
  venuesStatus: "idle" | "loading" | "succeeded" | "failed";
  approvedArtistsStatus: "idle" | "loading" | "succeeded" | "failed";
  approvedVenuesStatus: "idle" | "loading" | "succeeded" | "failed";
  draftArtistsStatus: "idle" | "loading" | "succeeded" | "failed";
  draftVenuesStatus: "idle" | "loading" | "succeeded" | "failed";
  allArtistsStatus: "idle" | "loading" | "succeeded" | "failed";
  allVenuesStatus: "idle" | "loading" | "succeeded" | "failed";
  audienceUsersStatus: "idle" | "loading" | "succeeded" | "failed";
  artistDraftReadinessStatus: "idle" | "loading" | "succeeded" | "failed";
  mutationStatus: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: AdminState = {
  pendingArtists: [],
  pendingVenues: [],
  approvedArtists: [],
  approvedVenues: [],
  draftArtists: [],
  draftVenues: [],
  allArtists: [],
  allVenues: [],
  audienceUsers: [],
  allArtistsCount: 0,
  allVenuesCount: 0,
  audienceUsersCount: 0,
  allArtistsPageIndex: 0,
  allVenuesPageIndex: 0,
  audienceUsersPageIndex: 0,
  artistDraftProgress: {},
  artistsStatus: "idle",
  venuesStatus: "idle",
  approvedArtistsStatus: "idle",
  approvedVenuesStatus: "idle",
  draftArtistsStatus: "idle",
  draftVenuesStatus: "idle",
  allArtistsStatus: "idle",
  allVenuesStatus: "idle",
  audienceUsersStatus: "idle",
  artistDraftReadinessStatus: "idle",
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
      .addCase(fetchDraftArtistsThunk.pending, (state) => {
        state.draftArtistsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchDraftArtistsThunk.fulfilled, (state, action) => {
        state.draftArtistsStatus = "succeeded";
        state.draftArtists = action.payload;
      })
      .addCase(fetchDraftArtistsThunk.rejected, (state, action) => {
        state.draftArtistsStatus = "failed";
        state.error = (action.payload as string) || "Failed to load incomplete artist signups";
      })
      .addCase(fetchDraftVenuesThunk.pending, (state) => {
        state.draftVenuesStatus = "loading";
        state.error = null;
      })
      .addCase(fetchDraftVenuesThunk.fulfilled, (state, action) => {
        state.draftVenuesStatus = "succeeded";
        state.draftVenues = action.payload;
      })
      .addCase(fetchDraftVenuesThunk.rejected, (state, action) => {
        state.draftVenuesStatus = "failed";
        state.error = (action.payload as string) || "Failed to load incomplete venue signups";
      })
      .addCase(fetchAllArtistsThunk.pending, (state) => {
        state.allArtistsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAllArtistsThunk.fulfilled, (state, action) => {
        state.allArtistsStatus = "succeeded";
        state.allArtists = action.payload.rows;
        state.allArtistsCount = action.payload.count;
        state.allArtistsPageIndex = action.payload.pageIndex;
      })
      .addCase(fetchAllArtistsThunk.rejected, (state, action) => {
        state.allArtistsStatus = "failed";
        state.error = (action.payload as string) || "Failed to load artists";
      })
      .addCase(fetchAllVenuesThunk.pending, (state) => {
        state.allVenuesStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAllVenuesThunk.fulfilled, (state, action) => {
        state.allVenuesStatus = "succeeded";
        state.allVenues = action.payload.rows;
        state.allVenuesCount = action.payload.count;
        state.allVenuesPageIndex = action.payload.pageIndex;
      })
      .addCase(fetchAllVenuesThunk.rejected, (state, action) => {
        state.allVenuesStatus = "failed";
        state.error = (action.payload as string) || "Failed to load venues";
      })
      .addCase(fetchAudienceUsersThunk.pending, (state) => {
        state.audienceUsersStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAudienceUsersThunk.fulfilled, (state, action) => {
        state.audienceUsersStatus = "succeeded";
        state.audienceUsers = action.payload.rows;
        state.audienceUsersCount = action.payload.count;
        state.audienceUsersPageIndex = action.payload.pageIndex;
      })
      .addCase(fetchAudienceUsersThunk.rejected, (state, action) => {
        state.audienceUsersStatus = "failed";
        state.error = (action.payload as string) || "Failed to load audience users";
      })
      .addCase(fetchArtistDraftReadinessThunk.pending, (state) => {
        state.artistDraftReadinessStatus = "loading";
      })
      .addCase(fetchArtistDraftReadinessThunk.fulfilled, (state, action) => {
        state.artistDraftReadinessStatus = "succeeded";
        for (const row of action.payload) {
          state.artistDraftProgress[row.artistProfileId] = row.completionPercent;
        }
      })
      .addCase(fetchArtistDraftReadinessThunk.rejected, (state) => {
        state.artistDraftReadinessStatus = "failed";
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
        state.approvedArtists = state.approvedArtists.filter((a) => a.artistProfileId !== id);
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
        state.approvedVenues = state.approvedVenues.filter((v) => v.venueId !== id);
      })
      .addCase(rejectVenueThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) || "Reject failed";
      })
      .addCase(requestArtistChangesThunk.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(requestArtistChangesThunk.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        const id = Number(action.meta.arg.artistProfileId);
        state.pendingArtists = state.pendingArtists.filter((a) => a.artistProfileId !== id);
        state.approvedArtists = state.approvedArtists.filter((a) => a.artistProfileId !== id);
      })
      .addCase(requestArtistChangesThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) || "Request changes failed";
      })
      .addCase(requestVenueChangesThunk.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(requestVenueChangesThunk.fulfilled, (state, action) => {
        state.mutationStatus = "idle";
        const id = Number(action.meta.arg.venueId);
        state.pendingVenues = state.pendingVenues.filter((v) => v.venueId !== id);
        state.approvedVenues = state.approvedVenues.filter((v) => v.venueId !== id);
      })
      .addCase(requestVenueChangesThunk.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = (action.payload as string) || "Request changes failed";
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
