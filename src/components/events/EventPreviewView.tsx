"use client";

import { useState } from "react";
import Link from "next/link";
import type { HostedEventDetail } from "@/features/events/eventTypes";
import { formatEventScheduleLine } from "@/lib/events/eventFormatters";
import { EventReviewActions } from "@/components/admin/EventReviewActions";

const INFO_ROWS: Array<{
  key: keyof HostedEventDetail | "duration";
  label: (e: HostedEventDetail) => string;
}> = [
  {
    key: "languages",
    label: (e) =>
      e.languages?.length
        ? `Event will be in ${e.languages.join(", ")}`
        : "Languages not specified",
  },
  {
    key: "ticketAgeNote",
    label: (e) => e.ticketAgeNote || "Ticket requirements not specified",
  },
  {
    key: "layout",
    label: (e) => `Layout ${e.layout || "—"}`,
  },
  {
    key: "kidsPolicy",
    label: (e) => (e.kidsPolicy === "NOT_ALLOWED" ? "Kids not allowed" : "Kids allowed"),
  },
  {
    key: "duration",
    label: (e) => `Duration ${e.durationDisplay || e.durationText || "—"}`,
  },
  {
    key: "entryPolicy",
    label: (e) => e.entryPolicy || "Entry policy not specified",
  },
  {
    key: "seating",
    label: (e) => {
      const map: Record<string, string> = {
        SEATED: "Seated",
        STANDING: "Standing",
        BOTH: "Seated & Standing",
      };
      return `Seating Arrangement ${map[e.seating || ""] || "—"}`;
    },
  },
  {
    key: "petPolicy",
    label: (e) => (e.petPolicy === "PET_FRIENDLY" ? "Pet friendly" : "Pets not allowed"),
  },
];

export function EventPreviewView({
  event,
  editHref,
  backHref = "/admin/events",
  showReviewActions = false,
}: {
  event: HostedEventDetail;
  editHref: string;
  backHref?: string;
  showReviewActions?: boolean;
}) {
  const [slide, setSlide] = useState(0);
  const images = [
    event.bannerReadUrl || event.bannerUrl,
    ...event.gallery.map((g) => g.readUrl || g.url),
  ].filter(Boolean) as string[];

  const scheduleLine = formatEventScheduleLine(event.startsAt, event.endsAt, event.venue, event);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href={backHref} className="text-sm font-semibold text-violet-700 hover:text-violet-900">
            ← Back
          </Link>
          <Link
            href={editHref}
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            Edit
          </Link>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 py-1 rounded-full border border-gray-200">
          Admin preview
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 leading-tight">
            {event.title}
            {event.subtitle ? ` | ${event.subtitle}` : ""}
          </h1>
          {scheduleLine && (
            <p className="text-sm text-violet-800/90 font-medium">{scheduleLine}</p>
          )}
        </header>

        {images.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl">
            <div className="flex items-center justify-center gap-2">
              {images.length > 1 && (
                <button
                  type="button"
                  className="absolute left-2 z-10 w-10 h-10 rounded-full bg-black/30 text-white text-xl"
                  onClick={() => setSlide((s) => (s - 1 + images.length) % images.length)}
                >
                  ‹
                </button>
              )}
              <img
                src={images[slide]}
                alt=""
                className="w-full max-h-[420px] object-cover rounded-2xl shadow-lg"
              />
              {images.length > 1 && (
                <button
                  type="button"
                  className="absolute right-2 z-10 w-10 h-10 rounded-full bg-black/30 text-white text-xl"
                  onClick={() => setSlide((s) => (s + 1) % images.length)}
                >
                  ›
                </button>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`w-2 h-2 rounded-full ${i === slide ? "bg-violet-600" : "bg-gray-300"}`}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <section className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {INFO_ROWS.map((row) => (
            <div key={row.key} className="flex gap-3 items-start">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs shrink-0">
                •
              </span>
              <p className="text-sm text-gray-700 leading-snug">{row.label(event)}</p>
            </div>
          ))}
        </section>

        {event.description && (
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-950">About</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </section>
        )}

        {event.bookingEnabled && (
          <section className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
            <h2 className="text-lg font-bold text-gray-950">Ticket booking settings</h2>
            <p className="text-sm text-gray-700">
              Booking enabled · {event.currencyCode}
              {event.allowWaitlist ? " · Waitlist on" : ""}
            </p>
            {event.ticketTypes?.length > 0 && (
              <ul className="space-y-2">
                {event.ticketTypes.map((t) => (
                  <li
                    key={t.hostedEventTicketTypeId}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-800 border-b border-violet-100 pb-2 last:border-0"
                  >
                    <span className="font-semibold">{t.name}</span>
                    <span>
                      {event.currencyCode} {t.price.toLocaleString("en-IN")} · {t.quantity} qty
                    </span>
                    {t.complimentaryDetails?.trim() && (
                      <p className="w-full text-xs text-emerald-700 mt-1 whitespace-pre-wrap">
                        <span className="font-semibold">Complimentary:</span>{" "}
                        {t.complimentaryDetails.trim()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {event.refundPolicy && (
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Refund policy:</span> {event.refundPolicy}
              </p>
            )}
            <p className="text-[11px] text-violet-700 font-medium">
              Checkout not wired yet — settings saved for when Book Ticket goes live.
            </p>
          </section>
        )}

        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-gray-950">Organized by</h2>
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-gray-50">
            <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-black text-lg">
              CC
            </div>
            <div>
              <p className="text-xs text-gray-500">1 events</p>
              <p className="font-bold text-gray-950">{event.organizerName}</p>
              {(event.organizerEmail || event.organizerPhone) && (
                <p className="text-xs text-gray-500 mt-1">
                  {[event.organizerEmail, event.organizerPhone].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      {(showReviewActions || event.status === "PENDING_REVIEW") && (
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/95 backdrop-blur px-4 py-4">
          <div className="max-w-3xl mx-auto space-y-3">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-amber-700">
              Pending venue review
            </p>
            <EventReviewActions event={event} layout="footer" />
          </div>
        </div>
      )}
    </div>
  );
}
