"use client";

import { useEffect, useRef, useState } from "react";

export type AdminSelectOption = {
  value: string;
  label: string;
};

type AdminSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  placeholder?: string;
  className?: string;
};

export function AdminSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className = "",
}: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between gap-2 text-white bg-black/30 border border-white/10 hover:border-violet-500/30 focus:border-violet-500/50 focus:outline-none transition-colors"
      >
        <span className={selected ? "text-white truncate" : "text-white/40 truncate"}>
          {selected?.label || placeholder}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/10 py-1 max-h-56 overflow-auto shadow-2xl"
          style={{
            background: "rgba(18,18,28,0.98)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(124,58,237,0.08)",
          }}
        >
          {options.map((opt) => {
            const isActive = opt.value === value;
            return (
              <li key={opt.value || "__empty"} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm transition-colors"
                  style={{
                    background: isActive ? "rgba(124,58,237,0.22)" : "transparent",
                    color: isActive ? "#E9D5FF" : "rgba(255,255,255,0.82)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
