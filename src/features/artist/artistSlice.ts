import { createSlice } from "@reduxjs/toolkit";
import type { ArtistHubProfile } from "./artistTypes";
import {
  fetchArtistProfileThunk,
  updateArtistProfileThunk,
  updateArtistTagsThunk,
  updateArtistSkillsThunk,
  updateArtistEquipmentThunk,
  upsertArtistCollectionsThunk,
  createArtistMediaAssetThunk,
  submitArtistProfileThunk,
  fetchArtistBySlugThunk,
} from "./artistThunks";

export interface ArtistState {
  profile: ArtistHubProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ArtistState = {
  profile: null,
  status: "idle",
  error: null,
};

const setProfileFromThunk = (state: ArtistState, profile: ArtistHubProfile) => {
  state.profile = profile;
  state.status = "succeeded";
  state.error = null;
};

const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    clearArtistError(state) {
      state.error = null;
    },
    resetArtistState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtistProfileThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchArtistProfileThunk.fulfilled, (state, action) => {
        setProfileFromThunk(state, action.payload);
      })
      .addCase(fetchArtistProfileThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to load profile";
      })
      .addCase(updateArtistProfileThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateArtistProfileThunk.fulfilled, (state, action) => {
        setProfileFromThunk(state, action.payload);
      })
      .addCase(updateArtistProfileThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Update failed";
      })
      .addCase(updateArtistTagsThunk.fulfilled, (state, action) => {
        setProfileFromThunk(state, action.payload);
      })
      .addCase(updateArtistTagsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Update failed";
      })
      .addCase(updateArtistSkillsThunk.fulfilled, (state, action) => {
        setProfileFromThunk(state, action.payload);
      })
      .addCase(updateArtistSkillsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Update failed";
      })
      .addCase(updateArtistEquipmentThunk.fulfilled, (state, action) => {
        setProfileFromThunk(state, action.payload);
      })
      .addCase(updateArtistEquipmentThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Update failed";
      })
      .addCase(upsertArtistCollectionsThunk.fulfilled, (state, action) => {
        setProfileFromThunk(state, action.payload);
      })
      .addCase(upsertArtistCollectionsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Update failed";
      })
      .addCase(createArtistMediaAssetThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(createArtistMediaAssetThunk.fulfilled, (state, action) => {
        setProfileFromThunk(state, action.payload);
      })
      .addCase(createArtistMediaAssetThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Create failed";
      })
      .addCase(submitArtistProfileThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitArtistProfileThunk.fulfilled, (state, action) => {
        setProfileFromThunk(state, action.payload);
      })
      .addCase(submitArtistProfileThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Submission failed";
      })
      .addCase(fetchArtistBySlugThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchArtistBySlugThunk.fulfilled, (state, action) => {
        setProfileFromThunk(state, action.payload);
      })
      .addCase(fetchArtistBySlugThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch artist profile";
      });
  },
});

export const { clearArtistError, resetArtistState } = artistSlice.actions;
export default artistSlice.reducer;
