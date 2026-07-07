import type { EventBookingSettingsValue } from "@/components/events/EventBookingSettings";
import { getPhoneNumberError, normalizePhoneNumber } from "@/lib/validation/phone";
import type { EventFormFieldErrors } from "@/lib/events/eventFormErrors";

export const EVENT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateOrganizerEmail(email: string, required: boolean): string | null {
  const trimmed = String(email || "").trim();
  if (!trimmed) {
    return required ? "Organizer email is required when ticket booking is enabled" : null;
  }
  if (trimmed.length > 100) return "Email is too long (max 100 characters)";
  if (!EVENT_EMAIL_RE.test(trimmed)) return "Enter a valid email address";
  return null;
}

export function validateOrganizerPhone(phone: string): string | null {
  const trimmed = String(phone || "").trim();
  if (!trimmed) return null;
  return getPhoneNumberError(normalizePhoneNumber(trimmed));
}

export function validateTicketTypes(booking: EventBookingSettingsValue): string | null {
  if (!booking.bookingEnabled) return null;
  if (!booking.ticketTypes.length) {
    return "Add at least one ticket type when booking is enabled";
  }
  for (let i = 0; i < booking.ticketTypes.length; i += 1) {
    const t = booking.ticketTypes[i];
    const label = t.name.trim() || `Ticket type ${i + 1}`;
    if (!t.name.trim()) return "Each ticket type needs a name";
    if (t.price < 0) return `${label}: price cannot be negative`;
    if (!Number.isFinite(t.quantity) || t.quantity <= 0) {
      return `${label}: quantity must be greater than 0`;
    }
    if (t.minPerBooking < 1 || t.maxPerBooking < 1 || t.minPerBooking > t.maxPerBooking) {
      return `${label}: min/max per booking is invalid`;
    }
  }
  return null;
}

export type EventFormValidationInput = {
  title: string;
  venueId?: number | "";
  organizerEmail: string;
  organizerPhone: string;
  booking: EventBookingSettingsValue;
};

export function validateEventFormForPublish(values: EventFormValidationInput): EventFormFieldErrors {
  const errors: EventFormFieldErrors = {};

  if (!values.venueId) errors.venue = "Venue is required";
  if (!values.title.trim()) errors.title = "Title is required";

  const organizerMessages: string[] = [];
  const emailErr = validateOrganizerEmail(values.organizerEmail, values.booking.bookingEnabled);
  if (emailErr) organizerMessages.push(emailErr);
  const phoneErr = validateOrganizerPhone(values.organizerPhone);
  if (phoneErr) organizerMessages.push(phoneErr);
  if (organizerMessages.length) errors.organizer = organizerMessages.join(" ");

  const bookingErr = validateTicketTypes(values.booking);
  if (bookingErr) errors.booking = bookingErr;

  return errors;
}

export function validateEventFormForSave(values: EventFormValidationInput): EventFormFieldErrors {
  return validateEventFormForPublish(values);
}

export function hasEventFormErrors(errors: EventFormFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
