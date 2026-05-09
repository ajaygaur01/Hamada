"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Loader2, ChevronRight, ArrowLeft, ShieldCheck, Mail, Phone, Building2, Calendar } from "lucide-react";

type UserSummary = {
  id: string; email: string; fullName: string | null; phone: string | null;
  role: string; gstin: string | null; gstinVerified: boolean;
  companyName: string | null; createdAt: string; bulkOrderCount: number;
};

type UserDetail = {
  id: string; email: string; full_name: string | null; phone: string | null;
  role: string; gstin: string | null; gstin_verified: boolean;
  company_name: string | null; company_address: string | null; createdAt: string;
  bulkOrders: any[]; sampleOrders: any[];
};

export default function UsersSection() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchUsers = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/users?search=${encodeURIComponent(q)}`);
      const data = await r.json();
      setUsers(data.users || []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchUsers]);

  const viewUser = async (id: string) => {
    setLoadingUser(true);
    try {
      const r = await fetch(`/api/admin/users/${id}`);
      const data = await r.json();
      setSelectedUser(data.user);
    } catch { /* ignore */ } finally {
      setLoadingUser(false);
    }
  };

  // Detail View
  if (selectedUser) {
    const allOrders = [
      ...selectedUser.sampleOrders.map((o: any) => ({
        id: o.id, orderNumber: o.order_number, type: "Sample",
        product: o.product?.name, amount: o.amount,
        paymentStatus: o.payment_status, orderStatus: o.order_status,
        date: o.created_at,
      })),
      ...selectedUser.bulkOrders.map((o: any) => ({
        id: o.id, orderNumber: o.order_number, type: "Bulk",
        product: o.items?.map((i: any) => i.product_name).join(", "),
        amount: o.total_amount,
        paymentStatus: o.payment_status, orderStatus: o.order_status,
        date: o.created_at,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium">
          <ArrowLeft size={16} /> Back to Users
        </button>

        {/* User Profile Card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500 text-xl font-bold shrink-0">
                {(selectedUser.full_name || selectedUser.email)[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">{selectedUser.full_name || "No Name"}</h2>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-zinc-500">
                  <span className="flex items-center gap-1"><Mail size={13} /> {selectedUser.email}</span>
                  {selectedUser.phone && <span className="flex items-center gap-1"><Phone size={13} /> {selectedUser.phone}</span>}
                  <span className="flex items-center gap-1"><Calendar size={13} /> Joined {new Date(selectedUser.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedUser.role === "admin" ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-600"}`}>
              {selectedUser.role}
            </span>
          </div>

          {/* Business Details */}
          {selectedUser.company_name && (
            <div className="mt-5 pt-5 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Company</p>
                <p className="flex items-center gap-1.5 text-zinc-900 font-medium"><Building2 size={14} /> {selectedUser.company_name}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">GSTIN</p>
                <p className="font-mono text-zinc-900">{selectedUser.gstin || "—"}</p>
              </div>
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">GST Status</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${selectedUser.gstin_verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  <ShieldCheck size={10} />
                  {selectedUser.gstin_verified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Orders */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h3 className="font-semibold text-zinc-900">All Orders ({allOrders.length})</h3>
          </div>
          {allOrders.length === 0 ? (
            <div className="p-6 text-center text-zinc-400 text-sm">No orders from this user.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Order #</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Payment</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {allOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-zinc-700">{o.orderNumber}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${o.type === "Sample" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                          {o.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-600 truncate max-w-[160px]">{o.product}</td>
                      <td className="px-5 py-3 font-medium text-zinc-900">₹{o.amount?.toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" :
                          o.paymentStatus === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        }`}>{o.paymentStatus}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          o.orderStatus === "delivered" ? "bg-emerald-100 text-emerald-700" :
                          o.orderStatus === "dispatched" ? "bg-blue-100 text-blue-700" :
                          o.orderStatus === "cancelled" ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-600"
                        }`}>{o.orderStatus}</span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">
                        {new Date(o.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Users List View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Users</h2>
          <p className="text-zinc-500 text-sm mt-1">{users.length} registered users</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input type="text" placeholder="Search by name, email, company..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:border-[#D04636] focus:ring-1 focus:ring-[#D04636] transition-all" />
        </div>
      </div>

      {loading || loadingUser ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-400" size={28} /></div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">No users found.</div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">GSTIN</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Orders</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joined</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => (
                  <tr key={u.id} onClick={() => viewUser(u.id)}
                    className="hover:bg-zinc-50 transition-colors cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500 text-sm font-bold shrink-0">
                          {(u.fullName || u.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{u.fullName || "—"}</p>
                          <p className="text-xs text-zinc-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">{u.companyName || "—"}</td>
                    <td className="px-5 py-4">
                      {u.gstinVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          <ShieldCheck size={10} /> Verified
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600">{u.bulkOrderCount}</span>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-2 py-4 text-zinc-300 group-hover:text-zinc-500 transition-colors">
                      <ChevronRight size={16} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
