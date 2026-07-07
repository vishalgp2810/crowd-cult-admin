"use client";

import { IconInbox } from "./AdminIcons";

export function QueueAvatar({ name, type }: { name: string; type: "artist" | "venue" | "audience" }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colors =
    type === "artist"
      ? {
          bg: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
          border: "rgba(124,58,237,0.4)",
          text: "#C4B5FD",
        }
      : type === "venue"
        ? {
            bg: "linear-gradient(135deg, #1c1917 0%, #78350f 100%)",
            border: "rgba(245,158,11,0.4)",
            text: "#FDE68A",
          }
        : {
            bg: "linear-gradient(135deg, #0c4a6e 0%, #164e63 100%)",
            border: "rgba(34,211,238,0.4)",
            text: "#A5F3FC",
          };
  return (
    <div
      className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-[11px] font-black"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      {initials || "?"}
    </div>
  );
}

export function QueueEmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="h-14 w-14 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <IconInbox className="w-6 h-6" style={{ color: "rgba(255,255,255,0.2)" }} />
      </div>
      <p className="text-sm font-semibold text-white/25">{label}</p>
    </div>
  );
}

export function QueueSkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.05] animate-pulse">
      <div className="h-9 w-9 rounded-xl bg-white/[0.05] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/[0.06] rounded-full w-1/3" />
        <div className="h-2 bg-white/[0.04] rounded-full w-1/4" />
      </div>
      <div className="h-6 w-24 bg-white/[0.05] rounded-full" />
      <div className="flex gap-2">
        <div className="h-7 w-16 bg-white/[0.05] rounded-lg" />
        <div className="h-7 w-14 bg-white/[0.05] rounded-lg" />
      </div>
    </div>
  );
}

export const queuePanelStyle = {
  background: "rgba(13,13,20,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
} as const;

/** Shared column tracks so header + rows line up (avatar = w-9). */
export const ADMIN_USERS_LIST_GRID = {
  artistVenue:
    "2.25rem minmax(0, 1.5fr) minmax(0, 1.5fr) minmax(0, 1fr) 8.5rem 5.5rem 8rem",
  audience: "2.25rem minmax(0, 1.6fr) minmax(0, 1.6fr) 5.5rem 8rem",
} as const;
