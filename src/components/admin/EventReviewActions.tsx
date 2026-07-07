"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { eventsApi } from "@/lib/api/eventsApi";
import { feeConfigApi } from "@/lib/api/feeConfigApi";
import type { HostedEventDetail, HostedEventListItem } from "@/features/events/eventTypes";
import { IconCheck, IconX } from "@/components/admin/AdminIcons";

type ReviewEvent = Pick<
  HostedEventListItem,
  "hostedEventId" | "title" | "status"
> &
  Partial<HostedEventDetail>;

type Props = {
  event: ReviewEvent;
  layout?: "inline" | "footer";
  onComplete?: () => void;
};

export function EventReviewActions({ event, layout = "inline", onComplete }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [defaultTxFee, setDefaultTxFee] = useState(2);
  const [defaultPlatformFee, setDefaultPlatformFee] = useState(2);
  const [approveOpen, setApproveOpen] = useState(false);
  const [txFee, setTxFee] = useState("2");
  const [platformFee, setPlatformFee] = useState("2");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [changesOpen, setChangesOpen] = useState(false);
  const [changesMessage, setChangesMessage] = useState("");

  const loadFees = useCallback(async () => {
    try {
      const data = await feeConfigApi.getFees();
      const tx = data.fees.find((f) => f.feeKey === "PAYMENT_PROCESSING");
      const plat = data.fees.find((f) => f.feeKey === "PLATFORM_SERVICE");
      if (tx) setDefaultTxFee(tx.rate);
      if (plat) setDefaultPlatformFee(plat.rate);
    } catch {
      /* defaults */
    }
  }, []);

  useEffect(() => {
    void loadFees();
  }, [loadFees]);

  if (event.status !== "PENDING_REVIEW") return null;

  const openApprove = () => {
    setTxFee(String(defaultTxFee));
    setPlatformFee(String(defaultPlatformFee));
    setApproveOpen(true);
  };

  const finish = () => {
    onComplete?.();
    router.push("/admin/requests");
  };

  const handleApprove = async () => {
    setBusy(true);
    try {
      await eventsApi.approve(event.hostedEventId, {
        eventTransactionFeeRate: Number(txFee),
        eventPlatformFeeRate: Number(platformFee),
      });
      toast.success(`"${event.title}" approved and published`);
      setApproveOpen(false);
      finish();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approve failed");
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (rejectReason.trim().length < 3) return;
    setBusy(true);
    try {
      await eventsApi.reject(event.hostedEventId, rejectReason.trim());
      toast.success("Event rejected");
      setRejectOpen(false);
      finish();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reject failed");
    } finally {
      setBusy(false);
    }
  };

  const handleRequestChanges = async () => {
    if (changesMessage.trim().length < 3) return;
    setBusy(true);
    try {
      await eventsApi.requestChanges(event.hostedEventId, changesMessage.trim());
      toast.success("Returned to venue for changes");
      setChangesOpen(false);
      finish();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };

  const buttonClass =
    layout === "footer"
      ? "px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
      : "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest";

  return (
    <>
      <div
        className={
          layout === "footer"
            ? "flex flex-wrap gap-2 justify-center"
            : "flex flex-wrap gap-2"
        }
      >
        <button
          type="button"
          disabled={busy}
          onClick={openApprove}
          className={`${buttonClass} inline-flex items-center gap-1.5 border border-emerald-500/35 text-emerald-300`}
        >
          <IconCheck className="w-3 h-3" />
          Approve
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setChangesOpen(true);
            setChangesMessage("");
          }}
          className={`${buttonClass} border border-amber-500/30 text-amber-200`}
        >
          Request changes
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setRejectOpen(true);
            setRejectReason("");
          }}
          className={`${buttonClass} inline-flex items-center gap-1.5 border border-rose-500/30 text-rose-300`}
        >
          <IconX className="w-3 h-3" />
          Reject
        </button>
      </div>

      {approveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div
            className="w-full max-w-md rounded-2xl p-6 space-y-4"
            style={{ background: "#0D0D14", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="text-lg font-bold text-white">Approve & publish</h3>
            <p className="text-sm text-white/50">{event.title}</p>
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
                onClick={() => setApproveOpen(false)}
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

      {rejectOpen && (
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
              <button type="button" onClick={() => setRejectOpen(false)} className="px-4 py-2 text-white/50 text-[10px] font-black uppercase">
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

      {changesOpen && (
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
              <button type="button" onClick={() => setChangesOpen(false)} className="px-4 py-2 text-white/50 text-[10px] font-black uppercase">
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
    </>
  );
}
