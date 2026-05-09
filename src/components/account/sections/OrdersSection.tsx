import { useState } from "react";
import Link from "next/link";
import { PackageOpen, Download, Truck } from "lucide-react";
import type { SampleOrder, BulkOrder } from "../AccountPageClient";

interface OrdersSectionProps {
  sampleOrders: SampleOrder[];
  bulkOrders: BulkOrder[];
}

type TabType = "all" | "bulk" | "sample";

export default function OrdersSection({ sampleOrders, bulkOrders }: OrdersSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Combine and map orders to a common format for display
  const allOrders = [
    ...bulkOrders.map(o => ({ ...o, type: "bulk" as const })),
    ...sampleOrders.map(o => ({ ...o, type: "sample" as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredOrders = activeTab === "all" 
    ? allOrders 
    : allOrders.filter(o => o.type === activeTab);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'dispatched': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-zinc-100 text-zinc-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-heading text-2xl text-zinc-900">My Orders</h2>
        
        {/* Tabs */}
        <div className="flex p-1 bg-white border border-zinc-200 rounded-lg shadow-sm">
          <button 
            onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "all" ? "bg-brand-cream text-brand-green" : "text-zinc-600 hover:text-zinc-900"}`}
          >
            All Orders
          </button>
          <button 
            onClick={() => { setActiveTab("bulk"); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "bulk" ? "bg-brand-cream text-brand-green" : "text-zinc-600 hover:text-zinc-900"}`}
          >
            Bulk Orders
          </button>
          <button 
            onClick={() => { setActiveTab("sample"); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === "sample" ? "bg-brand-cream text-brand-green" : "text-zinc-600 hover:text-zinc-900"}`}
          >
            Sample Orders
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-green">
            <PackageOpen size={48} strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-2">No orders yet</h3>
          <p className="text-zinc-500 max-w-sm mb-6">You haven't placed any {activeTab !== 'all' ? activeTab : ''} orders. Browse our catalog to get started.</p>
          <Link href="/products" className="bg-[#D04636] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#B83C2D] transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedOrders.map((order) => {
            const isBulk = order.type === "bulk";
            const amount = isBulk ? (order as BulkOrder).totalAmount : (order as SampleOrder).amount;
            const productName = isBulk 
              ? `${(order as BulkOrder).items?.length || 0} Items` 
              : `${(order as SampleOrder).productName} (${(order as SampleOrder).variantSize})`;

            return (
              <div key={order.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-zinc-900">{order.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm font-medium text-zinc-800">{productName}</p>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-3">
                    <p className="text-lg font-bold text-zinc-900">₹{amount.toLocaleString()}</p>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {order.orderStatus.toLowerCase() === 'dispatched' && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D04636] text-[#D04636] text-zinc-700 rounded-md text-sm font-medium hover:bg-[#fdebea] transition-colors">
                          <Truck size={16} /> Track
                        </button>
                      )}
                      {isBulk && (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D04636] text-[#D04636] text-zinc-700 rounded-md text-sm font-medium hover:bg-[#fdebea] transition-colors">
                          <Download size={16} /> Invoice
                        </button>
                      )}
                      <Link href={isBulk ? "/bulk-order/cart" : `/products/${(order as SampleOrder).productSlug}`} className="px-4 py-1.5 bg-brand-cream text-[#D04636] rounded-md text-sm font-medium hover:bg-[#d8ccaa] transition-colors">
                        Reorder
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1.5 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1.5 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
