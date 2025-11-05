"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { productType } from "@/types";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { GetProductDetail } from "@/services/participant";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<productType>();
  const images = product?.images || [];
  // cari index image yang isPrimary true
  const primaryIndex = images.findIndex((img) => img.isPrimary === true);
  // simpan index, bukan url
  const [selectedImage, setSelectedImage] = useState(
    primaryIndex !== -1 ? primaryIndex : 0
  );
  const [selectedVariants, setSelectedVariants] = useState({
    variants: [],
  });

  const [quantity, setQuantity] = useState(1);

  const getProductDetail = useCallback(async () => {
    const data = await GetProductDetail(id);

    setProduct(data.data);
  }, [id]);

  useEffect(() => {
    getProductDetail();
  }, [getProductDetail]);

  const handleSelectVariant = (variant, vv) => {
    setSelectedVariants((prev) => {
      const existing = prev.variants.find(
        (v) => v.variantTypeId === variant.id
      );

      let updatedVariants;
      if (existing) {
        // Update varian yang sudah ada
        updatedVariants = prev.variants.map((v) =>
          v.variantTypeId === variant.id
            ? {
                variantTypeId: variant.id,
                name: variant.name,
                valueId: vv.id,
                value: vv.value,
              }
            : v
        );
      } else {
        // Tambahkan varian baru
        updatedVariants = [
          ...prev.variants,
          {
            variantTypeId: variant.id,
            name: variant.name,
            valueId: vv.id,
            value: vv.value,
          },
        ];
      }

      return { ...prev, variants: updatedVariants };
    });
  };

  const isSelected = (variantId, valueId) =>
    selectedVariants.variants.some(
      (v) => v.variantTypeId === variantId && v.valueId === valueId
    );

  return (
    <div className="min-h-screen bg-background">
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
          <Link
            href="/#products"
            className="text-muted-foreground hover:text-primary font-medium"
          >
            GEAR
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-primary font-bold uppercase">
            {product?.category?.name}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Back Button */}
        <Button
          variant="outline"
          asChild
          className="mb-8 border-2 border-primary/20 hover:border-accent bg-transparent"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            BACK TO GEAR
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {product ? (
              <div className="relative overflow-hidden rounded-xl border-2 border-primary/20">
                <Image
                  width={600}
                  height={600}
                  src={
                    images[selectedImage]?.image_url || "/placeholder.png" // fallback agar tidak empty string
                  }
                  alt={product.name || "Product image"}
                  className="w-full h-[600px] rounded-xl object-cover"
                />
              </div>
            ) : (
              <Skeleton className="w-full h-[600px] object-cover" />
            )}

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? "border-accent"
                      : "border-primary/20 hover:border-primary/40"
                  }`}
                >
                  <Image
                    width={200}
                    height={200}
                    src={image.image_url || "/placeholder.svg"}
                    alt={`${product?.name} view ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-black mb-4 text-balance uppercase tracking-tight">
                {product?.name}
              </h1>
              {/* <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="text-lg font-bold ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-muted-foreground font-medium">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-muted-foreground">
                  SKU: {product.sku}
                </span>
              </div> */}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-primary">
                {formatPrice(product?.price || 0)}
              </span>
              {/* <span className="text-xl text-muted-foreground line-through font-medium">
                ${5000}
              </span>
              <Badge variant="destructive" className="text-sm font-bold">
                -{0}%
              </Badge> */}
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product?.description}
            </p>

            {product?.variants?.map((variant) => (
              <div key={variant.id}>
                <h3 className="font-bold text-lg mb-4 uppercase tracking-wide">
                  {variant.name}
                </h3>
                <div className="flex gap-3">
                  {variant?.values?.map((vv) => (
                    <button
                      type="button"
                      key={vv.id}
                      onClick={() => handleSelectVariant(variant, vv)}
                      className={`px-4 py-2 border-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                        isSelected(variant.id, vv.id)
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-primary/20 hover:border-primary/40"
                      }`}
                    >
                      {vv.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <h3 className="font-bold text-lg mb-4 uppercase tracking-wide">
                QUANTITY
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-primary/20 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-bold text-lg min-w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 h-14 text-lg font-bold uppercase tracking-wide bg-accent hover:bg-accent/90"
                  // onClick={handleToClick}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  ADD TO CART
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-6 border-2 border-primary/20 hover:border-accent bg-transparent"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-6 border-2 border-primary/20 hover:border-accent bg-transparent"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Buy Now button */}
              <Button
                size="lg"
                variant="outline"
                // onClick={handleBuyNow}
                // disabled={!selectedSize || !selectedColor}
                className="w-full h-14 text-lg font-bold uppercase tracking-wide border-2 border-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                BUY NOW
              </Button>

              {/* Selection validation message */}
              {/* {(!selectedSize || !selectedColor) && (
                <p className="text-sm text-muted-foreground text-center">
                  Please select size and color to continue
                </p>
              )} */}
            </div>

            {/* Features */}
            {/* <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 uppercase tracking-wide">
                  FEATURES
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Product Details Tabs */}
        {/* <div className="mt-20">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-14 bg-primary/10 border-2 border-primary/20">
              <TabsTrigger
                value="details"
                className="font-bold uppercase tracking-wide data-[state=active]:bg-accent"
              >
                DETAILS
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="font-bold uppercase tracking-wide data-[state=active]:bg-accent"
              >
                REVIEWS ({product.reviews})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="font-bold uppercase tracking-wide data-[state=active]:bg-accent"
              >
                SHIPPING
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <h3 className="font-bold text-xl mb-4 uppercase tracking-wide">
                      PRODUCT DETAILS
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {product.description}
                    </p>
                    <Separator className="my-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-3 uppercase tracking-wide">
                          SPECIFICATIONS
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>
                            <strong>Category:</strong> {product.category}
                          </li>
                          <li>
                            <strong>SKU:</strong> {product.sku}
                          </li>
                          <li>
                            <strong>Available Sizes:</strong>{" "}
                            {product.sizes.join(", ")}
                          </li>
                          <li>
                            <strong>Available Colors:</strong>{" "}
                            {product.colors.join(", ")}
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold mb-3 uppercase tracking-wide">
                          CARE INSTRUCTIONS
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Machine wash cold</li>
                          <li>• Do not bleach</li>
                          <li>• Tumble dry low</li>
                          <li>• Iron on low heat</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6 uppercase tracking-wide">
                    CUSTOMER REVIEWS
                  </h3>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                      Reviews coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-8">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="font-bold text-xl mb-6 uppercase tracking-wide">
                    SHIPPING INFO
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Free shipping on orders over $100</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Standard delivery: 3-5 business days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>Express delivery: 1-2 business days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>30-day return policy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div> */}
      </div>
    </div>
  );
}
