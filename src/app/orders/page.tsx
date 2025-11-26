"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { getOrders } from "@/services/participant";
import { OrderItem } from "@/types/interface";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "settlement":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-purple-100 text-purple-800";
    case "shipped":
      return "bg-cyan-100 text-cyan-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Menunggu Pembayaran";
    case "settlement":
      return "Dibayar";
    case "processing":
      return "Diproses";
    case "shipped":
      return "Dikirim";
    case "delivered":
      return "Terima";
    default:
      return status;
  }
}

export default function OrderPage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const getOrdersData = useCallback(async () => {
    const data = await getOrders(token!);

    setOrders(data.data);
  }, [token]);

  useEffect(() => {
    getOrdersData();
  }, [getOrdersData]);
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-foreground">
              Pesanan Saya
            </h1>
            <p className="text-muted-foreground text-lg">
              Kelola dan pantau semua pesanan Anda
            </p>
          </div>

          {orders.length === 0 ? (
            <Card className="p-12 border-2 border-dashed border-border text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tidak Ada Pesanan
              </h2>
              <p className="text-muted-foreground mb-6">
                Mulai berbelanja untuk membuat pesanan pertama Anda
              </p>
              <Link href="/products">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                  Lihat Semua Produk
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="p-6 border-2 border-border hover:border-primary transition-colors"
                >
                  <div className="grid gap-6 md:grid-cols-5">
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold uppercase">
                        Nomor Pesanan
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {order.order_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold uppercase">
                        Tanggal
                      </p>
                      <p className="text-sm text-foreground">
                        {order.order_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold uppercase">
                        Total
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold uppercase">
                        Status
                      </p>
                      <Badge
                        className={`mt-1 ${getStatusColor(
                          order.status
                        )} border-0`}
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <div className="flex items-end">
                      <Link
                        href={`/orders/${order.order_id}`}
                        className="w-full"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold bg-transparent"
                        >
                          Detail
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
