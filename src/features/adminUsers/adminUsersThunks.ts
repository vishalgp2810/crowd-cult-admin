import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminUsersApi } from "@/lib/api/adminUsersApi";
import type { CreateAdminUserInput } from "./adminUsersTypes";

const toErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

export const fetchAdminUsersThunk = createAsyncThunk(
  "adminUsers/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      return await adminUsersApi.listAdminUsers();
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const createAdminUsersThunk = createAsyncThunk(
  "adminUsers/createMany",
  async (users: CreateAdminUserInput[], { rejectWithValue }) => {
    try {
      return await adminUsersApi.createAdminUsers(users);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

