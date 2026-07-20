"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { addCartSchema } from "@/lib/schema";
import { formatPrice } from "@/lib/utils";
import { incrementCartCount, setCartCount } from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";
import {
  addCart,
  getCartsCount,
  GetProductDetail,
} from "@/services/participant";
import { ProductDetail, SelectedVariants } from "@/types";
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
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail>();
  const images = product?.images || [];
  // cari index image yang isPrimary true
  const primaryIndex = images.findIndex((img) => img.is_primary === true);
  // simpan index, bukan url
  const [selectedImage, setSelectedImage] = useState(
    primaryIndex !== -1 ? primaryIndex : 0,
  );
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({
    variants: [],
  });
  const [quantity, setQuantity] = useState(1);
  const login = useSelector((state: RootState) => state.auth.isLogin);
  const token = useSelector((state: RootState) => state.auth.token);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const getProductDetail = useCallback(async () => {
    const data = await GetProductDetail(id);

    setProduct(data.data);
  }, [id]);

  useEffect(() => {
    getProductDetail();
  }, [getProductDetail]);

  const handleSelectVariant = (
    variant: { id: number; name: string },
    vv: { id: number; value: string },
  ) => {
    setSelectedVariants((prev) => {
      const existing = prev.variants.find(
        (v) => v.variantTypeId === variant.id,
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
            : v,
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

  const isSelected = (variantId: number, valueId: number) =>
    selectedVariants.variants.some(
      (v) => v.variantTypeId === variantId && v.valueId === valueId,
    );

  // Get product_variant_id by matching selected variant values with combinations
  const getProductVariantInfo = () => {
    if (!product?.combinations || selectedVariants.variants.length === 0) {
      return null;
    }

    const selectedValueIds = selectedVariants.variants
      .map((v) => v.valueId)
      .sort();

    const matchingCombination = product.combinations.find((combo) => {
      const comboValueIds = [...combo.option_value_ids].sort();
      return (
        selectedValueIds.length === comboValueIds.length &&
        selectedValueIds.every((id, index) => id === comboValueIds[index])
      );
    });

    return matchingCombination || null;
  };

  // Get total stock atau stock yang sesuai dengan variant
  const getTotalStock = () => {
    if (!product?.combinations) {
      return 0;
    }

    const totalStock = product.combinations.reduce(
      (total, combo) => total + (combo.stock || 0),
      0,
    );
    // Jika belum ada variant dipilih, jumlahkan semua stock
    if (selectedVariants.variants.length === 0) {
      return totalStock;
    }

    // Jika sudah ada variant dipilih, ambil stock yang sesuai
    return getProductVariantInfo()?.stock || totalStock;
  };
  const getPriceVariant = () => {
    if (!product?.combinations) {
      return 0;
    }

    if (selectedVariants.variants.length === 0) {
      return product.base_price || 0;
    }

    return getProductVariantInfo()?.price || product.base_price;
  };

  const selectStock = getTotalStock();
  const selectPrice = getPriceVariant();

  const getCanPurchaseVariant = () => {
    if (!product?.combinations) {
      return 0;
    }

    return getProductVariantInfo()?.can_purchase
  }


  // Check apakah semua variants sudah dipilih atau allow_negative_stock true
  const areAllVariantsSelected = () => {
    if (!product?.variants) {
      return true; // Jika tidak ada variants, always true
    }
    return selectedVariants.variants.length === product.variants.length;
  };

  const isVariantSelectionComplete =
    product?.allow_negative_stock || areAllVariantsSelected();

  const handleToAddToCart = () => {
    if (!login) {
      return router.push("/login");
    }

    const productVariantId = getProductVariantInfo()?.product_variant_id;

    const payload: z.infer<typeof addCartSchema> = {
      product_id: product?.id as number,
      quantity,
      product_variant_id: productVariantId as number,
    };

    const addToCart = async () => {
      await addCart(payload, token!);

      // Ambil jumlah cart terbaru
      dispatch(incrementCartCount());
      const res = await getCartsCount(token!);
      dispatch(setCartCount(res.data.count));

      setIsAddedToCart(true);
    };

    addToCart();
  };

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
            {product?.category_name}
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
                    images[selectedImage]?.image_url || "/default-image.png" // fallback agar tidak empty string
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
                    src={image?.image_url || "/default-image.png"}
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
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-primary">
                {formatPrice(selectPrice)}
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product?.description}
            </p>

            {product?.variants?.map((variant, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg mb-4 uppercase tracking-wide">
                  {variant.variant_type_name}
                </h3>
                <div className="flex gap-3">
                  {variant?.values?.map((vv, vvIndex) => (
                    <div key={vvIndex}>
                      <button
                        type="button"
                        key={vv.variant_value_id}
                        onClick={() =>
                          handleSelectVariant(
                            {
                              id: variant.variant_type_id,
                              name: variant.variant_type_name,
                            },
                            {
                              id: vv.variant_value_id,
                              value: vv.variant_value_name,
                            },
                          )
                        }
                        className={`px-4 py-2 border-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                          isSelected(
                            variant.variant_type_id,
                            vv.variant_value_id,
                          )
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-primary/20 hover:border-primary/40"
                        }`}
                      >
                        {vv.variant_value_name}
                      </button>
                    </div>
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
                    disabled={!isVariantSelectionComplete || quantity <= 1}
                    className="h-12 w-12"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span
                    className={`px-4 py-2 font-bold text-lg min-w-12 text-center ${!isVariantSelectionComplete && !product?.allow_negative_stock ? "text-gray-500" : ""}`}
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setQuantity(
                        product?.allow_negative_stock
                          ? quantity + 1
                          : Math.min(selectStock, quantity + 1),
                      )
                    }
                    disabled={
                      !isVariantSelectionComplete ||
                      (!product?.allow_negative_stock &&
                        quantity >= selectStock)
                    }
                    className="h-12 w-12"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {product?.allow_negative_stock
                    ? "In Stock"
                    : `In stock (${selectStock} available)`}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  disabled={!isVariantSelectionComplete || getCanPurchaseVariant() === false }
                  onClick={handleToAddToCart}
                  className={`flex-1 h-14 text-lg font-bold uppercase tracking-wide transition-all ${
                    isAddedToCart
                      ? "bg-green-600 hover:bg-green-600"
                      : "bg-accent hover:bg-accent/90"
                  }`}
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
                disabled={!isVariantSelectionComplete}
                className="w-full h-14 text-lg font-bold uppercase tracking-wide border-2 border-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                BUY NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
