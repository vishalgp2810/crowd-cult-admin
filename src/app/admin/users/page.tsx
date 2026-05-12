"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAdminUsersError } from "@/features/adminUsers/adminUsersSlice";
import { createAdminUsersThunk, fetchAdminUsersThunk } from "@/features/adminUsers/adminUsersThunks";
import type { CreateAdminUserInput } from "@/features/adminUsers/adminUsersTypes";
import { IconRefresh, IconUsers } from "@/components/admin/AdminIcons";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.adminUsers.users);
  const listStatus = useAppSelector((s) => s.adminUsers.listStatus);
  const createStatus = useAppSelector((s) => s.adminUsers.createStatus);
  const lastSkipped = useAppSelector((s) => s.adminUsers.lastSkipped);
  const error = useAppSelector((s) => s.adminUsers.error);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
    phoneNumber: "",
  });

  useEffect(() => {
    void dispatch(fetchAdminUsersThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    dispatch(clearAdminUsersError());
  }, [dispatch, error]);

  const isBusy = createStatus === "loading";

  const submitSingleCreate = async () => {
    const payload: CreateAdminUserInput = {
      fullName: form.fullName.trim(),
      emailAddress: form.emailAddress.trim(),
      password: form.password.trim(),
      phoneNumber: form.phoneNumber.trim() || undefined,
    };

    if (!payload.fullName || !payload.emailAddress || !payload.password) {
      toast.error("Name, email and password are required");
      return;
    }

    const result = await dispatch(createAdminUsersThunk([payload])).unwrap().catch(() => null);
    if (!result) return;

    const createdCount = result.created?.length ?? 0;
    const skippedCount = result.skipped?.length ?? 0;
    toast.success(`Created ${createdCount} admin user(s)${skippedCount ? `, skipped ${skippedCount}` : ""}`);

    if (createdCount > 0) {
      setShowCreateForm(false);
      setForm({ fullName: "", emailAddress: "", password: "", phoneNumber: "" });
    }
    await dispatch(fetchAdminUsersThunk());
  };

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(13,13,20,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.35)" }}
            >
              <IconUsers className="w-5 h-5 text-violet-300" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Admin user management</p>
              <p className="text-xs text-white/45">Create a new platform admin account</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider text-white"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
          >
            {showCreateForm ? "Close form" : "Create admin"}
          </button>
        </div>

        {showCreateForm && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Full name"
              className="rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}
            />
            <input
              value={form.emailAddress}
              onChange={(e) => setForm((prev) => ({ ...prev, emailAddress: e.target.value }))}
              placeholder="Email address"
              className="rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Password"
              className="rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}
            />
            <input
              value={form.phoneNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="Phone number (optional)"
              className="rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)" }}
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={submitSingleCreate}
                disabled={isBusy}
                className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
              >
                {isBusy ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}
      </div>

      {!!lastSkipped.length && (
        <div className="rounded-2xl p-4" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <p className="text-xs font-bold text-red-300 mb-2">Skipped rows</p>
          <div className="space-y-1">
            {lastSkipped.map((item, idx) => (
              <p key={`${item.emailAddress || "unknown"}-${idx}`} className="text-xs text-red-200/85">
                {(item.emailAddress || "Unknown email")}: {item.reason}
              </p>
            ))}
          </div>
        </div>
      )}

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(13,13,20,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
          <p className="text-sm font-black text-white">Created admin users ({users.length})</p>
          <button
            type="button"
            onClick={() => void dispatch(fetchAdminUsersThunk())}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/50 hover:text-white/80"
          >
            <IconRefresh className={`w-3.5 h-3.5 ${listStatus === "loading" ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-white/35">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId} className="border-t border-white/[0.06] text-sm text-white/85">
                  <td className="px-4 py-3">{u.fullName}</td>
                  <td className="px-4 py-3">{u.emailAddress}</td>
                  <td className="px-4 py-3">{u.phoneNumber || "-"}</td>
                  <td className="px-4 py-3">{u.role?.roleCode || "-"}</td>
                  <td className="px-4 py-3 text-white/55">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
              {listStatus === "succeeded" && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-white/35">
                    No admin users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

