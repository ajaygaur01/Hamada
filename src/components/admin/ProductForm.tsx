"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, UploadCloud, X, Plus, GripVertical, Image as ImageIcon, Trash2 } from "lucide-react";
import { useToast } from "./ui/Toast";

type ImageType = { id?: string; url: string; altText: string; isPrimary: boolean; displayOrder: number; file?: File };
type VariantType = { id?: string; size: string; unit: string; samplePrice: number; bulkPrice: number; stock: number; minBulkQuantity: number; isActive: boolean };

interface ProductFormProps {
  initialData?: any;
  categories: { id: string; name: string }[];
  isEdit?: boolean;
}

export default function ProductForm({ initialData, categories, isEdit }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    categoryId: initialData?.category_id || (categories[0]?.id || ""),
    grade: initialData?.grade || "",
    shortDescription: initialData?.short_description || "",
    fullDescription: initialData?.full_description || "",
    origin: initialData?.origin || "",
    tastingProfile: initialData?.tasting_profile || "",
    useCases: initialData?.use_cases?.join(", ") || "",
    storageInstructions: initialData?.storage_instructions || "",
    shelfLife: initialData?.shelf_life || "",
    brewingGuide: initialData?.brewing_guide || "",
    isActive: initialData?.is_active ?? true,
    isFeatured: initialData?.is_featured ?? false,
  });

  const [images, setImages] = useState<ImageType[]>(
    (initialData?.images || []).map((img: any) => ({
      id: img.id, url: img.image_url, altText: img.alt_text || "", 
      isPrimary: img.is_primary, displayOrder: img.display_order
    }))
  );

  const [variants, setVariants] = useState<VariantType[]>(
    initialData?.variants?.length ? initialData.variants.map((v: any) => ({
      id: v.id, size: v.size, unit: v.unit, samplePrice: v.sample_price, 
      bulkPrice: v.bulk_price, stock: v.stock_quantity, minBulkQuantity: v.min_bulk_quantity, isActive: v.is_active
    })) : [{ size: "50g", unit: "grams", samplePrice: 0, bulkPrice: 0, stock: 0, minBulkQuantity: 1, isActive: true }]
  );

  // Auto-slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      name: val, 
      slug: !isEdit ? val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : prev.slug 
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    
    // Add temp previews
    const newImages = files.map((file, idx) => ({
      url: URL.createObjectURL(file),
      altText: "",
      isPrimary: images.length === 0 && idx === 0,
      displayOrder: images.length + idx,
      file // Keep file reference for actual upload on save
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (idx: number) => {
    setImages(prev => {
      const copy = [...prev];
      const removed = copy.splice(idx, 1)[0];
      if (removed.isPrimary && copy.length > 0) copy[0].isPrimary = true;
      return copy;
    });
  };

  const setPrimaryImage = (idx: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === idx })));
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { size: "", unit: "grams", samplePrice: 0, bulkPrice: 0, stock: 0, minBulkQuantity: 1, isActive: true }]);
  };
  const removeVariant = (idx: number) => setVariants(prev => prev.filter((_, i) => i !== idx));
  const updateVariant = (idx: number, field: keyof VariantType, val: any) => {
    setVariants(prev => { const c = [...prev]; c[idx] = { ...c[idx], [field]: val }; return c; });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug || !formData.categoryId) {
      toast("Name, slug, and category are required.", "error"); return;
    }
    
    setSaving(true);
    try {
      // 1. Upload new images first
      const uploadedImages = await Promise.all(images.map(async (img) => {
        if (img.file) {
          const body = new FormData(); body.append("file", img.file);
          const res = await fetch("/api/admin/upload", { method: "POST", body });
          if (!res.ok) throw new Error("Upload failed");
          const { url } = await res.json();
          return { ...img, url, id: undefined, file: undefined }; // New image
        }
        return img; // Existing image
      }));

      // 2. Save product
      const payload = {
        ...(isEdit && { id: initialData.id }),
        ...formData,
        useCases: formData.useCases.split(",").map(s => s.trim()).filter(Boolean),
        variants,
        images: uploadedImages,
      };

      const res = await fetch("/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      toast(isEdit ? "Product updated" : "Product created", "success");
      router.push("/admin/products");
    } catch (err: any) {
      toast(err.message || "Failed to save product", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">{isEdit ? "Edit Product" : "Add New Product"}</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors border border-zinc-200">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#D04636] hover:bg-[#B83C2D] transition-colors flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-900">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Name *</label>
                <input value={formData.name} onChange={handleNameChange} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]" placeholder="Premium Matcha..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Slug *</label>
                  <input value={formData.slug} onChange={e => setFormData(p => ({...p, slug: e.target.value}))} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Grade</label>
                  <input value={formData.grade} onChange={e => setFormData(p => ({...p, grade: e.target.value}))} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]" placeholder="Ceremonial, Culinary..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Short Description</label>
                <textarea rows={2} value={formData.shortDescription} onChange={e => setFormData(p => ({...p, shortDescription: e.target.value}))} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Full Description</label>
                <textarea rows={6} value={formData.fullDescription} onChange={e => setFormData(p => ({...p, fullDescription: e.target.value}))} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636] resize-none" />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-900">Media</h2>
            <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className={`relative group aspect-square rounded-xl overflow-hidden border-2 ${img.isPrimary ? "border-[#D04636]" : "border-zinc-200"}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {!img.isPrimary && (
                      <button onClick={() => setPrimaryImage(idx)} className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded">Set Primary</button>
                    )}
                    <button onClick={() => removeImage(idx)} className="text-white hover:text-red-400 p-1"><Trash2 size={16} /></button>
                  </div>
                  {img.isPrimary && <div className="absolute top-2 left-2 bg-[#D04636] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Primary</div>}
                </div>
              ))}
              <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-zinc-300 hover:border-[#D04636] hover:bg-zinc-50 transition-colors flex flex-col items-center justify-center text-zinc-500 gap-2">
                <UploadCloud size={24} />
                <span className="text-xs font-medium">Upload Image</span>
              </button>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-zinc-900">Variants & Pricing</h2>
              <button onClick={addVariant} className="text-xs font-semibold text-[#D04636] hover:underline flex items-center gap-1"><Plus size={14}/> Add Variant</button>
            </div>
            <div className="space-y-4">
              {variants.map((v, idx) => (
                <div key={idx} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl relative group">
                  <button onClick={() => removeVariant(idx)} className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Size / Weight</label>
                      <input value={v.size} onChange={e => updateVariant(idx, "size", e.target.value)} placeholder="e.g. 50g, 1kg" className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D04636]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Stock Qty</label>
                      <input type="number" value={v.stock} onChange={e => updateVariant(idx, "stock", Number(e.target.value))} className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D04636]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Sample Price (₹)</label>
                      <input type="number" value={v.samplePrice} onChange={e => updateVariant(idx, "samplePrice", Number(e.target.value))} className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D04636]" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Bulk Price (₹)</label>
                      <input type="number" value={v.bulkPrice} onChange={e => updateVariant(idx, "bulkPrice", Number(e.target.value))} className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D04636]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Status & Organization */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-900">Organization</h2>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Status</label>
              <select value={formData.isActive ? "active" : "draft"} onChange={e => setFormData(p => ({...p, isActive: e.target.value === "active"}))} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]">
                <option value="active">Active (Published)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Category *</label>
              <select value={formData.categoryId} onChange={e => setFormData(p => ({...p, categoryId: e.target.value}))} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]">
                <option value="" disabled>Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData(p => ({...p, isFeatured: e.target.checked}))} className="w-4 h-4 rounded accent-[#D04636]" />
              <span className="text-sm font-medium text-zinc-700">Feature on Homepage</span>
            </label>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-900">Product Details</h2>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Origin</label>
              <input value={formData.origin} onChange={e => setFormData(p => ({...p, origin: e.target.value}))} placeholder="Kagoshima, Japan" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Tasting Profile</label>
              <input value={formData.tastingProfile} onChange={e => setFormData(p => ({...p, tastingProfile: e.target.value}))} placeholder="Umami, Sweet, Nutty" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Tags (Comma separated)</label>
              <input value={formData.useCases} onChange={e => setFormData(p => ({...p, useCases: e.target.value}))} placeholder="Latte, Baking, Ceremony" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Shelf Life</label>
              <input value={formData.shelfLife} onChange={e => setFormData(p => ({...p, shelfLife: e.target.value}))} placeholder="12 months from packing" className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
