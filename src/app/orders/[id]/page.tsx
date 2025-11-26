"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { detailOrder } from "@/services/participant";
import { OrderItem } from "@/types/interface";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function OrderDetail() {
  const token = useSelector((state: RootState) => state.auth.token);
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderItem>();

  const getOrderData = useCallback(async () => {
    const data = await detailOrder(id, token!);

    setOrder(data.data);
  }, [id, token]);

  useEffect(() => {
    getOrderData();
  }, [getOrderData]);

  const subtotalPrice = order?.carts?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12">
          <Card className="p-12 border-2 border-border text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Pesanan Tidak Ditemukan
            </h1>
            <Link href="/orders">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Pesanan
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        <Link href="/orders">
          <Button
            variant="ghost"
            className="text-primary hover:bg-primary/10 font-bold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground">
            Detail Pesanan
          </h1>
          <p className="text-muted-foreground text-lg">
            Nomor Pesanan: {order?.order_id}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="p-6 border-2 border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Status Pesanan
                </h2>
                <Badge
                  className={`text-lg px-4 py-2 ${getStatusColor(
                    order.status
                  )} border-0`}
                >
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Pesanan dibuat pada {order?.order_date}
              </p>
            </Card>

            {/* Items List */}
            <Card className="p-6 border-2 border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Item Pesanan
              </h2>
              <div className="space-y-4">
                {order?.carts?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-border last:border-0"
                  >
                    <Image
                      src={
                        item.product.images[0]?.image_url || "/placeholder.svg"
                      }
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-foreground">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Info */}
            <Card className="p-6 border-2 border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Informasi Pengiriman
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold">
                      Alamat
                    </p>
                    <p className="text-foreground">{order.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-4 border-t border-border">
                  <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold">
                      Telepon
                    </p>
                    <p className="text-foreground">{order.phone}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <Card className="p-6 border-2 border-border h-fit">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Ringkasan Pesanan
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatPrice(subtotalPrice || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pajak (0%)</span>
                <span className="font-medium">{formatPrice(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ongkir</span>
                <span className="font-medium">
                  {formatPrice(order.shipping_cost!)}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-foreground">TOTAL</span>
                <span className="font-bold text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground font-semibold mb-1">
                  Nama Penerima
                </p>
                <p className="text-foreground">{order.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold mb-1">
                  Email
                </p>
                <p className="text-foreground">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold mb-1">
                  Metode Pembayaran
                </p>
                <p className="text-foreground capitalize">
                  {order.payment_type}
                </p>
              </div>
            </div>

            <Link href="/products" className="mt-6 block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                Belanja Lagi
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}
