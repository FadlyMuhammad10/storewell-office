"use client";
import { GetCategories } from "@/services/participant";
import { categoryType } from "@/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function CategorySection() {
  const [categories, setcategories] = useState([]);
  const getCategories = useCallback(async () => {
    const data = await GetCategories();

    setcategories(data.data);
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);
  return (
    <section className="page-container py-16 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-primary text-2xl font-medium">Shop by Category</h2>
        <Link
          href={"/products"}
          className="group inline-flex items-center gap-1"
        >
          <p className="text-xs capitalize font-semibold text-primary group-hover:underline">
            View All
          </p>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {categories?.slice(0, 4).map((category: categoryType) => (
          <Link
            href={"#"}
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
