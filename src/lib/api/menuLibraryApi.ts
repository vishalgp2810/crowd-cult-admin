import { apiClient, unwrapApiResponse } from "./client";

export type MenuFoodType = "VEG" | "NON_VEG" | "VEGAN" | "JAIN" | "EGG" | "NON_FOOD";

export type LibraryImage = {
  libraryImageId: number;
  name: string;
  category: string;
  foodType: MenuFoodType | null;
  tags: string[];
  /** Signed preview URL (expires) — never persist. */
  readUrl: string | null;
  isActive: boolean;
  /** How many dishes (across all venues) currently use this photo. */
  usageCount: number;
  storageUrl: string;
  createdAt: string;
};

export type LibraryListResult = {
  images: LibraryImage[];
  /** Suggested + existing categories. */
  categories: string[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type LibraryImageInput = {
  name?: string;
  category?: string;
  foodType?: MenuFoodType | null;
  tags?: string[];
  isActive?: boolean;
};

export const menuLibraryApi = {
  list: async (params: { category?: string; search?: string; status?: "ALL" | "ACTIVE" | "HIDDEN"; page?: number; limit?: number }) => {
    const res = await apiClient.get("/admin/menu-library", { params });
    return unwrapApiResponse<LibraryListResult>(res);
  },
  /** `url` = canonical URL from an upload with uploadKey "menu-image-library". */
  create: async (payload: LibraryImageInput & { url: string; name: string; category: string }) => {
    const res = await apiClient.post("/admin/menu-library", payload);
    return unwrapApiResponse<{ image: LibraryImage }>(res).image;
  },
  update: async (libraryImageId: number, payload: LibraryImageInput) => {
    const res = await apiClient.patch(`/admin/menu-library/${libraryImageId}`, payload);
    return unwrapApiResponse<{ image: LibraryImage }>(res).image;
  },
  remove: async (libraryImageId: number) => {
    const res = await apiClient.delete(`/admin/menu-library/${libraryImageId}`);
    return unwrapApiResponse<{ libraryImageId: number; stillUsedByDishes: number }>(res);
  },
};
