"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchApprovedVenuesThunk } from "@/features/admin/adminThunks";
import type {
  HostedEventDetail,
  HostedEventUpsertPayload,
} from "@/features/events/eventTypes";
import {
  formatEventScheduleLine,
  fromDatetimeLocalValue,
  slugifyTitle,
  toDatetimeLocalValue,
} from "@/lib/events/eventFormatters";
import { mediaApi } from "@/lib/api/mediaApi";
import { UPLOAD_KEYS } from "@/lib/constants/uploadKeys";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { EventAddressField, type EventAddressValue } from "@/components/events/EventAddressField";
import {
  EventBookingSettings,
  type EventBookingSettingsValue,
} from "@/components/events/EventBookingSettings";
import { EventMediaSection } from "@/components/events/EventMediaSection";
import { EventMediaArchiveSection } from "@/components/events/EventMediaArchiveSection";
import { EventShareModal } from "@/components/events/EventShareModal";
import type { EventTicketTypeFormValue } from "@/features/events/eventTypes";
import {
  EVENT_CATEGORIES,
  EVENT_TIMEZONES,
} from "@/lib/events/eventBookingConstants";
import {
  mapEventApiError,
  readApiErrorMessage,
  type EventFormFieldErrors,
  type EventFormFieldKey,
} from "@/lib/events/eventFormErrors";
import {
  hasEventFormErrors,
  validateEventFormForPublish,
  validateEventFormForSave,
} from "@/lib/events/eventFormValidation";
import { normalizePhoneNumber } from "@/lib/validation/phone";
import {
  DEFAULT_EVENT_BANNER_URL,
  DEFAULT_EVENT_GALLERY_URLS,
  withPlaceholderMedia,
} from "@/lib/events/eventPlaceholderMedia";

const LANGUAGE_OPTIONS = ["English", "Hindi", "Bengali", "Marathi", "Tamil", "Telugu"];
const DEFAULT_ORGANIZER = "Crowd and Cult Pvt Ltd";

export type EventFormValues = {
  venueId: number | "";
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  category: string;
  timezone: string;
  onlineMeetingUrl: string;
  startsAtLocal: string;
  endsAtLocal: string;
  bannerUrl: string;
  bannerPreview: string;
  galleryUrls: string[];
  galleryPreviews: string[];
  languages: string[];
  ticketAgeNote: string;
  layout: string;
  kidsPolicy: string;
  durationText: string;
  entryPolicy: string;
  seating: string;
  petPolicy: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  address: EventAddressValue;
  booking: EventBookingSettingsValue;
};

function emptyBookingSettings(): EventBookingSettingsValue {
  return {
    bookingEnabled: false,
    allowWaitlist: false,
    refundPolicy: "",
    currencyCode: "INR",
    attendeeFields: ["fullName", "email", "phone"],
    customQuestionsText: "",
    ticketTypes: [],
  };
}

function ticketFromDetail(t: HostedEventDetail["ticketTypes"][number]): EventTicketTypeFormValue {
  return {
    hostedEventTicketTypeId: t.hostedEventTicketTypeId,
    name: t.name,
    price: t.price,
    quantity: t.quantity,
    minPerBooking: t.minPerBooking,
    maxPerBooking: t.maxPerBooking,
    salesStartLocal: toDatetimeLocalValue(t.salesStartAt || ""),
    salesEndLocal: toDatetimeLocalValue(t.salesEndAt || ""),
    complimentaryDetails: t.complimentaryDetails || "",
  };
}

function emptyAddress(): EventAddressValue {
  return {
    formattedAddress: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    countryCode: "",
    placeId: "",
    latitude: null,
    longitude: null,
  };
}

