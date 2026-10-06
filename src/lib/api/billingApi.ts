import { apiClient, unwrapApiResponse } from "./client";

/** Platform-admin view of venue billing. Per-venue calls go to /venue/billing/* with x-venue-id. */

export type TaxKind = "GST" | "VAT" | "EXEMPT" | "OTHER";

export interface BillingOverviewRow {
  venueId: number;
  businessName: string;
  slug: string;
  city: string | null;
  billingEnabled: boolean;
  gstin: string | null;
  legalName: string | null;
  isCompositionScheme: boolean;
  pricesIncludeTax: boolean;
  billSplitMode: string | null;
  serviceChargePercent: number;
  invoicePrefix: string | null;
  taxGroupCount: number;
  billsToday: number;
  salesToday: number;
  salesMonth: number;
  taxMonth: number;
  unpaidBills: number;
}

export interface TaxGroup {
  taxRateId: number;
  name: string;
  taxKind: TaxKind;
  components: { name: string; rate: number }[];
  percentage: number;
  isActive: boolean;
}

export interface BillingSettings {
  billingEnabled: number | boolean;
  legalName: string | null;
  billingAddress: string | null;
  stateCode: string | null;
  gstin: string | null;
  fssaiNumber: string | null;
  vatNumber: string | null;
  isCompositionScheme: number | boolean;
  pricesIncludeTax: number | boolean;
  invoicePrefix: string | null;
  serviceChargePercent: number;
  billSplitMode: "SINGLE" | "SPLIT_GST_VAT";
  paperWidth: "80" | "58";
}

export interface BillingSetup {
  settings: BillingSettings;
  taxGroups: TaxGroup[];
  presets: { code: string; name: string; hint: string }[];
  stateCodes: { code: string; name: string }[];
}

export interface AdminBill {
  venueBillId: number;
  billNumber: string;
  billTypeLabel: string;
  status: "ISSUED" | "PAID" | "VOID";
  tableNumber: string | null;
  guestName: string | null;
  grandTotal: number;
  taxAmount: number;
  paymentMode: string | null;
  voidReason: string | null;
  publicToken: string;
  createdAt: string;
}

export interface SalesReport {
  billCount: number;
  voidCount: number;
  grandTotal: number;
  taxableAmount: number;
  taxAmount: number;
  discountAmount: number;
  taxSummary: { kind: string; component: string; rate: number; taxableAmount: number; taxAmount: number }[];
  payments: { mode: string; bills: number; amount: number }[];
}

const as = (venueId: number) => ({ headers: { "x-venue-id": String(venueId) } });

export const billingApi = {
  overview: async () => unwrapApiResponse<{ venues: BillingOverviewRow[] }>(await apiClient.get("/admin/billing/overview")).venues,
  getSetup: async (venueId: number) => unwrapApiResponse<BillingSetup>(await apiClient.get("/venue/billing/setup", as(venueId))),
  updateSettings: async (venueId: number, patch: Record<string, unknown>) =>
    unwrapApiResponse<BillingSetup>(await apiClient.patch("/venue/billing/settings", patch, as(venueId))),
  addPreset: async (venueId: number, presetCode: string) =>
    unwrapApiResponse<TaxGroup>(await apiClient.post("/venue/billing/tax-groups", { presetCode }, as(venueId))),
  listBills: async (venueId: number, params: { from: string; to: string; status?: string }) =>
    unwrapApiResponse<{ bills: AdminBill[]; total: number }>(
      await apiClient.get("/venue/billing/bills", { params: { ...params, limit: 200 }, ...as(venueId) })
    ),
  voidBill: async (venueId: number, billId: number, reason: string) =>
    unwrapApiResponse(await apiClient.post(`/venue/billing/bills/${billId}/void`, { reason }, as(venueId))),
  salesReport: async (venueId: number, from: string, to: string) =>
    unwrapApiResponse<SalesReport>(await apiClient.get("/venue/billing/reports/sales", { params: { from, to }, ...as(venueId) })),
  downloadRegister: async (venueId: number, from: string, to: string, fileLabel: string) => {
    const res = await apiClient.get("/venue/billing/reports/bills.csv", { params: { from, to }, responseType: "blob", ...as(venueId) });
    const url = URL.createObjectURL(res.data as Blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileLabel}-bills-${from}-to-${to}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  },
};
