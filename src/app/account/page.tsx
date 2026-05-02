import AccountPageClient from "@/components/account/AccountPageClient";
import { getServerAuthUser } from "@/lib/auth/server-session";

export default async function AccountPage() {
  const authUser = await getServerAuthUser();

  return (
    <AccountPageClient
      initialUser={{
        username: authUser?.username ?? "",
        email: authUser?.email ?? "",
        phone: authUser?.phone ?? "",
      }}
    />
  );
}
