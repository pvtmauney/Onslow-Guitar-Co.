"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORIES,
  STATUSES,
  MEDIA_KINDS,
  type MediaInput,
  type PhotoInput,
} from "./types";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

async function requireOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in.");
  return supabase;
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/admin");
}

async function removeStorageFiles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  paths: string[]
) {
  const clean = paths.filter(Boolean);
  if (clean.length === 0) return;
  // Best-effort: an orphaned file is not worth failing the save over.
  await supabase.storage.from("media").remove(clean);
}

/* ------------------------------ luthiers ------------------------------ */

export interface LuthierFormInput {
  id: string | null;
  name: string;
  town: string;
  county: string;
  badge: string;
  bio: string;
  specialties: string[];
  media: MediaInput[];
  removedPaths: string[];
}

export async function saveLuthier(
  input: LuthierFormInput
): Promise<ActionResult> {
  try {
    const supabase = await requireOwner();

    const name = input.name.trim();
    const town = input.town.trim();
    const bio = input.bio.trim();
    if (!name || !town || !bio)
      return { ok: false, error: "Name, town, and bio are required." };

    for (const m of input.media) {
      if (!MEDIA_KINDS.includes(m.kind))
        return { ok: false, error: "Unknown media type." };
      if (m.kind === "photo" && !m.alt_text.trim())
        return { ok: false, error: "Every photo needs alt text." };
    }

    const fields = {
      name,
      town,
      county: input.county.trim(),
      badge: input.badge.trim() || null,
      bio,
      specialties: input.specialties
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
    };

    let luthierId = input.id;
    if (luthierId) {
      const { error } = await supabase
        .from("luthiers")
        .update(fields)
        .eq("id", luthierId);
      if (error) return { ok: false, error: error.message };
      const { error: delErr } = await supabase
        .from("luthier_media")
        .delete()
        .eq("luthier_id", luthierId);
      if (delErr) return { ok: false, error: delErr.message };
    } else {
      const { count } = await supabase
        .from("luthiers")
        .select("*", { count: "exact", head: true });
      const { data, error } = await supabase
        .from("luthiers")
        .insert({ ...fields, sort_order: count ?? 0 })
        .select("id")
        .single();
      if (error || !data)
        return { ok: false, error: error?.message ?? "Insert failed." };
      luthierId = data.id;
    }

    if (input.media.length > 0) {
      const rows = input.media.map((m, i) => ({
        luthier_id: luthierId,
        kind: m.kind,
        storage_path: m.storage_path,
        external_id: m.external_id,
        alt_text: m.alt_text.trim(),
        sort_order: i,
      }));
      const { error } = await supabase.from("luthier_media").insert(rows);
      if (error) return { ok: false, error: error.message };
    }

    await removeStorageFiles(supabase, input.removedPaths);
    revalidateSite();
    return { ok: true, id: luthierId ?? undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteLuthier(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireOwner();
    const { data: media } = await supabase
      .from("luthier_media")
      .select("storage_path")
      .eq("luthier_id", id);
    const { error } = await supabase.from("luthiers").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    await removeStorageFiles(
      supabase,
      (media ?? []).map((m) => m.storage_path as string).filter(Boolean)
    );
    revalidateSite();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Delete failed." };
  }
}

export async function reorderLuthiers(ids: string[]): Promise<ActionResult> {
  try {
    const supabase = await requireOwner();
    for (let i = 0; i < ids.length; i++) {
      const { error } = await supabase
        .from("luthiers")
        .update({ sort_order: i })
        .eq("id", ids[i]);
      if (error) return { ok: false, error: error.message };
    }
    revalidateSite();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Reorder failed." };
  }
}

/* ------------------------------ products ------------------------------ */

export interface ProductFormInput {
  id: string | null;
  name: string;
  category: string;
  price: string;
  status: string;
  description: string;
  photos: PhotoInput[];
  removedPaths: string[];
}

export async function saveProduct(
  input: ProductFormInput
): Promise<ActionResult> {
  try {
    const supabase = await requireOwner();

    const name = input.name.trim();
    if (!name) return { ok: false, error: "The item needs a name." };
    if (!(CATEGORIES as readonly string[]).includes(input.category))
      return { ok: false, error: "Unknown category." };
    if (!(STATUSES as readonly string[]).includes(input.status))
      return { ok: false, error: "Unknown availability status." };
    for (const p of input.photos) {
      if (!p.alt_text.trim())
        return { ok: false, error: "Every photo needs alt text." };
    }

    const fields = {
      name,
      category: input.category,
      price: input.price.trim(),
      status: input.status,
      description: input.description.trim(),
    };

    let productId = input.id;
    if (productId) {
      const { error } = await supabase
        .from("products")
        .update(fields)
        .eq("id", productId);
      if (error) return { ok: false, error: error.message };
      const { error: delErr } = await supabase
        .from("product_photos")
        .delete()
        .eq("product_id", productId);
      if (delErr) return { ok: false, error: delErr.message };
    } else {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      const { data, error } = await supabase
        .from("products")
        .insert({ ...fields, sort_order: count ?? 0 })
        .select("id")
        .single();
      if (error || !data)
        return { ok: false, error: error?.message ?? "Insert failed." };
      productId = data.id;
    }

    if (input.photos.length > 0) {
      const rows = input.photos.map((p, i) => ({
        product_id: productId,
        storage_path: p.storage_path,
        alt_text: p.alt_text.trim(),
        sort_order: i,
      }));
      const { error } = await supabase.from("product_photos").insert(rows);
      if (error) return { ok: false, error: error.message };
    }

    await removeStorageFiles(supabase, input.removedPaths);
    revalidateSite();
    return { ok: true, id: productId ?? undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const supabase = await requireOwner();
    const { data: photos } = await supabase
      .from("product_photos")
      .select("storage_path")
      .eq("product_id", id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    await removeStorageFiles(
      supabase,
      (photos ?? []).map((p) => p.storage_path).filter(Boolean)
    );
    revalidateSite();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Delete failed." };
  }
}

export async function reorderProducts(ids: string[]): Promise<ActionResult> {
  try {
    const supabase = await requireOwner();
    for (let i = 0; i < ids.length; i++) {
      const { error } = await supabase
        .from("products")
        .update({ sort_order: i })
        .eq("id", ids[i]);
      if (error) return { ok: false, error: error.message };
    }
    revalidateSite();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Reorder failed." };
  }
}
