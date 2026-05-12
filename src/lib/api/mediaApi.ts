import { apiClient, unwrapApiResponse } from "./client";
import type { UploadKeyValue } from "@/lib/constants/uploadKeys";

export interface UploadResult {
  /**
   * Canonical `https://storage.googleapis.com/bucket/key` — persist in the DB only.
   * Not anonymously readable for private buckets; do not use as &lt;img src&gt;.
   */
  url: string;
  /** Time-limited signed URL — use for &lt;img src&gt; / previews; do not persist (expires). */
  readUrl: string;
  uploadKey: string;
}

export const mediaApi = {
  uploadFile: async (file: File, uploadKey: UploadKeyValue) => {
    const form = new FormData();
    form.append("file", file);
    form.append("uploadKey", uploadKey);
    const res = await apiClient.post("/media/upload", form);
    return unwrapApiResponse<UploadResult>(res);
  },
  // Backward-compatible alias used in profile managers.
  uploadSingle: async (file: File, uploadKey: UploadKeyValue) => {
    return mediaApi.uploadFile(file, uploadKey);
  },
};