function emptyForm(): EventFormValues {
  const now = new Date();
  const later = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  return {
    venueId: "",
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    category: "CONCERT",
    timezone: "Asia/Kolkata",
    onlineMeetingUrl: "",
    startsAtLocal: toDatetimeLocalValue(now.toISOString()),
    endsAtLocal: toDatetimeLocalValue(later.toISOString()),
    bannerUrl: DEFAULT_EVENT_BANNER_URL,
    bannerPreview: DEFAULT_EVENT_BANNER_URL,
    galleryUrls: [...DEFAULT_EVENT_GALLERY_URLS],
    galleryPreviews: [...DEFAULT_EVENT_GALLERY_URLS],
    languages: ["English"],
    ticketAgeNote: "Ticket needed for ages 18 and above",
    layout: "INDOOR",
    kidsPolicy: "NOT_ALLOWED",
    durationText: "",
    entryPolicy: "Entry allowed for ages 18 and above",
    seating: "BOTH",
    petPolicy: "PET_FRIENDLY",
    organizerName: DEFAULT_ORGANIZER,
    organizerEmail: "",
    organizerPhone: "",
    address: emptyAddress(),
    booking: emptyBookingSettings(),
  };
}

function fromDetail(d: HostedEventDetail): EventFormValues {
  return {
    venueId: d.venueId,
    title: d.title,
    slug: d.slug,
    subtitle: d.subtitle || "",
    description: d.description || "",
    category: d.category || "CONCERT",
    timezone: d.timezone || "Asia/Kolkata",
    onlineMeetingUrl: d.onlineMeetingUrl || "",
    startsAtLocal: toDatetimeLocalValue(d.startsAt),
    endsAtLocal: toDatetimeLocalValue(d.endsAt),
    bannerUrl: d.bannerUrl || DEFAULT_EVENT_BANNER_URL,
    bannerPreview: d.bannerReadUrl || d.bannerUrl || DEFAULT_EVENT_BANNER_URL,
    galleryUrls: d.gallery.length
      ? d.gallery.map((g) => g.url)
      : [...DEFAULT_EVENT_GALLERY_URLS],
    galleryPreviews: d.gallery.length
      ? d.gallery.map((g) => g.readUrl || g.url)
      : [...DEFAULT_EVENT_GALLERY_URLS],
    languages: d.languages?.length ? d.languages : ["English"],
    ticketAgeNote: d.ticketAgeNote || "",
    layout: d.layout || "INDOOR",
    kidsPolicy: d.kidsPolicy || "NOT_ALLOWED",
    durationText: d.durationText || "",
    entryPolicy: d.entryPolicy || "",
    seating: d.seating || "BOTH",
    petPolicy: d.petPolicy || "PET_FRIENDLY",
    organizerName: d.organizerName || DEFAULT_ORGANIZER,
    organizerEmail: d.organizerEmail || "",
    organizerPhone: d.organizerPhone || "",
    address: {
      formattedAddress: d.formattedAddress || "",
      addressLine1: d.addressLine1 || "",
      city: d.city || "",
      state: d.state || "",
      postalCode: d.postalCode || "",
      countryCode: d.countryCode || "",
      placeId: d.placeId || "",
      latitude: d.latitude ?? null,
      longitude: d.longitude ?? null,
    },
    booking: {
      bookingEnabled: Boolean(d.bookingEnabled),
      allowWaitlist: Boolean(d.allowWaitlist),
      refundPolicy: d.refundPolicy || "",
      currencyCode: d.currencyCode || "INR",
      attendeeFields: d.attendeeConfig?.fields?.length
        ? d.attendeeConfig.fields
        : ["fullName", "email", "phone"],
      customQuestionsText: (d.attendeeConfig?.customQuestions || []).join("\n"),
      ticketTypes: (d.ticketTypes || []).map(ticketFromDetail),
    },
  };
}

