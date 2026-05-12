import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import { fetchMeThunk, loginThunk, logoutThunk, refreshThunk, registerThunk } from "./authThunks";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  roleCode: null,
  status: "idle",
  error: null,
  initialized: false,
};

const getRoleCode = (user: AuthState["user"]) => user?.role?.roleCode || null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data;
        state.roleCode = getRoleCode(action.payload.data);
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Registration failed";
        state.initialized = true;
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data;
        state.roleCode = getRoleCode(action.payload.data);
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Login failed";
        state.initialized = true;
      })
      .addCase(fetchMeThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.roleCode = getRoleCode(action.payload);
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.roleCode = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(refreshThunk.fulfilled, (state) => {
        state.initialized = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.roleCode = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        state.initialized = true;
      })
      .addCase(logoutThunk.rejected, (state) => {
        // Token is cleared in the thunk, but the API can still fail — always end the session in-memory.
        state.user = null;
        state.roleCode = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        state.initialized = true;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
