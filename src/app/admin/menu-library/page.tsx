"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadMediaFile } from "@/lib/api/mediaUpload";
import { UPLOAD_KEYS } from "@/lib/constants/uploadKeys";
import {
  menuLibraryApi,
  type LibraryImage,
  type LibraryImageInput,
  type MenuFoodType,
} from "@/lib/api/menuLibraryApi";

const PAGE_SIZE = 60;

const FOOD_TYPES: { value: MenuFoodType | ""; label: string }[] = [
  { value: "", label: "Any / not set" },
  { value: "VEG", label: "Veg" },
  { value: "NON_VEG", label: "Non-veg" },
  { value: "VEGAN", label: "Vegan" },
  { value: "JAIN", label: "Jain" },
  { value: "EGG", label: "Egg" },
  { value: "NON_FOOD", label: "Drinks / non-food" },
];

const panel = { background: "rgba(13,13,20,0.85)", border: "1px solid rgba(255,255,255,0.08)" };
const inputCls =
  "h-10 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-500/50";
const labelCls = "text-[11px] font-semibold text-white/50";

/** "paneer_tikka-01.jpg" → "Paneer tikka 01" — a sensible default name admins can edit later. */
function nameFromFile(filename: string) {
  const base = filename.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return base ? base[0].toUpperCase() + base.slice(1) : "Dish photo";
}