function toPayload(
  values: EventFormValues,
  opts?: { slugLocked?: boolean; publishedSlug?: string }
): HostedEventUpsertPayload {
  const slug = opts?.slugLocked && opts.publishedSlug
    ? opts.publishedSlug
    : values.slug.trim() || slugifyTitle(values.title) || undefined;

  return {
    venueId: Number(values.venueId),
    title: values.title.trim(),
    slug,
    subtitle: values.subtitle.trim() || undefined,
    description: values.description.trim() || undefined,
    category: values.category as HostedEventUpsertPayload["category"],
    timezone: values.timezone || undefined,
    onlineMeetingUrl: values.onlineMeetingUrl.trim() || undefined,
    startsAt: fromDatetimeLocalValue(values.startsAtLocal),
    endsAt: fromDatetimeLocalValue(values.endsAtLocal),
    bannerUrl: values.bannerUrl || undefined,
    languages: values.languages,
    ticketAgeNote: values.ticketAgeNote || undefined,
    layout: values.layout as HostedEventUpsertPayload["layout"],
    kidsPolicy: values.kidsPolicy as HostedEventUpsertPayload["kidsPolicy"],
    durationText: values.durationText || undefined,
    entryPolicy: values.entryPolicy || undefined,
    seating: values.seating as HostedEventUpsertPayload["seating"],
    petPolicy: values.petPolicy as HostedEventUpsertPayload["petPolicy"],
    galleryUrls: values.galleryUrls,
    organizerName: values.organizerName.trim() || DEFAULT_ORGANIZER,
    organizerEmail: values.organizerEmail.trim() || undefined,
    organizerPhone: values.organizerPhone.trim() || undefined,
    bookingEnabled: values.booking.bookingEnabled,
    allowWaitlist: values.booking.allowWaitlist,
    refundPolicy: values.booking.refundPolicy.trim() || undefined,
    currencyCode: values.booking.currencyCode || "INR",
    attendeeConfig: {
      fields: values.booking.attendeeFields,
      customQuestions: values.booking.customQuestionsText
        .split("\n")
        .map((q) => q.trim())
        .filter(Boolean),
    },
    ticketTypes: values.booking.bookingEnabled
      ? values.booking.ticketTypes.map((t, index) => ({
          hostedEventTicketTypeId: t.hostedEventTicketTypeId ?? undefined,
          name: t.name.trim(),
          price: Number(t.price) || 0,
          quantity: Number(t.quantity) || 0,
          minPerBooking: Number(t.minPerBooking) || 1,
          maxPerBooking: Number(t.maxPerBooking) || 10,
          salesStartAt: fromDatetimeLocalValue(t.salesStartLocal) || null,
          salesEndAt: fromDatetimeLocalValue(t.salesEndLocal) || null,
          complimentaryDetails: t.complimentaryDetails.trim() || null,
          sortOrder: index,
        }))
      : [],
    formattedAddress: values.address.formattedAddress || undefined,
    addressLine1: values.address.addressLine1 || undefined,
    city: values.address.city || undefined,
    state: values.address.state || undefined,
    postalCode: values.address.postalCode || undefined,
    countryCode: values.address.countryCode || undefined,
    placeId: values.address.placeId || undefined,
    latitude: values.address.latitude,
    longitude: values.address.longitude,
  };
}

type EventFormProps = {
  initial?: HostedEventDetail | null;
  onSave: (payload: HostedEventUpsertPayload) => Promise<void>;
  onPublish?: () => Promise<void>;
  onPreview?: () => void;
  onMediaUpdated?: (detail: HostedEventDetail) => void;
  saving?: boolean;
  publishing?: boolean;
};

const cardStyle = {
  background: "rgba(13,13,20,0.85)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const sectionStyle = (hasError?: boolean) => ({
  ...cardStyle,
  border: hasError ? "1px solid rgba(244,63,94,0.45)" : cardStyle.border,
});

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2">
      {message}
    </p>
  );
}

const inputCls =
  "w-full rounded-lg px-3 py-2 text-sm text-white bg-black/30 border border-white/10 focus:border-violet-500/50 focus:outline-none";

