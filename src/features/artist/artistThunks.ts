import { createAsyncThunk } from "@reduxjs/toolkit";
import { artistApi, type CreateMediaAssetPayload, type MediaCollectionInput, type UpdateArtistProfilePayload } from "@/lib/api/artistApi";
import { mediaApi } from "@/lib/api/mediaApi";
import type { UploadKeyValue } from "@/lib/constants/uploadKeys";

const toErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

export const fetchArtistProfileThunk = createAsyncThunk(
  "artist/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await artistApi.getProfile();
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const updateArtistProfileThunk = createAsyncThunk(
  "artist/updateProfile",
  async (payload: UpdateArtistProfilePayload, { rejectWithValue }) => {
    try {
      return await artistApi.updateProfile(payload);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const updateArtistTagsThunk = createAsyncThunk(
  "artist/updateTags",
  async (tags: string[], { rejectWithValue }) => {
    try {
      return await artistApi.updateTags(tags);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const updateArtistSkillsThunk = createAsyncThunk(
  "artist/updateSkills",
  async (skills: string[], { rejectWithValue }) => {
    try {
      return await artistApi.updateSkills(skills);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const updateArtistEquipmentThunk = createAsyncThunk(
  "artist/updateEquipment",
  async (equipment: string[], { rejectWithValue }) => {
    try {
      return await artistApi.updateEquipment(equipment);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const upsertArtistCollectionsThunk = createAsyncThunk(
  "artist/upsertCollections",
  async (collections: MediaCollectionInput[], { rejectWithValue }) => {
    try {
      return await artistApi.upsertCollections(collections);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const createArtistMediaAssetThunk = createAsyncThunk(
  "artist/createMediaAsset",
  async (payload: CreateMediaAssetPayload, { rejectWithValue }) => {
    try {
      return await artistApi.createMediaAsset(payload);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const uploadMediaFileThunk = createAsyncThunk(
  "artist/uploadMediaFile",
  async (arg: { file: File; uploadKey: UploadKeyValue }, { rejectWithValue }) => {
    try {
      return await mediaApi.uploadFile(arg.file, arg.uploadKey);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const submitArtistProfileThunk = createAsyncThunk(
  "artist/submitProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await artistApi.submitProfile();
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const fetchArtistBySlugThunk = createAsyncThunk(
  "artist/fetchBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      return await artistApi.getProfileBySlug(slug);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);
