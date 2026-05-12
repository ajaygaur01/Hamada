"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Tag, Pencil, Trash2, Loader2, Save, X } from "lucide-react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { useToast } from "@/components/admin/ui/Toast";
import ConfirmModal from "@/components/admin/ui/ConfirmModal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    display_order: 0,
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      toast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        display_order: category.display_order || 0,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        display_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: !editingCategory ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : prev.slug
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast("Name and slug are required", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: editingCategory ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: editingCategory?.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      toast(`Category ${editingCategory ? "updated" : "created"}`, "success");
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast(err.message || "Failed to save category", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      toast("Category deleted", "success");
      fetchCategories();
    } catch (err: any) {
      toast(err.message || "Failed to delete category", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Category Name",
      render: (c: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-400">
            <Tag size={16} />
          </div>
          <div>
            <p className="font-semibold text-sm text-zinc-900">{c.name}</p>
            <p className="text-xs text-zinc-400">/{c.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (c: any) => <span className="text-sm text-zinc-500 truncate max-w-xs block">{c.description || "—"}</span>,
    },
    {
      key: "products",
      label: "Products",
      render: (c: any) => <span className="text-sm text-zinc-600 font-medium">{c.productCount}</span>,
    },
    {
      key: "order",
      label: "Order",
      render: (c: any) => <span className="text-xs text-zinc-400">{c.display_order}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (c: any) => (
        <div className="flex justify-end gap-2">
          <button onClick={() => openModal(c)} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
            <Pencil size={16} />
          </button>
          <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-md hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors">
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
          <h1 className="text-2xl font-bold text-zinc-900">Categories</h1>
          <p className="text-zinc-500 text-sm mt-1">Organize your products into categories for better navigation.</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="inline-flex items-center gap-2 bg-[#D04636] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#B83C2D] transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
      />

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="font-bold text-lg text-zinc-900">{editingCategory ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category Name *</label>
                <input 
                  value={formData.name} 
                  onChange={e => handleNameChange(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]"
                  placeholder="e.g. Ceremonial Matcha"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Slug *</label>
                <input 
                  value={formData.slug} 
                  onChange={e => setFormData(p => ({...p, slug: e.target.value}))}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Display Order</label>
                <input 
                  type="number"
                  value={formData.display_order} 
                  onChange={e => setFormData(p => ({...p, display_order: Number(e.target.value)}))}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description} 
                  onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636] resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-zinc-100 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 rounded-xl border border-zinc-200">Cancel</button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="px-6 py-2.5 bg-[#D04636] text-white text-sm font-semibold rounded-xl hover:bg-[#B83C2D] flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingCategory ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone if no products are linked."
        confirmLabel="Delete Category"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
