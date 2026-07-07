export type EventFormFieldKey =
  | "general"
  | "venue"
  | "title"
  | "banner"
  | "address"
  | "schedule"
  | "organizer"
  | "booking";

export type EventFormFieldErrors = Partial<Record<EventFormFieldKey, string>>;

export function readApiErrorMessage(error: unknown, fallback = "Request failed"): string {
  if (typeof error === "string" && error.trim()) return error;
  if (typeof error === "object" && error && "response" in error) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

export function mapEventApiError(message: string): EventFormFieldErrors {
  const m = message.toLowerCase();
  const errors: EventFormFieldErrors = {};

  if (m.includes("banner")) errors.banner = message;
  if (m.includes("address") || m.includes("coordinate") || m.includes("location")) {
    errors.address = message;
  }
  if (m.includes("organizer email") || m.includes("organizer phone") || m.includes("email address") || m.includes("mobile number")) {
    errors.organizer = message;
  }
  if (m.includes("ticket")) errors.booking = message;
  if (m.includes("venue")) errors.venue = message;
  if (m.includes("title")) errors.title = message;
  if (
    m.includes("start") ||
    m.includes("end") ||
    m.includes("schedule") ||
    m.includes("date")
  ) {
    errors.schedule = message;
  }

  if (!Object.keys(errors).length) errors.general = message;
  return errors;
}

export function isValidImageUrl(value: string): boolean {
  const trimmed = String(value || "").trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
