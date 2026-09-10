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
import { GetProducts, GetProductsFacets } from "@/services/participant";
import {
  Product,
  ProductFacetCategory,
  ProductFacets,
  queryParamsProduct,
} from "@/types/interface";
import { ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

const emptyFacets: ProductFacets = {
  brands: [],
  categories: [],
};

function parseBrandIds(values: string[], legacyBrandId?: string): number[] {
  const rawValues =
    values.length > 0 ? values.flatMap((value) => value.split(",")) : [legacyBrandId];

  return [
    ...new Set(
      rawValues
        .map((value) => Number(value?.trim()))
        .filter((value) => Number.isInteger(value) && value > 0),
    ),
  ];
}

function getFacets(response: unknown): ProductFacets | null {
  if (!response || typeof response !== "object") return null;

  const data = (response as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;

  const facets = data as Partial<ProductFacets>;
  if (!Array.isArray(facets.brands) || !Array.isArray(facets.categories)) {
    return null;
  }

  return {
    brands: facets.brands,
    categories: facets.categories,
  };
}

function containsCategory(
  category: ProductFacetCategory,
  categoryId: number,
): boolean {
  return (
    category.id === categoryId ||
    category.children.some((child) => containsCategory(child, categoryId))
  );
}

function CategoryFacetItem({
  category,
  level = 0,
  selectedCategoryId,
  onSelect,
}: {
  category: ProductFacetCategory;
  level?: number;
  selectedCategoryId: number;
  onSelect: (categoryId: number | null) => void;
}) {
  const hasChildren = category.children.length > 0;
  const selectedWithin = containsCategory(category, selectedCategoryId);
  const [expanded, setExpanded] = useState(level === 0 || selectedWithin);

  useEffect(() => {
    if (selectedWithin) setExpanded(true);
  }, [selectedWithin]);

  const isSelected = category.id === selectedCategoryId;

  return (
    <div>
      <div
        className={`flex min-h-9 items-center gap-2 ${
          isSelected ? "font-semibold text-primary" : "text-primary-foreground"
        }`}
        style={{ paddingLeft: `${level * 14}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={`${expanded ? "Collapse" : "Expand"} ${category.name}`}
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
            className="grid size-5 shrink-0 place-items-center rounded-sm hover:bg-black/5"
          >
            <ChevronRight
              className={`size-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span aria-hidden="true" className="w-5 shrink-0 text-center text-xs">
            •
          </span>
        )}

        <Checkbox
          id={`category-${category.id}`}
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelect(checked === true ? category.id : null)
          }
          className="border-[#C4C7C7] data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
        />
        <label
          htmlFor={`category-${category.id}`}
          className="min-w-0 flex-1 cursor-pointer truncate text-sm"
        >
          {category.name}
        </label>
        <span className="shrink-0 text-xs tabular-nums text-primary-foreground">
          {category.count}
        </span>
      </div>

      {hasChildren && expanded && (
        <div className="ml-2 border-l border-black/10">
          {category.children.map((child) => (
            <CategoryFacetItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedCategoryId={selectedCategoryId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen py-16" />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const selectedCategory = searchParams.get("category_id") ?? "";
  const selectedBrandIds = parseBrandIds(
    searchParams.getAll("brand_ids"),
    searchParams.get("brand_id") ?? undefined,
  );
  const brandIdsQuery = selectedBrandIds.join(",");
  const search = searchParams.get("search")?.trim() ?? "";
  const [totalPage, setTotalPage] = useState(1);
  const [totalDataPage, setTotalDataPage] = useState(0);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [facetsLoading, setFacetsLoading] = useState(true);
  const [facets, setFacets] = useState<ProductFacets>(emptyFacets);
  const [facetsError, setFacetsError] = useState("");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const getProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await GetProducts({
        page,
        per_page: 10,
        search: search || undefined,
        category_id: Number(selectedCategory) || undefined,
        brand_ids: brandIdsQuery || undefined,
        ...sortParams[sortBy],
      });

      setProductsData(Array.isArray(data?.data) ? data.data : []);
      setTotalPage(data?.meta?.last_page ?? 1);
      setTotalDataPage(data?.meta?.total ?? 0);
    } catch (error) {
      console.error("Error fetching products", error);
      setProductsData([]);
      setTotalPage(1);
      setTotalDataPage(0);
    } finally {
      setLoading(false);
    }
  }, [brandIdsQuery, page, search, selectedCategory, sortBy]);

  const getProductFacets = useCallback(async () => {
    setFacetsLoading(true);
    setFacetsError("");

    try {
      const response = await GetProductsFacets({
        search: search || undefined,
        category_id: Number(selectedCategory) || undefined,
        brand_ids: brandIdsQuery || undefined,
      });
      const nextFacets = getFacets(response);

      if (!nextFacets) {
        setFacets(emptyFacets);
        setFacetsError("Filters could not be loaded.");
        return;
      }

      setFacets(nextFacets);
    } catch (error) {
      console.error("Error fetching product facets", error);
      setFacets(emptyFacets);
      setFacetsError("Filters could not be loaded.");
    } finally {
      setFacetsLoading(false);
    }
  }, [brandIdsQuery, search, selectedCategory]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    getProductFacets();
  }, [getProductFacets]);

  const getPageHref = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());

    return `${pathname}?${params.toString()}#products`;
  };

  const setCategoryFilter = (value: number | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("category_id", value.toString());
    } else {
      params.delete("category_id");
    }
    params.delete("page");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const setBrandFilter = (brandId: number, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextBrandIds = checked
      ? [...new Set([...selectedBrandIds, brandId])]
      : selectedBrandIds.filter((id) => id !== brandId);

    // Normalize both supported input formats into one compact URL value.
    params.delete("brand_id");
    params.delete("brand_ids");
    if (nextBrandIds.length > 0) {
      params.set("brand_ids", nextBrandIds.join(","));
    }
    params.delete("page");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category_id");
    params.delete("brand_id");
    params.delete("brand_ids");
    params.delete("page");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const pages = getPaginationRange(page, totalPage, 1);
  const selectedCategoryId = Number(selectedCategory) || 0;
  const activeFilterCount =
    Number(Boolean(selectedCategoryId)) + selectedBrandIds.length;
  const selectedBrandIdSet = new Set(selectedBrandIds);
  const orderedBrands = [
    ...facets.brands.filter((brand) => selectedBrandIdSet.has(brand.id)),
    ...facets.brands.filter((brand) => !selectedBrandIdSet.has(brand.id)),
  ];
  const visibleBrands = showAllBrands
    ? orderedBrands
    : orderedBrands.slice(0, 5);

  return (
    <main className="min-h-screen py-16">
      <div className="page-container">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 text-primary lg:w-64">
            <div className="flex items-center justify-between border-b border-[#C4C7C7] pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Active filters
                </p>
                <p className="mt-1 text-xs font-medium">
                  {activeFilterCount === 0
                    ? "No filters selected"
                    : `${activeFilterCount} selected`}
                </p>
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground underline underline-offset-4 hover:text-primary"
                >
                  Clear all
                </button>
              )}
            </div>

            {facetsError && (
              <p className="border-b border-[#C4C7C7] py-4 text-xs text-red-600">
                {facetsError}
              </p>
            )}

            <Accordion
              type="multiple"
              defaultValue={["category", "brand"]}
              className="w-full"
            >
              <AccordionItem value="category">
                <AccordionTrigger className="py-5 hover:no-underline">
                  <span className="flex flex-1 items-center justify-between pr-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Category
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                      Hierarchy
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {facetsLoading ? (
                    <div className="space-y-3 py-1">
                      {["w-full", "w-4/5", "w-11/12", "w-3/4"].map(
                        (width, index) => (
                          <div
                            key={index}
                            className={`h-5 animate-pulse bg-black/5 ${width}`}
                          />
                        ),
                      )}
                    </div>
                  ) : facets.categories.length > 0 ? (
                    <div className="space-y-0.5">
                      {facets.categories.map((category) => (
                        <CategoryFacetItem
                          key={category.id}
                          category={category}
                          selectedCategoryId={selectedCategoryId}
                          onSelect={setCategoryFilter}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="py-2 text-xs text-primary-foreground">
                      No category filters available.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="brand">
                <AccordionTrigger className="py-5 hover:no-underline">
                  <span className="flex flex-1 items-center justify-between pr-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Brand
                    </span>
                    <span className="text-[10px] font-medium text-primary-foreground">
                      {selectedBrandIds.length > 0
                        ? `${selectedBrandIds.length} selected`
                        : "None selected"}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {facetsLoading ? (
                    <div className="space-y-4 py-1">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="h-5 animate-pulse bg-black/5"
                        />
                      ))}
                    </div>
                  ) : facets.brands.length > 0 ? (
                    <div className="space-y-3">
                      {visibleBrands.map((brand) => {
                        const isSelected = selectedBrandIdSet.has(brand.id);

                        return (
                          <div
                            key={brand.id}
                            className="flex items-center gap-3"
                          >
                            <Checkbox
                              id={`brand-${brand.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                setBrandFilter(brand.id, checked === true)
                              }
                              className="border-[#C4C7C7] data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor={`brand-${brand.id}`}
                              className={`min-w-0 flex-1 cursor-pointer truncate text-sm ${
                                isSelected
                                  ? "font-semibold text-primary"
                                  : "text-primary-foreground"
                              }`}
                            >
                              {brand.name}
                            </label>
                            <span className="text-xs tabular-nums text-primary-foreground">
                              {brand.count}
                            </span>
                          </div>
                        );
                      })}

                      {facets.brands.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setShowAllBrands((current) => !current)}
                          className="text-xs text-primary-foreground underline underline-offset-4 hover:text-primary"
                        >
                          {showAllBrands
                            ? "Show fewer brands"
                            : `+ ${facets.brands.length - 5} more brands`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="py-2 text-xs text-primary-foreground">
                      No brand filters available.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </aside>


          {/* Products Grid */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between tracking-wide">
              <div className="mb-4 text-xs text-primary-foreground font-medium">
                {totalDataPage} Product
                {totalDataPage !== 1 ? "s" : ""}
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
                  No products found for the selected filters.
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
