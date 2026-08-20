"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, formatPrice, getPaginationRange } from "@/lib/utils";
import { GetCategories, GetProducts } from "@/services/participant";
import { categoryType } from "@/types";
import { Product } from "@/types/interface";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalDataPage, setTotalDataPage] = useState(0);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoriesData, setCategoriesData] = useState<categoryType[]>();
  const [showFilters, setShowFilters] = useState(false);

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GetProducts({
        page,
        per_page: 10,
        category_id: Number(selectedCategory) || undefined,
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
  }, [page, selectedCategory]);

  const getCategories = useCallback(async () => {
    const data = await GetCategories();

    setCategoriesData(data.data);
  }, []);

  useEffect(() => {
    getProducts();
    getCategories();
  }, [getProducts, getCategories]);

  const pages = getPaginationRange(page, totalPage, 1);

  return (
    <main className="min-h-screen py-16">
      <div className="page-container">
        <div className="flex gap-8">
          {/* Sidebar */}
          {showFilters && (
            <div className="w-64 shrink-0 text-primary">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-normal text-sm uppercase tracking-wide">
                    FILTERS
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-accent rounded transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between tracking-wide">
              <div className="mb-4 text-xs text-primary-foreground font-medium">
                {totalDataPage} Product
                {productsData.length !== 1 ? "s" : ""}
              </div>
              <div className="">
                <p
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs text-primary-foreground font-normal hover:underline hover:cursor-pointer"
                >
                  Filters
                </p>
              </div>
            </div>
            <div className="w-full border-t border-[#C4C7C7]" />

            {productsData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 tracking-wider">
                {productsData.map((product) => (
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
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs">
                            {formatPrice(product.base_price!)}
                          </span>
                        </div>
                      </div>
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
            <div className="w-full border-t border-[#C4C7C7]" />
            <div className="mt-4 text-primary">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(page - 1)}
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
                          onClick={() => setPage(p)}
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
                      onClick={() => setPage(page + 1)}
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
