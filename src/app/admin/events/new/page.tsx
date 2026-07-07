"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EventForm } from "@/components/events/EventForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createEventThunk } from "@/features/events/eventsThunks";
import type { HostedEventUpsertPayload } from "@/features/events/eventTypes";

export default function AdminNewEventPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const saveStatus = useAppSelector((s) => s.events.saveStatus);

  const onSave = async (payload: HostedEventUpsertPayload) => {
    const created = await dispatch(createEventThunk(payload)).unwrap();
    toast.success("Event draft saved");
    router.push(`/admin/events/${created.hostedEventId}/edit`);
  };

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(13,13,20,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h1 className="text-lg font-black uppercase tracking-wide text-white">Create event</h1>
        <p className="text-sm text-white/45 mt-1">Save a draft before preview or publish.</p>
      </div>
      <EventForm
        onSave={onSave}
        saving={saveStatus === "loading"}
        onPreview={() => toast.error("Save draft first to preview")}
      />
    </div>
  );
}
