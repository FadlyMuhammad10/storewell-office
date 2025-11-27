"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { GetProducts } from "@/services/participant";
import { productType } from "@/types";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const getProducts = useCallback(async () => {
    const data = await GetProducts();

    setProducts(data.data);
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 text-balance uppercase tracking-tight">
            FEATURED GEAR
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto text-pretty font-medium">
            Premium streetwear and urban essentials. Handpicked for style, built
            for the streets.
          </p>
        </div>

        {/* Product Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-xl border-2 border-primary/20">
            <Button
              variant="default"
              size="lg"
              className="rounded-lg font-bold uppercase tracking-wide bg-primary"
            >
              NEW DROPS
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-lg font-bold uppercase tracking-wide hover:bg-accent/20"
            >
              TOP SELLERS
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="rounded-lg font-bold uppercase tracking-wide hover:bg-accent/20"
            >
              ON SALE
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products?.map((product: productType) => (
            <Link
              href={`/products/${product.id}`}
              className="block"
              key={product.id}
            >
              <Card className="group overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-2xl hover:border-accent transition-all duration-300 bg-card">
                <div className="relative overflow-hidden">
                  <Image
                    width={500}
                    height={288}
                    src={product.images?.[0]?.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-10 w-10 bg-background/90 hover:bg-accent"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-balance uppercase tracking-wide group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-xl text-primary">
                        {formatPrice(product.price!)}
                      </span>
                    </div>
                    <Button
                      size="lg"
                      className="h-10 px-4 bg-accent hover:bg-accent/90 font-bold"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-lg px-8 py-4 uppercase tracking-wide bg-transparent"
            asChild
          >
            <Link href="/products">VIEW ALL GEAR</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
