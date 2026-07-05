import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminBar } from "@/components/admin/AdminBar";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <AdminBar title="Add a shop item" />
      <ProductForm product={null} />
    </div>
  );
}
