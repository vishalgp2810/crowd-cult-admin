import { createSlice } from "@reduxjs/toolkit";
import type { AdminUser } from "./adminUsersTypes";
import { createAdminUsersThunk, fetchAdminUsersThunk } from "./adminUsersThunks";

type AdminUsersState = {
  users: AdminUser[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastSkipped: Array<{ emailAddress: string | null; reason: string }>;
};

const initialState: AdminUsersState = {
  users: [],
  listStatus: "idle",
  createStatus: "idle",
  error: null,
  lastSkipped: [],
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearAdminUsersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsersThunk.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAdminUsersThunk.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchAdminUsersThunk.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = (action.payload as string) || "Failed to load admin users";
      })
      .addCase(createAdminUsersThunk.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createAdminUsersThunk.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.lastSkipped = action.payload.skipped || [];
        if (action.payload.created?.length) {
          state.users = [...action.payload.created, ...state.users];
        }
      })
      .addCase(createAdminUsersThunk.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = (action.payload as string) || "Failed to create admin users";
      });
  },
});

export const { clearAdminUsersError } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;

