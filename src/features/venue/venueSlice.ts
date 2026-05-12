import { createSlice } from "@reduxjs/toolkit";
import type { VenueProfile } from "./venueTypes";
import {
  fetchVenueProfileThunk,
  updateVenueProfileThunk,
  updateVenueAmenitiesThunk,
  updateVenueTechSpecsThunk,
  submitVenueProfileThunk,
  fetchVenueBySlugThunk,
} from "./venueThunks";

interface VenueState {
  profile: VenueProfile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VenueState = {
  profile: null,
  status: "idle",
  error: null,
};

const venueSlice = createSlice({
  name: "venue",
  initialState,
  reducers: {
    resetVenueState: (state) => {
      state.profile = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVenueProfileThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVenueProfileThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchVenueProfileThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to load profile";
      })
      .addCase(updateVenueProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateVenueAmenitiesThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateVenueTechSpecsThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(submitVenueProfileThunk.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchVenueBySlugThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchVenueBySlugThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchVenueBySlugThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch venue profile";
      });
  },
});

export const { resetVenueState } = venueSlice.actions;
export default venueSlice.reducer;
