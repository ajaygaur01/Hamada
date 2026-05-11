"use client";

import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  User, 
  MapPin, 
  FileText, 
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Heart
} from "lucide-react";

import OverviewSection from "./sections/OverviewSection";
import OrdersSection from "./sections/OrdersSection";
import ProfileSection from "./sections/ProfileSection";
import AddressesSection from "./sections/AddressesSection";
import InvoicesSection from "./sections/InvoicesSection";
import WishlistSection from "./sections/WishlistSection";

export type UserProfile = {
  username: string;
  email: string;
  phone: string;
  gstin_verified: boolean;
};

export type SampleOrder = {
  id: string;
  orderNumber: string;
  productName: string;
  productSlug: string;
  variantSize: string;
  amount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

export type BulkOrder = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: {
    productName: string;
    variantSize: string;
    quantity: number;
  }[];
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  amount: number;
  pdfUrl: string | null;
};

export type WishlistItem = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number | null;
  addedAt: string;
};

type ActiveSection = "overview" | "orders" | "profile" | "wishlist" | "addresses" | "invoices";

export default function AccountPageClient({ initialUser }: { initialUser: UserProfile }) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  
  const [profile, setProfile] = useState<UserProfile>(initialUser);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [sampleOrders, setSampleOrders] = useState<SampleOrder[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersRes, addressesRes, invoicesRes, wishlistRes] = await Promise.all([
          fetch("/api/account/orders", { cache: "no-store" }),
          fetch("/api/account/addresses", { cache: "no-store" }),
          fetch("/api/account/invoices", { cache: "no-store" }),
          fetch("/api/account/wishlist", { cache: "no-store" })
        ]);

        if (ordersRes.ok) {
          const data = await ordersRes.json() as { sampleOrders?: SampleOrder[]; bulkOrders?: BulkOrder[]; };
          setSampleOrders(data.sampleOrders ?? []);
          setBulkOrders(data.bulkOrders ?? []);
        }
        if (addressesRes.ok) {
          const data = await addressesRes.json() as { addresses?: Address[]; };
          setAddresses(data.addresses ?? []);
        }
        if (invoicesRes.ok) {
          const data = await invoicesRes.json() as { invoices?: Invoice[]; };
          setInvoices(data.invoices ?? []);
        }
        if (wishlistRes.ok) {
          const data = await wishlistRes.json() as { wishlist?: WishlistItem[]; };
          setWishlist(data.wishlist ?? []);
        }
      } finally {
        setOrdersLoading(false);
        setWishlistLoading(false);
      }
    }

    void loadData();
  }, []);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save profile.");
        return;
      }
      setMessage("Profile updated successfully.");
    } catch {
      setError("Could not save profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleRemoveWishlist(id: string) {
    try {
      const response = await fetch("/api/account/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setWishlist(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "My Profile", icon: User },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "invoices", label: "Invoices", icon: FileText },
  ] as const;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white md:py-10 pb-20 md:pb-10">
      <div className="mx-auto w-full max-w-7xl px-0 md:px-6 flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden sticky top-24">
            
            {/* User Info */}
            <div className="p-6 border-b border-zinc-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-100 text-[#3E4F25] flex items-center justify-center text-2xl font-bold mb-4 shadow-sm border border-zinc-200">
                {getInitials(profile.username)}
              </div>
              <h2 className="font-bold text-zinc-900 text-lg">{profile.username || "User"}</h2>
              <p className="text-zinc-500 text-sm mb-3">{profile.email}</p>
              
              {profile.gstin_verified ? (
                <div className="flex items-center gap-1.5 bg-[#f0f4ea] text-brand-green px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-[#d2e0c2]">
                  <CheckCircle2 size={14} />
                  Verified Wholesale Buyer
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-amber-200">
                  <AlertTriangle size={14} />
                  Unverified Account
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-[#D04636] text-white shadow-sm" 
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-zinc-400"} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-zinc-100">
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
                  <LogOut size={18} />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-4 md:px-0">
          <div className="md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-zinc-100 md:p-8 min-h-[600px]">
            
            {activeSection === "overview" && (
              <OverviewSection 
                sampleOrders={sampleOrders} 
                bulkOrders={bulkOrders} 
                wishlistCount={wishlist.length}
                setActiveSection={setActiveSection}
              />
            )}
            
            {activeSection === "orders" && (
              ordersLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
                </div>
              ) : (
                <OrdersSection sampleOrders={sampleOrders} bulkOrders={bulkOrders} />
              )
            )}
            
            {activeSection === "profile" && (
              <ProfileSection 
                profile={profile}
                setProfile={setProfile}
                saveProfile={saveProfile}
                savingProfile={savingProfile}
                message={message}
                error={error}
              />
            )}

            {activeSection === "wishlist" && (
              <WishlistSection 
                wishlist={wishlist} 
                onRemove={handleRemoveWishlist} 
                loading={wishlistLoading} 
              />
            )}
            
            {activeSection === "addresses" && (
              <AddressesSection addresses={addresses} setAddresses={setAddresses} />
            )}
            
            {activeSection === "invoices" && (
              <InvoicesSection invoices={invoices} />
            )}
            
          </div>
        </div>

        {/* Mobile Bottom Tab Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50 px-2 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center justify-center w-16 h-12 rounded-lg transition-colors ${
                  isActive ? "text-[#D04636]" : "text-zinc-400"
                }`}
              >
                <div className={`${isActive ? "bg-zinc-100 p-1.5 rounded-full" : "p-1.5"}`}>
                  <Icon size={isActive ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium mt-0.5 whitespace-nowrap hidden sm:block">
                  {item.id === "addresses" ? "Addresses" : item.label.replace("My ", "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
