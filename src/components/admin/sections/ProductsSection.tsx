"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Loader2, Pencil, Trash2, X, Save, Eye, EyeOff, Star, ShoppingCart, Package, ChevronDown } from "lucide-react";

type Variant = { id: string; size: string; unit: string; samplePrice: number; bulkPrice: number; stock: number; isActive: boolean };
type ImageInfo = { id: string; url: string; isPrimary: boolean };
type Category = { id: string; name: string };
type Product = {
  id: string; name: string; slug: string; categoryId: string; categoryName: string;
  isActive: boolean; isFeatured: boolean; shortDescription: string; origin: string | null;
  imageUrl: string | null; images: ImageInfo[];
  variantCount: number; variants: Variant[];
  sampleOrders: number; bulkOrders: number; reviews: number; createdAt: string;
};

type EditState = {
  name: string;
  shortDescription: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  variants: Variant[];
};

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const fetchProducts = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/products?search=${encodeURIComponent(q)}`);
      const data = await r.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchProducts]);

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setEditState({
      name: p.name,
      shortDescription: p.shortDescription,
      categoryId: p.categoryId,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      variants: p.variants.map(v => ({ ...v })),
    });
  };

  const handleSave = async () => {
    if (!editingProduct || !editState) return;
    setSaving(true);
    try {
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editState.name,
          shortDescription: editState.shortDescription,
          categoryId: editState.categoryId,
          isActive: editState.isActive,
          isFeatured: editState.isFeatured,
          variants: editState.variants,
        }),
      });
      await fetchProducts(search);
      setEditingProduct(null);
      setEditState(null);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !isActive }),
    });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !isActive } : p));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("This will deactivate the product. Continue?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: false } : p));
  };

  const updateVariant = (idx: number, field: keyof Variant, value: any) => {
    if (!editState) return;
    setEditState(prev => {
      if (!prev) return prev;
      const variants = [...prev.variants];
      variants[idx] = { ...variants[idx], [field]: value };
      return { ...prev, variants };
    });
  };

  const activeCount = products.filter(p => p.isActive).length;
  const inactiveCount = products.filter(p => !p.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Products</h2>
          <p className="text-zinc-500 text-sm mt-1">
            {products.length} total · <span className="text-emerald-600">{activeCount} active</span> · <span className="text-zinc-400">{inactiveCount} inactive</span>
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input type="text" placeholder="Search products..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] transition-all" />
          </div>
          <div className="flex bg-zinc-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${viewMode === "grid" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}>
              Grid
            </button>
            <button onClick={() => setViewMode("table")}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${viewMode === "table" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}>
              Table
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-400" size={28} /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">No products found.</div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className={`bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md ${p.isActive ? "border-zinc-200" : "border-zinc-200 opacity-60"}`}>
              {/* Product Header */}
              <div className="flex items-start gap-3 p-4 pb-3">
                <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 shrink-0 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-900 text-sm truncate">{p.name}</h3>
                    {p.isFeatured && <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{p.categoryName} · {p.slug}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Variants */}
              <div className="px-4 pb-3">
                <div className="space-y-1.5">
                  {p.variants.map(v => (
                    <div key={v.id} className="flex items-center justify-between text-xs bg-zinc-50 rounded-lg px-3 py-2">
                      <span className="font-medium text-zinc-700">{v.size}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500">S: ₹{v.samplePrice}</span>
                        <span className="text-zinc-500">B: ₹{v.bulkPrice}</span>
                        <span className={`font-semibold ${v.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                          {v.stock} in stock
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 bg-zinc-50/50">
                <div className="flex gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><ShoppingCart size={11} /> {p.sampleOrders + p.bulkOrders} orders</span>
                  <span className="flex items-center gap-1"><Star size={11} /> {p.reviews} reviews</span>
                </div>
                <button onClick={() => handleToggleActive(p.id, p.isActive)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                    p.isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-zinc-200 text-zinc-500 hover:bg-zinc-300"
                  }`}>
                  {p.isActive ? <><Eye size={10} /> Active</> : <><EyeOff size={10} /> Inactive</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Variants</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Orders</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map(p => (
                  <tr key={p.id} className={`hover:bg-zinc-50 transition-colors ${!p.isActive ? "opacity-50" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                          {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <Package size={16} className="text-zinc-400" />}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 text-sm">{p.name}</p>
                          <p className="text-xs text-zinc-400 truncate max-w-[180px]">{p.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-zinc-600 text-xs">{p.categoryName}</td>
                    <td className="px-5 py-3">
                      {p.variants.map(v => (
                        <div key={v.id} className="text-xs text-zinc-600">{v.size} — ₹{v.samplePrice} / ₹{v.bulkPrice} ({v.stock})</div>
                      ))}
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-600">{p.sampleOrders + p.bulkOrders}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleToggleActive(p.id, p.isActive)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProduct && editState && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => { setEditingProduct(null); setEditState(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-100 rounded-t-2xl">
              <h2 className="font-bold text-lg text-zinc-900">Edit Product</h2>
              <button onClick={() => { setEditingProduct(null); setEditState(null); }}
                className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Basic Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Product Name</label>
                    <input value={editState.name}
                      onChange={e => setEditState(prev => prev ? { ...prev, name: e.target.value } : prev)}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Short Description</label>
                    <textarea value={editState.shortDescription}
                      onChange={e => setEditState(prev => prev ? { ...prev, shortDescription: e.target.value } : prev)}
                      rows={2}
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
                    <div className="relative">
                      <select value={editState.categoryId}
                        onChange={e => setEditState(prev => prev ? { ...prev, categoryId: e.target.value } : prev)}
                        className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636] appearance-none bg-white">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-end gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editState.isActive}
                        onChange={e => setEditState(prev => prev ? { ...prev, isActive: e.target.checked } : prev)}
                        className="w-4 h-4 rounded accent-[#D04636]" />
                      <span className="text-sm text-zinc-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editState.isFeatured}
                        onChange={e => setEditState(prev => prev ? { ...prev, isFeatured: e.target.checked } : prev)}
                        className="w-4 h-4 rounded accent-[#D04636]" />
                      <span className="text-sm text-zinc-700">Featured</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Images Preview */}
              {editingProduct.images.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Images</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {editingProduct.images.map(img => (
                      <div key={img.id} className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 ${img.isPrimary ? "border-[#D04636]" : "border-zinc-200"}`}>
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400">Image management is handled via the database. The primary image is highlighted with a red border.</p>
                </div>
              )}

              {/* Variants / Pricing */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Variants & Pricing</h3>
                <div className="space-y-3">
                  {editState.variants.map((v, idx) => (
                    <div key={v.id} className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-sm text-zinc-800">{v.size} <span className="font-normal text-zinc-400">({v.unit})</span></p>
                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input type="checkbox" checked={v.isActive}
                            onChange={e => updateVariant(idx, "isActive", e.target.checked)}
                            className="w-3.5 h-3.5 rounded accent-[#D04636]" />
                          <span className="text-zinc-600">Active</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Sample Price (₹)</label>
                          <input type="number" value={v.samplePrice}
                            onChange={e => updateVariant(idx, "samplePrice", Number(e.target.value))}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D04636]" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Bulk Price (₹)</label>
                          <input type="number" value={v.bulkPrice}
                            onChange={e => updateVariant(idx, "bulkPrice", Number(e.target.value))}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D04636]" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Stock Qty</label>
                          <input type="number" value={v.stock}
                            onChange={e => updateVariant(idx, "stock", Number(e.target.value))}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D04636]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-zinc-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => { setEditingProduct(null); setEditState(null); }}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#D04636] text-white text-sm font-semibold hover:bg-[#B83C2D] transition-colors flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
