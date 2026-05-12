import { createAsyncThunk } from "@reduxjs/toolkit";
import { venueApi } from "@/lib/api/venueApi";
import type { UpdateVenuePayload } from "./venueTypes";

export const fetchVenueProfileThunk = createAsyncThunk(
  "venue/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await venueApi.getMyProfile();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch venue profile");
    }
  }
);

export const updateVenueProfileThunk = createAsyncThunk(
  "venue/updateProfile",
  async (payload: UpdateVenuePayload, { rejectWithValue }) => {
    try {
      return await venueApi.updateProfile(payload);
    } catch (error: any) {
      return rejectWithValue(error.message || "Update failed");
    }
  }
);

export const updateVenueAmenitiesThunk = createAsyncThunk(
  "venue/updateAmenities",
  async (amenities: string[], { rejectWithValue }) => {
    try {
      return await venueApi.updateAmenities(amenities);
    } catch (error: any) {
      return rejectWithValue(error.message || "Update failed");
    }
  }
);

export const updateVenueTechSpecsThunk = createAsyncThunk(
  "venue/updateTechSpecs",
  async (techSpecs: string[], { rejectWithValue }) => {
    try {
      return await venueApi.updateTechSpecs(techSpecs);
    } catch (error: any) {
      return rejectWithValue(error.message || "Update failed");
    }
  }
);

export const submitVenueProfileThunk = createAsyncThunk(
  "venue/submitProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await venueApi.submitProfile();
    } catch (error: any) {
      return rejectWithValue(error.message || "Submission failed");
    }
  }
);

export const fetchVenueBySlugThunk = createAsyncThunk(
  "venue/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      return await venueApi.getProfileBySlug(slug);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch venue");
    }
  }
);
