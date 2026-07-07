import type { UploadKeyValue } from "@/lib/constants/uploadKeys";
import { uploadMediaFile } from "./mediaUpload";

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
  uploadFile: uploadMediaFile,
  uploadSingle: uploadMediaFile,
};
