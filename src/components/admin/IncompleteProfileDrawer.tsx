"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/adminApi";
import type { AudienceUser } from "@/features/admin/adminUserTypes";
import type { ArtistHubProfile, ArtistReadiness } from "@/features/artist/artistTypes";
import type { VenueProfile } from "@/features/venue/venueTypes";
import {
  IconCheck,
  IconClose,
  IconMail,
  IconPhone,
  IconX,
} from "./AdminIcons";
import { QueueAvatar } from "./adminQueueUi";

export type IncompleteProfileTarget =
  | { kind: "artist"; profile: ArtistHubProfile }
  | { kind: "venue"; profile: VenueProfile }
  | { kind: "audience"; profile: AudienceUser };

type IncompleteProfileDrawerProps = {
  target: IncompleteProfileTarget | null;
  onClose: () => void;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function copyText(label: string, value: string) {
  if (!value) return;
  void navigator.clipboard.writeText(value).then(() => toast.success(`${label} copied`));
}

function venueChecklist(venue: VenueProfile) {
  const checks = [
    { label: "Business name", ok: Boolean(venue.businessName?.trim()) },
    { label: "Venue type", ok: Boolean(venue.venueType?.trim()) },
    { label: "City", ok: Boolean(venue.city?.trim()) },
    { label: "Capacity", ok: Number(venue.capacity) > 0 },
    { label: "Bio", ok: Boolean(venue.bio?.trim()) },
    { label: "Profile image", ok: Boolean(venue.profileImageUrl) },
    { label: "Phone", ok: Boolean(venue.phoneNumber?.trim()) },
  ];
  const complete = checks.filter((c) => c.ok).length;
  return { checks, complete, total: checks.length };
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  const display = value?.trim() || "—";
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
      <span className="mt-0.5 text-white/35">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">{label}</p>
        {href && display !== "—" ? (
          <a href={href} className="text-sm text-cyan-300/90 hover:text-cyan-200 truncate block">
            {display}
          </a>
        ) : (
          <p className="text-sm text-white/80 truncate">{display}</p>
        )}
      </div>
      {display !== "—" && (
        <button
          type="button"
          onClick={() => copyText(label, display)}
          className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-white/30 hover:text-white/70 px-2 py-1 rounded-lg border border-white/[0.08]"
        >
          Copy
        </button>
      )}
    </div>
  );
}

