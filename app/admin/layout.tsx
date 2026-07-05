import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/Toaster";

export const metadata: Metadata = {
  title: "Owner panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ToastProvider>{children}</ToastProvider>;
}
