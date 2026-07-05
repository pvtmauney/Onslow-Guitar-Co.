import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminBar } from "@/components/admin/AdminBar";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductWithPhotos } from "@/lib/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("products")
    .select("*, photos:product_photos(*)")
    .eq("id", id)
    .single();
  if (!data) notFound();

  return (
    <div className="admin-shell">
      <AdminBar title={`Edit — ${data.name}`} />
      <ProductForm product={data as ProductWithPhotos} />
    </div>
  );
}
