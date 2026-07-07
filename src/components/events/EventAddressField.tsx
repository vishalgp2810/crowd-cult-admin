"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { commonApi, type AddressAutocompleteItem } from "@/lib/api/commonApi";

function readApiError(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (err instanceof Error && err.message.trim()) return err.message;
  return fallback;
}

export type EventAddressValue = {
  formattedAddress: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  placeId: string;
  latitude: number | null;
  longitude: number | null;
};

type EventAddressFieldProps = {
  value: EventAddressValue;
  onChange: (patch: Partial<EventAddressValue>) => void;
};

const inputCls =
  "w-full rounded-lg px-3 py-2 text-sm text-white bg-black/30 border border-white/10 focus:border-violet-500/50 focus:outline-none";

const labelCls = "block text-[9px] font-black uppercase tracking-widest text-white/30 mb-1.5";

function hasSavedAddress(value: EventAddressValue) {
  return Boolean(value.formattedAddress?.trim() || value.addressLine1?.trim());
}

export function EventAddressField({ value, onChange }: EventAddressFieldProps) {
  const [query, setQuery] = useState(value.formattedAddress || value.addressLine1 || "");
  const [suggestions, setSuggestions] = useState<AddressAutocompleteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manualEdit, setManualEdit] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(() => hasSavedAddress(value) && !value.placeId);

  useEffect(() => {
    setQuery(value.formattedAddress || value.addressLine1 || "");
    if (hasSavedAddress(value) && !value.placeId) {
      setShowManual(true);
    }
  }, [value.formattedAddress, value.addressLine1, value.placeId]);

  const applyManualAddress = useCallback(
    (line: string, extras?: Partial<EventAddressValue>) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      onChange({
        formattedAddress: trimmed,
        addressLine1: trimmed,
        placeId: "",
        latitude: extras?.latitude ?? value.latitude,
        longitude: extras?.longitude ?? value.longitude,
        city: extras?.city ?? value.city,
        state: extras?.state ?? value.state,
        postalCode: extras?.postalCode ?? value.postalCode,
        countryCode: extras?.countryCode ?? value.countryCode,
      });
    },
    [onChange, value.city, value.countryCode, value.latitude, value.longitude, value.postalCode, value.state]
  );

  const loadSuggestions = useCallback(async (text: string) => {
    const trimmed = String(text || "").trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setSearchError(null);
      return;
    }
    setLoading(true);
    setSearchError(null);
    try {
      const result = await commonApi.autocompleteAddress(trimmed);
      const items = result.suggestions || [];
      setSuggestions(items);
      if (!items.length) {
        setSearchError("No matches from search. Enter the address manually below.");
      }
    } catch (err) {
      setSuggestions([]);
      setSearchError(
        readApiError(
          err,
          "Address search unavailable. Enter the address manually below."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!focused || !manualEdit || showManual) return;
    const timer = setTimeout(() => void loadSuggestions(query), 400);
    return () => clearTimeout(timer);
  }, [query, focused, manualEdit, showManual, loadSuggestions]);

  const applySelection = async (item: AddressAutocompleteItem) => {
    try {
      const result = await commonApi.getAddressDetails(item.placeId);
      const place = result.place;
      const formatted = place.formattedAddress || item.description || "";
      onChange({
        formattedAddress: formatted,
        addressLine1: place.addressLine1 || formatted,
        city: place.city || "",
        state: place.state || "",
        postalCode: place.postalCode || "",
        countryCode: place.countryCode || "",
        placeId: place.placeId || item.placeId,
        latitude: place.latitude,
        longitude: place.longitude,
      });
      setQuery(formatted);
      setSuggestions([]);
      setManualEdit(false);
      setFocused(false);
      setShowManual(false);
    } catch {
      toast.error("Could not load address details — use manual entry below");
      setShowManual(true);
    }
  };

  const commitManualFromFields = () => {
    const line = (value.addressLine1 || query).trim();
    if (!line) {
      toast.error("Enter a street address or full address line");
      return;
    }
    applyManualAddress(line, {
      city: value.city,
      state: value.state,
      postalCode: value.postalCode,
      countryCode: value.countryCode || "IN",
      latitude: value.latitude,
      longitude: value.longitude,
    });
    setQuery(line);
    toast.success("Manual address saved");
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setFocused(false);
      const trimmed = query.trim();
      if (!trimmed || value.placeId) return;
      if (!hasSavedAddress(value) || value.addressLine1 !== trimmed) {
        applyManualAddress(trimmed, {
          city: value.city,
          state: value.state,
          postalCode: value.postalCode,
          countryCode: value.countryCode || "IN",
        });
      }
    }, 150);
  };

  const parseCoord = (raw: string) => {
    const n = Number(raw);
    return raw.trim() === "" || !Number.isFinite(n) ? null : n;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className={labelCls}>Search address (Google)</label>
        <input
          className={inputCls}
          placeholder="Search address — or skip and enter manually"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setManualEdit(true);
            setSearchError(null);
            if (!e.target.value.trim()) {
              onChange({
                formattedAddress: "",
                addressLine1: "",
                city: "",
                state: "",
                postalCode: "",
                countryCode: "",
                placeId: "",
                latitude: null,
                longitude: null,
              });
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={handleSearchBlur}
        />
        {focused && !showManual && (loading || suggestions.length > 0 || searchError) && (
          <ul
            className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/10 py-1 max-h-52 overflow-auto shadow-2xl"
            style={{ background: "rgba(18,18,28,0.98)" }}
          >
            {loading && <li className="px-3 py-2 text-xs text-white/40">Searching…</li>}
            {!loading && searchError && (
              <li className="px-3 py-2.5 text-xs text-amber-300/90 leading-relaxed">{searchError}</li>
            )}
            {!loading &&
              !searchError &&
              suggestions.map((item) => (
                <li key={item.placeId}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2.5 text-sm text-white/85 hover:bg-white/[0.06]"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => void applySelection(item)}
                  >
                    {item.description}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowManual((v) => !v)}
          className="text-[10px] font-black uppercase tracking-wider text-violet-400 hover:text-violet-300"
        >
          {showManual ? "Hide manual entry" : "Enter address manually"}
        </button>
        {hasSavedAddress(value) && (
          <span className="text-[10px] text-emerald-400/80 font-semibold">Address saved</span>
        )}
      </div>

      {showManual && (
        <div className="rounded-xl border border-white/10 p-4 space-y-3 bg-black/20">
          <p className="text-[10px] text-white/45 leading-relaxed">
            Use this when Google search is unavailable. City and state help visitors find your event.
          </p>
          <label className="block space-y-1">
            <span className={labelCls}>Street / full address</span>
            <input
              className={inputCls}
              placeholder="e.g. 123 MG Road, Koregaon Park"
              value={value.addressLine1 || query}
              onChange={(e) => {
                setQuery(e.target.value);
                onChange({ addressLine1: e.target.value, formattedAddress: e.target.value });
              }}
            />
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className={labelCls}>City</span>
              <input
                className={inputCls}
                placeholder="Pune"
                value={value.city}
                onChange={(e) => onChange({ city: e.target.value })}
              />
            </label>
            <label className="block space-y-1">
              <span className={labelCls}>State</span>
              <input
                className={inputCls}
                placeholder="Maharashtra"
                value={value.state}
                onChange={(e) => onChange({ state: e.target.value })}
              />
            </label>
            <label className="block space-y-1">
              <span className={labelCls}>Postal code</span>
              <input
                className={inputCls}
                placeholder="411001"
                value={value.postalCode}
                onChange={(e) => onChange({ postalCode: e.target.value })}
              />
            </label>
            <label className="block space-y-1">
              <span className={labelCls}>Country code</span>
              <input
                className={inputCls}
                placeholder="IN"
                value={value.countryCode || "IN"}
                onChange={(e) => onChange({ countryCode: e.target.value.toUpperCase() })}
              />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className={labelCls}>Latitude (optional)</span>
              <input
                className={inputCls}
                type="number"
                step="any"
                placeholder="18.5204"
                value={value.latitude ?? ""}
                onChange={(e) => onChange({ latitude: parseCoord(e.target.value) })}
              />
            </label>
            <label className="block space-y-1">
              <span className={labelCls}>Longitude (optional)</span>
              <input
                className={inputCls}
                type="number"
                step="any"
                placeholder="73.8567"
                value={value.longitude ?? ""}
                onChange={(e) => onChange({ longitude: parseCoord(e.target.value) })}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={commitManualFromFields}
            className="rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-wider border border-violet-500/40 text-violet-300 hover:border-violet-500/60"
          >
            Save manual address
          </button>
        </div>
      )}

      {value.latitude != null && value.longitude != null && (
        <p className="text-[10px] text-emerald-400/80">
          Coordinates — {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
        </p>
      )}
      {hasSavedAddress(value) && (
        <p className="text-xs text-white/45 leading-relaxed">
          {[value.formattedAddress || value.addressLine1, value.city, value.state]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
    </div>
  );
}
