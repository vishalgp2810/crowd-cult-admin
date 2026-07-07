"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { feeConfigApi, type FeeConfigItem } from "@/lib/api/feeConfigApi";

const SYSTEM_KEYS = new Set(["ESCROW_PROTECTION", "PLATFORM_SERVICE", "PAYMENT_PROCESSING"]);

const SYSTEM_SORT_ORDER: Record<string, number> = {
  ESCROW_PROTECTION: 1,
  PAYMENT_PROCESSING: 2,
  PLATFORM_SERVICE: 3,
};

function sortFeesForDisplay<T extends FeeConfigItem>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const aOrder = SYSTEM_SORT_ORDER[a.feeKey] ?? 100 + (a.sortOrder ?? 0);
    const bOrder = SYSTEM_SORT_ORDER[b.feeKey] ?? 100 + (b.sortOrder ?? 0);
    if (aOrder !== bOrder) return aOrder - bOrder;
    return String(a.feeKey).localeCompare(String(b.feeKey));
  });
}

function feeAppliesToLabel(feeKey: string): string {
  if (feeKey === "ESCROW_PROTECTION") return "Artist bookings";
  if (feeKey === "PAYMENT_PROCESSING") return "Event tickets";
  if (feeKey === "PLATFORM_SERVICE") return "Bookings & events";
  if (feeKey === "TIP_PLATFORM") return "Audience tips";
  return "Future use";
}

const DEFAULT_FEES: FeeConfigItem[] = [
  {
    feeKey: "ESCROW_PROTECTION",
    displayLabel: "Platform Escrow Protection",
    rate: 15,
    isSystem: true,
    sortOrder: 1,
  },
  {
    feeKey: "PAYMENT_PROCESSING",
    displayLabel: "Payment processing",
    rate: 2,
    isSystem: true,
    sortOrder: 2,
  },
  {
    feeKey: "PLATFORM_SERVICE",
    displayLabel: "Platform Service",
    rate: 2,
    isSystem: true,
    sortOrder: 3,
  },
];

type EditableFee = FeeConfigItem & { _localId: string };

