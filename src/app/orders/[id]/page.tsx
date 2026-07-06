"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { detailOrder, postPayment } from "@/services/participant";
import { OrderItem } from "@/types/interface";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "success":
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
    case "success":
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

function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5 text-primary" />;
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-primary" />;
    case "process":
      return <Package className="h-5 w-5 text-primary" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-primary" />;
    case "delivered":
      return <Home className="h-5 w-5 text-primary" />;
    default:
      return null;
  }
}

const statusSteps = [
  {
    key: "pending",
    label: getStatusLabel("pending"),
    icon: Clock,
  },
  {
    key: "success",
    label: getStatusLabel("success"),
    icon: CheckCircle2,
  },
  {
    key: "process",
    label: getStatusLabel("process"),
    icon: Package,
  },
  {
    key: "shipped",
    label: getStatusLabel("shipped"),
    icon: Truck,
  },
  {
    key: "delivered",
    label: getStatusLabel("delivered"),
    icon: Home,
  },
];

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

  const subtotalPrice = order?.details?.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.key === order?.process_status,
  );

  const handlePay = () => {
    const pay = async () => {
      const res = await postPayment(
        {
          order_code: id,
        },
        token!,
      );

      const snapToken = res.data.token;

      window.snap.pay(snapToken, {
        onSuccess: function () {
          window.location.href = `/orders/${id}`;
        },
        onPending: function () {
          window.location.href = `/orders/${id}`;
        },
        onError: function () {
          alert("Payment error");
        },
        onClose: function () {
          console.log("User closed snap");
        },
      });
    };

    pay();
  };

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
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div>
          <Link href="/orders">
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10 font-bold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
        </div>

        <Card className="p-6 border-2 border-border">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground font-semibold uppercase">
                Nomor Pesanan
              </p>
              <p className="text-lg font-bold text-foreground">
                {order.order_code}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold uppercase">
                Tanggal Pesanan
              </p>
              <p className="text-sm text-foreground">{order.order_date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold uppercase">
                Status Pembayaran
              </p>
              <Badge
                className={`mt-1 ${getStatusColor(order.status)} border-0`}
              >
                {getStatusLabel(order.status)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-semibold uppercase">
                Total
              </p>
              <p className="text-sm font-semibold text-primary">
                {formatPrice(order.final_amount)}
              </p>
            </div>
          </div>
        </Card>

        {order.status === "pending" && (
          <Card className="p-6 border-2 border-orange-300 bg-orange-50">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="text-3xl shrink-0">⏱️</div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    Selesaikan Pembayaran
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pesanan Anda sudah dikonfirmasi dan sedang menunggu
                    pembayaran
                  </p>
                </div>
              </div>

              {/* Alert */}
              {/* <Alert className="border-orange-300 bg-white">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  Pesanan akan otomatis dibatalkan jika pembayaran tidak
                  diselesaikan dalam 24 jam
                </AlertDescription>
              </Alert> */}

              {/* Payment Amount */}
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-muted-foreground font-semibold mb-1">
                  Jumlah Pembayaran
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(order.final_amount)}
                </p>
              </div>

              {/* Countdown */}
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <p className="text-sm font-semibold text-orange-900">
                    Sisa Waktu Pembayaran
                  </p>
                </div>
                {/* <PaymentCountdown expiresAt={paymentExpiredAt} /> */}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Link href="" className="block">
                  <Button
                    onClick={handlePay}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base h-12"
                  >
                    💳 Bayar Sekarang
                  </Button>
                </Link>
              </div>

              {/* Info */}
              <p className="text-xs text-muted-foreground text-center pt-2">
                Data pesanan Anda aman. Anda dapat melanjutkan pembayaran kapan
                saja tanpa perlu membuat pesanan baru.
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Status Pengiriman
            </h2>
          </div>
          {/* Status Content */}
          <div className="flex items-start">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;

              const isCompleted = index <= currentStatusIndex;
              const isLast = index === statusSteps.length - 1;

              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-200 text-muted-foreground"
                  }
                `}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className={`
                  mt-2 text-xs text-center
                  ${
                    isCompleted
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }
                `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {!isLast && (
                    <div
                      className={`
                  flex-1 h-1 mt-5 mx-2 rounded-full
                  ${index < currentStatusIndex ? "bg-primary" : "bg-gray-200"}
                `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <Card className="p-6 border-2 border-border">
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Item Pesanan
                </h2>
                <span className="ml-auto text-sm text-primary-foreground bg-primary px-3 py-1 rounded-full">
                  {order.details.length} item
                </span>
              </div>
              <div className="space-y-4">
                {order?.details?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-border last:border-0"
                  >
                    <Image
                      src={item.image_url || "/file.svg"}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-foreground">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.qty}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Info */}
            <Card className="p-6 border-2 border-border">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Informasi Pengiriman
                </h2>
              </div>
              <div className="space-y-6">
                {/* Recipient */}
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-1">
                      Penerima
                    </p>
                    <p className="text-foreground font-medium">
                      {order.full_name}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-1">
                      Nomor Telepon
                    </p>
                    <p className="text-foreground font-medium">
                      {order.phone_number}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-1">
                      Alamat Lengkap
                    </p>
                    <p className="text-foreground">{order.address}</p>
                  </div>
                </div>

                {/* Shipping Details */}
                {order.status !== "pending_payment" && (
                  <div className="pt-4 border-t border-border space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold mb-1">
                        Kurir Pengiriman
                      </p>
                      <p className="text-foreground capitalize">JNE / OKE</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground font-semibold mb-1">
                        Nomor Resi
                      </p>
                      <p className="text-foreground font-mono">-</p>
                    </div>
                  </div>
                )}
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
                  {formatPrice(order.final_amount!)}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-foreground">TOTAL</span>
                <span className="font-bold text-primary">
                  {formatPrice(order.final_amount)}
                </span>
              </div>
            </div>
            <div className="space-y-3 pt-6 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground font-semibold mb-1">
                  Nama Penerima
                </p>
                <p className="text-foreground">{order.full_name}</p>
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
                <p className="text-foreground">{order.payment_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold mb-1">
                  Waktu Transaksi
                </p>
                <p className="text-foreground">{order.transaction_time}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
