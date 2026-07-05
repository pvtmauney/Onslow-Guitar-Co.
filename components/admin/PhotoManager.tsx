"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { storageUrl } from "@/lib/data";
import { compressImage, fileStem } from "@/lib/media";
import type { PhotoInput } from "@/lib/types";
import { useToast } from "./Toaster";

/**
 * Multi-photo uploader: compresses to WebP client-side, uploads straight to
 * the `media` storage bucket, and collects required alt text per photo.
 */
export function PhotoManager({
  items,
  onChange,
  onRemoved,
  folder,
  max,
  label,
  hint,
  showMissingAlt,
}: {
  items: PhotoInput[];
  onChange: (items: PhotoInput[]) => void;
  onRemoved: (path: string) => void;
  folder: string;
  max: number;
  label: string;
  hint?: string;
  showMissingAlt: boolean;
}) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const supabase = createClient();
    setUploading(true);
    const next = [...items];
    for (const file of Array.from(files)) {
      if (next.length >= max) {
        toast(`Photo limit is ${max}.`, true);
        break;
      }
      try {
        const blob = await compressImage(file);
        const path = `${folder}/${fileStem()}.webp`;
        const { error } = await supabase.storage
          .from("media")
          .upload(path, blob, {
            contentType: "image/webp",
            cacheControl: "31536000",
          });
        if (error) throw new Error(error.message);
        next.push({ storage_path: path, alt_text: "" });
      } catch (e) {
        toast(
          e instanceof Error
            ? `Couldn't upload ${file.name}: ${e.message}`
            : `Couldn't upload ${file.name}.`,
          true
        );
      }
    }
    setUploading(false);
    onChange(next);
    if (fileRef.current) fileRef.current.value = "";
  }

  function remove(i: number) {
    onRemoved(items[i].storage_path);
    onChange(items.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  function setAlt(i: number, alt: string) {
    const next = [...items];
    next[i] = { ...next[i], alt_text: alt };
    onChange(next);
  }

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <button
        type="button"
        className="file-drop"
        disabled={uploading || items.length >= max}
        onClick={() => fileRef.current?.click()}
      >
        {uploading
          ? "Uploading…"
          : items.length >= max
            ? `Photo limit reached (${max})`
            : "Click to choose photos — they're resized automatically"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {hint && <p className="hint">{hint}</p>}
      {items.length > 0 && (
        <div className="thumbs">
          {items.map((p, i) => (
            <div className="thumb" key={p.storage_path}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={storageUrl(p.storage_path)} alt={p.alt_text || `Photo ${i + 1}`} />
              {i > 0 && (
                <button
                  type="button"
                  className="mv left"
                  title="Move earlier"
                  aria-label={`Move photo ${i + 1} earlier`}
                  onClick={() => move(i, -1)}
                >
                  ←
                </button>
              )}
              {i < items.length - 1 && (
                <button
                  type="button"
                  className="mv right"
                  title="Move later"
                  aria-label={`Move photo ${i + 1} later`}
                  onClick={() => move(i, 1)}
                >
                  →
                </button>
              )}
              <button
                type="button"
                className="rm"
                title="Remove photo"
                aria-label={`Remove photo ${i + 1}`}
                onClick={() => remove(i)}
              >
                ✕
              </button>
              <input
                type="text"
                className={`alt-input${showMissingAlt && !p.alt_text.trim() ? " missing" : ""}`}
                placeholder="Describe this photo *"
                aria-label={`Alt text for photo ${i + 1} (required)`}
                value={p.alt_text}
                onChange={(e) => setAlt(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
