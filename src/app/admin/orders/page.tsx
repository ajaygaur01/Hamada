"use client";

import { useEffect, useState, useCallback } from "react";
import { ShoppingCart, Eye, FileText, Search, Filter } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Badge } from "@/components/admin/ui/Badge";
import { useToast } from "@/components/admin/ui/Toast";

type OrderType = "sample" | "bulk";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "sample" | "bulk">("all");
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?type=${typeFilter}&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      
      // Combine and sort orders by date
      const combined = [
        ...(data.sampleOrders || []),
        ...(data.bulkOrders || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setOrders(combined);
    } catch {
      toast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, search, toast]);

  useEffect(() => {
    const t = setTimeout(() => fetchOrders(), 300);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  const columns = [
    {
      key: "order_number",
      label: "Order #",
      render: (o: any) => (
        <span className="font-mono text-xs font-bold text-zinc-700">{o.order_number}</span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (o: any) => (
        <div>
          <p className="font-medium text-sm text-zinc-900">{o.customer_name || o.user?.full_name || o.user?.email}</p>
          <p className="text-xs text-zinc-400">{o.email || o.user?.email}</p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (o: any) => (
        <Badge variant={o.type === "sample" ? "info" : "warning"}>
          {o.type}
        </Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (o: any) => (
        <span className="font-semibold text-zinc-900">₹{(o.amount || o.total_amount || 0).toLocaleString("en-IN")}</span>
      ),
    },
    {
      key: "payment_status",
      label: "Payment",
      render: (o: any) => {
        const variant = o.payment_status === "paid" ? "success" : o.payment_status === "failed" ? "danger" : "warning";
        return <Badge variant={variant}>{o.payment_status}</Badge>;
      },
    },
    {
      key: "order_status",
      label: "Status",
      render: (o: any) => {
        const variant = o.order_status === "delivered" ? "success" : o.order_status === "cancelled" ? "danger" : "info";
        return <Badge variant={variant}>{o.order_status}</Badge>;
      },
    },
    {
      key: "created_at",
      label: "Date",
      render: (o: any) => (
        <span className="text-xs text-zinc-500">
          {new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (o: any) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/orders/${o.id}?type=${o.type}`} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-[#D04636] transition-colors">
            <Eye size={18} />
          </Link>
          {o.invoice_url && (
            <a href={o.invoice_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-[#D04636] transition-colors">
              <FileText size={18} />
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
          <p className="text-zinc-500 text-sm mt-1">Track and manage all sample and bulk orders.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        extraFilters={
          <div className="flex items-center gap-2">
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D04636]"
            >
              <option value="all">All Types</option>
              <option value="sample">Sample Orders</option>
              <option value="bulk">Bulk Orders</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
