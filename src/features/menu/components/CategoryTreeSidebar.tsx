"use client";

import React, { useState } from "react";
import { MenuCategory, menuApi } from "@/lib/api/menuApi";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip } from "@heroui/react";
import { toast } from "sonner";

interface Props {
  categories: MenuCategory[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  onRefresh: () => void;
}

export const CategoryTreeSidebar: React.FC<Props> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onRefresh,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [newCatName, setNewCatName] = useState("");
  const [newCatParentId, setNewCatParentId] = useState<number | null>(null);
  const [newCatDescription, setNewCatDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit category modal state
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = async () => {
    if (!newCatName.trim()) return toast.error("Category name is required.");
    try {
      setSubmitting(true);
      await menuApi.createCategory({
        name: newCatName,
        parentId: newCatParentId,
        description: newCatDescription,
      });
      toast.success("Category created successfully!");
      setNewCatName("");
      setNewCatDescription("");
      onClose();
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !editName.trim()) return;
    try {
      setSubmitting(true);
      await menuApi.updateCategory(editingCategory.categoryId, {
        name: editName,
      });
      toast.success("Category updated!");
      setEditingCategory(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: MenuCategory) => {
    if (!confirm(`Are you sure you want to delete "${cat.name}"? Items will be unassigned, not deleted.`)) return;
    try {
      await menuApi.deleteCategory(cat.categoryId);
      toast.success("Category deleted!");
      if (selectedCategoryId === cat.categoryId) onSelectCategory(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="w-full lg:w-72 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <h2 className="text-lg font-bold text-white tracking-wide">Menu Categories</h2>
        <Button
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg"
          onClick={() => {
            setNewCatParentId(null);
            onOpen();
          }}
        >
          + Add
        </Button>
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[600px] pr-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-between ${
            selectedCategoryId === null
              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
              : "text-neutral-300 hover:bg-neutral-800/60"
          }`}
        >
          <span>All Items</span>
          <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">All</span>
        </button>

        {categories.map((cat) => (
          <div key={cat.categoryId} className="flex flex-col gap-1">
            <div
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                selectedCategoryId === cat.categoryId
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold"
                  : "text-neutral-300 hover:bg-neutral-800/60"
              }`}
              onClick={() => onSelectCategory(cat.categoryId)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="truncate">{cat.name}</span>
                {cat.isSystemDefault === 1 && (
                  <span className="text-[10px] bg-neutral-800 text-amber-400/80 px-1.5 py-0.2 rounded border border-amber-500/20 shrink-0">
                    Default
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="text-xs text-neutral-400 hover:text-white px-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCategory(cat);
                    setEditName(cat.name);
                  }}
                >
                  ✎
                </button>
                <button
                  className="text-xs text-red-400 hover:text-red-300 px-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cat);
                  }}
                  title="Delete category"
                >
                  ✕
                </button>
                <button
                  className="text-xs text-amber-400 hover:text-amber-300 px-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewCatParentId(cat.categoryId);
                    onOpen();
                  }}
                  title="Add Subcategory"
                >
                  +
                </button>
              </div>
            </div>

            {/* Subcategories */}
            {cat.subcategories && cat.subcategories.length > 0 && (
              <div className="pl-4 border-l border-neutral-800 ml-3 flex flex-col gap-1 my-0.5">
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub.categoryId}
                    className={`group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                      selectedCategoryId === sub.categoryId
                        ? "bg-amber-500/20 text-amber-300 font-semibold"
                        : "text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200"
                    }`}
                    onClick={() => onSelectCategory(sub.categoryId)}
                  >
                    <span className="truncate">↳ {sub.name}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="text-neutral-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(sub);
                          setEditName(sub.name);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(sub);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Category Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark bg-neutral-900 text-white border border-neutral-800">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-bold border-b border-neutral-800">
                {newCatParentId ? "Add Subcategory" : "Add Custom Category"}
              </ModalHeader>
              <ModalBody className="flex flex-col gap-4 py-4">
                <Input
                  label="Category Name"
                  placeholder="e.g. Artisanal Pizzas, Cocktails, Chef Specials"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  variant="bordered"
                />
                <Input
                  label="Description (Optional)"
                  placeholder="Brief description of items in this category"
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter className="border-t border-neutral-800">
                <Button variant="flat" onClick={onClose} className="text-neutral-400">
                  Cancel
                </Button>
                <Button
                  className="bg-amber-500 text-black font-semibold"
                  isLoading={submitting}
                  onClick={handleCreate}
                >
                  Save Category
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={Boolean(editingCategory)}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        className="dark bg-neutral-900 text-white border border-neutral-800"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-lg font-bold border-b border-neutral-800">Rename Category</ModalHeader>
              <ModalBody className="py-4">
                <Input
                  label="Category Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter className="border-t border-neutral-800">
                <Button variant="flat" onClick={() => setEditingCategory(null)} className="text-neutral-400">
                  Cancel
                </Button>
                <Button className="bg-amber-500 text-black font-semibold" isLoading={submitting} onClick={handleUpdate}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
