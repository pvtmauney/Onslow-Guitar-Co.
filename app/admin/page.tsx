import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminBar } from "@/components/admin/AdminBar";
import { ItemActions } from "@/components/admin/ItemActions";
import type { Luthier, LuthierMedia, Product, ProductPhoto } from "@/lib/types";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ data: luthiers }, { data: products }] = await Promise.all([
    supabase
      .from("luthiers")
      .select("*, media:luthier_media(id, kind)")
      .order("sort_order")
      .order("created_at"),
    supabase
      .from("products")
      .select("*, photos:product_photos(id)")
      .order("sort_order")
      .order("created_at"),
  ]);

  type LuthierRow = Luthier & { media: Pick<LuthierMedia, "id" | "kind">[] };
  type ProductRow = Product & { photos: Pick<ProductPhoto, "id">[] };
  const luthierRows = (luthiers ?? []) as LuthierRow[];
  const productRows = (products ?? []) as ProductRow[];
  const luthierIds = luthierRows.map((l) => l.id);
  const productIds = productRows.map((p) => p.id);

  return (
    <div className="admin-shell">
      <AdminBar title="Owner panel" />

      <p className="admin-sec">Builders</p>
      <div className="admin-list">
        {luthierRows.length === 0 && <p className="hint">No builders yet.</p>}
        {luthierRows.map((l, i) => {
          const photos = l.media.filter((m) => m.kind === "photo").length;
          const videos = l.media.length - photos;
          return (
            <div className="admin-item" key={l.id}>
              <div className="who">
                <strong>{l.name}</strong>
                <span>
                  {l.town.toUpperCase()} · {photos} PHOTOS · {videos} VIDEOS
                </span>
              </div>
              <ItemActions
                id={l.id}
                name={l.name}
                kind="luthier"
                index={i}
                orderedIds={luthierIds}
              />
            </div>
          );
        })}
      </div>
      <Link className="btn btn-amber" href="/admin/luthiers/new">
        + Add a luthier
      </Link>

      <p className="admin-sec">Gear &amp; Merch</p>
      <div className="admin-list">
        {productRows.length === 0 && <p className="hint">No items yet.</p>}
        {productRows.map((p, i) => (
          <div className="admin-item" key={p.id}>
            <div className="who">
              <strong>{p.name}</strong>
              <span>
                {p.category.toUpperCase()} · {p.price || "—"} ·{" "}
                {p.status.toUpperCase()} · {p.photos.length} PHOTOS
              </span>
            </div>
            <ItemActions
              id={p.id}
              name={p.name}
              kind="product"
              index={i}
              orderedIds={productIds}
            />
          </div>
        ))}
      </div>
      <Link className="btn btn-amber" href="/admin/products/new">
        + Add a shop item
      </Link>
    </div>
  );
}
