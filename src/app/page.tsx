"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAuthRoleCode,
  selectIsAuthenticated,
} from "@/features/auth/authSelectors";
import { logoutThunk } from "@/features/auth/authThunks";
import { isPlatformAdminRole } from "@/lib/roles";

/**
 * Root route: send guests to login, admins to the queue, and sign out everyone else
 * (this build is admin-only). Refs prevent parallel sign-out / replace storms if the
 * effect re-runs before the first run finishes.
 */
export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((s) => s.auth.initialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const roleCode = useAppSelector(selectAuthRoleCode);

  const guestRedirectRef = useRef(false);
  const adminRedirectRef = useRef(false);
  const signOutInFlightRef = useRef(false);

  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated) {
      if (guestRedirectRef.current) return;
      guestRedirectRef.current = true;
      router.replace("/auth");
      return;
    }

    if (isPlatformAdminRole(roleCode)) {
      if (adminRedirectRef.current) return;
      adminRedirectRef.current = true;
      router.replace("/admin/requests");
      return;
    }

    if (signOutInFlightRef.current) return;
    signOutInFlightRef.current = true;

    void (async () => {
      try {
        await dispatch(logoutThunk()).unwrap();
      } catch {
        // logoutThunk.rejected also clears in-memory session in the slice
      }
      router.replace("/auth?reason=ops_only");
    })();
  }, [initialized, isAuthenticated, roleCode, dispatch, router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
      <p className="text-xs font-black uppercase tracking-widest text-white/30">Loading…</p>
    </div>
  );
}
