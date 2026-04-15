import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, type LoginPayload, type RegisterPayload } from "@/lib/api/authApi";

const toErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authApi.registerArtistOrVenue(payload);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authApi.login(payload);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const fetchMeThunk = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.me();
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.refresh();
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.logout();
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);
