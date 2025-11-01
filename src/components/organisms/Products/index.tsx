"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PRODUCTS_DATA } from "@/constants";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsSection() {
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
          {PRODUCTS_DATA.map((product) => (
            <Link
              href={`/product/${product.id}`}
              className="block"
              key={product.id}
            >
              <Card className="group overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-2xl hover:border-accent transition-all duration-300 bg-card">
                <div className="relative overflow-hidden">
                  <Image
                    width={500}
                    height={288}
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-black text-xs px-3 py-1 uppercase tracking-wider">
                    {product.badge}
                  </Badge>
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
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="text-sm font-bold ml-1">
                        s{product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      ({product.reviews})
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-4 text-balance uppercase tracking-wide group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-xl text-primary">
                        ${product.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through font-medium">
                        ${product.originalPrice}
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
