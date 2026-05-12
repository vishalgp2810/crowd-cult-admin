export type AdminUser = {
  userId: number;
  fullName: string;
  emailAddress: string;
  phoneNumber?: string | null;
  isActive: number;
  createdAt: string;
  role?: {
    roleId: number;
    roleCode: string;
    roleName: string;
    roleLevel: string;
  };
};

export type CreateAdminUserInput = {
  fullName: string;
  emailAddress: string;
  password: string;
  phoneNumber?: string;
};

export type CreateAdminUsersResponse = {
  created: AdminUser[];
  skipped: Array<{ emailAddress: string | null; reason: string }>;
};

