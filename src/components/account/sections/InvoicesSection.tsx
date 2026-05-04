import { useState } from "react";
import { Search, Download, FileText, Calendar } from "lucide-react";

type Invoice = {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  amount: number;
};

// Mock Invoices
const mockInvoices: Invoice[] = [
  { id: "1", invoiceNumber: "INV-2023-001", orderNumber: "BLK-1001", date: "2023-10-15", amount: 12500 },
  { id: "2", invoiceNumber: "INV-2023-002", orderNumber: "BLK-1002", date: "2023-11-02", amount: 8400 },
];

export default function InvoicesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices); // Initially use mock data
  // In a real app, this would be fetched from an API

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-heading text-2xl text-zinc-900">Invoices</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search invoice or order..." 
              className="pl-9 pr-4 py-2 border border-zinc-300 rounded-lg text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
            <Calendar size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mb-6 text-brand-green">
              <FileText size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">No invoices found</h3>
            <p className="text-zinc-500 max-w-sm">
              {searchTerm ? "No invoices match your search criteria." : "You don't have any invoices yet. Invoices will appear here once your bulk orders are processed."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Invoice Number</th>
                  <th className="px-6 py-4 font-semibold">Order Number</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4 text-zinc-600">{invoice.orderNumber}</td>
                    <td className="px-6 py-4 text-zinc-600">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-zinc-900 font-medium text-right">₹{invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 text-brand-green hover:underline font-medium">
                        <Download size={16} /> PDF
                      </button>
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
