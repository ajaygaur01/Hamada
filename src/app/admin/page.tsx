import { redirect } from "next/navigation";
import { getServerAuthUser } from "@/lib/auth/server-session";
import AdminPanelClient from "@/components/admin/AdminPanelClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Kaori by Chiran",
};

export default async function AdminPage() {
  const user = await getServerAuthUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return <AdminPanelClient adminName={user.username || user.email} />;
}
