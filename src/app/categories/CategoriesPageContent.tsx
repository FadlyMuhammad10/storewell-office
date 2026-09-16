"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  GetCategoriesTree,
  GetDataBrands,
  GetProducts,
  GetProductsFacets,
} from "@/services/participant";
import { CategoryTree, ParticipantBrandResponse } from "@/types";
import { ProductFacetCategory } from "@/types/interface";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type DirectoryStats = {
  brandCount: number;
  productCount: number;
};

const emptyStats: DirectoryStats = {
  brandCount: 0,
  productCount: 0,
};

function getCategoryList(response: unknown): CategoryTree[] {
  if (!response || typeof response !== "object") return [];

  const firstData = (response as { data?: unknown }).data;
  if (Array.isArray(firstData)) return firstData as CategoryTree[];

  if (firstData && typeof firstData === "object") {
    const nestedData = (firstData as { data?: unknown }).data;
    if (Array.isArray(nestedData)) return nestedData as CategoryTree[];
    if ("id" in firstData) return [firstData as CategoryTree];
  }

  return [];
}

function getBrandCount(response: unknown): number {
  if (!response || typeof response !== "object") return 0;

  const firstData = (response as { data?: unknown }).data;
  const brands = Array.isArray(firstData)
    ? (firstData as ParticipantBrandResponse[])
    : firstData && typeof firstData === "object"
      ? ((firstData as { data?: unknown }).data as ParticipantBrandResponse[])
      : [];

  return Array.isArray(brands)
    ? brands.filter((brand) => brand.is_active).length
    : 0;
}

function getProductCount(response: unknown): number {
  if (!response || typeof response !== "object") return 0;

  const meta = (response as { meta?: { total?: unknown } }).meta;
  const total = Number(meta?.total);
  return Number.isFinite(total) ? total : 0;
}

function getFacetCategories(response: unknown): ProductFacetCategory[] {
  if (!response || typeof response !== "object") return [];

  const data = (response as { data?: unknown }).data;
  if (!data || typeof data !== "object") return [];

  const categories = (data as { categories?: unknown }).categories;
  return Array.isArray(categories)
    ? (categories as ProductFacetCategory[])
    : [];
}

function createProductCountMap(categories: ProductFacetCategory[]) {
  const counts = new Map<number, number>();

  function visit(items: ProductFacetCategory[]) {
    items.forEach((category) => {
      counts.set(category.id, Number(category.count) || 0);
      visit(category.children ?? []);
    });
  }

  visit(categories);
  return counts;
}

function countDescendants(category: CategoryTree): number {
  return (category.children ?? []).reduce(
    (total, child) => total + 1 + countDescendants(child),
    0,
  );
}

function categoryDescription(category: CategoryTree): string {
  const childNames = (category.children ?? [])
    .slice(0, 2)
    .map((child) => child.name)
    .join(" and ");

  return childNames
    ? `Explore ${childNames} and more from our ${category.name.toLowerCase()} edit.`
    : `Discover our considered selection of ${category.name.toLowerCase()} essentials.`;
}

function productLabel(count: number) {
  return `${count} product${count === 1 ? "" : "s"}`;
}

