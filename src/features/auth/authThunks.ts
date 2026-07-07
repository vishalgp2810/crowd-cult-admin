import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, type LoginPayload, type RegisterPayload } from "@/lib/api/authApi";
import { clearBearerToken, setBearerToken } from "@/lib/api/authToken";
import type { AuthState } from "./authTypes";

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
      const res = await authApi.registerArtistOrVenue(payload);
      if (res.token) setBearerToken(res.token);
      return res;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload);
      if (res.token) setBearerToken(res.token);
      return res;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const fetchMeThunk = createAsyncThunk(
  "auth/me",
  async (_, { getState, rejectWithValue }) => {
    const genBefore = (getState() as { auth: AuthState }).auth.authGeneration;
    try {
      const user = await authApi.me();
      return { user, genBefore };
    } catch (error) {
      return rejectWithValue({ genBefore, message: toErrorMessage(error) });
    }
  }
);

export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.refresh();
      if (res.token) setBearerToken(res.token);
      return res;
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      clearBearerToken();
      return await authApi.logout();
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);
