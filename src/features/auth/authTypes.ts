import type { AuthUser } from "@/lib/api/authApi";

export type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  roleCode: "PLATFORM_ADMIN" | "VENUE" | "ARTIST" | null;
  status: AuthStatus;
  error: string | null;
  initialized: boolean;
  /** Incremented on login / logout so late `/auth/me` responses cannot overwrite a newer session. */
  authGeneration: number;
}
