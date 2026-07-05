import { createClient } from "@supabase/supabase-js";
import type { LuthierWithMedia, ProductWithPhotos } from "./types";

/**
 * Public, read-only data access. Uses a plain (cookie-free) client so the
 * home page can be statically generated with ISR.
 */
function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getLuthiers(): Promise<LuthierWithMedia[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("luthiers")
      .select("*, media:luthier_media(*)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .order("sort_order", { referencedTable: "luthier_media", ascending: true });
    if (error || !data) return [];
    return data as LuthierWithMedia[];
  } catch {
    return [];
  }
}

export async function getProducts(): Promise<ProductWithPhotos[]> {
  const supabase = publicClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, photos:product_photos(*)")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .order("sort_order", { referencedTable: "product_photos", ascending: true });
    if (error || !data) return [];
    return data as ProductWithPhotos[];
  } catch {
    return [];
  }
}

/** Public URL for a file in the `media` storage bucket. */
export function storageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/media/${path}`;
}
