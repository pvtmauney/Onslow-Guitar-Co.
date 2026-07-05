"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteLuthier,
  deleteProduct,
  reorderLuthiers,
  reorderProducts,
} from "@/lib/actions";
import { useToast } from "./Toaster";

export function ItemActions({
  id,
  name,
  kind,
  index,
  orderedIds,
}: {
  id: string;
  name: string;
  kind: "luthier" | "product";
  index: number;
  orderedIds: string[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const editHref =
    kind === "luthier" ? `/admin/luthiers/${id}` : `/admin/products/${id}`;

  async function move(dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= orderedIds.length) return;
    setBusy(true);
    const ids = [...orderedIds];
    [ids[index], ids[target]] = [ids[target], ids[index]];
    const res =
      kind === "luthier" ? await reorderLuthiers(ids) : await reorderProducts(ids);
    setBusy(false);
    if (!res.ok) toast(res.error, true);
    router.refresh();
  }

  async function remove() {
    const label =
      kind === "luthier"
        ? `Remove ${name} from the website? This can't be undone.`
        : `Remove "${name}" from the shop? This can't be undone.`;
    if (!window.confirm(label)) return;
    setBusy(true);
    const res =
      kind === "luthier" ? await deleteLuthier(id) : await deleteProduct(id);
    setBusy(false);
    if (res.ok) toast(`${name} removed.`);
    else toast(res.error, true);
    router.refresh();
  }

  return (
    <div className="acts">
      <button
        type="button"
        className="mini"
        disabled={busy || index === 0}
        onClick={() => move(-1)}
        aria-label={`Move ${name} up`}
      >
        ↑
      </button>
      <button
        type="button"
        className="mini"
        disabled={busy || index === orderedIds.length - 1}
        onClick={() => move(1)}
        aria-label={`Move ${name} down`}
      >
        ↓
      </button>
      <Link className="mini" href={editHref}>
        Edit
      </Link>
      <button
        type="button"
        className="mini danger"
        disabled={busy}
        onClick={remove}
      >
        Delete
      </button>
    </div>
  );
}
