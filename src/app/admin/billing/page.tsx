"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { billingApi, type AdminBill, type BillingOverviewRow, type BillingSetup, type SalesReport } from "@/lib/api/billingApi";

const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
const monthStart = () => `${today().slice(0, 8)}01`;
const istTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "short", timeStyle: "short" }).format(new Date(iso));

const panel = { background: "rgba(13,13,20,0.85)", border: "1px solid rgba(255,255,255,0.08)" };
const inputCls = "h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-violet-500/50";
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/** Platform admin: GST/VAT billing status and sales for every approved venue. */
export default function AdminBillingPage() {
  const [rows, setRows] = useState<BillingOverviewRow[] | null>(null);
  const [q, setQ] = useState("");
  const [openVenue, setOpenVenue] = useState<BillingOverviewRow | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    billingApi
      .overview()
      .then((r) => !cancelled && setRows(r))
      .catch((err) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "Could not load billing overview");
        setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const shown = useMemo(
    () => (rows || []).filter((r) => !q.trim() || `${r.businessName} ${r.city || ""} ${r.gstin || ""}`.toLowerCase().includes(q.trim().toLowerCase())),
    [rows, q]
  );
  const totals = useMemo(() => {
    const on = (rows || []).filter((r) => r.billingEnabled);
    return {
      enabled: on.length,
      salesToday: on.reduce((s, r) => s + r.salesToday, 0),
      salesMonth: on.reduce((s, r) => s + r.salesMonth, 0),
      taxMonth: on.reduce((s, r) => s + r.taxMonth, 0),
    };
  }, [rows]);

  return (
    <div className="w-full space-y-6">
      <div className="rounded-2xl p-5 sm:p-6" style={panel}>
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white">Venue billing</h1>
        <p className="mt-1 max-w-3xl text-sm text-white/45">
          GST / VAT bills issued by venues through Crowd&amp;Cult. Open a venue to fix its tax profile, void a bill or download the bill register.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Venues billing" value={`${totals.enabled} / ${rows?.length ?? "…"}`} />
          <Stat label="Sales today" value={inr(totals.salesToday)} />
          <Stat label="Sales this month" value={inr(totals.salesMonth)} />
          <Stat label="Tax this month" value={inr(totals.taxMonth)} />
        </div>
      </div>

      <div className="rounded-2xl p-4" style={panel}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search venue, city or GSTIN" className={`${inputCls} sm:w-80`} />
        {rows === null ? (
          <p className="py-16 text-center text-xs font-black uppercase tracking-widest text-white/30">Loading…</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-white/40">
                  <th className="pb-2">Venue</th>
                  <th className="pb-2">Billing</th>
                  <th className="pb-2">GSTIN</th>
                  <th className="pb-2 text-right">Tax groups</th>
                  <th className="pb-2 text-right">Bills today</th>
                  <th className="pb-2 text-right">Sales today</th>
                  <th className="pb-2 text-right">This month</th>
                  <th className="pb-2 text-right">Unpaid</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr
                    key={r.venueId}
                    onClick={() => setOpenVenue(r)}
                    className="cursor-pointer text-white/80 hover:bg-white/[0.03]"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td className="py-2.5">
                      <p className="font-semibold text-white">{r.businessName}</p>
                      <p className="text-xs text-white/40">{r.city || "—"}</p>
                    </td>
                    <td>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.billingEnabled ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-white/40"}`}>
                        {r.billingEnabled ? "On" : "Off"}
                      </span>
                      {r.isCompositionScheme && <span className="ml-1 text-xs text-white/40">composition</span>}
                    </td>
                    <td className="font-mono text-xs">{r.gstin || <span className="text-white/30">—</span>}</td>
                    <td className="text-right">{r.taxGroupCount}</td>
                    <td className="text-right">{r.billsToday}</td>
                    <td className="text-right">{inr(r.salesToday)}</td>
                    <td className="text-right">{inr(r.salesMonth)}</td>
                    <td className={`text-right ${r.unpaidBills ? "text-amber-300" : ""}`}>{r.unpaidBills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openVenue && (
        <VenueBillingDrawer
          venue={openVenue}
          onClose={() => {
            setOpenVenue(null);
            setReloadKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
      <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function VenueBillingDrawer({ venue, onClose }: { venue: BillingOverviewRow; onClose: () => void }) {
  const [setup, setSetup] = useState<BillingSetup | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [from, setFrom] = useState(monthStart());
  const [to, setTo] = useState(today());
  const [bills, setBills] = useState<AdminBill[]>([]);
  const [report, setReport] = useState<SalesReport | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    billingApi
      .getSetup(venue.venueId)
      .then((s) => {
        if (cancelled) return;
        setSetup(s);
        setForm({ ...s.settings });
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not load settings"));
    return () => {
      cancelled = true;
    };
  }, [venue.venueId]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([billingApi.listBills(venue.venueId, { from, to }), billingApi.salesReport(venue.venueId, from, to)])
      .then(([b, r]) => {
        if (cancelled) return;
        setBills(b.bills);
        setReport(r);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not load bills"));
    return () => {
      cancelled = true;
    };
  }, [venue.venueId, from, to]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const gstin = String(form.gstin || "");
  const gstinError = gstin && !GSTIN_RE.test(gstin) ? "Invalid GSTIN format" : null;

  const save = async () => {
    if (gstinError) return toast.error(gstinError);
    setSaving(true);
    try {
      const next = await billingApi.updateSettings(venue.venueId, {
        billingEnabled: !!form.billingEnabled,
        legalName: form.legalName || null,
        billingAddress: form.billingAddress || null,
        stateCode: form.stateCode || null,
        gstin: gstin || null,
        fssaiNumber: form.fssaiNumber || null,
        vatNumber: form.vatNumber || null,
        isCompositionScheme: !!form.isCompositionScheme,
        pricesIncludeTax: !!form.pricesIncludeTax,
        invoicePrefix: form.invoicePrefix || null,
        serviceChargePercent: Number(form.serviceChargePercent) || 0,
        billSplitMode: form.billSplitMode || "SINGLE",
      });
      setSetup(next);
      setForm({ ...next.settings });
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const addPreset = async (code: string) => {
    try {
      await billingApi.addPreset(venue.venueId, code);
      setSetup(await billingApi.getSetup(venue.venueId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add");
    }
  };

  const voidBill = async (b: AdminBill) => {
    const reason = window.prompt(`Void ${b.billNumber}? Reason:`);
    if (!reason?.trim()) return;
    try {
      await billingApi.voidBill(venue.venueId, b.venueBillId, `Admin: ${reason.trim()}`);
      toast.success("Voided");
      setBills((await billingApi.listBills(venue.venueId, { from, to })).bills);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not void");
    }
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://crowdandcult.com";
  const existing = new Set((setup?.taxGroups || []).map((g) => g.name.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onMouseDown={onClose}>
      <div onMouseDown={(e) => e.stopPropagation()} className="h-full w-full max-w-3xl overflow-y-auto bg-[#0b0b12] p-6" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black text-white">{venue.businessName}</h2>
            <p className="text-sm text-white/40">Billing profile, tax groups, bills and reports</p>
          </div>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-white/40 hover:text-white">
            ×
          </button>
        </div>

        {!setup ? (
          <p className="py-16 text-center text-xs uppercase tracking-widest text-white/30">Loading…</p>
        ) : (
          <div className="mt-6 space-y-6">
            <section className="rounded-xl p-4" style={panel}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-white/70">Tax profile</h3>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input type="checkbox" checked={!!form.billingEnabled} onChange={(e) => set("billingEnabled", e.target.checked)} className="accent-violet-500" />
                  Billing on
                </label>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <L label="Legal name"><input className={inputCls} value={String(form.legalName || "")} onChange={(e) => set("legalName", e.target.value)} /></L>
                <L label="State">
                  <select className={inputCls} value={String(form.stateCode || "")} onChange={(e) => set("stateCode", e.target.value || null)}>
                    <option value="">—</option>
                    {setup.stateCodes.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} {s.name}
                      </option>
                    ))}
                  </select>
                </L>
                <div className="sm:col-span-2">
                  <L label="Address"><input className={inputCls} value={String(form.billingAddress || "")} onChange={(e) => set("billingAddress", e.target.value)} /></L>
                </div>
                <L label={gstinError || "GSTIN"}>
                  <input className={`${inputCls} font-mono`} value={gstin} maxLength={15} onChange={(e) => set("gstin", e.target.value.toUpperCase().trim())} />
                </L>
                <L label="Invoice prefix"><input className={`${inputCls} font-mono`} value={String(form.invoicePrefix || "")} maxLength={4} onChange={(e) => set("invoicePrefix", e.target.value.toUpperCase())} /></L>
                <L label="FSSAI"><input className={inputCls} value={String(form.fssaiNumber || "")} onChange={(e) => set("fssaiNumber", e.target.value)} /></L>
                <L label="VAT / TIN"><input className={inputCls} value={String(form.vatNumber || "")} onChange={(e) => set("vatNumber", e.target.value)} /></L>
                <L label="Service charge %"><input className={inputCls} type="number" min={0} max={20} value={Number(form.serviceChargePercent || 0)} onChange={(e) => set("serviceChargePercent", e.target.value)} /></L>
                <L label="Liquor on separate bill">
                  <select className={inputCls} value={String(form.billSplitMode || "SINGLE")} onChange={(e) => set("billSplitMode", e.target.value)}>
                    <option value="SINGLE">No — one bill</option>
                    <option value="SPLIT_GST_VAT">Yes — GST + VAT bills</option>
                  </select>
                </L>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={!!form.pricesIncludeTax} onChange={(e) => set("pricesIncludeTax", e.target.checked)} className="accent-violet-500" />
                  Prices include tax
                </label>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={!!form.isCompositionScheme} onChange={(e) => set("isCompositionScheme", e.target.checked)} className="accent-violet-500" />
                  Composition scheme
                </label>
              </div>
              <div className="mt-4 flex justify-end">
                <button type="button" disabled={saving} onClick={() => void save()} className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-40">
                  {saving ? "Saving…" : "Save profile"}
                </button>
              </div>
            </section>

            <section className="rounded-xl p-4" style={panel}>
              <h3 className="text-sm font-black uppercase tracking-wider text-white/70">Tax groups</h3>
              <ul className="mt-3 space-y-1 text-sm text-white/80">
                {setup.taxGroups.map((g) => (
                  <li key={g.taxRateId} className="flex justify-between">
                    <span>
                      {g.name} <span className="text-white/40">({g.taxKind})</span>
                    </span>
                    <span className="text-white/60">{g.components.map((c) => `${c.name} ${c.rate}%`).join(" + ") || "No tax"}</span>
                  </li>
                ))}
                {!setup.taxGroups.length && <li className="text-white/40">None yet.</li>}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {setup.presets
                  .filter((p) => !existing.has(p.name.toLowerCase()))
                  .map((p) => (
                    <button key={p.code} type="button" title={p.hint} onClick={() => void addPreset(p.code)} className="rounded-full border border-violet-500/30 px-3 py-1 text-xs text-violet-200">
                      + {p.name}
                    </button>
                  ))}
              </div>
              <p className="mt-2 text-xs text-white/35">Category / dish tax mapping is done by the venue in Dashboard → Billing → Tax &amp; settings.</p>
            </section>

            <section className="rounded-xl p-4" style={panel}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-white/70">Bills</h3>
                <div className="flex items-center gap-2 text-sm">
                  <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className={`${inputCls} w-auto [color-scheme:dark]`} />
                  <span className="text-white/30">to</span>
                  <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className={`${inputCls} w-auto [color-scheme:dark]`} />
                  <button
                    type="button"
                    onClick={() => void billingApi.downloadRegister(venue.venueId, from, to, venue.slug).catch(() => toast.error("Download failed"))}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80"
                  >
                    CSV
                  </button>
                </div>
              </div>

              {report && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Stat label="Bills" value={`${report.billCount}${report.voidCount ? ` +${report.voidCount} void` : ""}`} />
                  <Stat label="Sales" value={inr(report.grandTotal)} />
                  <Stat label="Tax" value={inr(report.taxAmount)} />
                  <Stat label="Discounts" value={inr(report.discountAmount)} />
                </div>
              )}
              {report && report.taxSummary.length > 0 && (
                <p className="mt-2 text-xs text-white/50">
                  {report.taxSummary.map((t) => `${t.component} ${t.rate}%: ${inr(t.taxAmount)} on ${inr(t.taxableAmount)}`).join(" · ")}
                </p>
              )}

              <table className="mt-4 w-full text-sm">
                <tbody>
                  {bills.map((b) => (
                    <tr key={b.venueBillId} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <td className="py-2">
                        <a href={`${siteUrl}/bill/${b.publicToken}`} target="_blank" rel="noreferrer" className="font-mono text-white hover:underline">
                          {b.billNumber}
                        </a>
                        <p className="text-xs text-white/40">
                          {istTime(b.createdAt)} · {b.tableNumber ? `T${b.tableNumber} · ` : ""}
                          {b.guestName || "Guest"}
                        </p>
                      </td>
                      <td className="text-xs">
                        <span className={b.status === "PAID" ? "text-emerald-300" : b.status === "VOID" ? "text-red-300" : "text-amber-300"}>
                          {b.status === "ISSUED" ? "Unpaid" : b.status}
                        </span>
                        {b.paymentMode && <span className="text-white/40"> · {b.paymentMode}</span>}
                        {b.voidReason && <p className="text-white/40">{b.voidReason}</p>}
                      </td>
                      <td className={`text-right ${b.status === "VOID" ? "text-white/30 line-through" : "text-white"}`}>{inr(b.grandTotal)}</td>
                      <td className="w-16 text-right">
                        {b.status !== "VOID" && (
                          <button type="button" onClick={() => void voidBill(b)} className="text-xs text-red-300 hover:underline">
                            Void
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!bills.length && (
                    <tr>
                      <td className="py-6 text-center text-sm text-white/40">No bills in this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-white/45">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
