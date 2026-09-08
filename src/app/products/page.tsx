"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  cn,
  formatPrice,
  getDiscountedPrice,
  getPaginationRange,
} from "@/lib/utils";
import { GetCategories, GetProducts } from "@/services/participant";
import { categoryType } from "@/types";
import { Product, queryParamsProduct } from "@/types/interface";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

type SortOption = "newest" | "price-asc" | "price-desc";

const sortParams: Record<
  SortOption,
  Pick<queryParamsProduct, "sort_by" | "sort_order">
> = {
  newest: { sort_by: "created_at", sort_order: "desc" },
  "price-asc": { sort_by: "price", sort_order: "asc" },
  "price-desc": { sort_by: "price", sort_order: "desc" },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen py-16" />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const [totalPage, setTotalPage] = useState(1);
  const [totalDataPage, setTotalDataPage] = useState(0);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [categoriesData, setCategoriesData] = useState<categoryType[]>();

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GetProducts({
        page,
        per_page: 10,
        category_id: Number(selectedCategory) || undefined,
        ...sortParams[sortBy],
      });

      setLoading(false);
      setProductsData(data.data);
      setTotalPage(data?.meta.last_page);
      setTotalDataPage(data.meta.total);
    } catch (error) {
      console.log("error fetching categories", error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, sortBy]);

  const getCategories = useCallback(async () => {
    const data = await GetCategories();

    setCategoriesData(data.data);
  }, []);

  useEffect(() => {
    getProducts();
    getCategories();
  }, [getProducts, getCategories]);

  const getPageHref = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());

    return `${pathname}?${params.toString()}#products`;
  };

  const pages = getPaginationRange(page, totalPage, 1);

  return (
    <main className="min-h-screen py-16">
      <div className="page-container">
        <div className="flex gap-8">
          {/* Sidebar */}
            <div className="w-52 shrink-0 text-primary">
              <div className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="category">
                    <AccordionTrigger className="text-xs font-normal uppercase text-primary">
                      Category
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categoriesData?.map((category) => (
                          <div
                            key={category.id}
                            className={`flex items-center gap-3 capitalize`}
                          >
                            <Checkbox
                              checked={
                                selectedCategory === category.id.toString()
                              }
                              onCheckedChange={(checked) =>
                                checked
                                  ? setSelectedCategory(category.id.toString())
                                  : setSelectedCategory("")
                              }
                              className={`border border-[#C4C7C7] data-[state=checked]:bg-blue-500 data-[state=checked]:border-none data-[state=checked]:text-white`}
                            />
                            <span
                              className={`text-sm ${
                                selectedCategory === category.id.toString()
                                  ? "font-semibold text-primary"
                                  : "font-normal text-[#1B1C1C]"
                              }`}
                            >
                              {category.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>


          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between tracking-wide">
              <div className="mb-4 text-xs text-primary-foreground font-medium">
                {totalDataPage} Product
                {productsData.length !== 1 ? "s" : ""}
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger
                  aria-label="Sort products"
                  className="h-auto border-0 px-0 py-0 text-xs font-normal text-primary-foreground shadow-none focus-visible:ring-0"
                >
                  <span>Sort by:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="newest">New first</SelectItem>
                  <SelectItem value="price-asc">Price: Low to high</SelectItem>
                  <SelectItem value="price-desc">Price: High to low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              id="products"
              className="w-full scroll-mt-24 border-t border-[#C4C7C7]"
            />

            {productsData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 tracking-wider">
                {productsData.map((product) => {
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
                      <Card className="border-0 shadow-none rounded-none bg-transparent">
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-3/4 bg-transparent">
                          <Image
                            src={
                              product.images?.[0]?.image_url ||
                              "/default-image.png"
                            }
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
                          <h3 className=" font-normal text-primary capitalize">
                            {product.name}
                          </h3>
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
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
            <div className="w-full border-t border-[#C4C7C7]" />
            <div className="mt-4 text-primary">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={getPageHref(Math.max(1, page - 1))}
                      aria-disabled={loading || page <= 1}
                      tabIndex={loading || page <= 1 ? -1 : undefined}
                      className={
                        loading || page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {pages.map((p, index) => (
                    <PaginationItem key={index}>
                      {p === "..." ? (
                        <span className="px-3 text-muted-foreground">…</span>
                      ) : (
                        <PaginationLink
                          isActive={p === page}
                          href={getPageHref(p)}
                          aria-disabled={loading}
                          tabIndex={loading ? -1 : undefined}
                          className={cn(
                            "cursor-pointer text-sm transition-colors",
                            p === page
                              ? "text-primary font-semibold hover:bg-black"
                              : "text-primary-foreground hover:text-white hover:bg-black",
                            loading && "pointer-events-none opacity-50",
                          )}
                        >
                          {p}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href={getPageHref(Math.min(totalPage, page + 1))}
                      aria-disabled={loading || page >= totalPage}
                      tabIndex={
                        loading || page >= totalPage ? -1 : undefined
                      }
                      className={
                        loading || page >= totalPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
