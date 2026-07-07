import { apiClient, unwrapApiResponse } from "./client";

export type FeeConfigItem = {
  feeKey: string;
  displayLabel: string;
  rate: number;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  isSystem?: boolean;
  updatedAt?: string | null;
};

export type FeeConfigListResponse = {
  fees: FeeConfigItem[];
};

export type FeeConfigUpdatePayload = {
  fees: Array<{
    feeKey: string;
    displayLabel: string;
    rate: number;
    description?: string;
    sortOrder?: number;
  }>;
  removedFeeKeys?: string[];
};

export const feeConfigApi = {
  getFees: async () => {
    const res = await apiClient.get("/admin/fees");
    return unwrapApiResponse<FeeConfigListResponse>(res);
  },

  updateFees: async (payload: FeeConfigUpdatePayload) => {
    const res = await apiClient.put("/admin/fees", payload);
    return unwrapApiResponse<FeeConfigListResponse>(res);
  },
};
