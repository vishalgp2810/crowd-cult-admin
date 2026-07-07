"use client";

import React from "react";

type NumericInputProps = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
  zeroAsEmpty?: boolean;
  decimal?: boolean;
  placeholder?: string;
  onBlur?: () => void;
};

export function NumericInput({
  value,
  onChange,
  className,
  min = 0,
  max,
  zeroAsEmpty = false,
  decimal = false,
  placeholder,
  onBlur,
}: NumericInputProps) {
  const display =
    zeroAsEmpty && value === 0 ? "" : decimal ? String(value) : String(Math.trunc(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();

    if (raw === "") {
      onChange(0);
      return;
    }

    if (decimal) {
      if (!/^\d*\.?\d*$/.test(raw)) return;
      const num = Number(raw);
      if (!Number.isFinite(num)) return;
      if (num < min) return;
      if (max != null && num > max) return;
      onChange(num);
      return;
    }

    if (!/^\d+$/.test(raw)) return;
    const num = parseInt(raw, 10);
    if (!Number.isFinite(num)) return;
    if (num < min) return;
    if (max != null && num > max) return;
    onChange(num);
  };

  return (
    <input
      type="text"
      inputMode={decimal ? "decimal" : "numeric"}
      className={className}
      value={display}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={onBlur}
    />
  );
}
