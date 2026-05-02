import { redirect } from "next/navigation";
import { getServerAuthUser } from "@/lib/auth/server-session";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function BulkOrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/?auth=login");
  }

  const { orderId } = await params;

  const order = await prisma.bulkOrder.findUnique({
    where: { id: orderId, user_id: user.id },
  });

  if (!order) {
    redirect("/products");
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Order Confirmed!</h1>
        <p className="text-zinc-600 mb-6">
          Thank you for your bulk order. Your order number is <strong className="text-zinc-900">{order.order_number}</strong>.
        </p>

        {user.gstin_verified && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 inline-flex items-center gap-2 mb-8">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-amber-800">Verified Wholesale Buyer</span>
          </div>
        )}

        <div className="space-y-3">
          <button className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
            Download Invoice
          </button>
          <Link href="/account" className="block w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
