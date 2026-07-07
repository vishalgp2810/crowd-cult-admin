function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

async function drawSvgOnCanvas(
  ctx: CanvasRenderingContext2D,
  svgEl: SVGSVGElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  const svgString = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, x, y, w, h);
      URL.revokeObjectURL(url);
      resolve();
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

export async function renderEventShareCardBlob(opts: {
  publicUrl: string;
  eventTitle: string;
  qrSvgEl: SVGSVGElement;
}): Promise<Blob> {
  const { publicUrl, eventTitle, qrSvgEl } = opts;
  const W = 1080;
  const H = 1280;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const bg = ctx.createRadialGradient(W / 2, H * 0.35, 80, W / 2, H * 0.6, W);
  bg.addColorStop(0, "#2a0f4a");
  bg.addColorStop(0.55, "#10071f");
  bg.addColorStop(1, "#050505");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 italic 32px Geist, Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Crowd&Cult", W / 2, 96);

  ctx.fillStyle = "rgba(168, 85, 247, 0.9)";
  ctx.font = "900 italic 18px Geist, Inter, system-ui, sans-serif";
  ctx.fillText("EVENT TICKETS", W / 2, 128);

  const displayTitle = eventTitle.toUpperCase();
  let titleSize = 56;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 italic ${titleSize}px Geist, Inter, system-ui, sans-serif`;
  while (ctx.measureText(displayTitle).width > W - 120 && titleSize > 28) {
    titleSize -= 4;
    ctx.font = `900 italic ${titleSize}px Geist, Inter, system-ui, sans-serif`;
  }
  ctx.fillText(displayTitle, W / 2, 220);

  const underlineWidth = Math.min(420, Math.max(160, ctx.measureText(displayTitle).width * 0.45));
  ctx.fillStyle = "#a855f7";
  ctx.fillRect(W / 2 - underlineWidth / 2, 238, underlineWidth, 5);

  const qrPanelSize = 680;
  const qrPanelX = (W - qrPanelSize) / 2;
  const qrPanelY = 300;

  ctx.save();
  ctx.shadowColor = "rgba(168, 85, 247, 0.35)";
  ctx.shadowBlur = 56;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "#ffffff";
  roundedRect(ctx, qrPanelX, qrPanelY, qrPanelSize, qrPanelSize, 32);
  ctx.fill();
  ctx.restore();

  const qrSize = qrPanelSize - 96;
  const qrX = qrPanelX + (qrPanelSize - qrSize) / 2;
  const qrY = qrPanelY + (qrPanelSize - qrSize) / 2;
  await drawSvgOnCanvas(ctx, qrSvgEl, qrX, qrY, qrSize, qrSize);

  const badgeText = "SCAN TO BOOK";
  ctx.font = "900 italic 22px Geist, Inter, system-ui, sans-serif";
  const badgeTextWidth = ctx.measureText(badgeText).width;
  const badgePadX = 22;
  const badgeW = badgeTextWidth + badgePadX * 2;
  const badgeH = 44;
  const badgeX = (W - badgeW) / 2;
  const badgeY = qrPanelY + qrPanelSize - badgeH / 2;

  ctx.fillStyle = "#a855f7";
  roundedRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, W / 2, badgeY + badgeH / 2 + 1);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "900 italic 26px Geist, Inter, system-ui, sans-serif";
  ctx.fillText(publicUrl.replace(/^https?:\/\//, ""), W / 2, H - 72);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error("Could not encode share card"));
    }, "image/png");
  });
}

export function buildEventQrShareFilename(slug: string) {
  const safe = String(slug || "event")
    .trim()
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-|-$/g, "");
  return `${safe || "event"}-qr.png`;
}
