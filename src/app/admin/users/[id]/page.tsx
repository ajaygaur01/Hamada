"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Calendar, Building, MapPin, CheckCircle2, Shield, ShoppingCart, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/admin/ui/Badge";
import { useToast } from "@/components/admin/ui/Toast";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [role, setRole] = useState("");
  const [gstinVerified, setGstinVerified] = useState(false);
  const { toast } = useToast();

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json.user);
      setRole(json.user.role);
      setGstinVerified(json.user.gstin_verified);
    } catch {
      toast("Failed to load user details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, gstinVerified }),
      });
      if (!res.ok) throw new Error();
      toast("User updated successfully", "success");
      fetchUser();
    } catch {
      toast("Failed to update user", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-400" size={32} /></div>;
  if (!data) return <div className="text-center py-20">User not found.</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft size={16} /> Back to Users
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#D04636]/10 text-[#D04636] flex items-center justify-center font-bold text-xl shrink-0">
                {(data.full_name || data.email).slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900">{data.full_name || "N/A"}</h1>
                <p className="text-sm text-zinc-500">{data.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={data.role === "admin" ? "danger" : "default"}>{data.role}</Badge>
                  {data.gstin_verified && <Badge variant="success">GST Verified</Badge>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <User size={16} className="text-zinc-400" /> Account Settings
                </h3>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">System Role</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#D04636]"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="gstinVerified"
                    checked={gstinVerified}
                    onChange={(e) => setGstinVerified(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#D04636]"
                  />
                  <label htmlFor="gstinVerified" className="text-sm text-zinc-700 cursor-pointer">Mark GSTIN as Verified</label>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Building size={16} className="text-zinc-400" /> Company Info
                </h3>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Company Name</p>
                  <p className="text-sm text-zinc-900">{data.company_name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">GSTIN</p>
                  <p className="text-sm text-zinc-900 font-mono">{data.gstin || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <h2 className="font-semibold text-zinc-900 flex items-center gap-2">
                <ShoppingCart size={18} className="text-zinc-400" /> Order History
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase">Order #</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[...data.bulkOrders, ...data.sampleOrders]
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((o: any) => (
                      <tr key={o.id} className="hover:bg-zinc-50">
                        <td className="px-6 py-3">
                          <Link href={`/admin/orders/${o.id}?type=${o.order_number.startsWith('SO') ? 'sample' : 'bulk'}`} className="font-mono text-xs font-bold text-[#D04636] hover:underline">
                            {o.order_number}
                          </Link>
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant={o.order_number.startsWith('SO') ? "info" : "warning"}>
                            {o.order_number.startsWith('SO') ? "Sample" : "Bulk"}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 font-medium">₹{(o.total_amount || o.amount).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-3 text-xs capitalize">{o.order_status}</td>
                        <td className="px-6 py-3 text-xs text-zinc-500">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  {(data.bulkOrders.length + data.sampleOrders.length) === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-zinc-400">No orders found for this user.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-3 mb-4">Contact Info</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email</p>
                  <p className="text-zinc-900">{data.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Phone</p>
                  <p className="text-zinc-900">{data.phone || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Member Since</p>
                  <p className="text-zinc-900">{new Date(data.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric", day: "numeric" })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-900 border-b border-zinc-100 pb-3 mb-4">Business Address</h2>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-zinc-400 mt-0.5" />
              <div className="text-sm text-zinc-600">
                {data.company_address ? (
                  <p className="whitespace-pre-line">{data.company_address}</p>
                ) : (
                  <p className="text-zinc-400 italic">No business address provided.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
