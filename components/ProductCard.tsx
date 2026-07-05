import type { ProductWithPhotos, Status } from "@/lib/types";
import { storageUrl } from "@/lib/data";
import { ZoomImage } from "./ZoomImage";

const STATUS_CLASS: Record<Status, string> = {
  "In stock": "s-in",
  "Low stock": "s-low",
  "Sold out": "s-out",
  "Special order": "s-order",
};

export function ProductCard({ product }: { product: ProductWithPhotos }) {
  const photos = [...(product.photos ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const photo = photos[0];

  return (
    <article className="product">
      <div className="product-photo">
        {photo ? (
          <ZoomImage
            src={storageUrl(photo.storage_path)}
            alt={photo.alt_text || product.name}
            className="zoom"
            sizes="(max-width: 640px) 100vw, 280px"
          />
        ) : (
          <div className="placeholder">
            {(product.category || "ITEM").toUpperCase()}
          </div>
        )}
      </div>
      <div className="product-body">
        <p className="pcat">{product.category}</p>
        <h3>{product.name}</h3>
        {product.description && <p className="pdesc">{product.description}</p>}
        <div className="price-row">
          <span className="price">{product.price}</span>
          <span className={`pstatus ${STATUS_CLASS[product.status] ?? "s-in"}`}>
            {product.status}
          </span>
        </div>
      </div>
    </article>
  );
}
