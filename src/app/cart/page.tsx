import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // other properties...
}

export default function CartPage() {
  const carts: CartItem[] = [];
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

              <div className="space-y-4">
                {carts.map((item) => (
                  <Card
                    key={`${item.id}`}
                    className="p-6 border-2 border-border"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden">
                        <Image
                          fill
                          src={"/images/urban-hoodie-streetwear.jpg"}
                          alt={item.name}
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-foreground text-lg">
                            {item.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            // onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* <div className="flex gap-4 mb-4">
                          <Badge variant="outline" className="font-medium">
                            SIZE: {item.size}
                          </Badge>
                          <Badge variant="outline" className="font-medium">
                            COLOR: {item.color}
                          </Badge>
                        </div> */}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              //   onClick={() =>
                              //     updateQuantity(item.id, item.quantity - 1)
                              //   }
                              className="h-8 w-8 p-0 border-2"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-bold text-foreground min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              //   onClick={() =>
                              //     updateQuantity(item.id, item.quantity + 1)
                              //   }
                              className="h-8 w-8 p-0 border-2"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">
                              {formatPrice(5000)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(5000)} each
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
                      Subtotal ({0} items)
                    </span>
                    <span className="font-medium">{formatPrice(1000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-primary">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">{formatPrice(0)}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-foreground">TOTAL</span>
                    <span className="font-bold text-foreground">
                      {formatPrice(1000)}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold mb-4"
                  //   onClick={handleCheckout}
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