function newLocalId() {
  return `fee-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toEditable(row: FeeConfigItem): EditableFee {
  return { ...row, _localId: row.feeKey || newLocalId() };
}

function normalizeFeeKey(raw: string) {
  return String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState<EditableFee[]>(DEFAULT_FEES.map(toEditable));
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setRemovedKeys([]);
    try {
      const data = await feeConfigApi.getFees();
      const rows = sortFeesForDisplay(data?.fees?.length ? data.fees : DEFAULT_FEES);
      setFees(rows.map(toEditable));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load fees");
      setFees(DEFAULT_FEES.map(toEditable));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateRow = (localId: string, patch: Partial<EditableFee>) => {
    setFees((prev) =>
      prev.map((row) => (row._localId === localId ? { ...row, ...patch } : row))
    );
  };

  const addFee = () => {
    setFees((prev) => [
      ...prev,
      {
        _localId: newLocalId(),
        feeKey: "",
        displayLabel: "",
        rate: 0,
        isSystem: false,
        sortOrder: prev.length + 1,
      },
    ]);
  };

  const removeFee = (row: EditableFee) => {
    if (row.isSystem || SYSTEM_KEYS.has(row.feeKey)) {
      toast.error("System fees cannot be removed");
      return;
    }
    const key = normalizeFeeKey(row.feeKey);
    if (key && !key.startsWith("NEW_")) {
      setRemovedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
    }
    setFees((prev) => prev.filter((f) => f._localId !== row._localId));
  };

  const payload = useMemo(
    () =>
      sortFeesForDisplay(fees).map((f, index) => ({
        feeKey: normalizeFeeKey(f.feeKey),
        displayLabel: f.displayLabel.trim(),
        rate: Number(f.rate),
        sortOrder: SYSTEM_SORT_ORDER[f.feeKey] ?? 10 + index,
      })),
    [fees]
  );

  const handleSave = async () => {
    for (const row of payload) {
      if (!row.feeKey) {
        toast.error("Each fee needs a fee key (e.g. LATE_BOOKING_FEE)");
        return;
      }
      if (!row.displayLabel) {
        toast.error("Each fee needs a checkout label");
        return;
      }
    }

    setSaving(true);
    try {
      const result = await feeConfigApi.updateFees({
        fees: payload,
        removedFeeKeys: removedKeys,
      });
      setFees(sortFeesForDisplay(result?.fees || []).map(toEditable));
      setRemovedKeys([]);
      toast.success("Fees saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save fees");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 w-full">
        <p className="text-xs font-black uppercase tracking-widest text-white/30">Loading fees…</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{
          background: "rgba(13,13,20,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white">
            Platform fees
          </h1>
          <p className="text-sm text-white/45 mt-1 max-w-3xl">
            Configure checkout rates. Use whole numbers for rate (
            <span className="text-white/70">15</span> = 15%). System fees are required; custom fees
            are stored for future use.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={addFee}
            className="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider text-violet-200"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.35)",
            }}
          >
            + Add fee
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
          >
            {saving ? "Saving…" : "Save all"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden w-full"
        style={{
          background: "rgba(13,13,20,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left border-collapse table-fixed">
            <thead>
              <tr
                className="text-[10px] font-black uppercase tracking-widest text-white/40"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <th className="px-4 sm:px-6 py-4 w-[17%]">Fee key</th>
                <th className="px-4 sm:px-6 py-4 w-[26%]">Checkout label</th>
                <th className="px-4 sm:px-6 py-4 w-[14%]">Rate (%)</th>
                <th className="px-4 sm:px-6 py-4 w-[17%]">Applies to</th>
                <th className="px-4 sm:px-6 py-4 w-[12%]">Type</th>
                <th className="px-4 sm:px-6 py-4 w-[14%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortFeesForDisplay(fees).map((row) => {
                const isSystem = row.isSystem || SYSTEM_KEYS.has(row.feeKey);
                return (
                  <tr
                    key={row._localId}
                    className="text-sm"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td className="px-4 sm:px-6 py-4 align-top">
                      {isSystem ? (
                        <code
                          className="block text-[11px] font-mono uppercase text-white/55 leading-relaxed break-all"
                          title={row.feeKey}
                        >
                          {row.feeKey}
                        </code>
                      ) : (
                        <input
                          type="text"
                          value={row.feeKey}
                          placeholder="LATE_BOOKING_FEE"
                          onChange={(e) =>
                            updateRow(row._localId, { feeKey: normalizeFeeKey(e.target.value) })
                          }
                          className="w-full h-10 rounded-lg px-3 text-xs font-mono uppercase bg-black/40 border border-white/10 text-white outline-none focus:border-violet-500/50"
                        />
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-top">
                      <input
                        type="text"
                        value={row.displayLabel}
                        onChange={(e) =>
                          updateRow(row._localId, { displayLabel: e.target.value })
                        }
                        className="w-full h-10 rounded-lg bg-black/40 border border-white/10 px-3 text-sm text-white outline-none focus:border-violet-500/50"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-top">
                      <div className="inline-flex items-center gap-2 min-w-[6.5rem]">
                        <input
                          type="number"
                          min={0}
                          max={50}
                          step={0.01}
                          value={row.rate}
                          onChange={(e) =>
                            updateRow(row._localId, { rate: Number(e.target.value) })
                          }
                          className="w-[5.5rem] min-w-[5.5rem] h-10 rounded-lg bg-black/40 border border-white/10 px-2 text-base font-semibold tabular-nums text-white text-center outline-none focus:border-violet-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-white/50 text-sm font-bold shrink-0">%</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-top">
                      <span className="text-xs text-white/55">{feeAppliesToLabel(row.feeKey)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-top">
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          isSystem
                            ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                            : "bg-white/5 text-white/50 border border-white/10"
                        }`}
                      >
                        {isSystem ? "System" : "Custom"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 align-top text-right">
                      {isSystem ? (
                        <span className="text-[10px] text-white/25 uppercase tracking-wider">
                          Locked
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeFee(row)}
                          className="text-[10px] font-black uppercase tracking-wider text-red-400/90 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {fees.length === 0 && (
          <p className="px-6 py-12 text-center text-sm text-white/40">
            No fees configured. Add a fee or reload the page.
          </p>
        )}
      </div>

      <p className="text-xs text-white/30 px-1">
        Note: Booking checkout applies <strong className="text-white/50">Escrow</strong> and{" "}
        <strong className="text-white/50">Platform service</strong>. Event ticket checkout applies{" "}
        <strong className="text-white/50">Payment processing</strong> and{" "}
        <strong className="text-white/50">Platform service</strong>. Additional custom fees are
        stored for future checkout versions.
      </p>
    </div>
  );
}
