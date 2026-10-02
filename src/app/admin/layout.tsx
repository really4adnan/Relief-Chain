import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin-nav";
import { AdminLogin } from "@/components/admin-login";

export const metadata: Metadata = {
  title: "Admin control panel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const authorized = await isAdmin();

  if (!authorized) {
    const hint =
      process.env.NODE_ENV !== "production" && !process.env.ADMIN_PASSCODE
        ? "reliefchain-dev"
        : null;
    return <AdminLogin hint={hint} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <AdminNav />
      <div className="mt-5">{children}</div>
    </div>
  );
}
