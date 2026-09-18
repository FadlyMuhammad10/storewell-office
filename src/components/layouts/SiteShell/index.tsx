"use client";

import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAccountPage = pathname === "/login" || pathname === "/register";

  if (isAccountPage) {
    return (
      <div className="flex min-h-dvh flex-col bg-[#fbf9f9] text-[#1a1a1a]">
        <header className="border-b border-black/[0.035]">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-6 sm:px-10 lg:px-12">
            <div className="flex items-center gap-6 sm:gap-10">
              <Link
                href="/"
                className="text-xl font-semibold tracking-[-0.06em]"
              >
                STOREWELL
              </Link>
              <nav aria-label="Main navigation" className="flex gap-5 sm:gap-7">
                <Link
                  href="/"
                  className="text-[10px] font-bold tracking-widest text-[#515151] hover:text-black"
                >
                  HOME
                </Link>
                <Link
                  href="/products"
                  className="text-[10px] font-bold tracking-widest text-[#515151] hover:text-black"
                >
                  SHOP
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/#footer-support"
                className="hidden text-[10px] font-bold tracking-wider text-[#515151] hover:text-black sm:block"
              >
                CUSTOMER SERVICE
              </Link>
              <span
                className="flex size-7 items-center justify-center rounded-full bg-[#e8e3dc]"
                aria-label="Storewell account"
              >
                <UserRound
                  className="size-3.5 text-[#746e64]"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-[#f5f3f3]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-9 text-[10px] font-semibold tracking-wider text-[#454545] sm:flex-row sm:px-10 sm:py-10 lg:px-12">
            <p>&copy; 2024 STOREWELL. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6">
              <Link href="/" className="hover:underline">
                PRIVACY POLICY
              </Link>
              <Link href="/" className="hover:underline">
                TERMS OF SERVICE
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-background">{children}</main>
      <div className="bg-[#EFEDED]">
        <Footer />
        <div className="w-full border-t border-[#C4C7C7]" />
        <div className="page-container flex items-center justify-between p-6">
          <p className="text-primary-foreground font-normal text-xs">
            &copy; 2024 Storewell. All rights reserved.
          </p>
          <div className="inline-flex gap-2">
            <Link
              href="/"
              className="font-normal text-xs text-primary-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="font-normal text-xs text-primary-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
