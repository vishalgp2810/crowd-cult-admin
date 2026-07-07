"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { eventsApi } from "@/lib/api/eventsApi";
import { feeConfigApi } from "@/lib/api/feeConfigApi";
import type { HostedEventListItem } from "@/features/events/eventTypes";
import { EventStatusChip } from "@/components/events/EventStatusChip";
import { formatEventScheduleLine } from "@/lib/events/eventFormatters";
import { IconCheck, IconX, IconRefresh } from "@/components/admin/AdminIcons";

type ApproveTarget = HostedEventListItem;

export function EventReviewQueue() {
  const [events, setEvents] = useState<HostedEventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [defaultTxFee, setDefaultTxFee] = useState(2);
  const [defaultPlatformFee, setDefaultPlatformFee] = useState(2);
  const [approveTarget, setApproveTarget] = useState<ApproveTarget | null>(null);
  const [txFee, setTxFee] = useState("2");
  const [platformFee, setPlatformFee] = useState("2");
  const [rejectTarget, setRejectTarget] = useState<ApproveTarget | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [changesTarget, setChangesTarget] = useState<ApproveTarget | null>(null);
  const [changesMessage, setChangesMessage] = useState("");

  const loadFees = useCallback(async () => {
    try {
      const data = await feeConfigApi.getFees();
      const tx = data.fees.find((f) => f.feeKey === "PAYMENT_PROCESSING");
      const plat = data.fees.find((f) => f.feeKey === "PLATFORM_SERVICE");
      if (tx) setDefaultTxFee(tx.rate);
      if (plat) setDefaultPlatformFee(plat.rate);
    } catch {
      /* use defaults */
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await eventsApi.listReviewQueue({ limit: 50 });
      setEvents(data.events || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load event review queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFees();
    void load();
  }, [load, loadFees]);

  const openApprove = (event: ApproveTarget) => {
    setApproveTarget(event);
    setTxFee(String(defaultTxFee));
    setPlatformFee(String(defaultPlatformFee));
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    setBusy(true);
    try {
      await eventsApi.approve(approveTarget.hostedEventId, {
        eventTransactionFeeRate: Number(txFee),
        eventPlatformFeeRate: Number(platformFee),
      });
      toast.success(`"${approveTarget.title}" approved and published`);
      setApproveTarget(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approve failed");
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || rejectReason.trim().length < 3) return;
    setBusy(true);
    try {
      await eventsApi.reject(rejectTarget.hostedEventId, rejectReason.trim());
      toast.success("Event rejected");
      setRejectTarget(null);
      setRejectReason("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reject failed");
    } finally {
      setBusy(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!changesTarget || changesMessage.trim().length < 3) return;
    setBusy(true);
    try {
      await eventsApi.requestChanges(changesTarget.hostedEventId, changesMessage.trim());
      toast.success("Returned to venue for changes");
      setChangesTarget(null);
      setChangesMessage("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/45">
          Venue-submitted events awaiting approval. Set buyer fees before publishing.
        </p>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10 text-white/60 hover:text-white"
        >
          <IconRefresh className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {loading && (
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/30 py-12">
          Loading events…
        </p>
      )}

      {!loading && events.length === 0 && (
        <div
          className="rounded-2xl p-10 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-sm text-white/45">No events pending review.</p>
        </div>
      )}

      <div className="space-y-3">
        {events.map((event) => {
          const schedule = formatEventScheduleLine(event.startsAt, event.endsAt, event.venue);
          return (
            <article
              key={event.hostedEventId}
              className="rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4"
              style={{
                background: "rgba(13,13,20,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-white truncate">{event.title}</h2>
                  <EventStatusChip status={event.status} endsAt={event.endsAt} />
                </div>
                {schedule && <p className="text-xs text-white/45">{schedule}</p>}
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-200/80">
                  {event.venue?.businessName || "Venue"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/events/${event.hostedEventId}/preview`}
                  className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 text-white/70 hover:text-white"
                >
                  Preview
                </Link>
                <Link
                  href={`/admin/events/${event.hostedEventId}/edit`}
                  className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 text-white/70 hover:text-white"
                >
                  Review
                </Link>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => openApprove(event)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/35 text-emerald-300"
                >
                  <IconCheck className="w-3 h-3" />
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setChangesTarget(event);
                    setChangesMessage("");
                  }}
                  className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-500/30 text-amber-200"
                >
                  Request changes
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setRejectTarget(event);
                    setRejectReason("");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-500/30 text-rose-300"
                >
                  <IconX className="w-3 h-3" />
                  Reject
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {approveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ background: "#0D0D14", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="text-lg font-bold text-white">Approve & publish</h3>
            <p className="text-sm text-white/50">{approveTarget.title}</p>
            <p className="text-xs text-white/40">
              Buyer sees both fees at checkout. Venue receives ticket subtotal only.
            </p>
            <label className="block space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                Payment processing fee (%)
              </span>
              <input
                type="number"
                min={0}
                max={50}
                step={0.01}
                value={txFee}
                onChange={(e) => setTxFee(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                Platform service fee (%)
              </span>
              <input
                type="number"
                min={0}
                max={50}
                step={0.01}
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
              />
            </label>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setApproveTarget(null)}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleApprove()}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-[10px] font-black uppercase tracking-widest text-white"
              >
                Approve & publish
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ background: "#0D0D14", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="text-lg font-bold text-white">Reject event</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Reason for rejection…"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setRejectTarget(null)} className="px-4 py-2 text-white/50 text-[10px] font-black uppercase">
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || rejectReason.trim().length < 3}
                onClick={() => void handleReject()}
                className="px-4 py-2 rounded-lg bg-rose-600 text-[10px] font-black uppercase text-white"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {changesTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ background: "#0D0D14", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="text-lg font-bold text-white">Request changes</h3>
            <textarea
              value={changesMessage}
              onChange={(e) => setChangesMessage(e.target.value)}
              rows={4}
              placeholder="What should the venue update?"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setChangesTarget(null)} className="px-4 py-2 text-white/50 text-[10px] font-black uppercase">
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || changesMessage.trim().length < 3}
                onClick={() => void handleRequestChanges()}
                className="px-4 py-2 rounded-lg bg-amber-600 text-[10px] font-black uppercase text-white"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