function CategoryCard({
  category,
  productCount,
}: {
  category: CategoryTree;
  productCount: number;
}) {
  const subcategoryCount = countDescendants(category);

  return (
    <Link
      href={`/products?category_id=${category.id}`}
      className="group flex h-full flex-col border border-black/15 bg-white transition-colors hover:border-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-[#E9E7F7]">
        <Image
          src={category.image_url || "/images/category.png"}
          alt={category.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute right-3 top-3 bg-white/95 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-primary shadow-sm">
          {productLabel(productCount)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-black uppercase tracking-tight">
            {category.name}
          </h2>
          <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide text-primary-foreground">
            {subcategoryCount > 0
              ? `${subcategoryCount} subcategor${subcategoryCount === 1 ? "y" : "ies"}`
              : "Root dept"}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-primary-foreground">
          {categoryDescription(category)}
        </p>
        <span className="mt-5 inline-flex items-center justify-between border-t border-black/10 pt-3 text-[10px] font-bold uppercase tracking-wider">
          Explore collection
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function CategoryGridSkeleton() {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Loading categories"
    >
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border border-black/10 bg-white">
          <Skeleton className="aspect-4/5 rounded-none bg-black/10" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-1/2 rounded-none bg-black/10" />
            <Skeleton className="h-9 w-full rounded-none bg-black/10" />
            <Skeleton className="h-4 w-full rounded-none bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CategoriesPageContent() {
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [productCounts, setProductCounts] = useState<Map<number, number>>(
    () => new Map(),
  );
  const [stats, setStats] = useState<DirectoryStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDirectory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [categoryResponse, facetResponse, brandResponse, productResponse] =
        await Promise.all([
          GetCategoriesTree(),
          GetProductsFacets(),
          GetDataBrands(),
          GetProducts({ page: 1, per_page: 1 }),
        ]);

      const nextCategories = getCategoryList(categoryResponse);

      if (nextCategories.length === 0) {
        const failed =
          categoryResponse &&
          typeof categoryResponse === "object" &&
          "message" in categoryResponse;
        setError(
          failed
            ? "Categories could not be loaded. Please try again."
            : "No categories are available yet.",
        );
      }

      setCategories(nextCategories);
      setProductCounts(
        createProductCountMap(getFacetCategories(facetResponse)),
      );
      setStats({
        brandCount: getBrandCount(brandResponse),
        productCount: getProductCount(productResponse),
      });
    } catch (loadError) {
      console.error("Error loading category directory", loadError);
      setCategories([]);
      setError("Categories could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  const subcategoryCount = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + countDescendants(category),
        0,
      ),
    [categories],
  );

  const directoryStats = [
    { value: categories.length, label: "Root departments" },
    { value: subcategoryCount, label: "Sub-categories" },
    { value: stats.brandCount, label: "Curated brands" },
    { value: stats.productCount, label: "Total products" },
  ];

  return (
    <main className="min-h-screen text-primary">
      <div className="page-container py-10 sm:py-14 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-9 flex items-center gap-2">
          <Link
            href="/"
            className="text-[11px] font-medium text-primary-foreground transition-colors hover:text-primary"
          >
            Home
          </Link>
          <span className="text-[11px] text-primary-foreground">/</span>
          <span className="text-[11px] font-semibold">Categories</span>
        </nav>

        <section className="border-b border-black/15 pb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                Departments &amp; curation
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Shop by category
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground">
                Explore our collections and find styles made for you. Discover
                thoughtful essentials engineered for modern movement,
                understated luxury, and lasting wear.
              </p>
            </div>

            <div className="w-fit border border-black/15 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-wider">
              {loading
                ? "Loading departments..."
                : `${categories.length} root departments`}
            </div>
          </div>
        </section>

        <section className="border-b border-black/15 py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              {loading
                ? "Loading root departments"
                : `Showing ${categories.length} root departments`}
            </p>
            <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-primary-foreground sm:block">
              Hierarchical root level
            </p>
          </div>

          {loading ? (
            <CategoryGridSkeleton />
          ) : error ? (
            <div className="border border-black/15 bg-white px-5 py-14 text-center">
              <p className="font-semibold">{error}</p>
              {error.startsWith("Categories could not") && (
                <button
                  type="button"
                  onClick={loadDirectory}
                  className="mt-5 border border-primary px-5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-primary hover:text-white"
                >
                  Try again
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  productCount={productCounts.get(category.id) ?? 0}
                />
              ))}
            </div>
          )}
        </section>

        <section className="py-12 sm:py-16">
          <div className="grid gap-8 border border-black/15 bg-[#F2F0F0] p-6 sm:p-8 lg:grid-cols-[1.1fr_2fr] lg:items-center lg:p-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                Curated taxonomy
              </p>
              <h2 className="mt-4 max-w-md text-2xl font-black uppercase leading-none tracking-tight sm:text-3xl">
                Hierarchical product classification
              </h2>
              <p className="mt-4 max-w-lg text-xs leading-5 text-primary-foreground">
                Storewell classifies products through an intuitive parent-child
                tree, helping you move from broad departments into focused
                collections with ease.
              </p>
              <Link
                href="/brands"
                className="group mt-6 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
              >
                View all brands directory
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {directoryStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex min-h-24 flex-col items-center justify-center border border-black/10 bg-white px-3 text-center"
                >
                  {loading ? (
                    <Skeleton className="mb-2 h-6 w-10 rounded-none bg-black/10" />
                  ) : (
                    <strong className="text-xl font-black tabular-nums">
                      {stat.value}
                    </strong>
                  )}
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-primary-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
