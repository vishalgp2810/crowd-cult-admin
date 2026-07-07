import { isEventPast } from "@/lib/events/eventFormatters";
import type { HostedEventStatus } from "@/features/events/eventTypes";

export function EventStatusChip({
  status,
  endsAt,
}: {
  status: HostedEventStatus;
  endsAt: string;
}) {
  const past = isEventPast(endsAt, status);
  const isPublished = status === "PUBLISHED";
  const isPendingReview = status === "PENDING_REVIEW";

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span
        className="inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
        style={{
          background: isPublished
            ? "rgba(124,58,237,0.15)"
            : isPendingReview
              ? "rgba(245,158,11,0.12)"
              : "rgba(255,255,255,0.06)",
          border: `1px solid ${
            isPublished
              ? "rgba(124,58,237,0.35)"
              : isPendingReview
                ? "rgba(245,158,11,0.3)"
                : "rgba(255,255,255,0.12)"
          }`,
          color: isPublished ? "#C4B5FD" : isPendingReview ? "#FCD34D" : "rgba(255,255,255,0.5)",
        }}
      >
        {isPendingReview ? "Pending review" : status}
      </span>
      {past && (
        <span
          className="inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest"
          style={{
            background: "rgba(148,163,184,0.12)",
            border: "1px solid rgba(148,163,184,0.25)",
            color: "#94A3B8",
          }}
        >
          Past
        </span>
      )}
    </div>
  );
}
