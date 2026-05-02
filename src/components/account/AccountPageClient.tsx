"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type UserProfile = {
  username: string;
  email: string;
  phone: string;
};

type SampleOrder = {
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

type BulkOrder = {
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

type WishlistItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  shortDescription: string;
  categoryName: string;
  useCases: string[];
  addedAt: string;
};

export default function AccountPageClient({ initialUser }: { initialUser: UserProfile }) {
  const [profile, setProfile] = useState<UserProfile>(initialUser);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [sampleOrders, setSampleOrders] = useState<SampleOrder[]>([]);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/account/orders", { cache: "no-store" });
        const data = (await response.json()) as {
          sampleOrders?: SampleOrder[];
          bulkOrders?: BulkOrder[];
        };
        if (response.ok) {
          setSampleOrders(data.sampleOrders ?? []);
          setBulkOrders(data.bulkOrders ?? []);
        }
      } finally {
        setOrdersLoading(false);
      }
    }

    async function loadWishlist() {
      try {
        const response = await fetch("/api/wishlist", { cache: "no-store" });
        const data = (await response.json()) as { items?: WishlistItem[] };
        if (response.ok) {
          setWishlistItems(data.items ?? []);
        }
      } finally {
        setWishlistLoading(false);
      }
    }

    void loadOrders();
    void loadWishlist();
  }, []);

  const allOrdersCount = useMemo(
    () => sampleOrders.length + bulkOrders.length,
    [bulkOrders.length, sampleOrders.length],
  );

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

  async function removeFromWishlist(productId: string) {
    const response = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
    if (response.ok) {
      setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <h1 className="text-2xl font-semibold text-zinc-900">My Account</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Manage profile details, wishlist, and your previous orders.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">Wishlist Items</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{wishlistItems.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">Total Orders</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{allOrdersCount}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">Sample Orders</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{sampleOrders.length}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-900">Profile Details</h2>
            <form className="mt-4 space-y-4" onSubmit={saveProfile}>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                value={profile.username}
                onChange={(event) => setProfile((prev) => ({ ...prev, username: event.target.value }))}
                placeholder="Username"
              />
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                value={profile.email}
                onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email"
                type="email"
              />
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                value={profile.phone}
                onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Phone"
                type="tel"
              />
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              <button
                type="submit"
                disabled={savingProfile}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-zinc-900">My Wishlist</h2>
            {wishlistLoading ? (
              <p className="mt-4 text-sm text-zinc-600">Loading wishlist...</p>
            ) : wishlistItems.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-600">No products in wishlist yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="rounded-md border border-zinc-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/products/${item.slug}`} className="text-sm font-medium text-zinc-900 hover:underline">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-zinc-600">{item.categoryName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void removeFromWishlist(item.productId)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-zinc-900">Previous Orders</h2>
          {ordersLoading ? (
            <p className="mt-4 text-sm text-zinc-600">Loading orders...</p>
          ) : (
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-800">Sample Orders</h3>
                {sampleOrders.length === 0 ? (
                  <p className="mt-2 text-sm text-zinc-600">No sample orders found.</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {sampleOrders.map((order) => (
                      <div key={order.id} className="rounded-md border border-zinc-200 p-3 text-sm">
                        <p className="font-medium text-zinc-900">{order.orderNumber}</p>
                        <p className="mt-1 text-zinc-700">
                          <Link href={`/products/${order.productSlug}`} className="hover:underline">
                            {order.productName}
                          </Link>{" "}
                          ({order.variantSize}) - INR {order.amount.toFixed(2)}
                        </p>
                        <p className="mt-1 text-zinc-600">
                          Payment: {order.paymentStatus} | Status: {order.orderStatus}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-800">Bulk Orders</h3>
                {bulkOrders.length === 0 ? (
                  <p className="mt-2 text-sm text-zinc-600">No bulk orders found.</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {bulkOrders.map((order) => (
                      <div key={order.id} className="rounded-md border border-zinc-200 p-3 text-sm">
                        <p className="font-medium text-zinc-900">{order.orderNumber}</p>
                        <p className="mt-1 text-zinc-700">Total: INR {order.totalAmount.toFixed(2)}</p>
                        <p className="mt-1 text-zinc-600">
                          Payment: {order.paymentStatus} | Status: {order.orderStatus}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
