import type { HostedEventAddress, HostedEventVenueSummary } from "@/features/events/eventTypes";

const fmtDatePart = (d: Date) =>
  d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

const fmtTimePart = (d: Date) =>
  d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

export function formatEventLocationLabel(
  venue?: HostedEventVenueSummary | null,
  address?: HostedEventAddress | null
) {
  if (address?.formattedAddress?.trim()) return address.formattedAddress.trim();
  if (address?.addressLine1?.trim()) {
    const parts = [address.addressLine1, address.city].filter(Boolean);
    if (parts.length) return parts.join(", ");
  }
  if (!venue) return "";
  return [venue.businessName, venue.city].filter(Boolean).join(", ");
}

export function formatEventScheduleLine(
  startsAt: string,
  endsAt: string,
  venue?: HostedEventVenueSummary | null,
  address?: HostedEventAddress | null
) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";

  const datePart = `${fmtDatePart(start)}, ${fmtTimePart(start)} – ${fmtDatePart(end)}, ${fmtTimePart(end)}`;
  const place = formatEventLocationLabel(venue, address);
  return place ? `${datePart} | ${place}` : datePart;
}

export function toDatetimeLocalValue(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

export function isEventPast(endsAt: string, status: string) {
  return status === "PUBLISHED" && new Date(endsAt).getTime() < Date.now();
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
