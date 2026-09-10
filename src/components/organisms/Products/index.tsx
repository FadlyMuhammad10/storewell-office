"use client";
import { Card } from "@/components/ui/card";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { GetProducts } from "@/services/participant";
import { Product } from "@/types/interface";
import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const getProducts = useCallback(async () => {
    const data = await GetProducts({
      page: 1,
      per_page: 4,
    });

    setProducts(data.data);
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);
  return (
    <section className="page-container py-16 space-y-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-primary">
            New Arrivals
          </h2>
          <p className="mt-2 text-sm text-primary-foreground">
            Seasonal silhouettes engineered in natural wool, cashmere, and
            poplin
          </p>
        </div>

        <Link
          href="/products"
          className="group inline-flex items-center gap-1 self-start text-xs font-bold uppercase tracking-wider text-primary sm:self-auto"
        >
          <span className="group-hover:underline">View all new arrivals</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {products?.map((product: Product) => {
          const { finalPrice, discountLabel } = getDiscountedPrice(
            product.base_price,
            product.discount,
            product.final_price,
          );

          return (
            <Link
              href={`/products/${product.id}`}
              className="block"
              key={product.id}
            >
              <Card className="group border-0 shadow-none rounded-none bg-background space-y-1">
                {/* Image */}
                <div className="relative overflow-hidden aspect-3/4">
                  <Image
                    src={product.images?.[0]?.image_url || "/default-image.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="group absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
                    <Heart className="h-4 w-4 text-white group-hover:text-primary group-hover:fill-primary" />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className=" font-normal text-primary">{product.name}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-xs">
                      {formatPrice(finalPrice)}
                    </span>
                    {discountLabel && (
                      <>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.base_price)}
                        </span>
                        <span className="text-xs font-semibold text-red-500">
                          {discountLabel}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
