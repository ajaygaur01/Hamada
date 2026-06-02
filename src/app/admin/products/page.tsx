"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  Package,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Copy,
  ExternalLink,
  Star,
} from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/admin/ui/DataTable";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Badge } from "@/components/admin/ui/Badge";
import { useToast } from "@/components/admin/ui/Toast";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";

export default function AdminProductsPage() {
  const [data, setData] = useState<{
    products: Record<string, unknown>[];
    categories: { id: string; name: string }[];
    total: number;
    totalPages: number;
  }>({ products: [], categories: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [editingStock, setEditingStock] = useState<{ variantId: string; value: number } | null>(
    null
  );
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        search,
        status: statusFilter,
      });
      if (categoryFilter) params.set("categoryId", categoryFilter);
      const res = await fetch(`/api/admin/products?${params}`);
      const json = await res.json();
      setData({
        products: json.products || [],
        categories: json.categories || [],
        total: json.total || 0,
        totalPages: json.totalPages || 1,
      });
    } catch {
      toast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter, toast]);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const stats = useMemo(() => {
    const active = data.products.filter((p) => p.is_active).length;
    const featured = data.products.filter((p) => p.is_featured).length;
    const lowStock = data.products.filter((p) =>
      (p.variants as { stock: number }[])?.some((v) => v.stock <= 10)
    ).length;
    return { active, featured, lowStock };
  }, [data.products]);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      toast(`Product ${currentStatus ? "hidden" : "published"}`, "success");
      fetchProducts();
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: !current }),
      });
      toast(current ? "Removed from featured" : "Added to featured", "success");
      fetchProducts();
    } catch {
      toast("Failed to update", "error");
    }
  };

  const handleBulkStatus = async (isActive: boolean) => {
    if (selectedIds.length === 0) return;
    setUpdating(true);
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, isActive }),
      });
      toast(`Updated ${selectedIds.length} products`, "success");
      setSelectedIds([]);
      fetchProducts();
    } catch {
      toast("Bulk update failed", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setUpdating(true);
    try {
      await fetch(`/api/admin/products?ids=${selectedIds.join(",")}`, { method: "DELETE" });
      toast(`Deactivated ${selectedIds.length} products`, "success");
      setSelectedIds([]);
      fetchProducts();
    } catch {
      toast("Bulk delete failed", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickStockUpdate = async (productId: string, variantId: string, newStock: number) => {
    setUpdating(true);
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          variants: [{ id: variantId, stock: newStock }],
        }),
      });
      toast("Stock updated", "success");
      setEditingStock(null);
      fetchProducts();
    } catch {
      toast("Failed to update stock", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/products?id=${deleteId}`, { method: "DELETE" });
      toast("Product deactivated", "success");
      fetchProducts();
    } catch {
      toast("Failed to delete product", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (p: Record<string, unknown>) => (
        <div className="flex min-w-[220px] items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
            {p.imageUrl ? (
              <img src={p.imageUrl as string} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package size={18} className="text-zinc-400" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/admin/products/${p.id}`}
                className="truncate font-semibold text-sm text-zinc-900 hover:text-[#D04636]"
              >
                {p.name as string}
              </Link>
              {Boolean(p.is_featured) && (
                <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" />
              )}
            </div>
            <p className="text-[11px] text-zinc-400">{p.categoryName as string}</p>
            <Link
              href={`/products/${p.slug}`}
              target="_blank"
              className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] text-zinc-400 hover:text-[#D04636]"
            >
              View live <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (p: Record<string, unknown>) => (
        <p className="max-w-[200px] truncate text-xs text-zinc-500" title={p.short_description as string}>
          {(p.short_description as string) || "—"}
        </p>
      ),
    },
    {
      key: "variants",
      label: "Stock & pricing",
      render: (p: Record<string, unknown>) => (
        <div className="min-w-[160px] space-y-1.5">
          {(p.variants as { id: string; size: string; bulkPrice: number; stock: number }[]).map(
            (v) => (
              <div key={v.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-zinc-500">
                  {v.size} · <span className="font-semibold text-zinc-800">₹{v.bulkPrice}</span>
                </span>
                {editingStock?.variantId === v.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      autoFocus
                      className="w-14 rounded border border-zinc-300 px-1 py-0.5 text-[10px] outline-none focus:border-[#D04636]"
                      value={editingStock.value}
                      onChange={(e) =>
                        setEditingStock({ ...editingStock, value: Number(e.target.value) })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleQuickStockUpdate(p.id as string, v.id, editingStock.value);
                        if (e.key === "Escape") setEditingStock(null);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickStockUpdate(p.id as string, v.id, editingStock.value)
                      }
                      className="text-emerald-600"
                    >
                      <Save size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingStock({ variantId: v.id, value: v.stock })}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      v.stock > 10
                        ? "bg-emerald-50 text-emerald-700"
                        : v.stock > 0
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {v.stock} in stock
                  </button>
                )}
              </div>
            )
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (p: Record<string, unknown>) => (
        <Badge variant={p.is_active ? "success" : "default"}>
          {p.is_active ? "Active" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (p: Record<string, unknown>) => (
        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            onClick={() => toggleFeatured(p.id as string, p.is_featured as boolean)}
            title={p.is_featured ? "Unfeature" : "Feature"}
            className={`rounded-lg p-2 transition-colors hover:bg-zinc-100 ${
              p.is_featured ? "text-amber-500" : "text-zinc-400"
            }`}
          >
            <Star size={16} className={p.is_featured ? "fill-current" : ""} />
          </button>
          <button
            type="button"
            onClick={() => toggleActive(p.id as string, p.is_active as boolean)}
            title={p.is_active ? "Hide" : "Publish"}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            {p.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <Link
            href={`/admin/products/new?duplicateId=${p.id}`}
            title="Duplicate"
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <Copy size={16} />
          </Link>
          <Link
            href={`/admin/products/${p.id}`}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-[#D04636]"
          >
            <Pencil size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(p.id as string)}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your full catalog — edit descriptions, prices, images, variants, and inventory from one place."
        stats={[
          { label: "Total", value: data.total || data.products.length },
          { label: "On this page", value: stats.active },
          { label: "Featured", value: stats.featured },
          { label: "Low stock", value: stats.lowStock },
        ]}
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#D04636] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#D04636]/20 transition-colors hover:bg-[#B83C2D]"
          >
            <Plus size={16} /> Add product
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={data.products as { id: string }[]}
        loading={loading}
        emptyMessage="No products found. Add your first product to get started."
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
        extraFilters={
          <>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D04636] focus:ring-2 focus:ring-[#D04636]/10"
            >
              <option value="">All categories</option>
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#D04636] focus:ring-2 focus:ring-[#D04636]/10"
            >
              <option value="all">All status</option>
              <option value="active">Active only</option>
              <option value="inactive">Drafts only</option>
            </select>
          </>
        }
        actions={
          <>
            <button
              type="button"
              onClick={() => handleBulkStatus(true)}
              disabled={updating}
              className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold transition-colors hover:bg-white/30 disabled:opacity-50"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus(false)}
              disabled={updating}
              className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold transition-colors hover:bg-white/30 disabled:opacity-50"
            >
              Draft
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={updating}
              className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold transition-colors hover:bg-white/30 disabled:opacity-50"
            >
              Deactivate
            </button>
          </>
        }
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Deactivate product"
        message="This product will be hidden from the storefront. You can reactivate it anytime from the edit page."
        confirmLabel="Deactivate"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
