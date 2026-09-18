import SiteShell from "@/components/layouts/SiteShell";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./providers/ReduxProvider";
import Script from "next/script";

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
          <SiteShell>{children}</SiteShell>
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
