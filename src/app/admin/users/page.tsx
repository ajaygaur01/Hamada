"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Eye, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Badge } from "@/components/admin/ui/Badge";
import { useToast } from "@/components/admin/ui/Toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      toast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const columns = [
    {
      key: "user",
      label: "User",
      render: (u: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D04636]/10 text-[#D04636] flex items-center justify-center font-bold text-xs shrink-0">
            {(u.fullName || u.email).slice(0, 2).toUpperCase()}
          </div>
          <div>
            <Link href={`/admin/users/${u.id}`} className="font-semibold text-sm text-zinc-900 hover:text-[#D04636] transition-colors">
              {u.fullName || "N/A"}
            </Link>
            <p className="text-xs text-zinc-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (u: any) => (
        <Badge variant={u.role === "admin" ? "danger" : "default"}>
          {u.role}
        </Badge>
      ),
    },
    {
      key: "company",
      label: "Company",
      render: (u: any) => (
        <div>
          <p className="text-sm text-zinc-600">{u.companyName || "—"}</p>
          {u.gstin && (
            <p className="text-[10px] flex items-center gap-1 mt-0.5">
              <span className="text-zinc-400 font-bold uppercase">GST:</span>
              <span className={u.gstinVerified ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                {u.gstin}
              </span>
            </p>
          )}
        </div>
      ),
    },
    {
      key: "orders",
      label: "Bulk Orders",
      render: (u: any) => <span className="text-sm text-zinc-600 font-medium">{u.bulkOrderCount}</span>,
    },
    {
      key: "joined",
      label: "Joined",
      render: (u: any) => (
        <span className="text-xs text-zinc-500">
          {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (u: any) => (
        <div className="flex justify-end">
          <Link href={`/admin/users/${u.id}`} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-[#D04636] transition-colors">
            <Eye size={18} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Users</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage customer accounts and administrative roles.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
      />
    </div>
  );
}
