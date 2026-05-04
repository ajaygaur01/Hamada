import { Package, IndianRupee, ShoppingBag, Box, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { SampleOrder, BulkOrder } from "../AccountPageClient";

interface OverviewSectionProps {
  sampleOrders: SampleOrder[];
  bulkOrders: BulkOrder[];
}

export default function OverviewSection({ sampleOrders, bulkOrders }: OverviewSectionProps) {
  const totalOrders = sampleOrders.length + bulkOrders.length;
  
  // Combine and sort orders to get recent ones
  const recentOrders = [...sampleOrders, ...bulkOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const totalSpent = bulkOrders.reduce((sum, order) => sum + order.totalAmount, 0) +
                     sampleOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="font-heading text-2xl text-zinc-900 mb-6">Overview</h2>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2">
          <div className="bg-white rounded-xl p-5 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-cream text-brand-green rounded-lg">
                <Box size={20} />
              </div>
              <p className="text-sm font-medium text-zinc-500">Total Orders</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 ml-12">{totalOrders}</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-cream text-brand-green rounded-lg">
                <Package size={20} />
              </div>
              <p className="text-sm font-medium text-zinc-500">Sample Orders</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 ml-12">{sampleOrders.length}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-cream text-brand-green rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <p className="text-sm font-medium text-zinc-500">Bulk Orders</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 ml-12">{bulkOrders.length}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-cream text-brand-green rounded-lg">
                <IndianRupee size={20} />
              </div>
              <p className="text-sm font-medium text-zinc-500">Total Spent</p>
            </div>
            <p className="text-2xl font-bold text-zinc-900 ml-12">₹{totalSpent.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-zinc-800">Recent Orders</h3>
        </div>
        
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No recent orders.</div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentOrders.map((order) => {
                const isBulk = 'totalAmount' in order;
                const amount = isBulk ? (order as BulkOrder).totalAmount : (order as SampleOrder).amount;
                
                return (
                  <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-zinc-900">{order.orderNumber}</span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-zinc-600">
                        {isBulk ? 'Bulk Order' : 'Sample Order'} • ₹{amount.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.orderStatus}
                      </span>
                      {isBulk && (
                        <Link href="/bulk-order/cart" className="text-sm font-medium text-brand-green hover:underline">
                          Reorder
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link href="/products" className="flex-1 bg-brand-green text-white text-center py-3 rounded-lg font-medium hover:bg-[#3f5226] transition-colors">
          Browse Products
        </Link>
        <Link href="/contact" className="flex-1 bg-white border border-zinc-200 text-zinc-700 text-center py-3 rounded-lg font-medium hover:bg-zinc-50 transition-colors">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
