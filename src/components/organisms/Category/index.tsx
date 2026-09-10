"use client";
import { GetCategoriesRoot } from "@/services/participant";
import { RootCategory } from "@/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function CategorySection() {
  const [categories, setCategories] = useState<RootCategory[]>([]);

  const getCategories = useCallback(async () => {
    const response = await GetCategoriesRoot();
    const payload = response?.data?.data ?? response?.data;

    setCategories(Array.isArray(payload) ? payload : []);
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);
  return (
    <section className="page-container py-16 space-y-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-primary">
            Shop by Category
          </h2>
          <p className="mt-2 text-sm text-primary-foreground">
            Explore our curated foundational collections
          </p>
        </div>

        <Link
          href="/products"
          className="group inline-flex items-center gap-1 self-start text-xs font-bold uppercase tracking-wider text-primary sm:self-auto"
        >
          <span className="group-hover:underline">
            View all root categories
          </span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {categories.slice(0, 4).map((category) => (
          <Link
            href={`/products?category_id=${category.id}`}
            className="space-y-2 items-center justify-center text-center"
            key={category.id}
          >
            <div className="relative overflow-hidden aspect-3/4">
              <Image
                src={category?.image_url || "/images/category.png"}
                alt={category?.name}
                fill
                className="object-cover w-full"
              />
            </div>
            <p className="uppercase text-xs font-semibold text-primary">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
