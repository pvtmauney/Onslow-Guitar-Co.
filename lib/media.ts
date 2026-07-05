/** Client-side media helpers (image compression, video URL parsing). */

export const MAX_IMAGE_DIMENSION = 1600;
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200 MB

/**
 * Resize + compress an image file in the browser before upload.
 * Returns a WebP blob no larger than MAX_IMAGE_DIMENSION on its long edge.
 */
export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width: w, height: h } = img;
      if (w > MAX_IMAGE_DIMENSION || h > MAX_IMAGE_DIMENSION) {
        const r = Math.min(MAX_IMAGE_DIMENSION / w, MAX_IMAGE_DIMENSION / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Could not encode image"));
        },
        "image/webp",
        0.82
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export type ParsedVideo = { kind: "youtube" | "vimeo"; id: string };

/** Parse a YouTube or Vimeo URL into an embeddable ID. */
export function parseVideoUrl(input: string): ParsedVideo | null {
  try {
    const url = new URL(input.trim());
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = url.searchParams.get("v");
      if (url.pathname === "/watch" && v) return { kind: "youtube", id: v };
      if (url.pathname.startsWith("/shorts/"))
        return { kind: "youtube", id: url.pathname.split("/")[2] };
      if (url.pathname.startsWith("/embed/"))
        return { kind: "youtube", id: url.pathname.split("/")[2] };
      if (url.pathname.startsWith("/live/"))
        return { kind: "youtube", id: url.pathname.split("/")[2] };
    }
    if (host === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      if (id) return { kind: "youtube", id };
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return { kind: "vimeo", id };
    }
  } catch {
    // not a URL
  }
  return null;
}

/** Random-ish unique file stem for storage paths. */
export function fileStem(): string {
  return (
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
  );
}
