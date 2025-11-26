"use client";
import { Button } from "@/components/ui/button";
import { setCartCount } from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";
import { detailOrder, getCartsCount } from "@/services/participant";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CheckoutSuccessPage() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handle = async () => {
      const orderId = searchParams.get("order_id");

      if (!orderId) {
        router.replace("/");
        return;
      }

      // refresh cart count (ya di sini bisa)
      try {
        const res = await getCartsCount(token!);
        dispatch(setCartCount(res.data.count));
      } catch (error) {
        console.log("cart count error:", error);
      }

      // cek order status real ke BE
      try {
        await detailOrder(orderId, token!);
        router.replace(`/orders/${orderId}`);
      } catch (err) {
        console.log("order error:", err);
        router.replace("/");
      }
    };

    handle();
  }, [router, searchParams, token, dispatch]);
  return (
    <main className="min-h-[55vh]">
      <div className="container mx-auto py-32">
        <p className="text-center text-muted-foreground text-xl">
          Mengalihkan ke halaman pesanan Anda...
        </p>
      </div>
    </main>
  );
}
