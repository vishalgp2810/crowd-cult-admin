"use client";

import React, { useEffect, useRef, useState } from "react";
import { Modal } from "@heroui/react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { buildBrandQrLogoDataUrl } from "@/lib/qr/brandQrLogo";
import { buildEventQrShareFilename, renderEventShareCardBlob } from "@/lib/qr/eventQrShareCard";

const PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "https://crowdandcult.com";
const QR_SIZE = 168;
const QR_LOGO_SIZE = 40;

export type EventShareModalProps = {
  slug: string;
  eventTitle: string;
  trigger: React.ReactNode;
};

function CopyIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ShareIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function DownloadIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

const iconBtn =
  "shrink-0 rounded-md p-1.5 text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-50";

export function EventShareModal({ slug, eventTitle, trigger }: EventShareModalProps) {
  const publicUrl = `${PUBLIC_SITE_URL}/events/${slug}`;
  const displayUrl = publicUrl.replace(/^https?:\/\//, "");
  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    buildBrandQrLogoDataUrl()
      .then((url) => {
        if (!cancelled) setLogoDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const getQrSvg = () => qrWrapperRef.current?.querySelector("svg") ?? null;

  const copyLink = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const downloadQr = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const svgEl = getQrSvg();
    if (!svgEl) {
      toast.error("QR not ready yet — try again.");
      return;
    }

    setDownloading(true);
    const filename = buildEventQrShareFilename(slug);
    try {
      const blob = await renderEventShareCardBlob({
        publicUrl,
        eventTitle,
        qrSvgEl: svgEl,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("QR poster downloaded");
    } catch {
      toast.error("Could not download QR poster");
    } finally {
      setDownloading(false);
    }
  };

  const shareLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof navigator === "undefined" || !navigator.share) {
      await copyLink();
      return;
    }

    setSharing(true);
    const filename = buildEventQrShareFilename(slug);

    try {
      const svgEl = getQrSvg();
      if (svgEl) {
        try {
          const blob = await renderEventShareCardBlob({
            publicUrl,
            eventTitle,
            qrSvgEl: svgEl,
          });
          const file = new File([blob], filename, { type: "image/png" });
          const canShareFiles =
            typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });

          if (canShareFiles) {
            await navigator.share({
              title: eventTitle,
              text: `Book tickets for ${eventTitle}`,
              url: publicUrl,
              files: [file],
            });
            return;
          }
        } catch {
          // fall through
        }
      }

      await navigator.share({
        title: eventTitle,
        text: `Book tickets for ${eventTitle}`,
        url: publicUrl,
      });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        await copyLink();
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal>
      {trigger}

      <Modal.Backdrop variant="blur" className="bg-black/70 !z-[500]" style={{ zIndex: 500 }}>
        <Modal.Container placement="center">
          <Modal.Dialog className="w-full min(calc(100vw-2rem),20rem) sm:min(calc(100vw-3rem),24rem) border border-white/10 bg-[#0A0A0A] rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col">
            <>
              <Modal.Header className="shrink-0 flex flex-row items-start justify-between gap-3 px-5 py-4 border-b border-white/10">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                    Event QR
                  </p>
                  <p className="text-sm font-bold text-white mt-1 leading-snug">{eventTitle}</p>
                </div>
                <Modal.CloseTrigger className="relative static inset-auto shrink-0 mt-0.5" />
              </Modal.Header>

              <Modal.Body className="px-5 pt-5 pb-6 flex flex-col items-center gap-4">
                <p className="text-[11px] text-white/45 text-center leading-relaxed">
                  Download or share the QR poster for the public event page.
                </p>

                <div
                  ref={qrWrapperRef}
                  className="inline-flex shrink-0 rounded-2xl bg-white p-3 shadow-[0_0_40px_-8px_rgba(168,85,247,0.4)]"
                >
                  <QRCodeSVG
                    value={publicUrl}
                    size={QR_SIZE}
                    className="block"
                    level="H"
                    marginSize={2}
                    bgColor="#ffffff"
                    fgColor="#0A0A0A"
                    imageSettings={
                      logoDataUrl
                        ? {
                            src: logoDataUrl,
                            height: QR_LOGO_SIZE,
                            width: QR_LOGO_SIZE,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                <div className="flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-3 pr-1.5 py-1.5 min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35 shrink-0">
                    URL
                  </span>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 truncate text-[11px] font-medium text-purple-300 hover:text-purple-200 hover:underline underline-offset-2"
                    title={publicUrl}
                  >
                    {displayUrl}
                  </a>
                  <button type="button" onClick={(e) => void copyLink(e)} aria-label="Copy link" className={iconBtn}>
                    <CopyIcon />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => void downloadQr(e)}
                    aria-label="Download QR poster"
                    disabled={downloading}
                    className={iconBtn}
                  >
                    <DownloadIcon />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => void shareLink(e)}
                    aria-label="Share link and QR poster"
                    disabled={sharing}
                    className={iconBtn}
                  >
                    <ShareIcon />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => void downloadQr(e)}
                  disabled={downloading}
                  className="w-full rounded-xl border border-purple-500/35 bg-purple-500/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-purple-200 hover:bg-purple-500/20 disabled:opacity-50"
                >
                  {downloading ? "Preparing download…" : "Download QR poster"}
                </button>
              </Modal.Body>
            </>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
