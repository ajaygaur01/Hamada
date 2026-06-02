"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Loader2,
  UploadCloud,
  X,
  Plus,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  FileText,
  IndianRupee,
  Info,
  Settings2,
} from "lucide-react";
import { useToast } from "./ui/Toast";

type ImageType = {
  id?: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
  file?: File;
};

type VariantType = {
  id?: string;
  size: string;
  unit: string;
  samplePrice: number;
  bulkPrice: number;
  stock: number;
  minBulkQuantity: number;
  isActive: boolean;
};

type TabId = "general" | "media" | "pricing" | "details";

interface ProductFormProps {
  initialData?: Record<string, unknown>;
  categories: { id: string; name: string }[];
  isEdit?: boolean;
}

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: "general", label: "General", icon: FileText },
  { id: "media", label: "Images", icon: ImageIcon },
  { id: "pricing", label: "Pricing & Stock", icon: IndianRupee },
  { id: "details", label: "Details", icon: Info },
];

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#D04636] focus:ring-2 focus:ring-[#D04636]/10";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500";

export default function ProductForm({ initialData, categories, isEdit }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: (initialData?.name as string) || "",
    slug: (initialData?.slug as string) || "",
    categoryId: (initialData?.category_id as string) || categories[0]?.id || "",
    grade: (initialData?.grade as string) || "",
    shortDescription: (initialData?.short_description as string) || "",
    fullDescription: (initialData?.full_description as string) || "",
    origin: (initialData?.origin as string) || "",
    tastingProfile: (initialData?.tasting_profile as string) || "",
    useCases: Array.isArray(initialData?.use_cases)
      ? (initialData.use_cases as string[]).join(", ")
      : "",
    storageInstructions: (initialData?.storage_instructions as string) || "",
    shelfLife: (initialData?.shelf_life as string) || "",
    brewingGuide: (initialData?.brewing_guide as string) || "",
    isActive: (initialData?.is_active as boolean) ?? true,
    isFeatured: (initialData?.is_featured as boolean) ?? false,
  });

  const [images, setImages] = useState<ImageType[]>(
    ((initialData?.images as Record<string, unknown>[]) || []).map((img, idx) => ({
      id: img.id as string | undefined,
      url: img.image_url as string,
      altText: (img.alt_text as string) || "",
      isPrimary: img.is_primary as boolean,
      displayOrder: (img.display_order as number) ?? idx,
    }))
  );

  const [variants, setVariants] = useState<VariantType[]>(
    (initialData?.variants as Record<string, unknown>[])?.length
      ? (initialData!.variants as Record<string, unknown>[]).map((v) => ({
          id: v.id as string | undefined,
          size: v.size as string,
          unit: (v.unit as string) || "grams",
          samplePrice: Number(v.sample_price),
          bulkPrice: Number(v.bulk_price),
          stock: v.stock_quantity as number,
          minBulkQuantity: (v.min_bulk_quantity as number) || 1,
          isActive: (v.is_active as boolean) ?? true,
        }))
      : [
          {
            size: "50g",
            unit: "grams",
            samplePrice: 0,
            bulkPrice: 0,
            stock: 0,
            minBulkQuantity: 1,
            isActive: true,
          },
        ]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !isEdit
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        : prev.slug,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const newImages = files.map((file, idx) => ({
      url: URL.createObjectURL(file),
      altText: formData.name || "",
      isPrimary: images.length === 0 && idx === 0,
      displayOrder: images.length + idx,
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const removed = copy.splice(idx, 1)[0];
      if (removed.isPrimary && copy.length > 0) copy[0].isPrimary = true;
      return copy.map((img, i) => ({ ...img, displayOrder: i }));
    });
  };

  const setPrimaryImage = (idx: number) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === idx })));
  };

  const updateImageAlt = (idx: number, altText: string) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], altText };
      return copy;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        size: "",
        unit: "grams",
        samplePrice: 0,
        bulkPrice: 0,
        stock: 0,
        minBulkQuantity: 1,
        isActive: true,
      },
    ]);
  };

  const removeVariant = (idx: number) => {
    if (variants.length <= 1) {
      toast("At least one variant is required", "error");
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx: number, field: keyof VariantType, val: string | number | boolean) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSave = async () => {
    if (!formData.name?.trim() || !formData.slug?.trim() || !formData.categoryId) {
      toast("Name, slug, and category are required.", "error");
      setActiveTab("general");
      return;
    }

    const validVariants = variants.filter((v) => v.size?.trim());
    if (validVariants.length === 0) {
      toast("Add at least one variant with a size.", "error");
      setActiveTab("pricing");
      return;
    }

    setSaving(true);
    setUploading(true);
    try {
      const uploadedImages = await Promise.all(
        images.map(async (img, idx) => {
          if (img.file) {
            const body = new FormData();
            body.append("file", img.file);
            const res = await fetch("/api/admin/upload", { method: "POST", body });
            if (!res.ok) throw new Error("Image upload failed");
            const { url } = await res.json();
            return {
              ...img,
              url,
              file: undefined,
              displayOrder: idx,
            };
          }
          return { ...img, displayOrder: idx };
        })
      );
      setUploading(false);

      const payload = {
        ...(isEdit && { id: initialData?.id as string }),
        ...formData,
        useCases: formData.useCases
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        variants: validVariants,
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

      toast(isEdit ? "Product updated successfully" : "Product published", "success");
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save product";
      toast(message, "error");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const storefrontUrl = formData.slug ? `/products/${formData.slug}` : null;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#D04636]">
            {isEdit ? "Edit product" : "New product"}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
            {formData.name || (isEdit ? "Untitled product" : "Add product")}
          </h1>
          {isEdit && storefrontUrl && (
            <Link
              href={storefrontUrl}
              target="_blank"
              className="mt-2 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-[#D04636]"
            >
              Preview on store <ExternalLink size={14} />
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#D04636] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#D04636]/20 transition-colors hover:bg-[#B83C2D] disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {uploading ? "Uploading…" : isEdit ? "Save changes" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main editor */}
        <div className="space-y-4 lg:col-span-3">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#D04636] text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* General */}
          {activeTab === "general" && (
            <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">Basic information</h2>
              <div>
                <label className={labelClass}>Product name *</label>
                <input
                  value={formData.name}
                  onChange={handleNameChange}
                  className={inputClass}
                  placeholder="Premium Ceremonial Matcha"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>URL slug *</label>
                  <input
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    className={inputClass}
                  />
                  <p className="mt-1 text-[11px] text-zinc-400">/products/{formData.slug || "…"}</p>
                </div>
                <div>
                  <label className={labelClass}>Grade</label>
                  <input
                    value={formData.grade}
                    onChange={(e) => setFormData((p) => ({ ...p, grade: e.target.value }))}
                    className={inputClass}
                    placeholder="Ceremonial, Culinary…"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Short description</label>
                <p className="mb-1.5 text-[11px] text-zinc-400">Shown on product cards and listings</p>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Full description</label>
                <p className="mb-1.5 text-[11px] text-zinc-400">Main product page content</p>
                <textarea
                  rows={8}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, fullDescription: e.target.value }))}
                  className={`${inputClass} resize-y min-h-[160px]`}
                />
              </div>
            </div>
          )}

          {/* Media */}
          {activeTab === "media" && (
            <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">Product images</h2>
                  <p className="text-sm text-zinc-500">First primary image appears on listings</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  <UploadCloud size={16} /> Upload
                </button>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              {images.length === 0 ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-200 py-16 text-zinc-400 transition-colors hover:border-[#D04636] hover:bg-zinc-50"
                >
                  <UploadCloud size={40} />
                  <span className="text-sm font-medium">Drop images or click to upload</span>
                  <span className="text-xs">JPEG, PNG, WebP · max 5MB each</span>
                </button>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`overflow-hidden rounded-xl border-2 bg-zinc-50 ${
                        img.isPrimary ? "border-[#D04636]" : "border-zinc-200"
                      }`}
                    >
                      <div className="relative aspect-[4/3]">
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                        {img.isPrimary && (
                          <span className="absolute left-2 top-2 rounded bg-[#D04636] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                            Primary
                          </span>
                        )}
                        <div className="absolute right-2 top-2 flex gap-1">
                          {!img.isPrimary && (
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(idx)}
                              className="rounded-lg bg-black/60 px-2 py-1 text-[10px] font-semibold text-white hover:bg-black/80"
                            >
                              Set primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <label className="mb-1 block text-[10px] font-bold uppercase text-zinc-400">
                          Alt text (SEO)
                        </label>
                        <input
                          value={img.altText}
                          onChange={(e) => updateImageAlt(idx, e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#D04636]"
                          placeholder="Describe this image"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 text-zinc-500 transition-colors hover:border-[#D04636] hover:text-[#D04636]"
                  >
                    <Plus size={24} />
                    <span className="text-xs font-medium">Add more</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pricing */}
          {activeTab === "pricing" && (
            <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">Variants, pricing & stock</h2>
                  <p className="text-sm text-zinc-500">Each size/weight is a separate purchasable variant</p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-1 text-sm font-semibold text-[#D04636] hover:underline"
                >
                  <Plus size={16} /> Add variant
                </button>
              </div>
              <div className="space-y-4">
                {variants.map((v, idx) => (
                  <div
                    key={v.id || `new-${idx}`}
                    className="relative rounded-xl border border-zinc-200 bg-zinc-50/50 p-4"
                  >
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="absolute right-3 top-3 rounded-lg p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Variant {idx + 1}
                      {v.id && <span className="ml-2 font-normal normal-case text-zinc-300">· saved</span>}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-zinc-400">
                          Size / weight *
                        </label>
                        <input
                          value={v.size}
                          onChange={(e) => updateVariant(idx, "size", e.target.value)}
                          placeholder="50g, 1kg"
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#D04636]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-zinc-400">Unit</label>
                        <select
                          value={v.unit}
                          onChange={(e) => updateVariant(idx, "unit", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#D04636]"
                        >
                          <option value="grams">Grams</option>
                          <option value="kg">Kilograms</option>
                          <option value="pieces">Pieces</option>
                          <option value="pack">Pack</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-zinc-400">
                          Min bulk qty
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={v.minBulkQuantity}
                          onChange={(e) => updateVariant(idx, "minBulkQuantity", Number(e.target.value))}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#D04636]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-zinc-400">
                          Stock quantity
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={v.stock}
                          onChange={(e) => updateVariant(idx, "stock", Number(e.target.value))}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#D04636]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-zinc-400">
                          Sample price (₹)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={v.samplePrice}
                          onChange={(e) => updateVariant(idx, "samplePrice", Number(e.target.value))}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#D04636]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase text-zinc-400">
                          Bulk price (₹)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={v.bulkPrice}
                          onChange={(e) => updateVariant(idx, "bulkPrice", Number(e.target.value))}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#D04636]"
                        />
                      </div>
                    </div>
                    <label className="mt-3 flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={v.isActive}
                        onChange={(e) => updateVariant(idx, "isActive", e.target.checked)}
                        className="h-4 w-4 rounded accent-[#D04636]"
                      />
                      <span className="text-sm text-zinc-600">Variant available for purchase</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          {activeTab === "details" && (
            <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">Product details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Origin</label>
                  <input
                    value={formData.origin}
                    onChange={(e) => setFormData((p) => ({ ...p, origin: e.target.value }))}
                    className={inputClass}
                    placeholder="Kagoshima, Japan"
                  />
                </div>
                <div>
                  <label className={labelClass}>Shelf life</label>
                  <input
                    value={formData.shelfLife}
                    onChange={(e) => setFormData((p) => ({ ...p, shelfLife: e.target.value }))}
                    className={inputClass}
                    placeholder="12 months from packing"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Tasting profile</label>
                <input
                  value={formData.tastingProfile}
                  onChange={(e) => setFormData((p) => ({ ...p, tastingProfile: e.target.value }))}
                  className={inputClass}
                  placeholder="Umami, sweet, nutty"
                />
              </div>
              <div>
                <label className={labelClass}>Use cases / tags</label>
                <input
                  value={formData.useCases}
                  onChange={(e) => setFormData((p) => ({ ...p, useCases: e.target.value }))}
                  className={inputClass}
                  placeholder="Latte, Baking, Ceremony (comma separated)"
                />
              </div>
              <div>
                <label className={labelClass}>Storage instructions</label>
                <textarea
                  rows={3}
                  value={formData.storageInstructions}
                  onChange={(e) => setFormData((p) => ({ ...p, storageInstructions: e.target.value }))}
                  className={`${inputClass} resize-none`}
                  placeholder="Store in airtight container, away from light…"
                />
              </div>
              <div>
                <label className={labelClass}>Brewing guide</label>
                <textarea
                  rows={5}
                  value={formData.brewingGuide}
                  onChange={(e) => setFormData((p) => ({ ...p, brewingGuide: e.target.value }))}
                  className={`${inputClass} resize-y`}
                  placeholder="Water temperature, whisking technique…"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Settings2 size={18} className="text-zinc-400" />
                <h2 className="font-semibold text-zinc-900">Publish settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={formData.isActive ? "active" : "draft"}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, isActive: e.target.value === "active" }))
                    }
                    className={inputClass}
                  >
                    <option value="active">Active — visible on store</option>
                    <option value="draft">Draft — hidden</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData((p) => ({ ...p, categoryId: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
                    className="h-4 w-4 rounded accent-[#D04636]"
                  />
                  <div>
                    <span className="text-sm font-medium text-zinc-800">Featured product</span>
                    <p className="text-[11px] text-zinc-400">Show on homepage highlights</p>
                  </div>
                </label>
              </div>
            </div>

            {images[0] && (
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <p className="border-b border-zinc-100 px-4 py-2 text-xs font-semibold uppercase text-zinc-400">
                  Preview
                </p>
                <img
                  src={images.find((i) => i.isPrimary)?.url || images[0].url}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                <div className="p-4">
                  <p className="font-semibold text-zinc-900 line-clamp-2">
                    {formData.name || "Product name"}
                  </p>
                  {variants[0] && (
                    <p className="mt-1 text-sm font-bold text-[#D04636]">
                      ₹{variants[0].bulkPrice || variants[0].samplePrice || "—"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky save bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white/95 p-4 backdrop-blur-md md:hidden">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D04636] py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isEdit ? "Save changes" : "Publish product"}
        </button>
      </div>
    </div>
  );
}
