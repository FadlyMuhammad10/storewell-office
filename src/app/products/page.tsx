"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { GetCategories, GetProducts } from "@/services/participant";
import { categoryType, productType } from "@/types";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProductsPage() {
  const [productsData, setProductsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [categoriesData, setCategoriesData] = useState<categoryType[]>();

  const getProducts = useCallback(async () => {
    const data = await GetProducts();

    setProductsData(data.data);
  }, []);

  const getCategories = useCallback(async () => {
    const data = await GetCategories();

    setCategoriesData(data.data);
  }, []);

  useEffect(() => {
    getProducts();
    getCategories();
  }, [getProducts, getCategories]);

  const filteredProducts = useMemo(() => {
    let products: productType[] = [...productsData];

    if (selectedCategory !== "ALL") {
      products = products.filter((p) => p.category?.name === selectedCategory);
    }

    return products;
  }, [selectedCategory, productsData]);

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary font-medium"
          >
            HOME
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-primary font-bold uppercase">ALL GEAR</span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black mb-2 text-balance uppercase tracking-tight">
              ALL GEAR
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse our complete collection of premium streetwear and urban
              essentials
            </p>
          </div>
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-primary/20 hover:border-accent bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div className="space-y-4">
                <h3 className="font-black text-lg uppercase tracking-wide">
                  CATEGORY
                </h3>
                <div className="space-y-2">
                  {categoriesData?.map((category, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-4 py-2 rounded-lg font-medium text-sm uppercase tracking-wide transition-all ${
                        selectedCategory === category.name
                          ? "bg-accent text-accent-foreground border-2 border-accent"
                          : "border-2 border-primary/20 hover:border-accent text-foreground"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 text-sm text-muted-foreground font-medium">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    href={`/products/${product.id}`}
                    className="block"
                    key={product.id}
                  >
                    <Card className="group overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-2xl hover:border-accent transition-all duration-300 bg-card h-full">
                      <div className="relative overflow-hidden">
                        <Image
                          width={500}
                          height={500}
                          src={
                            product.images?.[0]?.image_url || "/placeholder.svg"
                          }
                          alt={product.name}
                          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground font-black text-xs px-3 py-1 uppercase tracking-wider">
                          {product.badge}
                        </Badge> */}
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
                        <h3 className="font-bold text-lg mb-4 text-balance uppercase tracking-wide group-hover:text-accent transition-colors line-clamp-2">
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
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
