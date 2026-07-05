"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveLuthier } from "@/lib/actions";
import type { LuthierWithMedia, MediaInput, PhotoInput } from "@/lib/types";
import { PhotoManager } from "./PhotoManager";
import { VideoManager } from "./VideoManager";
import { useToast } from "./Toaster";

export function LuthierForm({ luthier }: { luthier: LuthierWithMedia | null }) {
  const router = useRouter();
  const toast = useToast();

  const initialMedia = [...(luthier?.media ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const [name, setName] = useState(luthier?.name ?? "");
  const [town, setTown] = useState(luthier?.town ?? "");
  const [county, setCounty] = useState(luthier?.county ?? "");
  const [badge, setBadge] = useState(luthier?.badge ?? "");
  const [bio, setBio] = useState(luthier?.bio ?? "");
  const [specialties, setSpecialties] = useState(
    (luthier?.specialties ?? []).join(", ")
  );
  const [photos, setPhotos] = useState<PhotoInput[]>(
    initialMedia
      .filter((m) => m.kind === "photo" && m.storage_path)
      .map((m) => ({ storage_path: m.storage_path!, alt_text: m.alt_text }))
  );
  const [videos, setVideos] = useState<MediaInput[]>(
    initialMedia
      .filter((m) => m.kind !== "photo")
      .map((m) => ({
        kind: m.kind,
        storage_path: m.storage_path,
        external_id: m.external_id,
        alt_text: m.alt_text,
      }))
  );
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [showMissingAlt, setShowMissingAlt] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !town.trim() || !bio.trim()) {
      toast("Name, town, and bio are required.", true);
      return;
    }
    if (photos.some((p) => !p.alt_text.trim())) {
      setShowMissingAlt(true);
      toast("Every photo needs a short description (alt text).", true);
      return;
    }
    setBusy(true);
    const media: MediaInput[] = [
      ...photos.map((p) => ({
        kind: "photo" as const,
        storage_path: p.storage_path,
        external_id: null,
        alt_text: p.alt_text,
      })),
      ...videos,
    ];
    const res = await saveLuthier({
      id: luthier?.id ?? null,
      name,
      town,
      county,
      badge,
      bio,
      specialties: specialties.split(","),
      media,
      removedPaths,
    });
    setBusy(false);
    if (res.ok) {
      toast(`${name.trim()} saved to the website.`);
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
        <label htmlFor="l-name">Name *</label>
        <input id="l-name" type="text" value={name} placeholder="Justin Jenkins"
          onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="l-town">Town *</label>
        <input id="l-town" type="text" value={town} placeholder="Jacksonville, North Carolina"
          onChange={(e) => setTown(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="l-county">County</label>
        <input id="l-county" type="text" value={county} placeholder="Onslow County"
          onChange={(e) => setCounty(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="l-badge">Badge</label>
        <input id="l-badge" type="text" value={badge} placeholder="UP & COMING (optional badge)"
          onChange={(e) => setBadge(e.target.value)} />
        <p className="hint">
          Short label shown next to the county, e.g. UP &amp; COMING or NEW BENCH.
        </p>
      </div>
      <div className="field">
        <label htmlFor="l-bio">Bio *</label>
        <textarea id="l-bio" value={bio} required
          placeholder="Their story, how they build, what their instruments sound like…"
          onChange={(e) => setBio(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="l-specs">Specialties</label>
        <input id="l-specs" type="text" value={specialties} placeholder="OM, DREADNOUGHT, 12-FRET"
          onChange={(e) => setSpecialties(e.target.value)} />
        <p className="hint">Comma-separated. Shown as small pills on the profile.</p>
      </div>

      <hr className="divider-line" />
      <PhotoManager
        items={photos}
        onChange={setPhotos}
        onRemoved={(p) => setRemovedPaths((r) => [...r, p])}
        folder="luthiers"
        max={6}
        label="Photos (first one is the main portrait)"
        hint="Up to 6. Each photo needs a short description for accessibility."
        showMissingAlt={showMissingAlt}
      />

      <hr className="divider-line" />
      <VideoManager
        items={videos}
        onChange={setVideos}
        onRemoved={(p) => setRemovedPaths((r) => [...r, p])}
        folder="videos"
      />

      <hr className="divider-line" />
      <button className="btn btn-amber" type="submit" disabled={busy}>
        {busy ? "Saving…" : luthier ? "Save changes" : "Add to website"}
      </button>
    </form>
  );
}
