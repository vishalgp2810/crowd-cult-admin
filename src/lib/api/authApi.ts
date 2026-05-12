import { apiClient, unwrapApiResponse } from "./client";

export interface RegisterPayload {
  fullName: string;
  emailAddress: string;
  password: string;
  roleCode: "VENUE" | "ARTIST";
  businessName?: string;
  stageName?: string;
  city?: string;
  genre?: string;
  hourlyRate?: number;
}

export interface LoginPayload {
  emailAddress: string;
  passwordHash: string;
  /**
   * Optional disambiguation for multi-role logins. Omit to let the server resolve
   * the user role (e.g. PLATFORM_ADMIN in the admin app).
   */
  roleCode?: "VENUE" | "ARTIST" | "PLATFORM_ADMIN";
}

export interface AuthUser {
  userId: number;
  emailAddress: string;
  fullName: string;
  roleId: number;
  role?: {
    roleCode: "PLATFORM_ADMIN" | "VENUE" | "ARTIST";
    roleName?: string;
  };
  venue?: { venueId: number; businessName: string } | null;
  artistProfile?: { artistProfileId: number; stageName: string; slug: string } | null;
}

interface AuthPayload {
  token?: string;
  data: AuthUser;
}

export const authApi = {
  registerArtistOrVenue: async (payload: RegisterPayload) => {
    const res = await apiClient.post("/auth/register", payload);
    return unwrapApiResponse<AuthPayload>(res);
  },
  login: async (payload: LoginPayload) => {
    const res = await apiClient.post("/auth/login", payload);
    return unwrapApiResponse<AuthPayload>(res);
  },
  me: async () => {
    const res = await apiClient.get("/auth/me");
    return unwrapApiResponse<AuthUser>(res);
  },
  refresh: async () => {
    const res = await apiClient.post("/auth/refresh", {});
    return unwrapApiResponse<{ token: string }>(res);
  },
  logout: async () => {
    const res = await apiClient.post("/auth/logout", {});
    return unwrapApiResponse<{ success: boolean }>(res);
  },
};