export function EventForm({
  initial,
  onSave,
  onPublish,
  onPreview,
  onMediaUpdated,
  saving,
  publishing,
}: EventFormProps) {
  const dispatch = useAppDispatch();
  const approvedVenues = useAppSelector((s) => s.admin.approvedVenues);
  const venuesStatus = useAppSelector((s) => s.admin.approvedVenuesStatus);

  const [values, setValues] = useState<EventFormValues>(() =>
    initial ? fromDetail(initial) : emptyForm()
  );
  const [fieldErrors, setFieldErrors] = useState<EventFormFieldErrors>({});

  useEffect(() => {
    if (venuesStatus === "idle") {
      void dispatch(fetchApprovedVenuesThunk({ force: true }));
    }
  }, [dispatch, venuesStatus]);

  useEffect(() => {
    if (initial) setValues(fromDetail(initial));
  }, [initial?.hostedEventId]);

  const selectedVenue = useMemo(
    () => approvedVenues.find((v) => v.venueId === Number(values.venueId)),
    [approvedVenues, values.venueId]
  );

  const schedulePreview = useMemo(() => {
    const startsAt = fromDatetimeLocalValue(values.startsAtLocal);
    const endsAt = fromDatetimeLocalValue(values.endsAtLocal);
    if (!startsAt || !endsAt) return "";
    return formatEventScheduleLine(startsAt, endsAt, selectedVenue || null, values.address);
  }, [values.startsAtLocal, values.endsAtLocal, selectedVenue, values.address]);

  const slugLocked = initial?.status === "PUBLISHED";

  const publicUrlSlug = useMemo(() => {
    if (slugLocked && initial?.slug) return initial.slug;
    return values.slug.trim() || slugifyTitle(values.title);
  }, [slugLocked, initial?.slug, values.slug, values.title]);

  const patch = (patchValues: Partial<EventFormValues>) => {
    setFieldErrors({});
    setValues((prev) => {
      const next = { ...prev, ...patchValues };
      if (patchValues.title != null && !slugLocked) {
        next.slug = slugifyTitle(patchValues.title);
      }
      return next;
    });
  };

  useEffect(() => {
    const order: EventFormFieldKey[] = [
      "general",
      "venue",
      "title",
      "address",
      "schedule",
      "banner",
      "organizer",
      "booking",
    ];
    const first = order.find((key) => fieldErrors[key]);
    if (first) {
      document.getElementById(`event-section-${first}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [fieldErrors]);

  const uploadBanner = useCallback(async (file: File) => {
    try {
      const res = await mediaApi.uploadFile(file, UPLOAD_KEYS.EVENT_BANNER);
      patch({ bannerUrl: res.url, bannerPreview: res.readUrl || res.url });
      toast.success("Banner uploaded");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Banner upload failed — placeholder image is still used.");
    }
  }, []);

  const resetBannerPlaceholder = useCallback(() => {
    patch({ bannerUrl: DEFAULT_EVENT_BANNER_URL, bannerPreview: DEFAULT_EVENT_BANNER_URL });
  }, []);

  const uploadGallery = useCallback(async (file: File) => {
    if (values.galleryUrls.length >= 5) {
      toast.error("Maximum 5 gallery images");
      return;
    }
    try {
      const res = await mediaApi.uploadFile(file, UPLOAD_KEYS.EVENT_GALLERY);
      patch({
        galleryUrls: [...values.galleryUrls, res.url],
        galleryPreviews: [...values.galleryPreviews, res.readUrl || res.url],
      });
      toast.success("Gallery image added");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gallery upload failed");
    }
  }, [values.galleryUrls, values.galleryPreviews]);

  const toggleLanguage = (lang: string) => {
    setValues((prev) => {
      const has = prev.languages.includes(lang);
      const languages = has
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages: languages.length ? languages : ["English"] };
    });
  };

  const buildPayload = () =>
    withPlaceholderMedia(toPayload(values, { slugLocked, publishedSlug: initial?.slug }));

  const applyValidationErrors = (errors: EventFormFieldErrors): boolean => {
    if (!hasEventFormErrors(errors)) return false;
    setFieldErrors(errors);
    const first = Object.values(errors).find(Boolean);
    if (first) toast.error(first);
    const sectionId: Record<EventFormFieldKey, string> = {
      general: "event-section-organizer",
      venue: "event-section-venue",
      title: "event-section-title",
      banner: "event-section-banner",
      address: "event-section-address",
      schedule: "event-section-schedule",
      organizer: "event-section-organizer",
      booking: "event-section-booking",
    };
    const key = (Object.keys(errors)[0] as EventFormFieldKey) || "general";
    document.getElementById(sectionId[key] || "event-section-organizer")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    return true;
  };

  const handleSave = async () => {
    const validationErrors = validateEventFormForSave(values);
    if (applyValidationErrors(validationErrors)) return;
    setFieldErrors({});
    try {
      await onSave(buildPayload());
    } catch (e: unknown) {
      const msg = readApiErrorMessage(e, "Save failed");
      setFieldErrors(mapEventApiError(msg));
      toast.error(msg);
    }
  };

  const handlePublish = async () => {
    const validationErrors = validateEventFormForPublish(values);
    if (applyValidationErrors(validationErrors)) return;
    setFieldErrors({});
    try {
      await onSave(buildPayload());
      if (onPublish) await onPublish();
    } catch (e: unknown) {
      const msg = readApiErrorMessage(e, "Publish failed");
      setFieldErrors(mapEventApiError(msg));
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <FieldError message={fieldErrors.general} />

      <section
        id="event-section-venue"
        className="rounded-2xl p-5 space-y-4"
        style={sectionStyle(Boolean(fieldErrors.venue))}
      >
        <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Venue</h2>
        <FieldError message={fieldErrors.venue} />
        <AdminSelect
          value={values.venueId ? String(values.venueId) : ""}
          placeholder="Select approved venue"
          onChange={(v) => patch({ venueId: v ? Number(v) : "" })}
          options={[
            { value: "", label: "Select approved venue" },
            ...approvedVenues.map((v) => ({
              value: String(v.venueId),
              label: `${v.businessName}${v.city ? ` — ${v.city}` : ""}`,
            })),
          ]}
        />
        {selectedVenue?.slug && (
          <Link
            href={`/venue/${selectedVenue.slug}`}
            target="_blank"
            className="text-[10px] font-bold uppercase tracking-wider text-violet-400 hover:text-violet-300"
          >
            View venue profile →
          </Link>
        )}
      </section>

      <section
        id="event-section-title"
        className="rounded-2xl p-5 space-y-4"
        style={sectionStyle(Boolean(fieldErrors.title))}
      >
        <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Event identity</h2>
        <FieldError message={fieldErrors.title} />
        <input
          className={`${inputCls} ${fieldErrors.title ? "border-rose-500/50" : ""}`}
          placeholder="Event title"
          value={values.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
        {values.title.trim() && (
          <p className="text-[11px] text-white/40 leading-relaxed">
            Public URL:{" "}
            <span className="text-violet-300/90 font-mono">/events/{publicUrlSlug || "…"}</span>
            {slugLocked ? (
              <span className="block text-[10px] text-white/30 mt-0.5">
                Locked while published — unpublish to change the URL.
              </span>
            ) : (
              <span className="block text-[10px] text-white/30 mt-0.5">
                Auto-generated from the title. You don&apos;t need to set this.
              </span>
            )}
          </p>
        )}
        <input
          className={inputCls}
          placeholder="Subtitle / tagline"
          value={values.subtitle}
          onChange={(e) => patch({ subtitle: e.target.value })}
        />
        <textarea
          className={`${inputCls} min-h-[100px] resize-y`}
          placeholder="Event description"
          value={values.description}
          onChange={(e) => patch({ description: e.target.value })}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminSelect
            value={values.category}
            onChange={(v) => patch({ category: v })}
            options={EVENT_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          />
          <AdminSelect
            value={values.timezone}
            onChange={(v) => patch({ timezone: v })}
            options={EVENT_TIMEZONES.map((tz) => ({ value: tz.value, label: tz.label }))}
          />
        </div>
        <input
          className={inputCls}
          placeholder="Online meeting link (optional, for virtual/hybrid events)"
          value={values.onlineMeetingUrl}
          onChange={(e) => patch({ onlineMeetingUrl: e.target.value })}
        />
      </section>

      <section
        id="event-section-address"
        className="rounded-2xl p-5 space-y-4"
        style={sectionStyle(Boolean(fieldErrors.address))}
      >
        <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Event location</h2>
        <FieldError message={fieldErrors.address} />
        <EventAddressField
          value={values.address}
          onChange={(addressPatch) => patch({ address: { ...values.address, ...addressPatch } })}
        />
        <p className="text-[10px] text-white/40">
          Search Google for an address, or click &quot;Enter address manually&quot; if search is unavailable.
        </p>
      </section>

      <section
        id="event-section-schedule"
        className="rounded-2xl p-5 space-y-4"
        style={sectionStyle(Boolean(fieldErrors.schedule))}
      >
        <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Schedule</h2>
        <FieldError message={fieldErrors.schedule} />
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Starts</span>
            <input type="datetime-local" className={inputCls} value={values.startsAtLocal} onChange={(e) => patch({ startsAtLocal: e.target.value })} />
          </label>
          <label className="block space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Ends</span>
            <input type="datetime-local" className={inputCls} value={values.endsAtLocal} onChange={(e) => patch({ endsAtLocal: e.target.value })} />
          </label>
        </div>
        {schedulePreview && (
          <p className="text-xs text-violet-300/80 leading-relaxed">{schedulePreview}</p>
        )}
      </section>

      <section
        id="event-section-banner"
        className="rounded-2xl p-5 space-y-4"
        style={sectionStyle(Boolean(fieldErrors.banner))}
      >
        <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Banner & gallery</h2>
        <EventMediaSection
          bannerPreview={values.bannerPreview}
          galleryPreviews={values.galleryPreviews}
          bannerError={fieldErrors.banner}
          onBannerUpload={(file) => void uploadBanner(file)}
          onBannerRemove={resetBannerPlaceholder}
          onGalleryUpload={(file) => void uploadGallery(file)}
          onGalleryRemove={(index) =>
            patch({
              galleryUrls: values.galleryUrls.filter((_, j) => j !== index),
              galleryPreviews: values.galleryPreviews.filter((_, j) => j !== index),
            })
          }
        />
      </section>

      <section className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">
          Audio &amp; video
        </h2>
        <EventMediaArchiveSection
          hostedEventId={initial?.hostedEventId}
          mediaAssets={initial?.mediaAssets}
          onUpdated={onMediaUpdated}
        />
      </section>

      <section className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Event information</h2>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
              style={{
                background: values.languages.includes(lang) ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${values.languages.includes(lang) ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.1)"}`,
                color: values.languages.includes(lang) ? "#C4B5FD" : "rgba(255,255,255,0.4)",
              }}
            >
              {lang}
            </button>
          ))}
        </div>
        <input className={inputCls} placeholder="Ticket / age note" value={values.ticketAgeNote} onChange={(e) => patch({ ticketAgeNote: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <AdminSelect
            value={values.layout}
            onChange={(v) => patch({ layout: v })}
            options={[
              { value: "INDOOR", label: "Indoor" },
              { value: "OUTDOOR", label: "Outdoor" },
              { value: "MIXED", label: "Mixed" },
            ]}
          />
          <AdminSelect
            value={values.kidsPolicy}
            onChange={(v) => patch({ kidsPolicy: v })}
            options={[
              { value: "ALLOWED", label: "Kids allowed" },
              { value: "NOT_ALLOWED", label: "Kids not allowed" },
            ]}
          />
          <AdminSelect
            value={values.seating}
            onChange={(v) => patch({ seating: v })}
            options={[
              { value: "SEATED", label: "Seated" },
              { value: "STANDING", label: "Standing" },
              { value: "BOTH", label: "Seated & standing" },
            ]}
          />
          <AdminSelect
            value={values.petPolicy}
            onChange={(v) => patch({ petPolicy: v })}
            options={[
              { value: "PET_FRIENDLY", label: "Pet friendly" },
              { value: "NOT_ALLOWED", label: "Pets not allowed" },
            ]}
          />
        </div>
        <input className={inputCls} placeholder="Duration override (optional)" value={values.durationText} onChange={(e) => patch({ durationText: e.target.value })} />
        <input className={inputCls} placeholder="Entry policy" value={values.entryPolicy} onChange={(e) => patch({ entryPolicy: e.target.value })} />
      </section>

      <section
        id="event-section-organizer"
        className="rounded-2xl p-5 space-y-3"
        style={sectionStyle(Boolean(fieldErrors.organizer))}
      >
        <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Organizer</h2>
        <FieldError message={fieldErrors.organizer} />
        <input
          className={inputCls}
          placeholder="Organizer name"
          value={values.organizerName}
          onChange={(e) => patch({ organizerName: e.target.value })}
          maxLength={120}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            className={`${inputCls} ${fieldErrors.organizer ? "border-rose-500/50" : ""}`}
            placeholder="Contact email"
            type="email"
            autoComplete="email"
            value={values.organizerEmail}
            onChange={(e) => patch({ organizerEmail: e.target.value.trimStart() })}
          />
          <input
            className={`${inputCls} ${fieldErrors.organizer ? "border-rose-500/50" : ""}`}
            placeholder="Contact phone (10-digit mobile)"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            value={values.organizerPhone}
            onChange={(e) => patch({ organizerPhone: normalizePhoneNumber(e.target.value) })}
          />
        </div>
        <p className="text-[10px] text-white/40">
          Email is required when ticket booking is enabled. Phone is optional — use a valid 10-digit
          Indian mobile if provided.
        </p>
      </section>

      <section
        id="event-section-booking"
        className="rounded-2xl p-5 space-y-4"
        style={sectionStyle(Boolean(fieldErrors.booking))}
      >
        <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">
          Ticket booking settings
        </h2>
        <FieldError message={fieldErrors.booking} />
        <EventBookingSettings
          value={values.booking}
          onChange={(bookingPatch) => patch({ booking: { ...values.booking, ...bookingPatch } })}
        />
      </section>

      <section
        className="rounded-2xl p-5 flex flex-wrap items-center justify-end gap-2"
        style={cardStyle}
      >
        {publicUrlSlug ? (
          <EventShareModal
            slug={publicUrlSlug}
            eventTitle={values.title || "Event"}
            trigger={
              <button
                type="button"
                className="rounded-lg px-4 py-2.5 text-[10px] font-black uppercase tracking-wider border border-purple-500/35 text-purple-200 hover:border-purple-500/55"
              >
                Event QR
              </button>
            }
          />
        ) : null}
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="rounded-lg px-4 py-2.5 text-[10px] font-black uppercase tracking-wider border border-white/15 text-white/70 hover:border-white/25"
          >
            Preview
          </button>
        )}
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="rounded-lg px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
        >
          {saving ? "Saving…" : "Save draft"}
        </button>
        {onPublish && (
          <button
            type="button"
            disabled={publishing || saving}
            onClick={() => void handlePublish()}
            className="rounded-lg px-5 py-2.5 text-[10px] font-black uppercase tracking-wider border border-emerald-500/40 text-emerald-300 disabled:opacity-50 hover:border-emerald-500/60"
          >
            {publishing ? "Publishing…" : "Publish"}
          </button>
        )}
      </section>
    </div>
  );
}
