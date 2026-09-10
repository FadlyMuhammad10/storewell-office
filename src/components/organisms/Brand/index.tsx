"use client";

import { GetDataBrands } from "@/services/participant";
import { ParticipantBrandResponse } from "@/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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

function LandingBrandCard({ brand }: { brand: ParticipantBrandResponse }) {
  const content = (
    <>
      <h3 className="text-xl font-bold leading-tight text-primary">
        {brand.name}
      </h3>
      <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-primary-foreground">
        {brand.countProduct} product{brand.countProduct === 1 ? "" : "s"}
        {brand.countProduct > 0 && (
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        )}
      </p>
    </>
  );

  const className =
    "flex min-h-32 flex-col items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-6 text-center";

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
      href={`/products?brand_ids=${brand.id}`}
      className={`group ${className} transition-colors hover:border-black/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
    >
      {content}
    </Link>
  );
}

export default function BrandSection() {
  const [brands, setBrands] = useState<ParticipantBrandResponse[]>([]);

  const getBrands = useCallback(async () => {
    const response = await GetDataBrands();
    const activeBrands = getBrandList(response).filter(
      (brand) => brand.is_active,
    );

    setBrands(activeBrands);
  }, []);

  useEffect(() => {
    getBrands();
  }, [getBrands]);

  return (
    <section className="bg-[#F5F3F3]">
      <div className="page-container space-y-10 py-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
              Featured labels
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-primary">
              Shop by Brand
            </h2>
            <p className="mt-2 text-sm text-primary-foreground">
              Curated labels engineered for timeless distinction
            </p>
          </div>

          <Link
            href="/brands"
            className="group inline-flex items-center gap-1 self-start text-xs font-bold uppercase tracking-wider text-primary sm:self-auto"
          >
            <span className="group-hover:underline">View all brands</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {brands.slice(0, 6).map((brand) => (
            <LandingBrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