export default function MenuImageLibraryPage() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "HIDDEN">("ALL");

  const [uploadCategory, setUploadCategory] = useState("Starters");
  const [uploadFoodType, setUploadFoodType] = useState<MenuFoodType | "">("");
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<LibraryImage | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", foodType: "" as MenuFoodType | "", tags: "" });
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(
    async (nextPage: number) => {
      setLoading(true);
      try {
        const result = await menuLibraryApi.list({
          category: categoryFilter || undefined,
          search: debounced || undefined,
          status,
          page: nextPage,
          limit: PAGE_SIZE,
        });
        setImages((prev) => (nextPage === 1 ? result.images : [...prev, ...result.images]));
        setCategories(result.categories);
        setPage(nextPage);
        setTotalPages(result.pagination.totalPages || 1);
        setTotal(result.pagination.total);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not load the library");
      } finally {
        setLoading(false);
      }
    },
    [categoryFilter, debounced, status]
  );

  useEffect(() => {
    void load(1);
  }, [load]);

  const replace = (img: LibraryImage) =>
    setImages((prev) => prev.map((i) => (i.libraryImageId === img.libraryImageId ? img : i)));

  /** Upload each file with the library upload key, then register it in the library. */
  const handleFiles = async (files: FileList | null) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return toast.error("Choose image files (JPG, PNG, WebP)");
    if (!uploadCategory.trim()) return toast.error("Pick a category for these photos");

    setUploadProgress({ done: 0, total: list.length });
    const added: LibraryImage[] = [];
    let failed = 0;
    for (const file of list) {
      try {
        const uploaded = await uploadMediaFile(file, UPLOAD_KEYS.MENU_IMAGE_LIBRARY);
        added.push(
          await menuLibraryApi.create({
            url: uploaded.url,
            name: nameFromFile(file.name),
            category: uploadCategory.trim(),
            foodType: uploadFoodType || null,
          })
        );
      } catch (err) {
        failed += 1;
        toast.error(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
      }
      setUploadProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
    }
    setUploadProgress(null);
    if (added.length) {
      toast.success(`Added ${added.length} photo${added.length === 1 ? "" : "s"} to the library`);
      void load(1);
    }
    if (failed && !added.length) toast.error("No photos were added");
  };

  const openEdit = (img: LibraryImage) => {
    setEditing(img);
    setEditForm({ name: img.name, category: img.category, foodType: img.foodType || "", tags: (img.tags || []).join(", ") });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload: LibraryImageInput = {
      name: editForm.name.trim(),
      category: editForm.category.trim(),
      foodType: editForm.foodType || null,
      tags: editForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (!payload.name || !payload.category) return toast.error("Name and category are required");
    setBusyId(editing.libraryImageId);
    try {
      replace(await menuLibraryApi.update(editing.libraryImageId, payload));
      setEditing(null);
      toast.success("Photo updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (img: LibraryImage) => {
    setBusyId(img.libraryImageId);
    try {
      replace(await menuLibraryApi.update(img.libraryImageId, { isActive: !img.isActive }));
      toast.success(img.isActive ? "Hidden from venues" : "Visible to venues");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (img: LibraryImage) => {
    const note = img.usageCount
      ? `\n\n${img.usageCount} dish${img.usageCount === 1 ? "" : "es"} already use it — they keep the photo.`
      : "";
    if (!window.confirm(`Remove "${img.name}" from the library?${note}`)) return;
    setBusyId(img.libraryImageId);
    try {
      await menuLibraryApi.remove(img.libraryImageId);
      setImages((prev) => prev.filter((i) => i.libraryImageId !== img.libraryImageId));
      setTotal((t) => Math.max(0, t - 1));
      toast.success("Removed from library");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setBusyId(null);
    }
  };

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
      active ? "bg-violet-600 text-white" : "border border-white/10 bg-white/[0.04] text-white/60 hover:text-white"
    }`;

  return (
    <div className="w-full space-y-6">
      {/* Header + upload */}
      <div className="rounded-2xl p-5 sm:p-6" style={panel}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-black uppercase tracking-wide text-white sm:text-xl">Menu image library</h1>
            <p className="mt-1 max-w-3xl text-sm text-white/45">
              Dish photos any venue can pick for its menu instead of uploading its own. A venue picking a photo only
              links to it — no new storage per venue. {total ? <span className="text-white/70">{total} photos.</span> : null}
            </p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-[1fr_1fr_auto] lg:w-auto lg:min-w-[520px]">
            <label className="space-y-1">
              <span className={labelCls}>Category for new photos</span>
              <input
                list="menu-library-categories"
                className={inputCls}
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                placeholder="e.g. Starters"
              />
            </label>
            <label className="space-y-1">
              <span className={labelCls}>Food type</span>
              <select className={inputCls} value={uploadFoodType} onChange={(e) => setUploadFoodType(e.target.value as MenuFoodType | "")}>
                {FOOD_TYPES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                disabled={Boolean(uploadProgress)}
                onClick={() => fileRef.current?.click()}
                className="h-10 w-full rounded-xl px-5 text-xs font-black uppercase tracking-wider text-white disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
              >
                {uploadProgress ? `Uploading ${uploadProgress.done}/${uploadProgress.total}…` : "+ Upload photos"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  void handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        </div>
        <datalist id="menu-library-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl p-4" style={panel}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            className={`${inputCls} md:max-w-sm`}
            placeholder="Search name or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-1.5">
            {(["ALL", "ACTIVE", "HIDDEN"] as const).map((s) => (
              <button key={s} type="button" className={chip(status === s)} onClick={() => setStatus(s)}>
                {s === "ALL" ? "All" : s === "ACTIVE" ? "Visible" : "Hidden"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button type="button" className={chip(!categoryFilter)} onClick={() => setCategoryFilter("")}>
            All categories
          </button>
          {categories.map((c) => (
            <button key={c} type="button" className={chip(categoryFilter === c)} onClick={() => setCategoryFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {!loading && !images.length ? (
        <div className="rounded-2xl px-5 py-16 text-center" style={panel}>
          <p className="text-sm font-semibold text-white">No photos here yet</p>
          <p className="mt-1 text-xs text-white/40">Pick a category above and upload a batch of dish photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
          {images.map((img) => {
            const busy = busyId === img.libraryImageId;
            return (
              <div key={img.libraryImageId} className={`overflow-hidden rounded-2xl ${img.isActive ? "" : "opacity-60"}`} style={panel}>
                <div className="relative aspect-square bg-black/40">
                  {img.readUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.readUrl} alt={img.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-white/30">No preview</div>
                  )}
                  {!img.isActive && (
                    <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white/80">Hidden</span>
                  )}
                  <span className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-violet-200">
                    {img.usageCount} {img.usageCount === 1 ? "dish" : "dishes"}
                  </span>
                </div>
                <div className="space-y-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{img.name}</p>
                    <p className="truncate text-xs text-white/45">
                      {img.category}
                      {img.foodType ? ` · ${FOOD_TYPES.find((f) => f.value === img.foodType)?.label || img.foodType}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" disabled={busy} onClick={() => openEdit(img)} className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70 hover:text-white disabled:opacity-40">
                      Edit
                    </button>
                    <button type="button" disabled={busy} onClick={() => void toggleActive(img)} className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70 hover:text-white disabled:opacity-40">
                      {img.isActive ? "Hide" : "Show"}
                    </button>
                    <button type="button" disabled={busy} onClick={() => void remove(img)} className="rounded-lg border border-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-40">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading && <p className="py-6 text-center text-xs font-black uppercase tracking-widest text-white/30">Loading…</p>}
      {!loading && page < totalPages && (
        <div className="text-center">
          <button type="button" onClick={() => void load(page + 1)} className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-white/70 hover:text-white">
            Load more
          </button>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4" onMouseDown={() => setEditing(null)}>
          <form
            onSubmit={saveEdit}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-md space-y-3 rounded-2xl p-6"
            style={{ ...panel, background: "#0d0d14" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white">Edit photo</h2>
              <button type="button" onClick={() => setEditing(null)} className="text-xl leading-none text-white/40 hover:text-white">
                ×
              </button>
            </div>
            {editing.readUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={editing.readUrl} alt="" className="h-40 w-full rounded-xl object-cover" />
            )}
            <label className="block space-y-1">
              <span className={labelCls}>Name</span>
              <input className={inputCls} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </label>
            <label className="block space-y-1">
              <span className={labelCls}>Category</span>
              <input list="menu-library-categories" className={inputCls} value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
            </label>
            <label className="block space-y-1">
              <span className={labelCls}>Food type</span>
              <select className={inputCls} value={editForm.foodType} onChange={(e) => setEditForm({ ...editForm, foodType: e.target.value as MenuFoodType | "" })}>
                {FOOD_TYPES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1">
              <span className={labelCls}>Search tags (comma separated)</span>
              <input className={inputCls} placeholder="paneer, tandoor, grilled" value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} />
            </label>
            <button
              type="submit"
              disabled={busyId === editing.libraryImageId}
              className="mt-2 h-10 w-full rounded-xl text-xs font-black uppercase tracking-wider text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
            >
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
