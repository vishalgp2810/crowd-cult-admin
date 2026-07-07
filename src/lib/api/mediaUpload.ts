import { apiClient, unwrapApiResponse } from "./client";
import type { UploadKeyValue } from "@/lib/constants/uploadKeys";
import type { UploadResult } from "./mediaApi";

const DIRECT_UPLOAD_MIN_BYTES = 20 * 1024 * 1024;

type DirectUploadPrep = {
  uploadUrl: string;
  url: string;
  contentType: string;
  uploadKey: string;
  method: "PUT";
};

function isVideoFile(file: File) {
  return file.type.startsWith("video/") || /\.(mp4|mov|webm|mkv|m4v|avi)$/i.test(file.name);
}

function isAudioFile(file: File) {
  return file.type.startsWith("audio/") || /\.(mp3|m4a|wav|aac|ogg|flac)$/i.test(file.name);
}

export function isEventMediaFile(file: File) {
  return isVideoFile(file) || isAudioFile(file);
}

export async function uploadMediaFile(file: File, uploadKey: UploadKeyValue): Promise<UploadResult> {
  const mimetype = file.type || "application/octet-stream";
  const useDirect = isVideoFile(file) || file.size >= DIRECT_UPLOAD_MIN_BYTES;

  if (useDirect) {
    const prep = await unwrapApiResponse<DirectUploadPrep>(
      await apiClient.post("/media/upload-url", {
        uploadKey,
        filename: file.name,
        mimetype,
        byteSize: file.size,
      })
    );

    const putRes = await fetch(prep.uploadUrl, {
      method: prep.method || "PUT",
      body: file,
      headers: { "Content-Type": prep.contentType || mimetype },
    });

    if (!putRes.ok) {
      throw new Error(`Upload failed (${putRes.status}). Try a smaller file or different format.`);
    }

    return {
      url: prep.url,
      readUrl: prep.url,
      uploadKey: prep.uploadKey,
    };
  }

  const form = new FormData();
  form.append("file", file);
  form.append("uploadKey", uploadKey);
  return unwrapApiResponse<UploadResult>(await apiClient.post("/media/upload", form));
}
