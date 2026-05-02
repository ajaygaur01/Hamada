import { redirect } from "next/navigation";
import { getServerAuthUser } from "@/lib/auth/server-session";

export default async function BulkOrderPage() {
  const user = await getServerAuthUser();

  if (!user) {
    redirect("/?auth=login&redirect=/bulk-order&source=page");
  }

  if (!user.gstin_verified) {
    redirect("/bulk-order/verify-gstin");
  } else {
    redirect("/bulk-order/cart");
  }
}
