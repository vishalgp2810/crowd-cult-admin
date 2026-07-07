"use client";

import { AdminSelect } from "@/components/admin/AdminSelect";
import { NumericInput } from "@/components/common/NumericInput";
import type { EventTicketTypeFormValue } from "@/features/events/eventTypes";
import {
  ATTENDEE_FIELD_OPTIONS,
  CURRENCY_OPTIONS,
} from "@/lib/events/eventBookingConstants";

export type EventBookingSettingsValue = {
  bookingEnabled: boolean;
  allowWaitlist: boolean;
  refundPolicy: string;
  currencyCode: string;
  attendeeFields: string[];
  customQuestionsText: string;
  ticketTypes: EventTicketTypeFormValue[];
};

type EventBookingSettingsProps = {
  value: EventBookingSettingsValue;
  onChange: (patch: Partial<EventBookingSettingsValue>) => void;
};

const inputCls =
  "w-full rounded-lg px-3 py-2 text-sm text-white bg-black/30 border border-white/10 focus:border-violet-500/50 focus:outline-none";

function emptyTicketType(): EventTicketTypeFormValue {
  return {
    hostedEventTicketTypeId: null,
    name: "General Admission",
    price: 0,
    quantity: 100,
    minPerBooking: 1,
    maxPerBooking: 10,
    salesStartLocal: "",
    salesEndLocal: "",
    complimentaryDetails: "",
  };
}

