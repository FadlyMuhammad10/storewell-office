import Navbar from "@/components/layouts/Navbar";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layouts/Footer";
import ReduxProvider from "./providers/ReduxProvider";
import Script from "next/script";
import Link from "next/link";

const geist = Geist({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "Storewell - Your Premium Shopping Destination",
  description:
    "Discover the latest fashion trends and premium products at Storewell. Shop with confidence and style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} relative overflow-x-hidden`}>
        <ReduxProvider>
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
                  href={"/"}
                  className="font-normal text-xs text-primary-foreground"
                >
                  Privacy Policy
                </Link>
                <Link
                  href={"/"}
                  className="font-normal text-xs text-primary-foreground"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          <Script
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            strategy="afterInteractive"
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
