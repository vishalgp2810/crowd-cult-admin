"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAllArtistsThunk,
  fetchAllVenuesThunk,
  fetchArtistDraftReadinessThunk,
  fetchAudienceUsersThunk,
} from "@/features/admin/adminThunks";
import { clearAdminError } from "@/features/admin/adminSlice";
import type { AudienceUser } from "@/features/admin/adminUserTypes";
import type { ArtistHubProfile } from "@/features/artist/artistTypes";
import type { VenueProfile } from "@/features/venue/venueTypes";
import {
  IncompleteProfileDrawer,
  type IncompleteProfileTarget,
} from "@/components/admin/IncompleteProfileDrawer";
import {
  ADMIN_USERS_LIST_GRID,
  QueueAvatar,
  QueueEmptyState,
  QueueSkeletonRow,
  queuePanelStyle,
} from "@/components/admin/adminQueueUi";
import {
  IconCopy,
  IconInbox,
  IconMapPin,
  IconRefresh,
  IconSearch,
  IconUsers,
} from "@/components/admin/AdminIcons";
import {
  AdminListPagination,
  ADMIN_USERS_PAGE_SIZE,
} from "@/components/admin/AdminListPagination";

type Tab = "artists" | "venues" | "audience";
type StatusFilter = "ALL" | "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "BANNED";

function statusBadgeStyle(status: string) {
  const s = status.toUpperCase();
  if (s === "APPROVED") {
    return { background: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", color: "#6EE7B7" };
  }
  if (s === "PENDING_APPROVAL") {
    return { background: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", color: "#FCD34D" };
  }
  if (s === "REJECTED" || s === "BANNED") {
    return { background: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", color: "#FCA5A5" };
  }
  return { background: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.25)", color: "#CBD5E1" };
}

function ProfileStatusBadge({ status, returned }: { status: string; returned?: boolean }) {
  const style = statusBadgeStyle(status);
  return (
    <div className="flex flex-col items-start gap-1">
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
        style={{ background: style.background, border: `1px solid ${style.border}`, color: style.color }}
      >
        {status.replace(/_/g, " ")}
      </span>
      {returned && (
        <span
          className="inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.25)",
            color: "#FCD34D",
          }}
        >
          Returned
        </span>
      )}
    </div>
  );
}

function ProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div className="mt-1.5">
      <p className="text-[10px] text-white/40 mb-1">{label}</p>
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden max-w-[140px]">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min(100, Math.max(0, percent))}%`,
            background: "linear-gradient(90deg, #22D3EE, #0EA5E9)",
          }}
        />
      </div>
    </div>
  );
}

function formatRelativeDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function venueFieldProgress(venue: VenueProfile) {
  const fields = [
    venue.businessName,
    venue.venueType,
    venue.city,
    venue.capacity > 0 ? "1" : "",
    venue.bio,
    venue.profileImageUrl,
    venue.phoneNumber,
  ];
  const filled = fields.filter((f) => Boolean(String(f || "").trim())).length;
  return Math.round((filled / fields.length) * 100);
}

