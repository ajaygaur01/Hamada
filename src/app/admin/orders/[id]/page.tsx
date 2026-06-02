"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, Package, Truck, CheckCircle, Clock, 
  XCircle, CreditCard, User, Building, MapPin, 
  FileText, ExternalLink, Save, Loader2 
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/admin/ui/Badge";
import { useToast } from "@/components/admin/ui/Toast";
import { generateOrderInvoice } from "@/lib/admin/invoice-generator";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "dispatched", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "verified", "failed"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [trackingLink, setTrackingLink] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}?type=${type}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrder(data);
      setStatus(data.order_status);
      setPaymentStatus(data.payment_status);
      setTrackingLink(data.tracking_link || "");
      setNotes(data.notes || "");
    } catch {
      toast("Failed to load order details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, type, toast]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          type: order.type,
          orderStatus: status,
          paymentStatus,
          trackingLink,
          notes,
        }),
      });
      if (!res.ok) throw new Error();
      toast("Order updated successfully", "success");
      fetchOrder();
    } catch {
      toast("Failed to update order", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-400" size={32} /></div>;
  if (!order) return <div className="text-center py-20">Order not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => generateOrderInvoice(order)}
            className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors"
          >
            <FileText size={16} />
            Download Invoice
          </button>
          <button 
            onClick={handleUpdate} 
            disabled={updating}
            className="flex items-center gap-2 bg-[#D04636] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#B83C2D] transition-colors disabled:opacity-50"
          >
            {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                  Order {order.order_number}
                  <Badge variant={order.type === "sample" ? "info" : "warning"}>{order.type}</Badge>
                </h1>
                <p className="text-xs text-zinc-400 mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={order.payment_status === "paid" ? "success" : "warning"}>
                  {order.payment_status}
                </Badge>
                <Badge variant={order.order_status === "delivered" ? "success" : "info"}>
                  {order.order_status}
                </Badge>
              </div>
            </div>

            {/* Status Manager */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Order Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]"
                >
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Payment Status</label>
                <select 
                  value={paymentStatus} 
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]"
                >
                  {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Tracking Link / ID</label>
                <input 
                  type="text" 
                  value={trackingLink} 
                  onChange={(e) => setTrackingLink(e.target.value)}
                  placeholder="https://shiprocket.co/..."
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Internal notes</label>
                <textarea 
                  rows={2}
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Admin-only notes about this order…"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636] resize-none" 
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <h2 className="font-semibold text-zinc-900 flex items-center gap-2">
                <Package size={18} className="text-zinc-400" /> Order Items
              </h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {order.type === "sample" ? (
                <div className="flex items-center gap-4 p-4">
                  <div className="w-16 h-16 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-100">
                    {order.product?.images?.[0]?.image_url ? (
                      <img src={order.product.images[0].image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="m-auto mt-4 text-zinc-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-zinc-900">{order.product?.name}</h3>
                    <p className="text-xs text-zinc-500">{order.variant?.size} {order.variant?.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{order.amount.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-zinc-400">Qty: 1</p>
                  </div>
                </div>
              ) : (
                order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="w-16 h-16 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-100">
                      <Package className="text-zinc-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-zinc-900">{item.product_name}</h3>
                      <p className="text-xs text-zinc-500">{item.variant_size}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">₹{item.total_price.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-zinc-400">₹{item.unit_price} x {item.quantity}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Totals */}
            <div className="bg-zinc-50 p-6 space-y-2 border-t border-zinc-100">
              {order.type === "bulk" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="text-zinc-900">₹{order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">GST</span>
                    <span className="text-zinc-900">₹{(order.cgst_amount + order.sgst_amount + order.igst_amount).toLocaleString("en-IN")}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-zinc-200">
                <span>Total Amount</span>
                <span className="text-[#D04636]">₹{(order.amount || order.total_amount).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
              <User size={18} className="text-zinc-400" /> Customer Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Name</p>
                <p className="text-sm font-medium text-zinc-900">{order.customer_name || order.user?.full_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email</p>
                <a href={`mailto:${order.email || order.user?.email}`} className="text-sm text-[#D04636] hover:underline">{order.email || order.user?.email}</a>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Phone</p>
                <p className="text-sm text-zinc-900">{order.phone || order.user?.phone}</p>
              </div>
              {order.type === "bulk" && (
                <>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Company</p>
                    <p className="text-sm text-zinc-900">{order.user?.company_name || order.business_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">GSTIN</p>
                    <p className="text-sm text-zinc-900">{order.user?.gstin || "N/A"}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
              <MapPin size={18} className="text-zinc-400" /> Shipping Address
            </h2>
            {order.type === "sample" ? (
              <div className="text-sm text-zinc-600 space-y-1">
                <p>{order.delivery_city}</p>
                <p>{order.pincode}</p>
                <p className="text-zinc-400 text-xs italic mt-2">Sample orders currently only capture city/pincode in checkout.</p>
              </div>
            ) : (
              <div className="text-sm text-zinc-600 space-y-1">
                <p className="font-medium text-zinc-900">{order.address?.full_name}</p>
                <p>{order.address?.address_line1}</p>
                {order.address?.address_line2 && <p>{order.address.address_line2}</p>}
                <p>{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                <p className="pt-2">T: {order.address?.phone}</p>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
              <CreditCard size={18} className="text-zinc-400" /> Payment Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Method</span>
                <span className="font-medium text-zinc-900 uppercase">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status</span>
                <span className="font-medium text-zinc-900 capitalize">{order.payment_status}</span>
              </div>
              {order.razorpay_payment_id && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">ID</span>
                  <span className="font-mono text-[10px]">{order.razorpay_payment_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
