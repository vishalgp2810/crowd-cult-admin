"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { EventForm } from "@/components/events/EventForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetEventDetail } from "@/features/events/eventsSlice";
import {
  fetchEventByIdThunk,
  publishEventThunk,
  updateEventThunk,
} from "@/features/events/eventsThunks";
import type { HostedEventUpsertPayload } from "@/features/events/eventTypes";

export default function AdminEditEventPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const eventId = Number(params.eventId);
  const { detail, detailStatus, saveStatus, publishStatus } = useAppSelector((s) => s.events);

  useEffect(() => {
    if (Number.isFinite(eventId)) {
      void dispatch(fetchEventByIdThunk(eventId));
    }
    return () => {
      dispatch(resetEventDetail());
    };
  }, [dispatch, eventId]);

  const onSave = async (payload: HostedEventUpsertPayload) => {
    await dispatch(updateEventThunk({ hostedEventId: eventId, payload })).unwrap();
    toast.success("Event saved");
  };

  const onPublish = async () => {
    await dispatch(publishEventThunk(eventId)).unwrap();
    toast.success("Event published");
  };

  if (detailStatus === "loading" || !detail) {
    return (
      <p className="text-center text-xs font-black uppercase tracking-widest text-white/30 py-12">
        Loading event…
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3"
        style={{
          background: "rgba(13,13,20,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <h1 className="text-lg font-black uppercase tracking-wide text-white">Edit event</h1>
          <p className="text-sm text-white/45 mt-1">{detail.title}</p>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-violet-300">
          {detail.status}
        </span>
      </div>
      <EventForm
        initial={detail}
        onSave={onSave}
        onPublish={detail.status === "DRAFT" ? onPublish : undefined}
        onPreview={() => router.push(`/admin/events/${eventId}/preview`)}
        onMediaUpdated={() => void dispatch(fetchEventByIdThunk(eventId))}
        saving={saveStatus === "loading"}
        publishing={publishStatus === "loading"}
      />
    </div>
  );
}
