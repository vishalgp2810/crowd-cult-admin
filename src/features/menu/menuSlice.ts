import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { menuApi, MenuCategory, MenuItem, ModifierGroup } from "@/lib/api/menuApi";

interface MenuState {
  categories: MenuCategory[];
  items: MenuItem[];
  modifiers: ModifierGroup[];
  fullTree: any | null;
  selectedCategoryId: number | null;
  searchQuery: string;
  foodTypeFilter: string;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  categories: [],
  items: [],
  modifiers: [],
  fullTree: null,
  selectedCategoryId: null,
  searchQuery: "",
  foodTypeFilter: "",
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "menu/fetchCategories",
  async (venueId: number | undefined, { rejectWithValue }) => {
    try {
      const res = await menuApi.getCategories(venueId);
      const payload = res?.successResponse?.data ?? res?.data ?? res;
      return Array.isArray(payload) ? payload : [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async (arg: { venueId?: number; query?: Record<string, any> } | undefined, { rejectWithValue }) => {
    try {
      const venueId = arg?.venueId;
      const query = arg?.query;
      const res = await menuApi.getMenuItems(query, venueId);
      const payload = res?.successResponse?.data ?? res?.data ?? res;
      if (Array.isArray(payload)) return payload;
      if (payload?.items) return payload.items;
      return [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch menu items");
    }
  }
);

export const fetchFullMenuTree = createAsyncThunk(
  "menu/fetchFullMenuTree",
  async (venueId: number | undefined, { rejectWithValue }) => {
    try {
      const res = await menuApi.getFullMenuTree(venueId);
      return res?.successResponse?.data ?? res?.data ?? res ?? null;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch full menu tree");
    }
  }
);

export const fetchModifiers = createAsyncThunk(
  "menu/fetchModifiers",
  async (venueId: number | undefined, { rejectWithValue }) => {
    try {
      const res = await menuApi.getModifiers(venueId);
      const payload = res?.successResponse?.data ?? res?.data ?? res;
      return Array.isArray(payload) ? payload : [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch modifiers");
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<number | null>) {
      state.selectedCategoryId = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setFoodTypeFilter(state, action: PayloadAction<string>) {
      state.foodTypeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Items
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Full Tree
      .addCase(fetchFullMenuTree.fulfilled, (state, action) => {
        state.fullTree = action.payload;
      })
      // Modifiers
      .addCase(fetchModifiers.fulfilled, (state, action) => {
        state.modifiers = action.payload;
      });
  },
});

export const { setSelectedCategory, setSearchQuery, setFoodTypeFilter } = menuSlice.actions;
export default menuSlice.reducer;
