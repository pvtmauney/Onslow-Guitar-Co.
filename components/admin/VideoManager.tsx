"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fileStem, parseVideoUrl, MAX_VIDEO_BYTES } from "@/lib/media";
import type { MediaInput } from "@/lib/types";
import { useToast } from "./Toaster";

/** Video list editor: YouTube/Vimeo links (recommended) or direct uploads. */
export function VideoManager({
  items,
  onChange,
  onRemoved,
  folder,
}: {
  items: MediaInput[];
  onChange: (items: MediaInput[]) => void;
  onRemoved: (path: string) => void;
  folder: string;
}) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  function addLink() {
    const parsed = parseVideoUrl(url);
    if (!parsed) {
      toast("That doesn't look like a YouTube or Vimeo link.", true);
      return;
    }
    onChange([
      ...items,
      {
        kind: parsed.kind,
        storage_path: null,
        external_id: parsed.id,
        alt_text: "",
      },
    ]);
    setUrl("");
  }

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (file.size > MAX_VIDEO_BYTES) {
      toast(
        "That video is over 200 MB. Upload it to YouTube and paste the link instead.",
        true
      );
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const path = `${folder}/${fileStem()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type || "video/mp4",
        cacheControl: "31536000",
      });
      if (error) throw new Error(error.message);
      onChange([
        ...items,
        {
          kind: "video_file",
          storage_path: path,
          external_id: null,
          alt_text: file.name,
        },
      ]);
    } catch (e) {
      toast(
        e instanceof Error ? `Upload failed: ${e.message}` : "Upload failed.",
        true
      );
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function remove(i: number) {
    const item = items[i];
    if (item.kind === "video_file" && item.storage_path)
      onRemoved(item.storage_path);
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="field">
      <label htmlFor="video-url">Videos</label>
      <input
        id="video-url"
        type="url"
        placeholder="Paste a YouTube or Vimeo link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addLink();
          }
        }}
      />
      <div className="row">
        <button type="button" className="mini" onClick={addLink}>
          Add video link
        </button>
        <button
          type="button"
          className="mini"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload video file (≤200 MB)"}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => handleFile(e.target.files)}
      />
      <p className="hint">
        YouTube or Vimeo links are strongly recommended — they stream better
        and don&apos;t count against your storage.
      </p>
      {items.length > 0 && (
        <div className="vid-list">
          {items.map((v, i) => (
            <div className="vid-item" key={`${v.kind}-${v.external_id ?? v.storage_path}-${i}`}>
              <span>
                {v.kind === "video_file"
                  ? `UPLOADED CLIP (${v.alt_text || "video"})`
                  : `${v.kind.toUpperCase()} · ${v.external_id}`}
              </span>
              <button
                type="button"
                className="vrm"
                title="Remove video"
                aria-label={`Remove video ${i + 1}`}
                onClick={() => remove(i)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
