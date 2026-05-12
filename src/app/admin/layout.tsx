import { redirect } from "next/navigation";
import { getServerAuthUser } from "@/lib/auth/server-session";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = { title: "Admin — Kaori by Chiran" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerAuthUser();
  if (!user || user.role !== "admin") redirect("/");

  return <AdminShell adminName={user.username || user.email}>{children}</AdminShell>;
}
