import Navbar from "@/components/layouts/Navbar";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layouts/Footer";
import ReduxProvider from "./providers/ReduxProvider";
import Script from "next/script";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
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
      <body className={`${poppins.className} relative overflow-x-hidden`}>
        <ReduxProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
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
