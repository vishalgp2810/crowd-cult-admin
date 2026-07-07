export const EVENT_CATEGORIES = [
  { value: "CONCERT", label: "Concert" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "FESTIVAL", label: "Festival" },
  { value: "COMEDY", label: "Comedy" },
  { value: "THEATRE", label: "Theatre" },
  { value: "SPORTS", label: "Sports" },
  { value: "OTHER", label: "Other" },
] as const;

export const EVENT_TIMEZONES = [
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "UTC", label: "UTC" },
] as const;

export const ATTENDEE_FIELD_OPTIONS = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email address" },
  { key: "phone", label: "Phone number" },
  { key: "company", label: "Company name" },
] as const;

export const CURRENCY_OPTIONS = [{ value: "INR", label: "INR — Indian Rupee" }] as const;