export function EventBookingSettings({ value, onChange }: EventBookingSettingsProps) {
  const patchTicket = (index: number, patch: Partial<EventTicketTypeFormValue>) => {
    const next = value.ticketTypes.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onChange({ ticketTypes: next });
  };

  const addTicketType = () => {
    if (value.ticketTypes.length >= 10) return;
    onChange({ ticketTypes: [...value.ticketTypes, emptyTicketType()] });
  };

  const removeTicketType = (index: number) => {
    onChange({ ticketTypes: value.ticketTypes.filter((_, i) => i !== index) });
  };

  const toggleAttendeeField = (key: string) => {
    const has = value.attendeeFields.includes(key);
    const fields = has
      ? value.attendeeFields.filter((f) => f !== key)
      : [...value.attendeeFields, key];
    onChange({ attendeeFields: fields.length ? fields : ["fullName", "email"] });
  };

  return (
    <div className="space-y-5">
      <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Enable ticket booking</p>
          <p className="text-[10px] text-white/40 mt-0.5">
            When on, publish requires ticket types and organizer email.
          </p>
        </div>
        <input
          type="checkbox"
          className="h-4 w-4 accent-violet-500"
          checked={value.bookingEnabled}
          onChange={(e) => {
            const enabled = e.target.checked;
            onChange({
              bookingEnabled: enabled,
              ticketTypes:
                enabled && !value.ticketTypes.length
                  ? [emptyTicketType()]
                  : value.ticketTypes,
            });
          }}
        />
      </label>

      {value.bookingEnabled && (
        <>
          <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">Allow waitlist</p>
              <p className="text-[10px] text-white/40 mt-0.5">For when tickets sell out.</p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 accent-violet-500"
              checked={value.allowWaitlist}
              onChange={(e) => onChange({ allowWaitlist: e.target.checked })}
            />
          </label>

          <AdminSelect
            value={value.currencyCode}
            onChange={(v) => onChange({ currencyCode: v || "INR" })}
            options={CURRENCY_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
          />
          <p className="text-[10px] text-white/40 -mt-2">
            Payments use the platform Razorpay configuration (no per-event gateway setup).
          </p>

          <textarea
            className={`${inputCls} min-h-[88px] resize-y`}
            placeholder="Refund / cancellation policy"
            value={value.refundPolicy}
            onChange={(e) => onChange({ refundPolicy: e.target.value })}
          />

          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
              Attendee fields to collect
            </p>
            <div className="flex flex-wrap gap-2">
              {ATTENDEE_FIELD_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => toggleAttendeeField(opt.key)}
                  className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                  style={{
                    background: value.attendeeFields.includes(opt.key)
                      ? "rgba(124,58,237,0.2)"
                      : "rgba(255,255,255,0.05)",
                    border: `1px solid ${
                      value.attendeeFields.includes(opt.key)
                        ? "rgba(124,58,237,0.4)"
                        : "rgba(255,255,255,0.1)"
                    }`,
                    color: value.attendeeFields.includes(opt.key) ? "#C4B5FD" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className={`${inputCls} min-h-[72px] resize-y`}
            placeholder="Custom questions (one per line, optional)"
            value={value.customQuestionsText}
            onChange={(e) => onChange({ customQuestionsText: e.target.value })}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
                Ticket types
              </p>
              <button
                type="button"
                onClick={addTicketType}
                disabled={value.ticketTypes.length >= 10}
                className="text-[10px] font-black uppercase tracking-wider text-violet-400 hover:text-violet-300 disabled:opacity-40"
              >
                + Add tier
              </button>
            </div>

            {value.ticketTypes.map((ticket, index) => (
              <div
                key={ticket.hostedEventTicketTypeId ?? `new-${index}`}
                className="rounded-xl border border-white/10 p-4 space-y-3"
                style={{ background: "rgba(0,0,0,0.2)" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/35">
                    Tier {index + 1}
                  </span>
                  {value.ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="text-[10px] text-rose-400/80 hover:text-rose-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  className={inputCls}
                  placeholder="Ticket name (e.g. General Admission)"
                  value={ticket.name}
                  onChange={(e) => patchTicket(index, { name: e.target.value })}
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="block space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Price ({value.currencyCode})
                    </span>
                    <NumericInput
                      decimal
                      zeroAsEmpty
                      min={0}
                      className={inputCls}
                      value={ticket.price}
                      onChange={(price) => patchTicket(index, { price })}
                      placeholder="0"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Quantity
                    </span>
                    <NumericInput
                      min={1}
                      className={inputCls}
                      value={ticket.quantity}
                      onChange={(quantity) => patchTicket(index, { quantity })}
                      onBlur={() => {
                        if (ticket.quantity <= 0) patchTicket(index, { quantity: 1 });
                      }}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Min per booking
                    </span>
                    <NumericInput
                      min={1}
                      className={inputCls}
                      value={ticket.minPerBooking}
                      onChange={(minPerBooking) => patchTicket(index, { minPerBooking })}
                      onBlur={() => {
                        if (ticket.minPerBooking < 1) patchTicket(index, { minPerBooking: 1 });
                      }}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Max per booking
                    </span>
                    <NumericInput
                      min={1}
                      className={inputCls}
                      value={ticket.maxPerBooking}
                      onChange={(maxPerBooking) => patchTicket(index, { maxPerBooking })}
                      onBlur={() => {
                        if (ticket.maxPerBooking < 1) patchTicket(index, { maxPerBooking: 1 });
                      }}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Sales start
                    </span>
                    <input
                      type="datetime-local"
                      className={inputCls}
                      value={ticket.salesStartLocal}
                      onChange={(e) => patchTicket(index, { salesStartLocal: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Sales end
                    </span>
                    <input
                      type="datetime-local"
                      className={inputCls}
                      value={ticket.salesEndLocal}
                      onChange={(e) => patchTicket(index, { salesEndLocal: e.target.value })}
                    />
                  </label>
                  <label className="block space-y-1 sm:col-span-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                      Complimentary inclusions
                    </span>
                    <textarea
                      className={`${inputCls} min-h-[72px] resize-y`}
                      placeholder="e.g. 1 welcome drink, VIP lounge access (optional)"
                      value={ticket.complimentaryDetails}
                      onChange={(e) =>
                        patchTicket(index, { complimentaryDetails: e.target.value })
                      }
                    />
                    <span className="text-[9px] text-white/35 italic">
                      Leave empty if this tier has no complimentary perks
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