function CopyBtn({ value, label }: { value: string; label: string }) {
  if (!value) return null;
  return (
    <button
      type="button"
      title={`Copy ${label}`}
      onClick={() => {
        void navigator.clipboard.writeText(value).then(() => toast.success(`${label} copied`));
      }}
      className="shrink-0 p-1 rounded-md text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
    >
      <IconCopy className="w-3 h-3" />
    </button>
  );
}

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "ALL", label: "All statuses" },
  { key: "DRAFT", label: "Draft" },
  { key: "PENDING_APPROVAL", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

export default function AdminSignupsPage() {
  const dispatch = useAppDispatch();
  const allArtists = useAppSelector((s) => s.admin.allArtists);
  const allVenues = useAppSelector((s) => s.admin.allVenues);
  const audienceUsers = useAppSelector((s) => s.admin.audienceUsers);
  const allArtistsCount = useAppSelector((s) => s.admin.allArtistsCount);
  const allVenuesCount = useAppSelector((s) => s.admin.allVenuesCount);
  const audienceUsersCount = useAppSelector((s) => s.admin.audienceUsersCount);
  const allArtistsPageIndex = useAppSelector((s) => s.admin.allArtistsPageIndex);
  const allVenuesPageIndex = useAppSelector((s) => s.admin.allVenuesPageIndex);
  const audienceUsersPageIndex = useAppSelector((s) => s.admin.audienceUsersPageIndex);
  const artistDraftProgress = useAppSelector((s) => s.admin.artistDraftProgress);
  const allArtistsStatus = useAppSelector((s) => s.admin.allArtistsStatus);
  const allVenuesStatus = useAppSelector((s) => s.admin.allVenuesStatus);
  const audienceUsersStatus = useAppSelector((s) => s.admin.audienceUsersStatus);
  const adminError = useAppSelector((s) => s.admin.error);

  const [tab, setTab] = useState<Tab>("artists");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [artistPage, setArtistPage] = useState(0);
  const [venuePage, setVenuePage] = useState(0);
  const [audiencePage, setAudiencePage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [drawerTarget, setDrawerTarget] = useState<IncompleteProfileTarget | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const fetchArtists = useCallback(
    async (pageIndex: number, force = false) => {
      const result = await dispatch(
        fetchAllArtistsThunk({
          force,
          pageIndex,
          pageSize: ADMIN_USERS_PAGE_SIZE,
          status: statusFilter,
          searchKey: debouncedSearch || undefined,
        })
      ).unwrap();
      const draftIds = result.rows
        .filter((a) => a.status === "DRAFT")
        .map((a) => a.artistProfileId);
      if (draftIds.length > 0) {
        await dispatch(
          fetchArtistDraftReadinessThunk({ force: true, artistProfileIds: draftIds })
        );
      }
    },
    [dispatch, statusFilter, debouncedSearch]
  );

  const fetchVenues = useCallback(
    async (pageIndex: number, force = false) => {
      await dispatch(
        fetchAllVenuesThunk({
          force,
          pageIndex,
          pageSize: ADMIN_USERS_PAGE_SIZE,
          status: statusFilter,
          searchKey: debouncedSearch || undefined,
        })
      );
    },
    [dispatch, statusFilter, debouncedSearch]
  );

  const fetchAudience = useCallback(
    async (pageIndex: number, force = false) => {
      await dispatch(
        fetchAudienceUsersThunk({
          force,
          pageIndex,
          pageSize: ADMIN_USERS_PAGE_SIZE,
          searchKey: debouncedSearch || undefined,
        })
      );
    },
    [dispatch, debouncedSearch]
  );

  const loadCurrentTab = useCallback(
    async (force = false) => {
      setIsRefreshing(true);
      try {
        if (tab === "artists") await fetchArtists(artistPage, force);
        else if (tab === "venues") await fetchVenues(venuePage, force);
        else await fetchAudience(audiencePage, force);
      } catch {
        // errors handled via adminError slice
      } finally {
        setIsRefreshing(false);
      }
    },
    [tab, artistPage, venuePage, audiencePage, fetchArtists, fetchVenues, fetchAudience]
  );

  useEffect(() => {
    void (async () => {
      setIsRefreshing(true);
      try {
        if (tab === "artists") await fetchArtists(artistPage, true);
        else if (tab === "venues") await fetchVenues(venuePage, true);
        else await fetchAudience(audiencePage, true);
      } catch {
        // errors handled via adminError slice
      } finally {
        setIsRefreshing(false);
      }
    })();
  }, [tab, artistPage, venuePage, audiencePage, statusFilter, debouncedSearch, fetchArtists, fetchVenues, fetchAudience]);

  useEffect(() => {
    if (adminError) {
      toast.error(adminError);
      dispatch(clearAdminError());
    }
  }, [adminError, dispatch]);

  const loading =
    tab === "artists"
      ? allArtistsStatus === "loading"
      : tab === "venues"
        ? allVenuesStatus === "loading"
        : audienceUsersStatus === "loading";

  const currentPageIndex =
    tab === "artists" ? allArtistsPageIndex : tab === "venues" ? allVenuesPageIndex : audienceUsersPageIndex;
  const totalCount =
    tab === "artists" ? allArtistsCount : tab === "venues" ? allVenuesCount : audienceUsersCount;

  const handlePageChange = (nextPage: number) => {
    if (tab === "artists") setArtistPage(nextPage);
    else if (tab === "venues") setVenuePage(nextPage);
    else setAudiencePage(nextPage);
  };

  const handleTabChange = (next: Tab) => {
    setTab(next);
    setArtistPage(0);
    setVenuePage(0);
    setAudiencePage(0);
  };

  const handleStatusFilterChange = (next: StatusFilter) => {
    setStatusFilter(next);
    setArtistPage(0);
    setVenuePage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setArtistPage(0);
    setVenuePage(0);
    setAudiencePage(0);
  };

  const renderArtistRow = (a: ArtistHubProfile, i: number) => {
    const isDraft = a.status === "DRAFT";
    const progress = isDraft ? (artistDraftProgress[a.artistProfileId] ?? 0) : null;
    return (
      <motion.div
        key={a.artistProfileId}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.03 }}
        className="px-5 py-4 border-b transition-colors"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <div
          className="flex gap-3 lg:grid lg:items-center"
          style={{ gridTemplateColumns: ADMIN_USERS_LIST_GRID.artistVenue, gap: "1rem" }}
        >
          <QueueAvatar name={a.stageName || a.fullName || "?"} type="artist" />
          <div className="min-w-0 flex-1 lg:flex-none">
            <p className="font-bold text-[14px] text-white truncate">
              {a.stageName || a.fullName || "Unnamed artist"}
            </p>
            <p className="text-[11px] text-white/40 truncate">
              {[a.performerTypeLabel, a.genre].filter(Boolean).join(" · ") || "Type not set"}
              {isDraft && progress !== null ? ` · ${progress}% complete` : ""}
            </p>
            {isDraft && progress !== null && (
              <ProgressBar percent={progress} label="Profile setup" />
            )}
          </div>
          <div className="hidden lg:block min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-[11px] text-cyan-300/80 truncate">{a.emailAddress || "—"}</p>
              <CopyBtn value={a.emailAddress || ""} label="Email" />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-[11px] text-white/45 truncate">{a.phoneNumber || "—"}</p>
              <CopyBtn value={a.phoneNumber || ""} label="Phone" />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-1 min-w-0">
            <IconMapPin className="w-3 h-3 shrink-0 text-white/25" />
            <p className="text-[11px] text-white/40 truncate">
              {[a.city, a.state].filter(Boolean).join(", ") || "—"}
            </p>
          </div>
          <div className="hidden lg:block">
            <ProfileStatusBadge status={a.status} returned={Boolean(a.rejectionReason?.trim())} />
          </div>
          <div className="hidden lg:block text-[11px] text-white/40 tabular-nums">
            {formatRelativeDate(a.createdAt)}
          </div>
          <div className="hidden lg:flex justify-end">
            <button
              type="button"
              onClick={() => setDrawerTarget({ kind: "artist", profile: a })}
              className="rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-200"
              style={{
                background: "rgba(34,211,238,0.12)",
                border: "1px solid rgba(34,211,238,0.3)",
              }}
            >
              View profile
            </button>
          </div>
        </div>
        <div className="mt-3 lg:hidden space-y-1 pl-12">
          <ProfileStatusBadge status={a.status} returned={Boolean(a.rejectionReason?.trim())} />
          <p className="text-[11px] text-cyan-300/80">{a.emailAddress || "—"}</p>
          <p className="text-[11px] text-white/45">{a.phoneNumber || "—"}</p>
          <button
            type="button"
            onClick={() => setDrawerTarget({ kind: "artist", profile: a })}
            className="mt-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-200"
            style={{
              background: "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.3)",
            }}
          >
            View profile
          </button>
        </div>
      </motion.div>
    );
  };

  const renderVenueRow = (v: VenueProfile, i: number) => {
    const isDraft = v.status === "DRAFT";
    const progress = isDraft ? venueFieldProgress(v) : null;
    return (
      <motion.div
        key={v.venueId}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.03 }}
        className="px-5 py-4 border-b transition-colors"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <div
          className="flex gap-3 lg:grid lg:items-center"
          style={{ gridTemplateColumns: ADMIN_USERS_LIST_GRID.artistVenue, gap: "1rem" }}
        >
          <QueueAvatar name={v.businessName || v.fullName || "?"} type="venue" />
          <div className="min-w-0 flex-1 lg:flex-none">
            <p className="font-bold text-[14px] text-white truncate">
              {v.businessName || v.fullName || "Unnamed venue"}
            </p>
            <p className="text-[11px] text-white/40 truncate">
              {v.venueType || "Type not set"}
              {isDraft && progress !== null ? ` · ${progress}% complete` : ""}
            </p>
            {isDraft && progress !== null && (
              <ProgressBar percent={progress} label="Profile setup" />
            )}
          </div>
          <div className="hidden lg:block min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-[11px] text-cyan-300/80 truncate">{v.emailAddress || "—"}</p>
              <CopyBtn value={v.emailAddress || ""} label="Email" />
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <p className="text-[11px] text-white/45 truncate">{v.phoneNumber || "—"}</p>
              <CopyBtn value={v.phoneNumber || ""} label="Phone" />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-1 min-w-0">
            <IconMapPin className="w-3 h-3 shrink-0 text-white/25" />
            <p className="text-[11px] text-white/40 truncate">
              {[v.city, v.state].filter(Boolean).join(", ") || "—"}
            </p>
          </div>
          <div className="hidden lg:block">
            <ProfileStatusBadge status={v.status} returned={Boolean(v.rejectionReason?.trim())} />
          </div>
          <div className="hidden lg:block text-[11px] text-white/40 tabular-nums">
            {formatRelativeDate(v.createdAt)}
          </div>
          <div className="hidden lg:flex justify-end">
            <button
              type="button"
              onClick={() => setDrawerTarget({ kind: "venue", profile: v })}
              className="rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-200"
              style={{
                background: "rgba(34,211,238,0.12)",
                border: "1px solid rgba(34,211,238,0.3)",
              }}
            >
              View profile
            </button>
          </div>
        </div>
        <div className="mt-3 lg:hidden space-y-1 pl-12">
          <ProfileStatusBadge status={v.status} returned={Boolean(v.rejectionReason?.trim())} />
          <p className="text-[11px] text-cyan-300/80">{v.emailAddress || "—"}</p>
          <p className="text-[11px] text-white/45">{v.phoneNumber || "—"}</p>
          <button
            type="button"
            onClick={() => setDrawerTarget({ kind: "venue", profile: v })}
            className="mt-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-200"
            style={{
              background: "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.3)",
            }}
          >
            View profile
          </button>
        </div>
      </motion.div>
    );
  };

  const renderAudienceRow = (u: AudienceUser, i: number) => (
    <motion.div
      key={u.userId}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.03 }}
      className="px-5 py-4 border-b transition-colors"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div
        className="flex gap-3 lg:grid lg:items-center"
        style={{ gridTemplateColumns: ADMIN_USERS_LIST_GRID.audience, gap: "1rem" }}
      >
        <QueueAvatar name={u.fullName || u.emailAddress || "?"} type="audience" />
        <div className="min-w-0 flex-1 lg:flex-none">
          <p className="font-bold text-[14px] text-white truncate">
            {u.fullName || "Unnamed user"}
          </p>
          <p className="text-[11px] text-white/40">Audience member</p>
        </div>
        <div className="hidden lg:block min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-[11px] text-cyan-300/80 truncate">{u.emailAddress || "—"}</p>
            <CopyBtn value={u.emailAddress || ""} label="Email" />
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <p className="text-[11px] text-white/45 truncate">{u.phoneNumber || "—"}</p>
            <CopyBtn value={u.phoneNumber || ""} label="Phone" />
          </div>
        </div>
        <div className="hidden lg:block text-[11px] text-white/40 tabular-nums">
          {formatRelativeDate(u.createdAt)}
        </div>
        <div className="hidden lg:flex justify-end">
          <button
            type="button"
            onClick={() => setDrawerTarget({ kind: "audience", profile: u })}
            className="rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-200"
            style={{
              background: "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.3)",
            }}
          >
            View profile
          </button>
        </div>
      </div>
      <div className="mt-3 lg:hidden space-y-1 pl-12">
        <p className="text-[11px] text-cyan-300/80">{u.emailAddress || "—"}</p>
        <p className="text-[11px] text-white/45">{u.phoneNumber || "—"}</p>
        <button
          type="button"
          onClick={() => setDrawerTarget({ kind: "audience", profile: u })}
          className="mt-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-200"
          style={{
            background: "rgba(34,211,238,0.12)",
            border: "1px solid rgba(34,211,238,0.3)",
          }}
        >
          View profile
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(13,13,20,0.9))",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-violet-300/60 mb-1">Artists</p>
            <p className="text-3xl font-black text-white tabular-nums">
              {allArtistsCount > 0 || allArtistsStatus === "succeeded" ? allArtistsCount : "—"}
            </p>
          </div>
          <IconUsers className="w-8 h-8 text-violet-300 opacity-80" />
        </div>
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(13,13,20,0.9))",
            border: "1px solid rgba(245,158,11,0.22)",
          }}
        >
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-amber-300/60 mb-1">Venues</p>
            <p className="text-3xl font-black text-white tabular-nums">
              {allVenuesCount > 0 || allVenuesStatus === "succeeded" ? allVenuesCount : "—"}
            </p>
          </div>
          <IconInbox className="w-8 h-8 text-amber-300 opacity-80" />
        </div>
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(13,13,20,0.9))",
            border: "1px solid rgba(34,211,238,0.22)",
          }}
        >
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-cyan-300/60 mb-1">Audience</p>
            <p className="text-3xl font-black text-white tabular-nums">
              {audienceUsersCount > 0 || audienceUsersStatus === "succeeded" ? audienceUsersCount : "—"}
            </p>
          </div>
          <IconUsers className="w-8 h-8 text-cyan-300 opacity-80" />
        </div>
      </div>

      {tab !== "audience" && (
        <div
          className="flex flex-wrap gap-1.5 rounded-2xl p-1.5"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {STATUS_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleStatusFilterChange(key)}
              className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
              style={
                statusFilter === key
                  ? {
                      background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(14,165,233,0.12))",
                      border: "1px solid rgba(34,211,238,0.35)",
                      color: "#A5F3FC",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                      color: "rgba(255,255,255,0.4)",
                    }
              }
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap items-center gap-2 rounded-2xl p-1.5"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {(["artists", "venues", "audience"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabChange(t)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all capitalize"
              style={
                tab === t
                  ? {
                      background:
                        t === "artists"
                          ? "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.2))"
                          : t === "venues"
                            ? "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.15))"
                            : "linear-gradient(135deg, rgba(34,211,238,0.25), rgba(14,165,233,0.15))",
                      border: `1px solid ${t === "artists" ? "rgba(124,58,237,0.4)" : t === "venues" ? "rgba(245,158,11,0.4)" : "rgba(34,211,238,0.4)"}`,
                      color: t === "artists" ? "#C4B5FD" : t === "venues" ? "#FDE68A" : "#A5F3FC",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid transparent",
                      color: "rgba(255,255,255,0.35)",
                    }
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 min-w-[200px] flex-1 sm:flex-none"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <IconSearch className="w-4 h-4 text-white/30 shrink-0" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search name, email, phone…"
              className="bg-transparent text-sm text-white placeholder:text-white/25 outline-none w-full min-w-0"
            />
          </div>
          <button
            type="button"
            onClick={() => void loadCurrentTab(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white/70 hover:text-white transition-colors disabled:opacity-40"
            style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
          >
            <IconRefresh className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="rounded-2xl overflow-hidden"
          style={queuePanelStyle}
        >
          <div
            className="hidden lg:grid items-center px-5 py-3 text-[9px] font-black uppercase tracking-widest text-white/25 border-b"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              gridTemplateColumns:
                tab === "audience"
                  ? ADMIN_USERS_LIST_GRID.audience
                  : ADMIN_USERS_LIST_GRID.artistVenue,
              gap: "1rem",
            }}
          >
            <div className="w-9 shrink-0" aria-hidden />
            <span>User</span>
            <span>Contact</span>
            {tab !== "audience" && <span>Location</span>}
            {tab !== "audience" && <span>Status</span>}
            <span>Signed up</span>
            <span className="text-right">Actions</span>
          </div>

          {loading && (
            <>
              <QueueSkeletonRow />
              <QueueSkeletonRow />
              <QueueSkeletonRow />
            </>
          )}

          {!loading && totalCount === 0 && (
            <QueueEmptyState label={`No ${tab} match your filters`} />
          )}

          {!loading &&
            tab === "artists" &&
            allArtists.map((a, i) => renderArtistRow(a, i))}
          {!loading &&
            tab === "venues" &&
            allVenues.map((v, i) => renderVenueRow(v, i))}
          {!loading &&
            tab === "audience" &&
            audienceUsers.map((u, i) => renderAudienceRow(u, i))}

          {!loading && totalCount > 0 && (
            <AdminListPagination
              pageIndex={currentPageIndex}
              pageSize={ADMIN_USERS_PAGE_SIZE}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              disabled={loading || isRefreshing}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <IncompleteProfileDrawer target={drawerTarget} onClose={() => setDrawerTarget(null)} />
    </div>
  );
}
