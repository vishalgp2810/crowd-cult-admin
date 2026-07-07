/** Optional branded chip for QR center — fails silently if logo unavailable. */
export async function buildBrandQrLogoDataUrl(): Promise<string | null> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.crossOrigin = "anonymous";
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("logo load failed"));
      el.src = "https://crowdandcult.com/favicon.ico";
    });

    const SIZE = 128;
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, SIZE, SIZE);
    const inner = SIZE - 28;
    const ratio = Math.min(inner / img.naturalWidth, inner / img.naturalHeight);
    const lw = img.naturalWidth * ratio;
    const lh = img.naturalHeight * ratio;
    ctx.drawImage(img, (SIZE - lw) / 2, (SIZE - lh) / 2, lw, lh);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}
