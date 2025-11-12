"use client";
import { Badge } from "@/components/ui/badge";
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
import { productType } from "@/types";
import { CartItem } from "@/types/interface";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
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
      setCarts((prev) =>
        prev.map((item) =>
          Number(item.id) === id ? { ...item, quantity } : item
        )
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleSelect = (cartId: number) => {
    setSelectedCarts(
      (prev) =>
        prev.includes(cartId)
          ? prev.filter((id) => id !== cartId) // uncheck
          : [...prev, cartId] // check
    );
  };

  const handleSelectAll = () => {
    if (selectedCarts.length === carts.length) {
      setSelectedCarts([]); // Unselect all
    } else {
      setSelectedCarts(carts.map((c) => Number(c.id))); // Select all
    }
  };

  const getSelectedTotal = () => {
    const selectedItems = carts.filter((item) =>
      selectedCarts.includes(Number(item.id))
    );

    return selectedItems.reduce(
      (total, item) => total + item.product.price! * item.quantity,
      0
    );
  };

  const handleCheckout = (selectedIds: number[]) => {
    const selectedItems = carts.filter((item) =>
      selectedIds.includes(Number(item.id))
    );

    dispatch(setCheckoutItems(selectedItems)); // simpan di redux
    router.push("/checkout");
  };

  return (
    <section>
      {carts.length === 0 ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              YOUR CART IS EMPTY
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              Looks like you haven&apos;t added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                START SHOPPING
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                CONTINUE SHOPPING
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-foreground">
                  SHOPPING CART
                </h1>
                <Badge variant="secondary" className="text-sm font-bold">
                  {carts.length} ITEMS
                </Badge>
              </div>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <Checkbox
                  checked={selectedCarts.length === carts.length}
                  onCheckedChange={handleSelectAll}
                  className="h-5 w-5 border-foreground"
                />
                <span className="font-medium text-foreground">
                  SELECT ALL ({carts.length})
                </span>
              </div>

              <div className="space-y-4">
                {carts.map((item) => (
                  <Card
                    key={`${item.id}`}
                    className={`p-6 border-2 transition-colors duration-200 ease-in-out ${
                      selectedCarts.includes(Number(item.id))
                        ? "border-border"
                        : "border-primary bg-primary/5"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex items-start pt-1">
                        <Checkbox
                          checked={selectedCarts.includes(Number(item.id))}
                          onCheckedChange={() => handleSelect(Number(item.id))}
                          className="h-5 w-5 border-foreground"
                        />
                      </div>
                      <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden">
                        <Image
                          fill
                          src={item.product.images![0].image_url || ""}
                          alt={item.product.name}
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-foreground text-lg">
                            {item.product.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(Number(item.id))}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex gap-4 mb-4">
                          {item.cartVariant?.map((variant, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="font-medium"
                            >
                              {variant.variantValue.variantType.name}:{" "}
                              {variant.variantValue.value}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  Number(item.id),
                                  item.quantity - 1
                                )
                              }
                              className="h-8 w-8 p-0 border-2"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-bold text-foreground min-w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  Number(item.id),
                                  item.quantity + 1
                                )
                              }
                              className="h-8 w-8 p-0 border-2"
                              disabled={updating === Number(item.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">
                              {formatPrice(item.product.price! * item.quantity)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.product.price!)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => dispatch(resetCart())}
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  CLEAR CART
                </Button>
              </div> */}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 border-2 border-border sticky top-4">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({selectedCarts.length} items)
                    </span>
                    <span className="font-medium">
                      {formatPrice(getSelectedTotal())}
                    </span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-primary">FREE</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">{formatPrice(0)}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-foreground">TOTAL</span>
                    <span className="font-bold text-foreground">
                      {formatPrice(getSelectedTotal())}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold mb-4"
                  disabled={selectedCarts.length === 0}
                  onClick={() => handleCheckout(selectedCarts)}
                >
                  PROCEED TO CHECKOUT
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Secure checkout powered by
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      VISA
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      MASTERCARD
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      PAYPAL
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      )}
    </section>
  );
}
