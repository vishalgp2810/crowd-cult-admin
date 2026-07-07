"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { EventPreviewView } from "@/components/events/EventPreviewView";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetEventDetail } from "@/features/events/eventsSlice";
import { fetchEventByIdThunk } from "@/features/events/eventsThunks";

export default function AdminEventPreviewPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const eventId = Number(params.eventId);
  const { detail, detailStatus } = useAppSelector((s) => s.events);

  useEffect(() => {
    if (Number.isFinite(eventId)) {
      void dispatch(fetchEventByIdThunk(eventId));
    }
    return () => {
      dispatch(resetEventDetail());
    };
  }, [dispatch, eventId]);

  if (detailStatus === "loading" || !detail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading preview…</p>
      </div>
    );
  }

  return (
    <EventPreviewView
      event={detail}
      editHref={`/admin/events/${eventId}/edit`}
      backHref={detail.status === "PENDING_REVIEW" ? "/admin/requests" : "/admin/events"}
      showReviewActions={detail.status === "PENDING_REVIEW"}
    />
  );
}
