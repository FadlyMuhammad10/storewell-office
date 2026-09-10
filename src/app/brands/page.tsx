"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { GetDataBrands } from "@/services/participant";
import { ParticipantBrandResponse } from "@/types";
import { ArrowRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function getBrandList(response: unknown): ParticipantBrandResponse[] {
  if (!response || typeof response !== "object") return [];

  const firstData = (response as { data?: unknown }).data;
  if (Array.isArray(firstData)) {
    return firstData as ParticipantBrandResponse[];
  }

  if (firstData && typeof firstData === "object") {
    const nestedData = (firstData as { data?: unknown }).data;
    if (Array.isArray(nestedData)) {
      return nestedData as ParticipantBrandResponse[];
    }
  }

  return [];
}

function productLabel(count: number) {
  return `${count} product${count === 1 ? "" : "s"}`;
}

function brandProductsHref(brandId: number) {
  return `/products?brand_ids=${brandId}`;
}

function PopularBrandCard({ brand }: { brand: ParticipantBrandResponse }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold leading-tight group-hover:underline">
          {brand.name}
        </h3>
        <span className="shrink-0 bg-black/5 px-2 py-1 text-[9px] font-semibold uppercase">
          {productLabel(brand.countProduct)}
        </span>
      </div>
      <span className="mt-8 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground group-hover:text-primary">
        {brand.countProduct > 0 ? "View products" : "No products available"}
        {brand.countProduct > 0 && (
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        )}
      </span>
    </>
  );

  const className =
    "flex min-h-36 flex-col justify-between border border-black/15 bg-white p-5";

  if (brand.countProduct <= 0) {
    return (
      <article
        className={`${className} cursor-not-allowed opacity-50`}
      >
        {content}
      </article>
    );
  }

  return (
    <Link
      href={brandProductsHref(brand.id)}
      className={`group ${className} transition-colors hover:border-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
    >
      {content}
    </Link>
  );
}

function BrandDirectoryItem({ brand }: { brand: ParticipantBrandResponse }) {
  const content = (
    <>
      <h4 className="text-sm font-medium group-hover:underline">
        {brand.name}
      </h4>
      <span className="flex shrink-0 items-center gap-2 text-[10px] font-semibold text-primary-foreground">
        {brand.countProduct}
        {brand.countProduct > 0 && (
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        )}
      </span>
    </>
  );

  const className =
    "flex min-h-14 items-center justify-between gap-4 border border-black/15 bg-white px-4 py-3";

  if (brand.countProduct <= 0) {
    return (
      <article
        className={`${className} cursor-not-allowed opacity-50`}
      >
        {content}
      </article>
    );
  }

  return (
    <Link
      href={brandProductsHref(brand.id)}
      className={`group ${className} transition-colors hover:border-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
    >
      {content}
    </Link>
  );
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<ParticipantBrandResponse[]>([]);
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 350);

  useEffect(() => {
    let cancelled = false;

    async function loadBrands() {
      setLoading(true);
      setError("");

      const response = await GetDataBrands(
        debouncedSearch ? { search: debouncedSearch } : undefined,
      );

      if (cancelled) return;

      const list = getBrandList(response)
        .filter((brand) => brand.is_active)
        .sort((a, b) => a.name.localeCompare(b.name));

      if (
        list.length === 0 &&
        response &&
        typeof response === "object" &&
        "message" in response &&
        !("data" in response)
      ) {
        setError("Brands could not be loaded. Please try again.");
      }

      setBrands(list);
      setLoading(false);
    }

    loadBrands();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const availableLetters = useMemo(
    () => new Set(brands.map((brand) => brand.name.charAt(0).toUpperCase())),
    [brands],
  );

  const visibleBrands = useMemo(
    () =>
      selectedLetter
        ? brands.filter(
            (brand) => brand.name.charAt(0).toUpperCase() === selectedLetter,
          )
        : brands,
    [brands, selectedLetter],
  );

  const groupedBrands = useMemo(() => {
    return visibleBrands.reduce<Record<string, ParticipantBrandResponse[]>>(
      (groups, brand) => {
        const initial = brand.name.charAt(0).toUpperCase() || "#";
        groups[initial] = [...(groups[initial] ?? []), brand];
        return groups;
      },
      {},
    );
  }, [visibleBrands]);

  const popularBrands = useMemo(
    () =>
      [...brands]
        .sort((a, b) => b.countProduct - a.countProduct)
        .slice(0, 8),
    [brands],
  );

  function toggleLetter(letter: string) {
    setSelectedLetter((current) => (current === letter ? "" : letter));
  }

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
          <span className="text-[11px] font-semibold">Brands</span>
        </nav>

        <section className="border-b border-black/15 pb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                Directory
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Brands
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground">
                Discover and explore our curated collection of brands.
              </p>
            </div>

            <div className="w-fit border border-black/15 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-wider">
              {loading ? "Loading brands..." : `${brands.length} curated brands`}
            </div>
          </div>
        </section>

        <section className="border-b border-black/15 py-7">
          <div className="flex min-h-14 items-center border border-black/15 bg-white px-4">
            <Search aria-hidden="true" className="mr-4 size-4 text-primary-foreground" />
            <label htmlFor="brand-search" className="sr-only">
              Search brands
            </label>
            <input
              id="brand-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedLetter("");
              }}
              placeholder="Search brands..."
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-primary-foreground/70"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear brand search"
                className="mr-4 rounded-sm p-1 text-primary-foreground transition-colors hover:bg-black/5 hover:text-primary"
              >
                <X className="size-4" />
              </button>
            )}
            <span className="shrink-0 border-l border-black/10 pl-4 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              {loading ? "Searching" : `${visibleBrands.length} brands`}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-9 gap-1 sm:grid-cols-[repeat(13,minmax(0,1fr))] lg:grid-cols-[repeat(26,minmax(0,1fr))]">
            {alphabet.map((letter) => {
              const enabled = availableLetters.has(letter);
              const active = selectedLetter === letter;

              return (
                <button
                  key={letter}
                  type="button"
                  disabled={!enabled || loading}
                  aria-pressed={active}
                  onClick={() => toggleLetter(letter)}
                  className={`h-8 text-[10px] font-bold transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : enabled
                        ? "hover:bg-black/5"
                        : "cursor-not-allowed text-primary-foreground/30"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </section>

        {!search && !selectedLetter && !loading && popularBrands.length > 0 && (
          <section className="border-b border-black/15 py-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Popular Brands</h2>
                <p className="mt-1 text-[11px] text-primary-foreground">
                  Brands with the largest product collections
                </p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                {popularBrands.length} featured
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popularBrands.map((brand) => (
                <PopularBrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </section>
        )}

        <section className="py-10">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-black/15 pb-6">
            <h2 className="text-xl font-bold">All Brands A–Z</h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              Organized by initial letter
            </span>
          </div>

          {loading ? (
            <div className="space-y-8" aria-label="Loading brands">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="grid gap-5 border-b border-black/10 pb-8 md:grid-cols-[8rem_1fr]"
                >
                  <Skeleton className="h-12 w-16 bg-black/10" />
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((card) => (
                      <Skeleton
                        key={card}
                        className="h-14 rounded-none bg-black/10"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border border-red-200 bg-red-50 px-5 py-10 text-center text-sm text-red-700">
              {error}
            </div>
          ) : Object.keys(groupedBrands).length > 0 ? (
            <div>
              {Object.entries(groupedBrands).map(([initial, items]) => (
                <section
                  id={`brands-${initial}`}
                  key={initial}
                  className="grid scroll-mt-28 gap-5 border-b border-black/15 py-7 first:pt-0 md:grid-cols-[8rem_1fr]"
                >
                  <div>
                    <h3 className="text-2xl font-black">{initial}</h3>
                    <p className="mt-1 text-[10px] font-medium text-primary-foreground">
                      {items.length} brand{items.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((brand) => (
                      <BrandDirectoryItem key={brand.id} brand={brand} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="border border-black/15 bg-white px-5 py-14 text-center">
              <p className="font-semibold">No brands found</p>
              <p className="mt-2 text-sm text-primary-foreground">
                Try another search term or clear the letter filter.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
