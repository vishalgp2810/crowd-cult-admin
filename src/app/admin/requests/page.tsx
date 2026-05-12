"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import {
  approveArtistThunk,
  approveVenueThunk,
  fetchApprovedArtistsThunk,
  fetchApprovedVenuesThunk,
  fetchPendingArtistsThunk,
  fetchPendingVenuesThunk,
  rejectArtistThunk,
  rejectVenueThunk,
} from "@/features/admin/adminThunks";
import { clearAdminError } from "@/features/admin/adminSlice";
import {
  IconCheck,
  IconX,
  IconRefresh,
  IconMapPin,
  IconLink,
  IconClose,
  IconInbox,
  IconUsers,
} from "@/components/admin/AdminIcons";

type Tab = "artists" | "venues";
type QueueView = "pending" | "approved";

type RejectTarget =
  | { kind: "artist"; artistProfileId: number; label: string }
  | { kind: "venue"; venueId: number; label: string };

function publicProfileUrl(type: "artist" | "venue", slug: string) {
  return `/${type}/${encodeURIComponent(slug)}`;
}

/* ─── Micro components ──────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
      style={{
        background: "rgba(245,158,11,0.12)",
        border: "1px solid rgba(245,158,11,0.25)",
        color: "#FCD34D",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ background: "#F59E0B" }}
      />
      {status.replace(/_/g, " ")}
    </span>
  );
}

function ApproveBtn({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(5,150,105,0.10))",
        border: "1px solid rgba(16,185,129,0.35)",
        color: "#6EE7B7",
        boxShadow: "0 0 12px rgba(16,185,129,0.12)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const el = e.currentTarget;
          el.style.background =
            "linear-gradient(135deg, rgba(16,185,129,0.30), rgba(5,150,105,0.18))";
          el.style.boxShadow = "0 0 18px rgba(16,185,129,0.25)";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background =
          "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(5,150,105,0.10))";
        el.style.boxShadow = "0 0 12px rgba(16,185,129,0.12)";
      }}
    >
      <IconCheck className="w-3 h-3" />
      Approve
    </button>
  );
}

function RejectBtn({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.25)",
        color: "#FCA5A5",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const el = e.currentTarget;
          el.style.background = "rgba(239,68,68,0.18)";
          el.style.boxShadow = "0 0 14px rgba(239,68,68,0.2)";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = "rgba(239,68,68,0.08)";
        el.style.boxShadow = "none";
      }}
    >
      <IconX className="w-3 h-3" />
      Reject
    </button>
  );
}

function ViewBtn({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-150"
      style={{
        color: "rgba(129,210,255,0.75)",
        border: "1px solid rgba(129,210,255,0.15)",
        background: "rgba(129,210,255,0.05)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.color = "rgba(129,210,255,1)";
        el.style.background = "rgba(129,210,255,0.1)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.color = "rgba(129,210,255,0.75)";
        el.style.background = "rgba(129,210,255,0.05)";
      }}
    >
      <IconLink className="w-3 h-3" />
      Profile
    </a>
  );
}

/* ─── Avatar / Initials ─────────────────────────────────────────────────── */
function Avatar({ name, type }: { name: string; type: "artist" | "venue" }) {
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
      : {
        bg: "linear-gradient(135deg, #1c1917 0%, #78350f 100%)",
        border: "rgba(245,158,11,0.4)",
        text: "#FDE68A",
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

/* ─── Empty state ───────────────────────────────────────────────────────── */
function EmptyState({ label }: { label: string }) {
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

/* ─── Loading skeleton ──────────────────────────────────────────────────── */
function SkeletonRow() {
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

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function AdminRequestsPage() {
  const dispatch = useAppDispatch();
  const pendingArtists = useAppSelector((s) => s.admin.pendingArtists);
  const pendingVenues = useAppSelector((s) => s.admin.pendingVenues);
  const approvedArtists = useAppSelector((s) => s.admin.approvedArtists);
  const approvedVenues = useAppSelector((s) => s.admin.approvedVenues);
  const artistsStatus = useAppSelector((s) => s.admin.artistsStatus);
  const venuesStatus = useAppSelector((s) => s.admin.venuesStatus);
  const approvedArtistsStatus = useAppSelector((s) => s.admin.approvedArtistsStatus);
  const approvedVenuesStatus = useAppSelector((s) => s.admin.approvedVenuesStatus);
  const mutationStatus = useAppSelector((s) => s.admin.mutationStatus);
  const adminError = useAppSelector((s) => s.admin.error);

  const [tab, setTab] = useState<Tab>("artists");
  const [queueView, setQueueView] = useState<QueueView>("pending");
  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCurrentTab = useCallback(async () => {
    setIsRefreshing(true);
    if (tab === "artists") {
      if (queueView === "pending") {
        await dispatch(fetchPendingArtistsThunk({ force: true }));
      } else {
        await dispatch(fetchApprovedArtistsThunk({ force: true }));
      }
    } else {
      if (queueView === "pending") {
        await dispatch(fetchPendingVenuesThunk({ force: true }));
      } else {
        await dispatch(fetchApprovedVenuesThunk({ force: true }));
      }
    }
    setIsRefreshing(false);
  }, [dispatch, queueView, tab]);

  useEffect(() => {
    if (tab === "artists") {
      if (queueView === "pending") {
        void dispatch(fetchPendingArtistsThunk(undefined));
      } else {
        void dispatch(fetchApprovedArtistsThunk(undefined));
      }
    } else {
      if (queueView === "pending") {
        void dispatch(fetchPendingVenuesThunk(undefined));
      } else {
        void dispatch(fetchApprovedVenuesThunk(undefined));
      }
    }
  }, [dispatch, queueView, tab]);

  useEffect(() => {
    if (adminError) {
      toast.error(adminError);
      dispatch(clearAdminError());
    }
  }, [adminError, dispatch]);

  const busy = mutationStatus === "loading";

  const handleApproveArtist = (id: number) =>
    dispatch(approveArtistThunk(id))
      .unwrap()
      .then(async () => {
        toast.success("Artist approved ✓");
        await dispatch(fetchPendingArtistsThunk({ force: true }));
        await dispatch(fetchApprovedArtistsThunk({ force: true }));
      })
      .catch(() => { });

  const handleApproveVenue = (id: number) =>
    dispatch(approveVenueThunk(id))
      .unwrap()
      .then(async () => {
        toast.success("Venue approved ✓");
        await dispatch(fetchPendingVenuesThunk({ force: true }));
        await dispatch(fetchApprovedVenuesThunk({ force: true }));
      })
      .catch(() => { });

  const submitReject = () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    if (reason.length < 3) {
      toast.error("Please enter a rejection reason (at least 3 characters).");
      return;
    }
    const p =
      rejectTarget.kind === "artist"
        ? dispatch(
          rejectArtistThunk({
            artistProfileId: rejectTarget.artistProfileId,
            rejectionReason: reason,
          })
        ).unwrap()
        : dispatch(
          rejectVenueThunk({
            venueId: rejectTarget.venueId,
            rejectionReason: reason,
          })
        ).unwrap();
    p.then(() => {
      toast.success("Submission rejected");
      setRejectTarget(null);
      setRejectReason("");
    }).catch(() => { });
  };

  // Count helpers
  const artistCount =
    queueView === "pending"
      ? artistsStatus === "succeeded"
        ? pendingArtists.length
        : null
      : approvedArtistsStatus === "succeeded"
        ? approvedArtists.length
        : null;
  const venueCount =
    queueView === "pending"
      ? venuesStatus === "succeeded"
        ? pendingVenues.length
        : null
      : approvedVenuesStatus === "succeeded"
        ? approvedVenues.length
        : null;
  const activeArtistList = queueView === "pending" ? pendingArtists : approvedArtists;
  const activeVenueList = queueView === "pending" ? pendingVenues : approvedVenues;
  const activeArtistsStatus = queueView === "pending" ? artistsStatus : approvedArtistsStatus;
  const activeVenuesStatus = queueView === "pending" ? venuesStatus : approvedVenuesStatus;

  return (
    <div className="space-y-6">

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Artists pending */}
        <div
          className="flex items-center gap-4 rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(124,58,237,0.04) 100%)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          <div
            className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.18))",
              boxShadow: "0 0 16px rgba(124,58,237,0.2)",
            }}
          >
            <IconUsers className="w-5 h-5 text-violet-300" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35 mb-0.5">
              Artists
            </p>
            <p className="text-2xl font-black text-white leading-none">
              {artistsStatus === "loading" ? (
                <span className="text-white/20">…</span>
              ) : (
                artistCount ?? "—"
              )}
            </p>
          </div>
        </div>

        {/* Venues pending */}
        <div
          className="flex items-center gap-4 rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.04) 100%)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <div
            className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(217,119,6,0.18))",
              boxShadow: "0 0 16px rgba(245,158,11,0.18)",
            }}
          >
            <IconInbox className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35 mb-0.5">
              Venues
            </p>
            <p className="text-2xl font-black text-white leading-none">
              {venuesStatus === "loading" ? (
                <span className="text-white/20">…</span>
              ) : (
                venueCount ?? "—"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Queue type switch ─────────────────────────────────────────── */}
      <div
        className="inline-flex items-center gap-1 rounded-2xl p-1.5"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          type="button"
          onClick={() => setQueueView("pending")}
          className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-150"
          style={
            queueView === "pending"
              ? {
                background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.2))",
                border: "1px solid rgba(124,58,237,0.4)",
                color: "#C4B5FD",
              }
              : {
                background: "transparent",
                border: "1px solid transparent",
                color: "rgba(255,255,255,0.4)",
              }
          }
        >
          Pending
        </button>
        <button
          type="button"
          onClick={() => setQueueView("approved")}
          className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-150"
          style={
            queueView === "approved"
              ? {
                background: "linear-gradient(135deg, rgba(16,185,129,0.35), rgba(5,150,105,0.2))",
                border: "1px solid rgba(16,185,129,0.4)",
                color: "#6EE7B7",
              }
              : {
                background: "transparent",
                border: "1px solid transparent",
                color: "rgba(255,255,255,0.4)",
              }
          }
        >
          Approved
        </button>
      </div>

      {/* ── Tab bar + Refresh ─────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-2xl p-1.5"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Artist tab */}
        <button
          type="button"
          onClick={() => setTab("artists")}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-150"
          style={
            tab === "artists"
              ? {
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.2))",
                border: "1px solid rgba(124,58,237,0.4)",
                color: "#C4B5FD",
                boxShadow: "0 0 16px rgba(124,58,237,0.2)",
              }
              : {
                background: "transparent",
                border: "1px solid transparent",
                color: "rgba(255,255,255,0.35)",
              }
          }
        >
          <IconUsers className="w-3.5 h-3.5" />
          Artists
          {artistCount !== null && artistCount > 0 && (
            <span
              className="h-4 min-w-[1rem] px-1 flex items-center justify-center rounded-full text-[8px] font-black text-white"
              style={{ background: tab === "artists" ? "#7C3AED" : "rgba(255,255,255,0.12)" }}
            >
              {artistCount}
            </span>
          )}
        </button>

        {/* Venues tab */}
        <button
          type="button"
          onClick={() => setTab("venues")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-150"
          style={
            tab === "venues"
              ? {
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.15))",
                border: "1px solid rgba(245,158,11,0.4)",
                color: "#FDE68A",
                boxShadow: "0 0 16px rgba(245,158,11,0.15)",
              }
              : {
                background: "transparent",
                border: "1px solid transparent",
                color: "rgba(255,255,255,0.35)",
              }
          }
        >
          <IconInbox className="w-3.5 h-3.5" />
          Venues
          {venueCount !== null && venueCount > 0 && (
            <span
              className="h-4 min-w-[1rem] px-1 flex items-center justify-center rounded-full text-[8px] font-black text-white"
              style={{ background: tab === "venues" ? "#D97706" : "rgba(255,255,255,0.12)" }}
            >
              {venueCount}
            </span>
          )}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Refresh button */}
        <button
          type="button"
          onClick={loadCurrentTab}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-150 text-white/40 hover:text-white/70 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <IconRefresh className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* ── Content panel ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(13,13,20,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* Column headers */}
          <div
            className="grid items-center px-5 py-3 border-b"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              gridTemplateColumns: "auto 1fr auto auto auto",
              gap: "1rem",
            }}
          >
            <div /> {/* Avatar column */}
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
              {tab === "artists" ? "Artist" : "Venue"}
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25 hidden sm:block">
              Location
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
              Status
            </span>
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25 text-right">
              Actions
            </span>
          </div>

          {/* ── Artists ── */}
          {tab === "artists" && (
            <>
              {activeArtistsStatus === "loading" && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}
              {activeArtistsStatus === "failed" && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <p className="text-sm font-semibold text-red-400/70">
                    Could not load artist queue
                  </p>
                  <button
                    type="button"
                    onClick={loadCurrentTab}
                    className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}
              {activeArtistsStatus === "succeeded" && activeArtistList.length === 0 && (
                <EmptyState
                  label={
                    queueView === "pending"
                      ? "No pending artist submissions"
                      : "No approved artists found"
                  }
                />
              )}
              {activeArtistsStatus === "succeeded" &&
                activeArtistList.map((a, i) => (
                  <motion.div
                    key={a.artistProfileId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group grid items-center px-5 py-4 border-b transition-colors duration-100"
                    style={{
                      borderColor: "rgba(255,255,255,0.05)",
                      gridTemplateColumns: "auto 1fr auto auto auto",
                      gap: "1rem",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Avatar name={a.stageName} type="artist" />

                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-white truncate">
                        {a.stageName}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <IconMapPin className="w-3 h-3 shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
                        <p className="text-[11px] text-white/40 truncate">
                          {[a.city, a.state].filter(Boolean).join(", ") || "Location not set"}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <StatusBadge status={a.status} />
                    </div>

                    <div className="hidden sm:block">
                      <ViewBtn href={publicProfileUrl("artist", a.slug)} />
                    </div>

                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {queueView === "pending" ? (
                        <>
                          <ApproveBtn
                            disabled={busy}
                            onPress={() => handleApproveArtist(a.artistProfileId)}
                          />
                          <RejectBtn
                            disabled={busy}
                            onPress={() =>
                              setRejectTarget({
                                kind: "artist",
                                artistProfileId: a.artistProfileId,
                                label: a.stageName,
                              })
                            }
                          />
                        </>
                      ) : (
                        <ViewBtn href={publicProfileUrl("artist", a.slug)} />
                      )}
                    </div>
                  </motion.div>
                ))}
            </>
          )}

          {/* ── Venues ── */}
          {tab === "venues" && (
            <>
              {activeVenuesStatus === "loading" && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}
              {activeVenuesStatus === "failed" && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <p className="text-sm font-semibold text-red-400/70">
                    Could not load venue queue
                  </p>
                  <button
                    type="button"
                    onClick={loadCurrentTab}
                    className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}
              {activeVenuesStatus === "succeeded" && activeVenueList.length === 0 && (
                <EmptyState
                  label={
                    queueView === "pending"
                      ? "No pending venue submissions"
                      : "No approved venues found"
                  }
                />
              )}
              {activeVenuesStatus === "succeeded" &&
                activeVenueList.map((v, i) => (
                  <motion.div
                    key={v.venueId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group grid items-center px-5 py-4 border-b transition-colors duration-100"
                    style={{
                      borderColor: "rgba(255,255,255,0.05)",
                      gridTemplateColumns: "auto 1fr auto auto auto",
                      gap: "1rem",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Avatar name={v.businessName} type="venue" />

                    <div className="min-w-0">
                      <p className="font-bold text-[14px] text-white truncate">
                        {v.businessName}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <IconMapPin className="w-3 h-3 shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
                        <p className="text-[11px] text-white/40 truncate">
                          {[v.city, v.state].filter(Boolean).join(", ") || "Location not set"}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block">
                      <StatusBadge status={v.status} />
                    </div>

                    <div className="hidden sm:block">
                      <ViewBtn href={publicProfileUrl("venue", v.slug)} />
                    </div>

                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {queueView === "pending" ? (
                        <>
                          <ApproveBtn
                            disabled={busy}
                            onPress={() => handleApproveVenue(v.venueId)}
                          />
                          <RejectBtn
                            disabled={busy}
                            onPress={() =>
                              setRejectTarget({
                                kind: "venue",
                                venueId: v.venueId,
                                label: v.businessName,
                              })
                            }
                          />
                        </>
                      ) : (
                        <ViewBtn href={publicProfileUrl("venue", v.slug)} />
                      )}
                    </div>
                  </motion.div>
                ))}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Reject modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {rejectTarget && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                setRejectTarget(null);
                setRejectReason("");
              }}
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
              style={{
                background: "#0E0E1A",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.1)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-red-400/70 mb-0.5">
                    Reject profile
                  </p>
                  <h2 className="text-base font-black text-white leading-tight">
                    {rejectTarget.label}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRejectTarget(null);
                    setRejectReason("");
                  }}
                  className="h-8 w-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/[0.07] transition-all"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-xs text-white/40 leading-relaxed">
                  Provide a clear reason so the applicant understands what to fix
                  before re-submitting.
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  placeholder="e.g. Incomplete address or violates community policy…"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none resize-none transition-all duration-150"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    lineHeight: "1.6",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <p className="text-[10px] text-white/20">
                  {rejectReason.trim().length} / min 3 characters
                </p>
              </div>

              {/* Footer */}
              <div
                className="flex justify-end gap-3 px-6 py-4 border-t"
                style={{
                  borderColor: "rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setRejectTarget(null);
                    setRejectReason("");
                  }}
                  className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitReject}
                  disabled={busy}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                    boxShadow: "0 0 20px rgba(239,68,68,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    if (!busy)
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 0 28px rgba(239,68,68,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 20px rgba(239,68,68,0.3)";
                  }}
                >
                  <IconX className="w-3.5 h-3.5" />
                  Reject profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
