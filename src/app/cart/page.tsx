"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice } from "@/lib/utils";
import { setCartCount } from "@/redux/slices/cartSlice";
import { setCheckoutItems } from "@/redux/slices/checkoutSlice";
import { RootState } from "@/redux/store";
import {
  deleteCart,
  getCarts,
  getCartsCount,
  updateCart,
} from "@/services/participant";
import { CartItem } from "@/types/interface";
import { Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [carts, setCarts] = useState<CartItem[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const [updating, setUpdating] = useState<number | null>(null);
  const [selectedCarts, setSelectedCarts] = useState<number[]>([]);

  const getCartsData = useCallback(async () => {
    const data = await getCarts(token!);

    setCarts(data.data);
  }, [token]);

  useEffect(() => {
    getCartsData();
  }, [getCartsData]);

  const handleDelete = async (id: number) => {
    try {
      await deleteCart(id, token!);
      const res = await getCartsCount(token!);
      dispatch(setCartCount(res.data.count));
      getCartsData();
    } catch (error) {
      console.error("Failed to update cart count:", error);
    }
  };

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(id);
    try {
      await updateCart(id, quantity, token!);

      await getCartsData();
    } finally {
      setUpdating(null);
    }
  };

  const handleSelect = (cartId: number) => {
    const cart = carts.find((c) => c.id === cartId);

    if (!cart?.can_purchase) {
      return;
    }
    setSelectedCarts(
      (prev) =>
        prev.includes(cartId)
          ? prev.filter((id) => id !== cartId) // uncheck
          : [...prev, cartId], // check
    );
  };

  const purchasableCartIds = carts
    .filter((c) => c.can_purchase)
    .map((c) => Number(c.id));

  const handleSelectAll = () => {
    if (selectedCarts.length === carts.length) {
      setSelectedCarts([]); // Unselect all
    } else {
      // setSelectedCarts(carts.map((c) => Number(c.id))); // Select all
      setSelectedCarts(purchasableCartIds);
    }
  };

  const getSelectedTotal = () => {
    const selectedItems = carts.filter((item) =>
      selectedCarts.includes(Number(item.id)),
    );

    return selectedItems.reduce(
      (total, item) => total + item.variant_price * item.qty,
      0,
    );
  };

  const selectedItems = carts.filter((item) =>
    selectedCarts.includes(Number(item.id)),
  );

  const invalidStockItems = selectedItems.filter((item) => {
    if (item.allow_negative_stock) {
      return false;
    }

    return (
      (item.variant_stock ?? 0) <= 0 || item.qty > (item.variant_stock ?? 0)
    );
  });

  const canCheckout = invalidStockItems.length === 0;

  const handleCheckout = (selectedIds: number[]) => {
    const selectedItems = carts.filter((item) =>
      selectedIds.includes(Number(item.id)),
    );

    dispatch(setCheckoutItems(selectedItems)); // simpan di redux
    router.push("/checkout");
  };

  return (
    <section className="page-container py-16">
      {carts.length === 0 ? (
        <div className="relative">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold text-muted-foreground mb-4">
              YOUR CART IS EMPTY
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Looks like you haven&apos;t added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary text-white font-bold"
              >
                START SHOPPING
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="tracking-wider">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-normal text-muted-foreground">
              Your Cart
            </h1>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Checkbox
              checked={selectedCarts.length === carts.length}
              onCheckedChange={handleSelectAll}
              className={`border border-[#C4C7C7] data-[state=checked]:bg-primary data-[state=checked]:border-none data-[state=checked]:text-white`}
            />
            <span className="font-medium text-xs text-primary">
              SELECT ALL ({selectedItems.length})
            </span>
          </div>
          <div className="absolute w-full border-t border-[#C4C7C7]" />
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 mt-2">
              <div className="space-y-4">
                {carts.map((item) => (
                  <div key={`${item.id}`}>
                    <Card
                      className={`p-6 border-none shadow-none ${
                        !item.can_purchase
                          ? " bg-primary-foreground/10"
                          : selectedCarts.includes(Number(item.id))
                            ? "bg-transparent"
                            : "bg-transparent"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[auto_12rem_1fr_auto] gap-8">
                        <div className="flex justify-center items-center">
                          <Checkbox
                            checked={selectedCarts.includes(Number(item.id))}
                            onCheckedChange={() =>
                              handleSelect(Number(item.id))
                            }
                            disabled={!item.can_purchase}
                            className={`border border-[#C4C7C7] data-[state=checked]:bg-primary data-[state=checked]:border-none data-[state=checked]:text-white`}
                          />
                        </div>
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
                            <div className="flex flex-wrap gap-1 text-xs text-primary-foreground font-medium uppercase">
                              {item.combinations?.map((combination, index) => (
                                <span key={index} className="font-medium">
                                  {index > 0 && " | "}
                                  {combination.variant_value_name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="inline-flex items-center rounded-full border border-border w-fit">
                            <button
                              onClick={() =>
                                updateQuantity(Number(item.id), item.qty - 1)
                              }
                              disabled={item.qty <= 1 || !item.can_purchase}
                              className="flex h-10 w-10 items-center justify-center disabled:opacity-40"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <span className="min-w-10 text-center font-medium">
                              {item.qty}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(Number(item.id), item.qty + 1)
                              }
                              disabled={
                                updating === Number(item.id) ||
                                !item.can_purchase ||
                                (!item.allow_negative_stock &&
                                  item.qty >= (item.variant_stock ?? 0))
                              }
                              className="flex h-10 w-10 items-center justify-center disabled:opacity-40"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex h-full flex-col justify-between items-end">
                          <div className="text-right">
                            <p className="font-normal capitalize text-primary text-xl">
                              {formatPrice(item.variant_price * item.qty)}
                            </p>
                            <p className="text-xs text-primary-foreground">
                              {formatPrice(item.variant_price)} each
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(Number(item.id))}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                    <div className="w-full border-t border-[#C4C7C7]" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mt-2">
              <Card className="bg-transparent border-none shadow-sm sticky top-24 p-6">
                <h2 className="font-normal capitalize text-primary text-xl">
                  Summary
                </h2>
                <div className="w-full border-t border-[#C4C7C7]" />
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-primary-foreground">
                      Subtotal ({selectedCarts.length} items)
                    </span>
                    <span className="font-medium text-primary">
                      {formatPrice(getSelectedTotal())}
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
                      {formatPrice(getSelectedTotal())}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold mb-4"
                  disabled={!canCheckout || selectedCarts.length === 0}
                  onClick={() => handleCheckout(selectedCarts)}
                >
                  PROCEED TO CHECKOUT
                </Button>

                <div className="text-center inline-flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-primary-foreground" />
                  <p className="text-xs uppercase text-primary-foreground">
                    SECURE CHECKOUT GUARANTEE
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