export function IncompleteProfileDrawer({ target, onClose }: IncompleteProfileDrawerProps) {
  const [readiness, setReadiness] = useState<ArtistReadiness | null>(null);
  const [readinessStatus, setReadinessStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [nudgeSubject, setNudgeSubject] = useState("");
  const [nudgeMessage, setNudgeMessage] = useState("");
  const [nudgeTo, setNudgeTo] = useState("");
  const [nudgePreviewStatus, setNudgePreviewStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [sendingNudge, setSendingNudge] = useState(false);

  const nudgeTarget = useMemo(() => {
    if (!target) return null;
    if (target.kind === "artist") {
      return { targetType: "artist" as const, targetId: target.profile.artistProfileId };
    }
    if (target.kind === "venue") {
      return { targetType: "venue" as const, targetId: target.profile.venueId };
    }
    return { targetType: "audience" as const, targetId: target.profile.userId };
  }, [target]);

  const displayName =
    target?.kind === "artist"
      ? target.profile.stageName || target.profile.fullName || "Artist"
      : target?.kind === "venue"
        ? target.profile.businessName || target.profile.fullName || "Venue"
        : target?.profile.fullName || target?.profile.emailAddress || "Audience member";

  const email =
    target?.kind === "artist"
      ? target.profile.emailAddress
      : target?.kind === "venue"
        ? target.profile.emailAddress
        : target?.profile.emailAddress;
  const phone =
    target?.kind === "artist"
      ? target.profile.phoneNumber
      : target?.kind === "venue"
        ? target.profile.phoneNumber
        : target?.profile.phoneNumber;
  const fullName =
    target?.kind === "artist"
      ? target.profile.fullName
      : target?.kind === "venue"
        ? target.profile.fullName
        : target?.profile.fullName;

  const venueProgress = useMemo(
    () => (target?.kind === "venue" ? venueChecklist(target.profile) : null),
    [target]
  );

  useEffect(() => {
    if (!target || target.kind !== "artist") {
      setReadiness(null);
      setReadinessStatus("idle");
      return;
    }
    let cancelled = false;
    setReadinessStatus("loading");
    void adminApi
      .getArtistReadiness(target.profile.artistProfileId)
      .then((data) => {
        if (!cancelled) {
          setReadiness(data);
          setReadinessStatus("idle");
        }
      })
      .catch(() => {
        if (!cancelled) setReadinessStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, [target]);

  useEffect(() => {
    if (!nudgeTarget) {
      setNudgeSubject("");
      setNudgeMessage("");
      setNudgeTo("");
      setNudgePreviewStatus("idle");
      return;
    }

    let cancelled = false;
    setNudgePreviewStatus("loading");
    void adminApi
      .getSignupNudgePreview(nudgeTarget.targetType, nudgeTarget.targetId)
      .then((preview) => {
        if (cancelled) return;
        setNudgeTo(preview.to);
        setNudgeSubject(preview.subject);
        setNudgeMessage(preview.message);
        setNudgePreviewStatus("idle");
      })
      .catch(() => {
        if (!cancelled) setNudgePreviewStatus("failed");
      });

    return () => {
      cancelled = true;
    };
  }, [nudgeTarget]);

  const handleSendNudge = async () => {
    if (!nudgeTarget || !nudgeTo) return;
    const subject = nudgeSubject.trim();
    const message = nudgeMessage.trim();
    if (message.length < 10) {
      toast.error("Email message must be at least 10 characters.");
      return;
    }

    setSendingNudge(true);
    try {
      const result = await adminApi.sendSignupNudgeEmail({
        targetType: nudgeTarget.targetType,
        targetId: nudgeTarget.targetId,
        subject: subject || "Complete your Crowd & Cult profile",
        message,
      });
      if (result.channel === "dev-quota-fallback") {
        toast.warning(`ZeptoMail quota exhausted. Email logged locally for ${nudgeTo} (dev only).`);
      } else {
        toast.success(`Nudge email sent to ${nudgeTo}`);
      }
    } catch (err) {
      const apiMessage =
        err instanceof Error && err.message ? err.message : "Could not send nudge email.";
      toast.error(apiMessage);
    } finally {
      setSendingNudge(false);
    }
  };

  return (
    <AnimatePresence>
      {target && (
        <div className="fixed inset-0 z-[500] flex justify-end">
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-lg h-dvh max-h-dvh flex flex-col min-h-0 shadow-2xl"
            style={{
              background: "#0E0E1A",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <QueueAvatar
                  name={displayName}
                  type={target.kind === "audience" ? "audience" : target.kind}
                />
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400/70 mb-0.5">
                    {target.kind === "artist"
                      ? `Artist · ${target.profile.status.replace(/_/g, " ")}`
                      : target.kind === "venue"
                        ? `Venue · ${target.profile.status.replace(/_/g, " ")}`
                        : "Audience"}
                  </p>
                  <h2 className="text-base font-black text-white truncate">{displayName}</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/[0.07]"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-5 space-y-5">
              {target.kind !== "audience" && target.profile.rejectionReason && (
                <div
                  className="rounded-xl px-4 py-3 text-xs text-amber-200/90"
                  style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.25)",
                  }}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-amber-400/80 mb-1">
                    Returned for changes
                  </p>
                  <p className="leading-relaxed">{target.profile.rejectionReason}</p>
                </div>
              )}

              <section
                className="rounded-2xl px-4 py-2"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 px-1 pt-2 pb-1">
                  Contact
                </p>
                <ContactRow icon={<IconMail className="w-4 h-4" />} label="Email" value={email} />
                <ContactRow
                  icon={<IconPhone className="w-4 h-4" />}
                  label="Phone"
                  value={phone}
                  href={phone ? `tel:${phone}` : undefined}
                />
                <ContactRow icon={<span className="text-[10px] font-black">FN</span>} label="Full name" value={fullName} />
                <div className="grid grid-cols-2 gap-3 py-3 border-t border-white/[0.06] mt-1">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Signed up</p>
                    <p className="text-xs text-white/70 mt-0.5">
                      {formatDate(
                        target.kind === "audience"
                          ? target.profile.createdAt
                          : target.profile.createdAt
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Last updated</p>
                    <p className="text-xs text-white/70 mt-0.5">
                      {formatDate(
                        target.kind === "audience"
                          ? target.profile.updatedAt
                          : target.profile.updatedAt
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {target.kind === "artist" && (
                <section
                  className="rounded-2xl px-4 py-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3">
                    Profile completion
                  </p>
                  {readinessStatus === "loading" && (
                    <p className="text-xs text-white/40 animate-pulse">Loading readiness…</p>
                  )}
                  {readinessStatus === "failed" && (
                    <p className="text-xs text-red-300/80">Could not load completion details.</p>
                  )}
                  {readiness && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">
                          {readiness.ready ? "Ready to submit" : "Not ready to submit"}
                        </span>
                        <span className="font-bold text-cyan-300">
                          {Object.values(readiness.sections).filter((s) => s.complete).length}/
                          {Object.keys(readiness.sections).length} sections
                        </span>
                      </div>
                      {Object.values(readiness.sections).map((section) => (
                        <div key={section.label} className="rounded-xl px-3 py-2.5 bg-white/[0.02]">
                          <div className="flex items-center gap-2 mb-1">
                            {section.complete ? (
                              <IconCheck className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <IconX className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <p className="text-xs font-bold text-white/80">{section.label}</p>
                          </div>
                          {!section.complete && section.missing.length > 0 && (
                            <ul className="ml-5 text-[11px] text-white/45 list-disc space-y-0.5">
                              {section.missing.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {target.kind === "venue" && venueProgress && (
                <section
                  className="rounded-2xl px-4 py-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3">
                    Profile completion
                  </p>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-white/50">Key fields filled</span>
                    <span className="font-bold text-cyan-300">
                      {venueProgress.complete}/{venueProgress.total}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {venueProgress.checks.map((check) => (
                      <div key={check.label} className="flex items-center gap-2 text-xs">
                        {check.ok ? (
                          <IconCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <IconX className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className={check.ok ? "text-white/60" : "text-white/80"}>{check.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {email && (
                <section
                  className="rounded-2xl px-4 py-4 space-y-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    Nudge email
                  </p>
                  {nudgePreviewStatus === "loading" && (
                    <p className="text-xs text-white/40 animate-pulse">Loading email preview…</p>
                  )}
                  {nudgePreviewStatus === "failed" && (
                    <p className="text-xs text-red-300/80">Could not load email preview.</p>
                  )}
                  {nudgePreviewStatus === "idle" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30">
                          To
                        </label>
                        <p className="mt-1 text-sm text-cyan-300/90 break-all">{nudgeTo || email}</p>
                      </div>
                      <div>
                        <label
                          htmlFor="nudge-subject"
                          className="text-[9px] font-black uppercase tracking-widest text-white/30"
                        >
                          Subject
                        </label>
                        <input
                          id="nudge-subject"
                          type="text"
                          value={nudgeSubject}
                          onChange={(e) => setNudgeSubject(e.target.value)}
                          className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/40"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="nudge-message"
                          className="text-[9px] font-black uppercase tracking-widest text-white/30"
                        >
                          Message
                        </label>
                        <textarea
                          id="nudge-message"
                          value={nudgeMessage}
                          onChange={(e) => setNudgeMessage(e.target.value)}
                          rows={6}
                          className="mt-1 w-full max-h-48 rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-sm text-white/85 leading-relaxed outline-none focus:border-cyan-500/40 resize-y"
                        />
                        <p className="mt-1.5 text-[10px] text-white/35 leading-relaxed">
                          Review and edit before sending. The user receives a branded HTML email with a
                          dashboard link.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>

            {email && (
              <div
                className="shrink-0 px-5 py-4 border-t"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(14,14,26,0.98)",
                  boxShadow: "0 -8px 24px rgba(0,0,0,0.35)",
                }}
              >
                <button
                  type="button"
                  onClick={() => void handleSendNudge()}
                  disabled={sendingNudge || nudgePreviewStatus !== "idle" || nudgeMessage.trim().length < 10}
                  className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-[11px] font-black uppercase tracking-wider text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #22D3EE, #0EA5E9)" }}
                >
                  <IconMail className="w-4 h-4" />
                  {sendingNudge ? "Sending…" : "Send nudge email"}
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
