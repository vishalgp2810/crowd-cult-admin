"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { EventStatusChip } from "@/components/events/EventStatusChip";
import { EventShareModal } from "@/components/events/EventShareModal";
import {
  deactivateEventThunk,
  fetchEventsThunk,
  unpublishEventThunk,
} from "@/features/events/eventsThunks";
import type { HostedEventStatus } from "@/features/events/eventTypes";
import { formatEventScheduleLine } from "@/lib/events/eventFormatters";

type StatusFilter = "" | HostedEventStatus;
type TimeframeFilter = "all" | "upcoming" | "past";

export default function AdminEventsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { list, listStatus, listTotal } = useAppSelector((s) => s.events);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [timeframe, setTimeframe] = useState<TimeframeFilter>("all");

  const load = useCallback(() => {
    void dispatch(
      fetchEventsThunk({
        status: statusFilter || undefined,
        timeframe,
        limit: 50,
      })
    );
  }, [dispatch, statusFilter, timeframe]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDeactivate = async (id: number, title: string) => {
    if (!confirm(`Deactivate "${title}"? It will be hidden from the list.`)) return;
    try {
      await dispatch(deactivateEventThunk(id)).unwrap();
      toast.success("Event deactivated");
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Deactivate failed");
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await dispatch(unpublishEventThunk(id)).unwrap();
      toast.success("Event unpublished");
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Unpublish failed");
    }
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{
          background: "rgba(13,13,20,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <h1 className="text-lg font-black uppercase tracking-wide text-white">Hosted events</h1>
          <p className="text-sm text-white/45 mt-1">
            Create and publish Crowd&Cult events at approved venues.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          + Create event
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "upcoming", "past"] as TimeframeFilter[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTimeframe(t)}
            className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest"
            style={{
              background: timeframe === t ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${timeframe === t ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.1)"}`,
              color: timeframe === t ? "#C4B5FD" : "rgba(255,255,255,0.45)",
            }}
          >
            {t}
          </button>
        ))}
        {(["", "DRAFT", "PENDING_REVIEW", "PUBLISHED"] as StatusFilter[]).map((s) => (
          <button
            key={s || "any"}
            type="button"
            onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest"
            style={{
              background: statusFilter === s ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${statusFilter === s ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.1)"}`,
              color: statusFilter === s ? "#C4B5FD" : "rgba(255,255,255,0.45)",
            }}
          >
            {s === "PENDING_REVIEW" ? "Pending review" : s || "All status"}
          </button>
        ))}
      </div>

      {listStatus === "loading" && (
        <p className="text-center text-xs font-black uppercase tracking-widest text-white/30 py-12">
          Loading events…
        </p>
      )}

      {listStatus === "succeeded" && list.length === 0 && (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: "rgba(13,13,20,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-sm text-white/50">No events yet.</p>
          <Link
            href="/admin/events/new"
            className="inline-block mt-4 text-[10px] font-black uppercase tracking-wider text-violet-400"
          >
            Create your first event →
          </Link>
        </div>
      )}

      {list.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(13,13,20,0.85)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[9px] font-black uppercase tracking-widest text-white/35">
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr key={row.hostedEventId} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-semibold text-white">{row.title}</td>
                    <td className="px-4 py-3 text-white/55">
                      {row.venue?.businessName}
                      {row.venue?.city ? `, ${row.venue.city}` : ""}
                    </td>
                    <td className="px-4 py-3 text-white/45 text-xs max-w-[200px]">
                      {formatEventScheduleLine(row.startsAt, row.endsAt, row.venue)}
                    </td>
                    <td className="px-4 py-3">
                      <EventStatusChip status={row.status} endsAt={row.endsAt} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          type="button"
                          className="text-[9px] font-black uppercase tracking-wider text-violet-400"
                          onClick={() => router.push(`/admin/events/${row.hostedEventId}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-[9px] font-black uppercase tracking-wider text-white/50"
                          onClick={() => router.push(`/admin/events/${row.hostedEventId}/preview`)}
                        >
                          Preview
                        </button>
                        {row.slug ? (
                          <EventShareModal
                            slug={row.slug}
                            eventTitle={row.title}
                            trigger={
                              <button
                                type="button"
                                className="text-[9px] font-black uppercase tracking-wider text-purple-300"
                              >
                                QR
                              </button>
                            }
                          />
                        ) : null}
                        {row.status === "PUBLISHED" && (
                          <button
                            type="button"
                            className="text-[9px] font-black uppercase tracking-wider text-amber-400/90"
                            onClick={() => void handleUnpublish(row.hostedEventId)}
                          >
                            Unpublish
                          </button>
                        )}
                        <button
                          type="button"
                          className="text-[9px] font-black uppercase tracking-wider text-red-400/80"
                          onClick={() => void handleDeactivate(row.hostedEventId, row.title)}
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2 text-[9px] text-white/30">{listTotal} total</p>
        </div>
      )}
    </div>
  );
}
