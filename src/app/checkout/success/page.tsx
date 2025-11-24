import { Button } from "@/components/ui/button";
import { setCartCount } from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";
import { getCartsCount } from "@/services/participant";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CheckoutSuccessPage() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const countCart = await getCartsCount(token!);
        dispatch(setCartCount(countCart.data.count));
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
  }, [dispatch, token]);
  return (
    <main className="container mx-auto px-4 py-44">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Terima kasih!</h1>
        <p className="text-muted-foreground">
          Jika pembayaran berhasil, pesanan Anda akan segera diproses.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              Kembali Belanja
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline">Lihat Keranjang</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
