"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import {
  fetchAllArtistsThunk,
  fetchAllVenuesThunk,
  fetchAudienceUsersThunk,
  fetchDraftArtistsThunk,
  fetchDraftVenuesThunk,
  fetchPendingArtistsThunk,
  fetchPendingVenuesThunk,
} from "@/features/admin/adminThunks";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopHeader } from "./AdminTopHeader";

type AdminAppShellProps = {
  children: ReactNode;
  onSignOut: () => void;
};

export function AdminAppShell({ children, onSignOut }: AdminAppShellProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const contentWide =
    pathname?.startsWith("/admin/fees") || pathname?.startsWith("/admin/events");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    void dispatch(fetchPendingArtistsThunk());
    void dispatch(fetchPendingVenuesThunk());
    void dispatch(fetchDraftArtistsThunk());
    void dispatch(fetchDraftVenuesThunk());
    const countParams = { pageIndex: 0, pageSize: 1, status: "ALL" as const, force: true };
    void dispatch(fetchAllArtistsThunk(countParams));
    void dispatch(fetchAllVenuesThunk(countParams));
    void dispatch(fetchAudienceUsersThunk({ pageIndex: 0, pageSize: 1, force: true }));
  }, [dispatch]);

  useEffect(() => {
    const saved = window.localStorage.getItem("cc-admin-sidebar-collapsed");
    if (saved === "1") setSidebarCollapsed(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cc-admin-sidebar-collapsed", sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);

  return (
    <div
      className="h-screen overflow-hidden flex"
      style={{ background: "var(--cc-bg-base, #07070B)", color: "var(--cc-text-primary, #F0F0FF)" }}
    >
      {/* Global toast — z-50 ensures it always floats above sticky header (z-30) */}
      <Toaster
        position="top-center"
        offset={72}
        richColors
        toastOptions={{
          style: {
            background: "#12121C",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#F0F0FF",
            zIndex: 9999,
          },
        }}
      />
      {/* Desktop sidebar */}
      <AdminSidebar
        variant="desktop"
        onSignOut={onSignOut}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              key="admin-drawer-backdrop"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[60] lg:hidden"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="admin-drawer-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 z-[70] lg:hidden flex shadow-2xl"
              style={{ boxShadow: "4px 0 32px rgba(0,0,0,0.6)" }}
            >
              <AdminSidebar
                variant="drawer"
                onSignOut={onSignOut}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminTopHeader onOpenMobileMenu={() => setMobileOpen(true)} />

        {/* Background subtle grid / noise texture */}
        <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto relative">
          {/* Decorative ambient blobs */}
          <div
            aria-hidden
            className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] opacity-[0.035]"
            style={{
              background: "radial-gradient(circle at 80% 10%, #7C3AED 0%, transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none fixed bottom-0 w-[400px] h-[400px] opacity-[0.025] transition-[left] duration-200"
            style={{
              left: sidebarCollapsed ? 82 : 260,
              background: "radial-gradient(circle at 20% 80%, #A855F7 0%, transparent 60%)",
            }}
          />

          {/* Page content */}
          <div
            className={`relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${
              contentWide ? "max-w-none" : "max-w-6xl"
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
