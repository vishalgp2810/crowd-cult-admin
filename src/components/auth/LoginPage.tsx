// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginThunk, logoutThunk } from "@/features/auth/authThunks";
import { selectAuthStatus } from "@/features/auth/authSelectors";
import { isPlatformAdminRole } from "@/lib/roles";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchParams.get("reason") === "ops_only") {
      toast.error("This console is for platform administrators only. Use the public app for artist and venue accounts.");
      // Clean URL after showing the message once.
      router.replace("/auth");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const loginResult = await dispatch(
        loginThunk({ emailAddress: email, passwordHash: password })
      ).unwrap();
      const resolvedRoleCode = String(
        loginResult?.data?.role?.roleCode || loginResult?.data?.roleCode || ""
      )
        .trim()
        .toUpperCase() || null;

      if (!isPlatformAdminRole(resolvedRoleCode)) {
        try {
          await dispatch(logoutThunk()).unwrap();
        } catch {
          // ignore
        }
        toast.error("This account is not a platform administrator. Use the public Crowd & Cult app for artist or venue sign-in.");
        return;
      }

      toast.success("Welcome back!");
      setTimeout(() => router.push("/admin/requests"), 300);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || "Authentication failed");
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-center" richColors />

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] blur-[120px] bg-purple-600/10 rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-purple-600 p-2.5 rounded-xl mb-3 shadow-2xl shadow-purple-600/20">
            <span className="text-white text-xl sm:text-2xl font-black italic">C&amp;C</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter italic text-center leading-none">
            CROWD<span className="text-yellow-500">&</span>CULT
          </h1>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mt-2">Admin console</p>
        </div>

        <div className="bg-[#121212] border border-white/5 rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-3xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl font-black tracking-tight">Sign in</h2>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest italic">Platform team only</p>
            </div>
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full h-12 bg-[#1A1A1A] border border-white/5 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-purple-500/30 transition-all shadow-inner"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Password</label>
                <input
                  required
                  type="password"
                  className="w-full h-12 bg-[#1A1A1A] border border-white/5 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-purple-500/30 transition-all shadow-inner"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <div className="pt-2">
              <button
                disabled={!mounted || isLoading || authStatus === "loading"}
                type="submit"
                className="w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-[0.98] bg-purple-600 text-white shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mounted && (isLoading || authStatus === "loading") ? "SYNCING…" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
