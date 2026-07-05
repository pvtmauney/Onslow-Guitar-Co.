"use client";

import { useMemo, useState } from "react";
import type { Category, ProductWithPhotos } from "@/lib/types";
import { AMP_CATEGORIES, CATEGORIES } from "@/lib/types";
import { ProductCard } from "./ProductCard";

// Merch and amps/cabs have their own sections on the page.
const EXCLUDED: readonly Category[] = ["Merch", ...AMP_CATEGORIES];

/** Gear grid with client-side category filter pills. */
export function GearSection({ products }: { products: ProductWithPhotos[] }) {
  const [filter, setFilter] = useState<string>("All");

  const gear = useMemo(
    () => products.filter((p) => !EXCLUDED.includes(p.category)),
    [products]
  );
  const cats = useMemo(
    () =>
      ["All", ...CATEGORIES.filter((c) => !EXCLUDED.includes(c))].filter(
        (c) => c === "All" || gear.some((p) => p.category === c)
      ),
    [gear]
  );
  const items =
    filter === "All" ? gear : gear.filter((p) => p.category === filter);

  return (
    <>
      <div
        className="filters"
        role="group"
        aria-label="Filter products by category"
      >
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            className={`pill${filter === c ? " active" : ""}`}
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="shop-grid" aria-live="polite">
        {items.length === 0 ? (
          <div className="empty-note">ITEMS COMING SOON</div>
        ) : (
          items.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </>
  );
}
