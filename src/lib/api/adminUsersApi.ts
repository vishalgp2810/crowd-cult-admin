import { apiClient, unwrapApiResponse } from "./client";
import type { AdminUser, CreateAdminUserInput, CreateAdminUsersResponse } from "@/features/adminUsers/adminUsersTypes";

export const adminUsersApi = {
  listAdminUsers: async () => {
    const res = await apiClient.get("/admin/users");
    return unwrapApiResponse<AdminUser[]>(res);
  },

  createAdminUsers: async (users: CreateAdminUserInput[]) => {
    const res = await apiClient.post("/admin/users", { users });
    return unwrapApiResponse<CreateAdminUsersResponse>(res);
  },
};

