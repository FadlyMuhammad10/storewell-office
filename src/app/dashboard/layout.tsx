import { LayoutDashboard, LogOut, PackageOpen } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <div className="page-container py-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <h2 className="font-normal capitalize text-primary text-xl">
              My Account
            </h2>
            <nav className="flex flex-col space-y-2">
              <div className="inline-flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <Link
                  href="/dashboard"
                  className="text-primary hover:text-primary transition-colors font-light"
                >
                  Dashboard
                </Link>
              </div>
              <div className="inline-flex items-center gap-2">
                <PackageOpen className="w-4 h-4 text-primary-foreground" />
                <Link
                  href="/dashboard/orders"
                  className="text-primary-foreground hover:text-primary transition-colors font-light"
                >
                  Orders
                </Link>
              </div>
            </nav>
            <div className="w-full border-t border-[#C4C7C7]" />
            <div className="inline-flex items-center gap-2 ">
              <LogOut className="w-4 h-4 text-destructive" />
              <Link
                href="/"
                className="text-destructive hover:text-destructive transition-colors font-light"
              >
                Sign Out
              </Link>
            </div>
          </aside>
          <section className="space-y-6">{children}</section>
        </div>
      </div>
    </main>
  );
}
