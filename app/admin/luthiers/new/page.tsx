import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminBar } from "@/components/admin/AdminBar";
import { LuthierForm } from "@/components/admin/LuthierForm";

export default async function NewLuthierPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <AdminBar title="Add a luthier" />
      <LuthierForm luthier={null} />
    </div>
  );
}
