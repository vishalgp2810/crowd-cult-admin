import { apiClient } from "./client";

export interface MenuCategory {
  categoryId: number;
  venueId: number;
  parentId?: number | null;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  isSystemDefault: number;
  isActive: number;
  subcategories?: MenuCategory[];
  items?: MenuItem[];
}

export interface MenuItemVariant {
  variantId?: number;
  name: string;
  price: number;
  discountPrice?: number | null;
  costPrice?: number | null;
  sku?: string | null;
  barcode?: string | null;
  isDefault?: number;
  isAvailable?: number;
}

export interface MenuItemMedia {
  mediaId?: number;
  url: string;
  mediaType?: "IMAGE" | "VIDEO" | "THUMBNAIL";
  isPrimary?: number;
}

export interface MenuItemAvailability {
  availabilityId?: number;
  dayOfWeek: string;
  slotName?: string | null;
  startTime: string;
  endTime: string;
}

export interface MenuItemInventory {
  stockPolicy: "UNLIMITED" | "TRACKED";
  currentStock: number;
  lowStockAlert: number;
  isOutOfStock: number;
}

export interface MenuItem {
  menuItemId: number;
  venueId: number;
  taxRateId?: number | null;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  foodType: "VEG" | "NON_VEG" | "VEGAN" | "JAIN" | "EGG" | "NON_FOOD";
  basePrice: number;
  discountPrice?: number | null;
  costPrice?: number | null;
  prepTimeMinutes?: number;
  calories?: number | null;
  servingSize?: string | null;
  spiceLevel?: "NONE" | "MILD" | "MEDIUM" | "SPICY" | "EXTRA_SPICY";
  ingredients?: string[];
  allergens?: string[];
  tags?: string[];
  sku?: string | null;
  barcode?: string | null;
  isFeatured?: number;
  isPopular?: number;
  isRecommended?: number;
  isChefSpecial?: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "HIDDEN";
  isAvailable: number;
  displayOrder: number;
  variants?: MenuItemVariant[];
  media?: MenuItemMedia[];
  availabilities?: MenuItemAvailability[];
  inventory?: MenuItemInventory;
  categories?: MenuCategory[];
}

export interface ModifierOption {
  modifierOptionId?: number;
  name: string;
  price: number;
  isDefault?: number;
}

export interface ModifierGroup {
  modifierGroupId: number;
  venueId: number;
  title: string;
  description?: string | null;
  groupType: "ADD_ON" | "CUSTOMIZATION";
  selectionType: "SINGLE" | "MULTIPLE";
  minSelection: number;
  maxSelection: number;
  isRequired: number;
  displayOrder: number;
  options?: ModifierOption[];
}

export const menuApi = {
  // Categories
  getCategories: async (venueId?: number) => {
    const response = await apiClient.get("/venue/menu/categories", {
      headers: venueId ? { "x-venue-id": venueId } : {},
      params: { includeSubcategories: true },
    });
    return response.data;
  },
  createCategory: async (data: Partial<MenuCategory>, venueId?: number) => {
    const response = await apiClient.post("/venue/menu/categories", data, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  updateCategory: async (categoryId: number, data: Partial<MenuCategory>, venueId?: number) => {
    const response = await apiClient.put(`/venue/menu/categories/${categoryId}`, data, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  deleteCategory: async (categoryId: number, venueId?: number) => {
    const response = await apiClient.delete(`/venue/menu/categories/${categoryId}`, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  reorderCategories: async (items: { categoryId: number; displayOrder: number; parentId?: number | null }[], venueId?: number) => {
    const response = await apiClient.put("/venue/menu/categories/reorder", { items }, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },

  // Items
  getMenuItems: async (params?: Record<string, any>, venueId?: number) => {
    const response = await apiClient.get("/venue/menu/items", {
      headers: venueId ? { "x-venue-id": venueId } : {},
      params,
    });
    return response.data;
  },
  createMenuItem: async (data: Record<string, any>, venueId?: number) => {
    const response = await apiClient.post("/venue/menu/items", data, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  updateMenuItem: async (menuItemId: number, data: Record<string, any>, venueId?: number) => {
    const response = await apiClient.put(`/venue/menu/items/${menuItemId}`, data, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  deleteMenuItem: async (menuItemId: number, venueId?: number) => {
    const response = await apiClient.delete(`/venue/menu/items/${menuItemId}`, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  toggleItemStock: async (menuItemId: number, isAvailable: boolean, venueId?: number) => {
    const response = await apiClient.patch(`/venue/menu/items/${menuItemId}/stock`, { isAvailable: isAvailable ? 1 : 0 }, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  getMenuItem: async (menuItemId: number, venueId?: number) => {
    const response = await apiClient.get(`/venue/menu/items/${menuItemId}`, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  duplicateMenuItem: async (menuItemId: number, venueId?: number) => {
    const response = await apiClient.post(`/venue/menu/items/${menuItemId}/duplicate`, {}, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  bulkUpdateItems: async (
    payload: { menuItemIds: number[]; action: string; categoryId?: number },
    venueId?: number
  ) => {
    const response = await apiClient.post("/venue/menu/items/bulk", payload, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  importMenuItems: async (rows: Record<string, unknown>[], venueId?: number) => {
    const response = await apiClient.post("/venue/menu/items/import", { rows }, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },

  // Tree View & Public QR Menu
  getFullMenuTree: async (venueId?: number) => {
    const response = await apiClient.get("/venue/menu/full-tree", {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },

  // Modifiers
  getModifiers: async (venueId?: number) => {
    const response = await apiClient.get("/venue/menu/modifiers", {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  createModifierGroup: async (data: Record<string, any>, venueId?: number) => {
    const response = await apiClient.post("/venue/menu/modifiers", data, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  updateModifierGroup: async (modifierGroupId: number, data: Record<string, any>, venueId?: number) => {
    const response = await apiClient.put(`/venue/menu/modifiers/${modifierGroupId}`, data, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
  deleteModifierGroup: async (modifierGroupId: number, venueId?: number) => {
    const response = await apiClient.delete(`/venue/menu/modifiers/${modifierGroupId}`, {
      headers: venueId ? { "x-venue-id": venueId } : {},
    });
    return response.data;
  },
};
