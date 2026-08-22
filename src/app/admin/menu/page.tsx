"use client";

import React from "react";
import { CategoryTreeSidebar } from "@/features/menu/components/CategoryTreeSidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategories,
  fetchMenuItems,
  fetchModifiers,
  setSelectedCategory,
  setSearchQuery,
  setFoodTypeFilter,
} from "@/features/menu/menuSlice";

/**
 * Platform-admin / venue support view for menu management.
 * Primary venue owner UX lives in crowd-cult-frontend /dashboard/venue/menu.
 */
export default function AdminVenueMenuPage() {
  const dispatch = useAppDispatch();
  const { categories, items, selectedCategoryId, searchQuery, foodTypeFilter, loading } =
    useAppSelector((s) => s.menu);

  React.useEffect(() => {
    void dispatch(fetchCategories());
    void dispatch(fetchModifiers());
  }, [dispatch]);

  React.useEffect(() => {
    void dispatch(
      fetchMenuItems({
        query: {
          categoryId: selectedCategoryId || undefined,
          search: searchQuery || undefined,
          foodType: foodTypeFilter && foodTypeFilter !== "ALL" ? foodTypeFilter : undefined,
        },
      })
    );
  }, [dispatch, selectedCategoryId, searchQuery, foodTypeFilter]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Venue Menu</h1>
          <p className="text-sm text-neutral-400">
            Support view — venue owners manage menus at /dashboard/venue/menu
          </p>
        </div>
      </div>
      <div className="flex gap-4 items-start">
        <CategoryTreeSidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => dispatch(setSelectedCategory(id))}
          onRefresh={() => dispatch(fetchCategories())}
        />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white"
              placeholder="Search items…"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
            <select
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white"
              value={foodTypeFilter || ""}
              onChange={(e) => dispatch(setFoodTypeFilter(e.target.value || ""))}
            >
              <option value="">All types</option>
              {["VEG", "NON_VEG", "VEGAN", "JAIN", "EGG", "NON_FOOD"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <p className="text-neutral-500 text-sm">Loading…</p>
          ) : (
            <ul className="space-y-2">
              {(items || []).map((item: { menuItemId: number; name: string; basePrice: number; foodType: string; status: string }) => (
                <li
                  key={item.menuItemId}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 flex justify-between text-sm"
                >
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-neutral-400">
                    {item.foodType} · {item.status} · ₹{item.basePrice}
                  </span>
                </li>
              ))}
              {!items?.length && (
                <p className="text-neutral-500 text-sm">No items for this venue.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
