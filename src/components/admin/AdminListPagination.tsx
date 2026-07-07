"use client";

type AdminListPaginationProps = {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (pageIndex: number) => void;
  disabled?: boolean;
};

export function AdminListPagination({
  pageIndex,
  pageSize,
  totalCount,
  onPageChange,
  disabled = false,
}: AdminListPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(pageIndex, totalPages - 1);
  const from = totalCount === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(totalCount, (safePage + 1) * pageSize);

  return (
    <div
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
    >
      <p className="text-[11px] text-white/40 tabular-nums">
        Showing <span className="text-white/70 font-semibold">{from}</span>–
        <span className="text-white/70 font-semibold">{to}</span> of{" "}
        <span className="text-white/70 font-semibold">{totalCount}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || safePage <= 0}
          onClick={() => onPageChange(safePage - 1)}
          className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          Previous
        </button>
        <span className="text-[11px] text-white/50 tabular-nums px-2">
          Page {safePage + 1} / {totalPages}
        </span>
        <button
          type="button"
          disabled={disabled || safePage >= totalPages - 1}
          onClick={() => onPageChange(safePage + 1)}
          className="rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export const ADMIN_USERS_PAGE_SIZE = 20;
