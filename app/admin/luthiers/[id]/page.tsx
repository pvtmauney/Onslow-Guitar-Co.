import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminBar } from "@/components/admin/AdminBar";
import { LuthierForm } from "@/components/admin/LuthierForm";
import type { LuthierWithMedia } from "@/lib/types";

export default async function EditLuthierPage({
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
    .from("luthiers")
    .select("*, media:luthier_media(*)")
    .eq("id", id)
    .single();
  if (!data) notFound();

  return (
    <div className="admin-shell">
      <AdminBar title={`Edit — ${data.name}`} />
      <LuthierForm luthier={data as LuthierWithMedia} />
    </div>
  );
}
