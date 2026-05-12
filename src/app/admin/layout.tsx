"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAuthRoleCode,
  selectIsAuthenticated,
} from "@/features/auth/authSelectors";
import { logoutThunk } from "@/features/auth/authThunks";
import { isPlatformAdminRole } from "@/lib/roles";
import { AdminAppShell } from "@/components/admin/AdminAppShell";

/**
 * If a non–platform admin hits /admin, sign them out and send them to /auth. Do not
 * bounce through "/" first (that doubled redirects and re-triggered the home effect in a loop).
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((s) => s.auth.initialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const roleCode = useAppSelector(selectAuthRoleCode);

  const allowed = isPlatformAdminRole(roleCode);
  const authOnlyRedirectRef = useRef(false);
  const kickToAuthRef = useRef(false);

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) {
      if (authOnlyRedirectRef.current) return;
      authOnlyRedirectRef.current = true;
      router.replace("/auth");
      return;
    }
    if (isPlatformAdminRole(roleCode)) {
      return;
    }
    if (kickToAuthRef.current) return;
    kickToAuthRef.current = true;
    void (async () => {
      try {
        await dispatch(logoutThunk()).unwrap();
      } catch {
        // state cleared on rejected in slice
      }
      router.replace("/auth?reason=ops_only");
    })();
  }, [initialized, isAuthenticated, roleCode, dispatch, router]);

  const showShell = initialized && isAuthenticated && allowed;

  const handleSignOut = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
    } catch {
      // continue to auth
    }
    router.push("/auth");
  };

  if (!showShell) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-xs font-black uppercase tracking-widest text-white/30">Loading…</p>
      </div>
    );
  }

  return <AdminAppShell onSignOut={handleSignOut}>{children}</AdminAppShell>;
}
