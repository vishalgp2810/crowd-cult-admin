"use client";

const MAX_GALLERY = 5;

type EventMediaSectionProps = {
  bannerPreview: string;
  galleryPreviews: string[];
  bannerError?: string;
  onBannerUpload: (file: File) => void;
  onBannerRemove: () => void;
  onGalleryUpload: (file: File) => void;
  onGalleryRemove: (index: number) => void;
};

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-violet-400/80" aria-hidden>
      <path
        d="M12 16V4m0 0L8 8m4-4 4 4M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white/35" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function EventMediaSection({
  bannerPreview,
  galleryPreviews,
  bannerError,
  onBannerUpload,
  onBannerRemove,
  onGalleryUpload,
  onGalleryRemove,
}: EventMediaSectionProps) {
  const galleryFull = galleryPreviews.length >= MAX_GALLERY;

  const pickFile = (handler: (file: File) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handler(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <p className="text-[10px] text-white/40 leading-relaxed">
        Placeholder images are applied automatically. Upload to replace when storage is available.
      </p>

      {bannerError && (
        <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-lg px-3 py-2">
          {bannerError}
        </p>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Hero banner</p>
            <p className="text-[10px] text-white/40 mt-0.5">16:9 · required to publish</p>
          </div>
          {bannerPreview && (
            <button
              type="button"
              onClick={onBannerRemove}
              className="text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white/60"
            >
              Reset placeholder
            </button>
          )}
        </div>

        <label className="group relative block w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 cursor-pointer">
          {bannerPreview ? (
            <img src={bannerPreview} alt="Event banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/[0.03]">
              <UploadIcon />
            </div>
          )}
          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <UploadIcon />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              Replace image
            </span>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={pickFile(onBannerUpload)} />
        </label>
      </div>

      <div className="space-y-3 pt-1 border-t border-white/[0.06]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Gallery</p>
            <p className="text-[10px] text-white/40 mt-0.5">Up to {MAX_GALLERY} images</p>
          </div>
          <span className="text-[10px] font-bold text-white/35 tabular-nums">
            {galleryPreviews.length}/{MAX_GALLERY}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {galleryPreviews.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black/20"
            >
              <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                aria-label={`Remove gallery image ${i + 1}`}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/75 text-white text-sm leading-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600/90"
                onClick={() => onGalleryRemove(i)}
              >
                ×
              </button>
              <span className="absolute bottom-1.5 left-1.5 text-[8px] font-black uppercase tracking-wider text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                {i + 1}
              </span>
            </div>
          ))}

          {!galleryFull && (
            <label className="flex flex-col items-center justify-center gap-2 aspect-[4/3] rounded-xl border-2 border-dashed border-white/12 bg-white/[0.02] hover:border-violet-500/35 hover:bg-violet-500/[0.04] transition-colors cursor-pointer p-3 text-center">
              <ImageIcon />
              <span className="text-[9px] font-black uppercase tracking-wider text-white/50">Add image</span>
              <input type="file" accept="image/*" className="hidden" onChange={pickFile(onGalleryUpload)} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
