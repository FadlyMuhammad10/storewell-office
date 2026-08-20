"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, getStatusLabel } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { detailOrder, postPayment } from "@/services/participant";
import { ShowOrderDetailResponse } from "@/types/interface";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Home,
  Package,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  const [order, setOrder] = useState<ShowOrderDetailResponse>();

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
    (step) =>
      step.key === order?.process_status || order?.process_status === "new",
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
      <div className="min-h-screen">
        <main className="page-container py-16">
          <Card className="p-12 border-2 border-border text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Pesanan Tidak Ditemukan
            </h1>
            <Link href="/dashboard/orders">
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
    <main className="page-container py-16 space-y-10 tracking-wide">
      <div className="flex flex-row justify-between">
        <div className="space-y-2">
          <p className="text-xs text-primary-foreground font-medium">
            ORDER HISTORY / DETAILS
          </p>
          <h1 className="text-3xl font-medium text-primary ">
            Order #{order.order_code}
          </h1>
        </div>
        {order.status === "pending" && (
          <Card className="bg-[#F5F3F3] border border-[#C4C7C7] p-6 h-fit text-center shadow-none">
            <div className="space-y-1">
              <p className="text-xs font-normal">PAYMENT DEADLINE</p>
              <p className="text-lg font-normal text-primary">
                Payment within{" "}
                {new Date(order.expiry_at).toLocaleString("en-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </Card>
        )}
      </div>
      {order.status !== "expired" && (
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
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-muted-foreground"
                  }
                `}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span
                    className={`
                  mt-2 text-xs text-center text-primary font-medium uppercase
                  ${isCompleted ? "text-foreground" : ""}
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
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-xl font-normal text-primary">
                Items ({order.details.length})
              </h3>
            </div>
            <div className="space-y-4">
              {order.details.map((item) => (
                <div key={item.id}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="relative aspect-3/4 w-48 bg-transparent rounded-lg overflow-hidden">
                      <Image
                        fill
                        src={item.image_url || "/default-image.png"}
                        alt={item.product_name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col">
                        <h3 className="font-normal capitalize text-primary text-xl">
                          {item.product_name}
                        </h3>
                        {item.variants.map((v, i) => (
                          <div
                            key={i}
                            className="text-primary-foreground font-light capitalize"
                          >
                            <div className="inline-flex">
                              <span>{`${v.variant_type_name}: `}</span>
                              <span>{v.variant_value_name}</span>
                            </div>
                          </div>
                        ))}
                        <p className="text-primary-foreground font-light">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <Link
                        href={`/products/${item.product_id}`}
                        className="text-primary text-xs uppercase underline"
                      >
                        View Product
                      </Link>
                    </div>
                    <div className="flex h-full flex-col justify-between items-end">
                      <div className="text-right">
                        <p className="font-normal capitalize text-primary text-xl">
                          {formatPrice(item.final_price * item.qty)}
                        </p>
                        <p className="text-xs text-primary-foreground">
                          {formatPrice(item.final_price)} each
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-t border-[#C4C7C7] mt-6" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative mt-2">
          <Card className="bg-[#F5F3F3] border-none shadow-sm p-6">
            <h2 className="font-normal capitalize text-primary text-xl">
              Summary
            </h2>
            <div className="w-full border-t border-[#C4C7C7]" />
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-primary-foreground">Subtotal</span>
                <span className="font-medium text-primary">
                  {formatPrice(subtotalPrice || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-foreground">Shipping</span>
                <span className=" text-sm">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-foreground">Tax</span>
                <span className=" text-sm">Calculated at checkout</span>
              </div>
              <div className="w-full border-t border-[#C4C7C7]" />
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-primary">TOTAL</span>
                <span className="font-semibold text-primary">
                  {formatPrice(order.final_amount)}
                </span>
              </div>
            </div>

            {order.status === "pending" && (
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold mb-4"
                onClick={handlePay}
                disabled={order.status !== "pending"}
              >
                COMPLETE PAYMENT
              </Button>
            )}
            {order.status === "expired" && (
              <Card className="bg-gray-200 border border-[#C4C7C7] h-fit text-center shadow-none">
                <div className="space-y-1">
                  <p className="text-xs font-normal">
                    This order has expired and can no longer be paid.
                  </p>
                </div>
              </Card>
            )}
            <div className="space-y-1">
              <p className="text-primary-foreground text-xs font-normal">
                SHIPPING ADDRESS
              </p>
              <div className="w-full border-t border-[#C4C7C7] mb-4" />
              <p className="text-primary font-medium capitalize">
                {order.full_name}
              </p>
              <p className="text-primary font-extralight capitalize">
                {order.phone_number}
              </p>
              <p className="text-primary font-extralight capitalize">
                {order.address}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-primary-foreground text-xs font-normal">
                DELIVERY METHOD
              </p>
              <div className="w-full border-t border-[#C4C7C7] mb-4" />
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <h2 className="text-primary font-extralight capitalize">
                  Standard Shipping (3-5 Business Days)
                </h2>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {order.status === "pending" && (
        <>
          <div className="w-full border-t border-[#C4C7C7]" />
          <div className="space-y-6">
            <h3 className="text-xl font-normal text-primary">
              Payment Instructions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div>
                <div className="flex flex-col gap-2">
                  <Badge className=" bg-transparent h-7 w-7 flex items-center justify-center p-0 text-xs border border-primary font-medium">
                    01
                  </Badge>
                  <h2 className="font-light text-primary-foreground">
                    Click the &apos;Complete Payment&apos; button to proceed to
                    our secure Midtrans payment gateway.
                  </h2>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <Badge className=" bg-transparent h-7 w-7 flex items-center justify-center p-0 text-xs border border-primary font-medium">
                    02
                  </Badge>
                  <h2 className="font-light text-primary-foreground">
                    Select your preferred payment method (Credit Card, Virtual
                    Account, or Bank Transfer).
                  </h2>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <Badge className=" bg-transparent h-7 w-7 flex items-center justify-center p-0 text-xs border border-primary font-medium">
                    03
                  </Badge>
                  <h2 className="font-light text-primary-foreground">
                    Once payment is confirmed, your order status will
                    automatically update to &apos;Processing&apos;.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
