/** Strip to digits only, max 10 (Indian mobile). */
export function normalizePhoneNumber(value: string | null | undefined): string {
  return String(value ?? "").replace(/\D/g, "").slice(0, 10);
}

/** Returns an error message, or null if the value is empty or valid. */
export function getPhoneNumberError(value: string | null | undefined): string | null {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;

  const digitsOnly = normalizePhoneNumber(trimmed);

  if (digitsOnly.length !== 10) {
    return "Enter a valid 10-digit mobile number";
  }

  if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
    return "Mobile number must start with 6, 7, 8, or 9";
  }

  return null;
}
