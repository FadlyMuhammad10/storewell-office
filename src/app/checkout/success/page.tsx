import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutSuccessPage() {
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
