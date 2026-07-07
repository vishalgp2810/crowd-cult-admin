/**
 * Centralized currency configuration for Crowd&Cult (India launch).
 *
 * To switch currencies later (e.g. multi-region rollout), update the three
 * constants below and `formatCurrency` will pick it up everywhere.
 */
export const CURRENCY_SYMBOL = "₹";
export const CURRENCY_CODE = "INR";
export const CURRENCY_LOCALE = "en-IN";

const INTEGER_FORMATTER = new Intl.NumberFormat(CURRENCY_LOCALE, {
  maximumFractionDigits: 0,
});

const DECIMAL_FORMATTER = new Intl.NumberFormat(CURRENCY_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Numeric = number | string | null | undefined;

const toNumber = (value: Numeric): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Format a numeric value as a localized money string (e.g. "₹1,00,000" or "₹1,000.50").
 */
export const formatCurrency = (
  value: Numeric,
  options: { decimals?: 0 | 2 } = {}
): string => {
  const n = toNumber(value);
  const formatter = options.decimals === 2 ? DECIMAL_FORMATTER : INTEGER_FORMATTER;
  return `${CURRENCY_SYMBOL}${formatter.format(n)}`;
};

/**
 * Same as `formatCurrency` but returns just the number portion (no symbol).
 */
export const formatAmount = (
  value: Numeric,
  options: { decimals?: 0 | 2 } = {}
): string => {
  const n = toNumber(value);
  const formatter = options.decimals === 2 ? DECIMAL_FORMATTER : INTEGER_FORMATTER;
  return formatter.format(n);
};
