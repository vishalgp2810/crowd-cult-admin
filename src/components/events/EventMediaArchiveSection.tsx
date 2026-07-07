"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type {
  HostedEventDetail,
  HostedEventMediaAsset,
} from "@/features/events/eventTypes";
import { eventsApi } from "@/lib/api/eventsApi";
import { mediaApi } from "@/lib/api/mediaApi";
import { isEventMediaFile } from "@/lib/api/mediaUpload";
import { UPLOAD_KEYS } from "@/lib/constants/uploadKeys";

export type EventMediaApi = {
  createMediaAsset: (
    hostedEventId: number,
    payload: {
      title: string;
      assetType: "audio" | "video";
      url: string;
      byteSize?: number;
    }
  ) => Promise<HostedEventDetail>;
  setMediaAssetBackground: (
    hostedEventId: number,
    hostedEventMediaAssetId: number,
    enabled: boolean
  ) => Promise<HostedEventDetail>;
  deleteMediaAsset: (
    hostedEventId: number,
    hostedEventMediaAssetId: number
  ) => Promise<HostedEventDetail>;
};

type Props = {
  hostedEventId: number | null | undefined;
  mediaAssets?: HostedEventMediaAsset[];
  onUpdated?: (detail: HostedEventDetail) => void;
  api?: EventMediaApi;
};

export function EventMediaArchiveSection({
  hostedEventId,
  mediaAssets = [],
  onUpdated,
  api = eventsApi,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState(mediaAssets);
  const [uploading, setUploading] = useState(false);
  const [bgSavingId, setBgSavingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    setAssets(mediaAssets);
  }, [mediaAssets]);

  if (!hostedEventId) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
        <p className="text-xs text-white/45 italic">Save draft first to upload media.</p>
      </div>
    );
  }

  const handleUpload = async (file: File) => {
    const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|webm|mkv|m4v|avi)$/i.test(file.name);
    const isAudio = file.type.startsWith("audio/") || /\.(mp3|m4a|wav|aac|ogg|flac)$/i.test(file.name);
    if (!isEventMediaFile(file)) {
      toast.error("Only audio and video files are supported");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await mediaApi.uploadFile(file, UPLOAD_KEYS.EVENT_MEDIA);
      const detail = await api.createMediaAsset(hostedEventId, {
        title: file.name.replace(/\.[^.]+$/, "") || file.name,
        assetType: isVideo ? "video" : "audio",
        url: uploaded.url,
        byteSize: file.size,
      });
      setAssets(detail.mediaAssets || []);
      onUpdated?.(detail);
      toast.success("Media uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleBackground = async (asset: HostedEventMediaAsset) => {
    if (asset.assetType !== "audio") {
      toast.error("Only audio can be set as background music");
      return;
    }
    const id = asset.hostedEventMediaAssetId;
    const enabled = !asset.isEventBackgroundTrack;
    setBgSavingId(id);
    try {
      const detail = await api.setMediaAssetBackground(hostedEventId, id, enabled);
      setAssets(detail.mediaAssets || []);
      onUpdated?.(detail);
      toast.success(enabled ? "Background music set" : "Background music cleared");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update background track");
    } finally {
      setBgSavingId(null);
    }
  };

  const removeAsset = async (asset: HostedEventMediaAsset) => {
    const id = asset.hostedEventMediaAssetId;
    setRemovingId(id);
    try {
      const detail = await api.deleteMediaAsset(hostedEventId, id);
      setAssets(detail.mediaAssets || []);
      onUpdated?.(detail);
      toast.success("Media removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove media");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
            Media archive
          </p>
          <p className="text-xs text-white/45 mt-1">
            Upload audio or video. Set one audio track as background music on the public event page.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white"
          >
            {uploading ? "Uploading…" : "+ Upload media"}
          </button>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <p className="text-xs text-white/40 italic">No audio or video uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((asset) => {
            const isBg = asset.isEventBackgroundTrack;
            const isAudio = asset.assetType === "audio";
            return (
              <div
                key={asset.hostedEventMediaAssetId}
                className={[
                  "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3",
                  isBg
                    ? "border-emerald-400/40 bg-emerald-500/10"
                    : "border-white/10 bg-white/[0.02]",
                ].join(" ")}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{asset.title}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/35 mt-0.5">
                    {asset.assetType}
                    {isBg ? " · Background music" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isAudio ? (
                    <button
                      type="button"
                      disabled={bgSavingId === asset.hostedEventMediaAssetId}
                      onClick={() => void toggleBackground(asset)}
                      className={[
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors",
                        isBg
                          ? "border-emerald-400/50 text-emerald-200 bg-emerald-500/20"
                          : "border-white/15 text-white/70 hover:border-violet-400/40",
                      ].join(" ")}
                    >
                      {bgSavingId === asset.hostedEventMediaAssetId
                        ? "Saving…"
                        : isBg
                          ? "Clear background"
                          : "Set as background"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={removingId === asset.hostedEventMediaAssetId}
                    onClick={() => void removeAsset(asset)}
                    className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
                  >
                    {removingId === asset.hostedEventMediaAssetId ? "Removing…" : "Remove"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
