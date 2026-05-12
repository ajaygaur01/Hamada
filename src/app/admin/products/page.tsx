"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Package, Pencil, Trash2, Eye, EyeOff, Save, Loader2, Copy, MoreVertical } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Badge } from "@/components/admin/ui/Badge";
import { useToast } from "@/components/admin/ui/Toast";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";

export default function AdminProductsPage() {
  const [data, setData] = useState<{ products: any[]; totalPages: number }>({ products: [], totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [editingStock, setEditingStock] = useState<{ variantId: string; value: number } | null>(null);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?page=${page}&search=${encodeURIComponent(search)}&status=${statusFilter}`);
      const json = await res.json();
      setData({ products: json.products || [], totalPages: json.totalPages || 1 });
    } catch {
      toast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, toast]);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      toast(`Product ${currentStatus ? "deactivated" : "activated"}`, "success");
      fetchProducts();
    } catch {
      toast("Failed to update status", "error");
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
    if (!confirm(`Are you sure you want to deactivate ${selectedIds.length} products?`)) return;
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
          variants: [{ id: variantId, stock: newStock }] 
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
      toast("Product deactivated (soft delete)", "success");
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
      render: (p: any) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-200">
            {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <Package size={16} className="text-zinc-400" />}
          </div>
          <div>
            <Link href={`/admin/products/${p.id}`} className="font-semibold text-sm text-[#D04636] hover:underline truncate block">
              {p.name}
            </Link>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{p.categoryName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "variants",
      label: "Stock / Pricing",
      render: (p: any) => (
        <div className="space-y-2 min-w-[150px]">
          {p.variants.map((v: any) => (
            <div key={v.id} className="flex items-center justify-between gap-3 group/variant">
              <div className="text-[10px] text-zinc-500 font-medium">
                {v.size} — <span className="text-zinc-900 font-bold">₹{v.bulkPrice}</span>
              </div>
              <div className="flex items-center gap-1">
                {editingStock?.variantId === v.id ? (
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      autoFocus
                      className="w-12 px-1 py-0.5 text-[10px] border border-zinc-300 rounded outline-none focus:border-[#D04636]"
                      value={editingStock.value}
                      onChange={(e) => setEditingStock({ ...editingStock, value: Number(e.target.value) })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleQuickStockUpdate(p.id, v.id, editingStock.value);
                        if (e.key === 'Escape') setEditingStock(null);
                      }}
                    />
                    <button onClick={() => handleQuickStockUpdate(p.id, v.id, editingStock.value)} className="text-emerald-600 hover:text-emerald-700">
                      <Save size={12} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setEditingStock({ variantId: v.id, value: v.stock })}
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${v.stock > 10 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                  >
                    {v.stock}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (p: any) => (
        <Badge variant={p.isActive ? "success" : "default"}>
          {p.isActive ? "Active" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (p: any) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => toggleActive(p.id, p.isActive)} title={p.isActive ? "Deactivate" : "Activate"}
            className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
            {p.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <Link href={`/admin/products/new?duplicateId=${p.id}`} title="Duplicate" className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
            <Copy size={16} />
          </Link>
          <Link href={`/admin/products/${p.id}`} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
            <Pencil size={16} />
          </Link>
          <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-md hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Products</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage inventory, quick-edit stock, and perform bulk actions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 bg-[#D04636] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#B83C2D] transition-colors shadow-sm">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data.products}
        loading={loading}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        search={search}
        onSearchChange={setSearch}
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
        extraFilters={
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D04636]">
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Drafts Only</option>
          </select>
        }
        actions={
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleBulkStatus(true)} 
              disabled={updating}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              Publish
            </button>
            <button 
              onClick={() => handleBulkStatus(false)} 
              disabled={updating}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              Draft
            </button>
            <button 
              onClick={handleBulkDelete} 
              disabled={updating}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        }
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to deactivate this product? It will be marked as inactive and hidden from the storefront."
        confirmLabel="Delete Product"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
