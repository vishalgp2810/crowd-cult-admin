"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { fetchMeThunk, refreshThunk, logoutThunk } from "@/features/auth/authThunks";
import { isPlatformAdminRole } from "@/lib/roles";

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const status = useMemo(() => searchParams.get("status"), [searchParams]);
  const reason = useMemo(() => searchParams.get("reason"), [searchParams]);

  useEffect(() => {
    const run = async () => {
      if (status === "error") {
        if (reason === "role_mismatch") {
          const accountRole = searchParams.get("accountRole") || "existing";
          setError(
            `This email is already registered as ${accountRole}. Use the public Crowd & Cult app, or a different account for the admin console.`
          );
          return;
        }
        setError(reason || "Google authentication failed");
        return;
      }
      try {
        const user = await dispatch(fetchMeThunk()).unwrap();
        await dispatch(refreshThunk()).unwrap();
        const roleCode = String(user?.role?.roleCode || "").toUpperCase();

        if (isPlatformAdminRole(roleCode)) {
          router.replace("/admin/requests");
          return;
        }
        if (roleCode === "ARTIST" || roleCode === "VENUE") {
          try {
            await dispatch(logoutThunk()).unwrap();
          } catch {
            // still show message
          }
          setError(
            "This admin app is for platform staff only. Sign in to artist or venue tools on the public Crowd & Cult site."
          );
          return;
        }
        setError("Account role could not be resolved.");
      } catch (_) {
        setError("Unable to complete Google login.");
      }
    };
    run();
  }, [dispatch, reason, router, searchParams, status]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-3xl p-8 space-y-4 text-center">
        {error ? (
          <>
            <h1 className="text-xl font-black uppercase tracking-wide">Google sign-in</h1>
            <p className="text-sm text-gray-400">{error}</p>
            <button
              type="button"
              onClick={() => router.replace("/auth")}
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 py-3 text-xs font-black uppercase tracking-widest"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <h1 className="text-xl font-black uppercase tracking-wide">Finishing sign-in</h1>
            <p className="text-sm text-gray-400">Please wait…</p>
          </>
        )}
      </div>
    </main>
  );
}
