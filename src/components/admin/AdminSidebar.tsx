"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { ADMIN_NAV, getActiveNavKey } from "./adminNavConfig";
import {
  IconExternal,
  IconInbox,
  IconLogout,
  IconChart,
  IconShield,
  IconUsers,
  IconChevronRight,
  IconChevronLeft,
} from "./AdminIcons";
import { cn } from "./cn";

type AdminSidebarProps = {
  onNavigate?: () => void;
  onSignOut: () => void;
  variant: "desktop" | "drawer";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

/** Map nav hrefs → icon components */
function NavIcon({ href, isActive }: { href: string; isActive: boolean }) {
  const cls = "w-4 h-4";
  if (href === "/admin/requests") return <IconInbox className={cls} />;
  if (href === "/admin/users") return <IconUsers className={cls} />;
  if (href === "/admin/analytics") return <IconChart className={cls} />;
  if (href === "/admin/moderation") return <IconShield className={cls} />;
  return <IconInbox className={cls} />;
}

export function AdminSidebar({
  onNavigate,
  onSignOut,
  variant,
  collapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname() || "/";
  const activeHref = getActiveNavKey(pathname);
  const user = useAppSelector(selectAuthUser);
  const email = user?.emailAddress ?? "Admin";
  const initials = email.slice(0, 2).toUpperCase();
  const pendingTotal =
    useAppSelector((s) => s.admin.pendingArtists.length + s.admin.pendingVenues.length) ?? 0;

  const wrapCls =
    variant === "desktop"
      ? cn(
          "hidden lg:flex lg:flex-col shrink-0 h-screen sticky top-0 transition-[width] duration-200",
          collapsed ? "w-[82px]" : "w-[260px]"
        )
      : "flex flex-col w-[min(100vw-2rem,260px)] h-full max-h-screen";

  return (
    <aside
      className={cn(wrapCls, "bg-[#09090F] border-r border-white/[0.06]")}
      aria-label="Admin navigation"
    >
      {/* ── Brand header ──────────────────────────────── */}
      <div
        className={cn(
          "h-[60px] border-b border-white/[0.06] flex items-center sticky top-0 z-20",
          collapsed ? "px-2 justify-center" : "px-4 justify-between"
        )}
        style={{ background: "rgba(9,9,15,0.96)", backdropFilter: "blur(8px)" }}
      >
        <Link
          href="/admin/requests"
          onClick={onNavigate}
          className={cn("flex items-center group", collapsed ? "gap-0" : "gap-3")}
        >
          {/* Logo mark */}
          <div
            className="relative h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 60%, #EC4899 100%)",
              boxShadow: "0 0 20px rgba(124,58,237,0.45), 0 4px 12px rgba(0,0,0,0.5)",
            }}
          >
            <span className="text-white text-base font-black italic select-none">C</span>
            {/* Subtle inner highlight */}
            <span
              className="absolute inset-0 rounded-xl"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)" }}
            />
          </div>

          {!collapsed && <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40 leading-none mb-0.5">
              Crowd &amp; Cult
            </p>
            <p className="text-[15px] font-black text-white leading-none tracking-tight">
              Admin Console
            </p>
          </div>}
        </Link>
        {variant === "desktop" && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="h-8 w-8 rounded-lg border border-white/[0.08] text-white/45 hover:text-white/80 hover:bg-white/[0.05] transition-colors flex items-center justify-center"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {collapsed ? <IconChevronRight className="w-4 h-4" /> : <IconChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* ── Pending summary chip ───────────────────────── */}
      {pendingTotal > 0 && !collapsed && (
        <div className="mx-3 mt-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <span
              className="h-5 w-5 rounded-md flex items-center justify-center text-[9px] font-black text-black"
              style={{ background: "#F59E0B" }}
            >
              {pendingTotal > 99 ? "99+" : pendingTotal}
            </span>
            <span className="text-[10px] font-bold text-amber-300/80 tracking-wide">
              pending review
            </span>
          </div>
        </div>
      )}

      {/* ── Navigation ────────────────────────────────── */}
      <nav
        className={cn(
          "flex-1 min-h-0 py-4 space-y-0.5 overflow-y-auto no-scrollbar",
          collapsed ? "px-2" : "px-2"
        )}
      >
        {/* Operations section */}
        {!collapsed && <p className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
          Operations
        </p>}

        {ADMIN_NAV.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center rounded-xl px-3 py-2.5 transition-all duration-150",
                collapsed ? "justify-center gap-0" : "gap-3",
                isActive
                  ? "text-white"
                  : "text-white/45 hover:text-white/85 hover:bg-white/[0.04]"
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-full"
                  style={{ background: "linear-gradient(to bottom, #7C3AED, #A855F7)" }}
                />
              )}

              {/* Active BG */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(168,85,247,0.08) 100%)",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                />
              )}

              {/* Icon container */}
              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150",
                  isActive
                    ? "text-violet-300"
                    : "bg-white/[0.04] text-white/40 group-hover:bg-white/[0.07] group-hover:text-white/60"
                )}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.2))",
                        boxShadow: "0 0 12px rgba(124,58,237,0.25)",
                      }
                    : {}
                }
              >
                <NavIcon href={item.href} isActive={isActive} />
              </span>

              {/* Label */}
              {!collapsed && <span className="relative z-10 flex-1 min-w-0 text-left text-[13px] font-semibold tracking-tight">
                {item.label}
              </span>}

              {/* Badge */}
              {item.href === "/admin/requests" && pendingTotal > 0 && !collapsed && (
                <span
                  className="relative z-10 shrink-0 h-5 min-w-[1.25rem] px-1.5 flex items-center justify-center rounded-full text-[9px] font-black tabular-nums text-white"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
                >
                  {pendingTotal > 99 ? "99+" : pendingTotal}
                </span>
              )}
            </Link>
          );
        })}

        {/* Reference section */}
        {!collapsed && <p className="px-3 pt-5 pb-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
          Reference
        </p>}

        <Link
          href="/legacy"
          onClick={onNavigate}
          className={cn(
            "group flex items-center rounded-xl px-3 py-2.5 text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-150",
            collapsed ? "justify-center gap-0" : "gap-3"
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] group-hover:bg-white/[0.07] transition-colors">
            <IconExternal className="w-3.5 h-3.5" />
          </span>
          {!collapsed && <span className="flex-1 text-[12px] font-semibold">Legacy marketing page</span>}
          {!collapsed && <IconChevronRight className="w-3 h-3 opacity-30 group-hover:opacity-60 transition-opacity" />}
        </Link>
      </nav>

      {/* ── User footer ───────────────────────────────── */}
      <div
        className={cn("mt-auto sticky bottom-0 z-20 pt-3 pb-4", collapsed ? "mx-2" : "mx-3")}
        style={{ background: "rgba(9,9,15,0.96)", backdropFilter: "blur(8px)" }}
      >
        {/* Divider */}
        <div className="h-px mb-3" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }} />

        {/* User card */}
        {!collapsed && <div
          className="flex items-center gap-3 p-3 rounded-xl mb-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Avatar */}
          <div
            className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-[11px] font-black text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
              border: "1px solid rgba(124,58,237,0.4)",
            }}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/30 mb-0.5">
              Signed in
            </p>
            <p className="text-[11px] font-semibold text-white/80 truncate" title={email}>
              {email}
            </p>
          </div>
        </div>}

        {/* Sign-out button */}
        <button
          type="button"
          onClick={onSignOut}
          className={cn(
            "group w-full flex items-center justify-center rounded-xl px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-150 text-white/40 hover:text-red-300/90",
            collapsed ? "gap-0" : "gap-2"
          )}
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(239,68,68,0.06)";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(239,68,68,0.25)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(255,255,255,0.08)";
          }}
        >
          <IconLogout className="w-3.5 h-3.5" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}
