"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveProduct } from "@/lib/actions";
import {
  CATEGORIES,
  STATUSES,
  type PhotoInput,
  type ProductWithPhotos,
} from "@/lib/types";
import { PhotoManager } from "./PhotoManager";
import { useToast } from "./Toaster";

export function ProductForm({
  product,
}: {
  product: ProductWithPhotos | null;
}) {
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState<string>(
    product?.category ?? CATEGORIES[0]
  );
  const [price, setPrice] = useState(product?.price ?? "");
  const [status, setStatus] = useState<string>(product?.status ?? STATUSES[0]);
  const [description, setDescription] = useState(product?.description ?? "");
  const [photos, setPhotos] = useState<PhotoInput[]>(
    [...(product?.photos ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({ storage_path: p.storage_path, alt_text: p.alt_text }))
  );
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [showMissingAlt, setShowMissingAlt] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast("The item needs a name.", true);
      return;
    }
    if (photos.some((p) => !p.alt_text.trim())) {
      setShowMissingAlt(true);
      toast("Every photo needs a short description (alt text).", true);
      return;
    }
    setBusy(true);
    const res = await saveProduct({
      id: product?.id ?? null,
      name,
      category,
      price,
      status,
      description,
      photos,
      removedPaths,
    });
    setBusy(false);
    if (res.ok) {
      toast(`"${name.trim()}" saved.`);
      router.push("/admin");
      router.refresh();
    } else {
      toast(res.error, true);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Link className="mini" href="/admin" style={{ marginBottom: 18, display: "inline-block" }}>
        ← Back to dashboard
      </Link>

      <div className="field">
        <label htmlFor="p-name">Item name *</label>
        <input id="p-name" type="text" value={name} placeholder="OGC Logo T-Shirt"
          onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="p-cat">Category *</label>
        <select id="p-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="p-price">Price</label>
        <input id="p-price" type="text" value={price} placeholder="$24"
          onChange={(e) => setPrice(e.target.value)} />
        <p className="hint">Free-form — &quot;$24&quot;, &quot;$649&quot;, &quot;From $58&quot;, etc.</p>
      </div>
      <div className="field">
        <label htmlFor="p-status">Availability</label>
        <select id="p-status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="p-desc">Description</label>
        <textarea id="p-desc" value={description} style={{ minHeight: 80 }}
          placeholder="One or two sentences shown on the card…"
          onChange={(e) => setDescription(e.target.value)} />
      </div>

      <hr className="divider-line" />
      <PhotoManager
        items={photos}
        onChange={setPhotos}
        onRemoved={(p) => setRemovedPaths((r) => [...r, p])}
        folder="products"
        max={6}
        label="Photos (first one shows on the card)"
        hint="Up to 6. Each photo needs a short description for accessibility."
        showMissingAlt={showMissingAlt}
      />

      <hr className="divider-line" />
      <button className="btn btn-amber" type="submit" disabled={busy}>
        {busy ? "Saving…" : product ? "Save changes" : "Add to shop"}
      </button>
    </form>
  );
}
